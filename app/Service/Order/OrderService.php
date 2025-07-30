<?php

namespace App\Service\Order;

use App\Models\ItemRecord;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\VariantItem;
use App\Request\CreateOrderDetailRequest;
use App\Request\CreateOrderRequest;
use App\Request\CreateSalesTransactionDetailRequest;
use App\Request\CreateSalesTransactionRequest;
use App\Request\ProcessOrderRequest;
use App\Service\Transaction\TransactionService;
use DB;

class OrderService
{
  public function __construct(private TransactionService $transactionService)
  {
  }
  public function create(CreateOrderRequest $request)
  {
    return DB::transaction(function () use ($request) {
      $newOrder = Order::create([
        "user_id" => $request->userId,
        "tenant_id" => $request->tenantId,
        "order_status" => $request->status,
      ]);
      return $newOrder;
    });
  }
  public function processOrder(ProcessOrderRequest $request)
  {
    $order = Order::findOrFail($request->orderId);

    return DB::transaction(function () use ($request, $order) {

      $variantIds = collect($request->orderItems)->pluck('variant_item_id');
      $variants = VariantItem::whereIn('id', $variantIds)
        ->lockForUpdate()
        ->get()
        ->keyBy('id');

      $totalAmount = 0;
      $transactionDetails = [];

      foreach ($request->orderItems as $orderItem) {
        $variant = $variants->get($orderItem['variant_item_id']);

        if (!$variant || $variant->stock < $orderItem['quantity']) {
          throw new \Exception('Stok tidak mencukupi untuk produk: ' . ($variant->item->name ?? 'N/A'));
        }

        $subtotal = $orderItem['price_at_sale'] * $orderItem['quantity'];
        $totalAmount += $subtotal;

        $variant->decrement('stock', $orderItem['quantity']);

        $transactionDetails[] = [
          'item_id' => $orderItem['item_id'],
          'variant_item_id' => $orderItem['variant_item_id'],
          'variant_id' => $orderItem['variant_item_id'],
          'quantity' => $orderItem['quantity'],
          'price_at_sale' => $orderItem['price_at_sale'],
          'sub_total' => $subtotal,
        ];

        ItemRecord::create([
          'variant_item_id' => $orderItem['variant_item_id'],
          'stock_out' => $orderItem['quantity'],
          'stock_record' => $variant->stock,
        ]);
      }

      $order->orderItem()->createMany($transactionDetails);

      $finalAmount = $request->discount > 0 && $request->discount <= 100
        ? $totalAmount * (1 - ($request->discount / 100))
        : $totalAmount;

      $change = $request->payment['amount_paid'] - $finalAmount;

      $order->update([
        'total_amount' => $totalAmount,
        'final_amount' => $finalAmount,
        'order_status' => 'completed',
      ]);

      $createSalesTransactionRequest = new CreateSalesTransactionRequest();

      $createSalesTransactionRequest->orderId = $request->orderId;
      $createSalesTransactionRequest->tenantId = $order->tenant_id;
      $createSalesTransactionRequest->buyerId = $request->buyerId;
      $createSalesTransactionRequest->invoiceNumber = "INV-" . time();
      $createSalesTransactionRequest->totalAmount = $totalAmount;
      $createSalesTransactionRequest->finalAmount = $finalAmount;
      $createSalesTransactionRequest->paymentMethod = $request->payment["payment_method"];
      $createSalesTransactionRequest->amountPaid = $request->payment['amount_paid'];
      $createSalesTransactionRequest->change = $change;

      $transaction = $this->transactionService->createTransaction($createSalesTransactionRequest);
      $transaction->details()->createMany($transactionDetails);


      return $transaction;
    });
  }
}