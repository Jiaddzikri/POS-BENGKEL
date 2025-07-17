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

  public function createOrderDetail(CreateOrderDetailRequest $request)
  {
    return DB::transaction(function () use ($request) {
      $orderItem = OrderItem::create([
        "order_id" => $request->orderId,
        "item_id" => $request->itemId,
        "variant_item_id" => $request->variantId,
        "quantity" => $request->quantity,
        "price_at_sale" => $request->priceAtSale,
      ]);
      return $orderItem;
    });
  }

  public function processOrder(ProcessOrderRequest $request)
  {
    $order = Order::findOrFail($request->orderId);

    return DB::transaction(function () use ($request, $order) {
      $totalAmount = 0;
      $finalAmount = 0;
      foreach ($request->orderItems as $orderItem) {

        $totalAmount += $orderItem["price_at_sale"] * $orderItem["quantity"];

        $orderDetailRequest = new CreateOrderDetailRequest();
        $orderDetailRequest->orderId = $order->id;
        $orderDetailRequest->itemId = $orderItem["item_id"];
        $orderDetailRequest->variantId = $orderItem["variant_item_id"];
        $orderDetailRequest->quantity = $orderItem["quantity"];
        $orderDetailRequest->priceAtSale = $orderItem["price_at_sale"];

        $this->createOrderDetail($orderDetailRequest);

        $findVariantItem = VariantItem::where("id", $orderItem["variant_item_id"]);

        $findVariantItem->update([
          "stock" => $findVariantItem->first()->stock - $orderItem["quantity"]
        ]);

        ItemRecord::create([
          "variant_item_id" => $orderItem["variant_item_id"],
          "stock_record" => $findVariantItem->first()->stock,
          "stock_out" => $orderItem["quantity"]
        ]);
      }

      Order::where("id", $order->id)->update([
        "total_amount" => $totalAmount,
        "order_status" => "completed"
      ]);

      $createSalesTransactionRequest = new CreateSalesTransactionRequest();
      $createSalesTransactionRequest->tenantId = $order->tenant_id;
      $createSalesTransactionRequest->buyerId = $request->buyerId;
      $createSalesTransactionRequest->invoiceNumber = "INV-" . time();
      $createSalesTransactionRequest->totalAmount = $totalAmount;
      $createSalesTransactionRequest->finalAmount = $totalAmount;
      $createSalesTransactionRequest->paymentMethod = "cash";
      $createSalesTransactionRequest->amountPaid = $request->payment['amount_paid'];
      $createSalesTransactionRequest->change = $request->payment['amount_paid'] - $totalAmount;

      $transaction = $this->transactionService->createTransaction($createSalesTransactionRequest);


      foreach ($request->orderItems as $orderItem) {
        $createSalesTransactionDetailRequest = new CreateSalesTransactionDetailRequest();
        $createSalesTransactionDetailRequest->salesTransactionId = $transaction->id;
        $createSalesTransactionDetailRequest->itemId = $orderItem["item_id"];
        $createSalesTransactionDetailRequest->variantItemId = $orderItem["variant_item_id"];
        $createSalesTransactionDetailRequest->quantity = $orderItem["quantity"];
        $createSalesTransactionDetailRequest->priceAtSale = $orderItem["price_at_sale"];
        $createSalesTransactionDetailRequest->subTotal = $orderItem["price_at_sale"] * $orderItem["quantity"];

        $this->transactionService->createTransactionDetail($createSalesTransactionDetailRequest);

      }

    });
  }
}