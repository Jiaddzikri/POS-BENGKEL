<?php

namespace App\Service\Transaction;

use App\Models\Buyer;
use App\Models\SalesTransaction;
use App\Models\SalesTransactionDetail;
use App\Request\CreateSalesTransactionDetailRequest;
use App\Request\CreateSalesTransactionRequest;
use DB;

class TransactionService
{
  public function createTransaction(CreateSalesTransactionRequest $request)
  {
    return DB::transaction(function () use ($request) {
      $buyer = Buyer::where("id", $request->buyerId)->first();
      $newTransaction = SalesTransaction::create([
        "tenant_id" => $request->tenantId,
        'order_id' => $request->orderId,
        "name" => $buyer->name,
        "buyer_id" => $request->buyerId,
        "invoice_number" => $request->invoiceNumber,
        "payment_method" => $request->paymentMethod,
        "total_amount" => $request->totalAmount,
        "final_amount" => $request->finalAmount,
        "amount_paid" => $request->amountPaid,
        "change" => $request->change,
      ]);
      return $newTransaction;
    });
  }

  public function createTransactionDetail(CreateSalesTransactionDetailRequest $request)
  {
    return DB::transaction(function () use ($request) {
      $transactionDetail = SalesTransactionDetail::create([
        "sales_transaction_id" => $request->salesTransactionId,
        "item_id" => $request->itemId,
        "variant_id" => $request->variantItemId,
        "quantity" => $request->quantity,
        "price_at_sale" => $request->priceAtSale,
        "sub_total" => $request->subTotal,
      ]);
      return $transactionDetail;
    });
  }
}
