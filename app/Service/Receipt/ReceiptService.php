<?php

namespace App\Service\Receipt;

use App\Models\SalesTransaction;
use Exception;

class ReceiptService
{
  public function getReceiptData(string $orderId): array
  {
    try {
      $transaction = SalesTransaction::with(['details', 'user', 'tenant', 'details.item', 'details.variant'])->where('order_id', "=", $orderId)->firstOrFail();


      if ($transaction == null)
        throw new Exception('transaction not found', 404);


      return [
        'receiptNumber' => $transaction->invoice_number . '-' . date('YmdHis'),
        'invoiceNumber' => $transaction->invoice_number,
        'tenant' => [
          'name' => $transaction->tenant->name,
        ],
        'buyer' => $transaction->buyer ? [
          'name' => $transaction->buyer->name,
          'phone_number' => $transaction->buyer->phone_number,
        ] : null,
        'items' => $transaction->details->map(function ($item) {

          return [
            'name' => $item->item->name . ' ' . $item->variant->name,
            'quantity' => $item->quantity,
            'price' => $item->item->selling_price + $item->variant->additional_price,
            'total' => $item->quantity * ($item->item->selling_price + $item->variant->additional_price),
          ];
        }),
        'summary' => [
          'subtotal' => $transaction->total_amount,
          'discount' => $transaction->discount,
          'total' => $transaction->final_amount,
          'amountPaid' => $transaction->amount_paid,
          'change' => $transaction->change,
        ],
        'cashier' => $transaction->user->name ?? 'Cashier',
        'printedAt' => now()->format('d/m/Y H:i:s'),
      ];
    } catch (Exception $error) {
      throw $error;
    }
  }
}