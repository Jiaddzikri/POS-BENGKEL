<?php

namespace App\Service\Receipt;

use App\Models\SalesTransaction;
use Exception;

class ReceiptService
{
  public function getReceiptData(string $orderId): array
  {
    try {
      $transaction = SalesTransaction::with([
        'details',
        'details.item',
        'details.variant',
        'user',
        'tenant',
        'buyer',
      ])->where('order_id', '=', $orderId)->firstOrFail();

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
        'items' => $transaction->details->map(function ($detail) {
          // Flat-model: variant is null — use item name + price_at_sale directly.
          // Legacy model: variant exists — append variant name and use variant price.
          $itemName = $detail->item?->name ?? 'Item';
          $variantName = $detail->variant?->name;
          $displayName = $variantName ? ($itemName . ' ' . $variantName) : $itemName;

          $price = $detail->price_at_sale
            ?? $detail->variant?->price
            ?? $detail->item?->selling_price
            ?? 0;

          return [
            'name' => $displayName,
            'quantity' => $detail->quantity,
            'price' => $price,
            'total' => $detail->quantity * $price,
          ];
        }),
        'summary' => [
          'subtotal' => $transaction->total_amount,
          'discount' => $transaction->discount,
          'total' => $transaction->final_amount,
          'amountPaid' => $transaction->amount_paid,
          'change' => $transaction->change,
        ],
        'cashier' => $transaction->user?->name ?? 'Cashier',
        'printedAt' => now()->format('d/m/Y H:i:s'),
      ];
    } catch (Exception $error) {
      throw $error;
    }
  }
}