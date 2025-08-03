<?php

namespace App\Service\Order;

use App\Models\ItemRecord;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\VariantItem;
use App\Request\addOrderDetailRequest;
use App\Request\CreateOrderDetailRequest;
use App\Request\CreateOrderRequest;
use App\Request\CreateSalesTransactionDetailRequest;
use App\Request\CreateSalesTransactionRequest;
use App\Request\ProcessOrderRequest;
use App\Service\Transaction\TransactionService;
use DB;
use DiscountUsageHistoryAttributeRequest;
use Exception;
use Log;

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

      $orderItems = $order->orderItem;

      $variantIds = $orderItems->pluck('variant_item_id');
      $variants = VariantItem::whereIn('id', $variantIds)
        ->lockForUpdate()
        ->get()
        ->keyBy('id');

      $totalAmount = 0;
      $transactionDetails = [];

      foreach ($orderItems as $orderItem) {
        $variant = $variants->get($orderItem->variant_item_id);

        $subtotal = $orderItem->price_at_sale * $orderItem->quantity;
        $totalAmount += $subtotal;


        $transactionDetails[] = [
          'item_id' => $orderItem->item_id,
          'variant_id' => $orderItem->variant_item_id,
          'quantity' => $orderItem->quantity,
          'price_at_sale' => $orderItem->price_at_sale,
          'sub_total' => $subtotal,
        ];

        ItemRecord::create([
          'variant_item_id' => $orderItem->variant_item_id,
          'stock_out' => $orderItem->quantity,
          'stock_record' => $variant->stock,
        ]);
      }

      $finalAmount = $request->discount > 0 && $request->discount <= 100
        ? $totalAmount * (1 - ($request->discount / 100))
        : $totalAmount;

      $change = $request->payment['amount_paid'] - $finalAmount;

      $order->update([
        'discount' => $request->discount,
        'total_amount' => $totalAmount,
        'final_amount' => $finalAmount,
        'order_status' => 'completed',
        'buyer_id' => $request->buyerId
      ]);

      $createSalesTransactionRequest = new CreateSalesTransactionRequest();

      $createSalesTransactionRequest->orderId = $request->orderId;
      $createSalesTransactionRequest->tenantId = $order->tenant_id;
      $createSalesTransactionRequest->buyerId = $request->buyerId;
      $createSalesTransactionRequest->invoiceNumber = "INV-" . time();
      $createSalesTransactionRequest->totalAmount = $totalAmount;
      $createSalesTransactionRequest->finalAmount = $finalAmount;
      $createSalesTransactionRequest->discount = $request->discount;
      $createSalesTransactionRequest->paymentMethod = $request->payment["payment_method"];
      $createSalesTransactionRequest->amountPaid = $request->payment['amount_paid'];
      $createSalesTransactionRequest->change = $change;


      $transaction = $this->transactionService->createTransaction($createSalesTransactionRequest);
      $transaction->details()->createMany($transactionDetails);

      return $transaction;
    });
  }

  public function addOrderDetail(addOrderDetailRequest $request)
  {
    return DB::transaction(function () use ($request) {
      $orderItem = OrderItem::where('item_id', $request->itemId)
        ->where('order_id', $request->orderId)
        ->first();
      $variant = VariantItem::where('id', $request->variantItemId)
        ->lockForUpdate()
        ->first();

      if ($orderItem) {
        $newQuantity = $orderItem->quantity + $request->quantity;

        $request->quantity = $newQuantity;

        return $this->updateQuantity($request);
      }

      $createOrderItem = OrderItem::create([
        'order_id' => $request->orderId,
        'item_id' => $request->itemId,
        'variant_item_id' => $request->variantItemId,
        'quantity' => $request->quantity,
        'price_at_sale' => $request->priceAtSale,
        'sub_total' => $request->priceAtSale * $request->quantity
      ]);

      $variant->decrement('stock', $request->quantity);

      return $createOrderItem;
    });
  }

  public function updateQuantity(addOrderDetailRequest $request)
  {
    return DB::transaction(function () use ($request) {
      $orderItem = OrderItem::where('item_id', $request->itemId)
        ->where('order_id', $request->orderId)
        ->first();
      $variant = VariantItem::where('id', $request->variantItemId)
        ->lockForUpdate()
        ->first();

      $difference = $request->quantity - $orderItem->quantity;

      if ($difference === 0) {
        return;
      }
      if ($difference > 0 && $variant->stock < $difference) {
        throw new Exception('Stock is not enough', 400);
      }

      if ($difference > 0) {
        $variant->decrement('stock', $difference);
      } else {
        $variant->increment('stock', abs($difference));
      }
      $orderItem->update(['quantity' => $request->quantity, 'price_at_sale' => $request->priceAtSale, 'sub_total' => $request->priceAtSale * $request->quantity]);

      return $orderItem->refresh();
    });
  }
}