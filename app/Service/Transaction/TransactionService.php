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
        "user_id" => $request->userId,
        "buyer_id" => $request->buyerId,
        "invoice_number" => $request->invoiceNumber,
        "payment_method" => $request->paymentMethod,
        "total_amount" => $request->totalAmount,
        'discount' => $request->discount,
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

  public function getNewestTransaction(string $tenantId, int $limit)
  {
    $transactions = SalesTransaction::select([
      'sales_transactions.id as transaction_id',
      DB::raw('DATE_FORMAT(sales_transactions.created_at, "%H:%i") as transaction_time'),
      'buyers.name as buyer_name',
      'sales_transactions.final_amount as final_amount',
      DB::raw('COUNT(sales_transaction_details.id) as total_items')
    ])

      ->leftJoin('sales_transaction_details', 'sales_transactions.id', '=', 'sales_transaction_details.sales_transaction_id')
      ->leftJoin('buyers', 'sales_transactions.buyer_id', '=', 'buyers.id')
      ->where('sales_transactions.tenant_id', '=', $tenantId)
      ->groupBy(
        'sales_transactions.id',
        'transaction_time',
        'buyers.name',
        'sales_transactions.final_amount',
        'sales_transactions.created_at'
      )
      ->orderBy('sales_transactions.created_at', 'desc')
      ->limit($limit)
      ->get();

    return $transactions;

  }
}
