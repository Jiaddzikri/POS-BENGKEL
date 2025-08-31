<?php

namespace App\Service\Order;

use App\Models\ItemRecord;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\VariantItem;
use App\Request\addOrderDetailRequest;
use App\Request\CreateOrderRequest;
use App\Request\CreateSalesTransactionRequest;
use App\Request\ProcessOrderRequest;
use App\Service\Transaction\TransactionService;
use DB;
use Exception;

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
      $createSalesTransactionRequest->userId = $request->userId;
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
      $orderItem = OrderItem::where('item_id', $request->itemId)->where('variant_item_id', '=', $request->variantItemId)
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
        'price_at_sale' => $request->priceAtSale
      ]);

      $variant->decrement('stock', $request->quantity);
      $this->updateOrderTotals($request->orderId);

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

      $orderItem->update([
        'quantity' => $request->quantity,
        'price_at_sale' => $request->priceAtSale
      ]);
      $this->updateOrderTotals($request->orderId);

      return $orderItem->refresh();
    });
  }

  private function updateOrderTotals($orderId)
  {
    $order = Order::find($orderId);

    if (!$order) {
      throw new Exception('Order not found', 404);
    }

    $totalAmount = OrderItem::where('order_id', $orderId)
      ->selectRaw('SUM(quantity * price_at_sale) as total')
      ->value('total') ?? 0;

    $discountPercentage = $order->discount ?? 0;

    $discountAmount = ($totalAmount * $discountPercentage) / 100;

    $finalAmount = $totalAmount - $discountAmount;

    $order->update([
      'total_amount' => $totalAmount,
      'discount_amount' => $discountAmount,
      'final_amount' => $finalAmount,
      'updated_at' => now()
    ]);

    return $order;
  }

  public function holdOrder(string $orderId, int $discount)
  {
    return DB::transaction(function () use ($orderId, $discount) {
      $order = Order::lockForUpdate()->findOrFail($orderId);
      $orderItems = $order->orderItem;

      $totalAmount = 0;

      foreach ($orderItems as $orderItem) {
        $totalAmount += $orderItem->price_at_sale * $orderItem->quantity;
      }

      $finalAmount = $discount > 0 && $discount < 100 ? $totalAmount * (1 - ($discount / 100))
        : $totalAmount;

      $order->update(['order_status' => 'awaiting_payment', 'total_amount' => $totalAmount, 'final_amount' => $finalAmount, 'discount' => $discount]);

      return $order;
    });
  }

  public function deleteOrderDetail(string $orderId, $variantId)
  {
    return DB::transaction(function () use ($orderId, $variantId) {
      $orderItem = OrderItem::where('variant_item_id', $variantId)
        ->where('order_id', $orderId)
        ->firstOrFail();

      $variant = VariantItem::lockForUpdate()->findOrFail($variantId);

      $variant->increment('stock', $orderItem->quantity);
      $order = Order::findOrFail($orderId);
      $subtotalItem = $orderItem->price_at_sale * $orderItem->quantity;
      $newTotalAmount = $order->total_amount - $subtotalItem;

      $newFinalAmount = $order->discount > 0
        ? $newTotalAmount * (1 - ($order->discount / 100))
        : $newTotalAmount;

      $orderItem->delete();

      $order->update([
        'total_amount' => $newTotalAmount,
        'final_amount' => $newFinalAmount,
      ]);

      return $order->refresh();
    });
  }

  public function deleteAllOrderItems($orderId)
  {
    return DB::transaction(function () use ($orderId) {
      $order = Order::findOrFail($orderId);
      foreach ($order->orderItem as $item) {
        $variant = VariantItem::lockForUpdate()->find($item->variant_item_id);
        if ($variant) {
          $variant->increment('stock', $item->quantity);
        }
      }
      $order->orderItem()->delete();
      $order->update([
        'total_amount' => 0,
        'final_amount' => 0,
        'discount' => 0,
      ]);

      return $order;
    });
  }
}