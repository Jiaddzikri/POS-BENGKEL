<?php

namespace App\Service\Inventory;

use App\Models\ItemRecord;
use App\Models\VariantItem;
use App\Request\AdjustStockRequest;
use DB;
use Exception;

class InventoryService
{
  public function adjustStock(AdjustStockRequest $request)
  {
    try {
      DB::beginTransaction();

      $variants = VariantItem::where('id', '=', $request->variantId)->lockForUpdate()->first();

      if ($variants == null) {
        throw new Exception('item not found', 404);
      }

      if ($request->quantity > 0) {
        switch ($request->adjusmentType) {
          case 'add-stock':
            $variants->increment('stock', $request->quantity);
            ItemRecord::create([
              'variant_item_id' => $request->variantId,
              'stock_record' => $variants->stock,
              'stock_in' => $request->quantity,
            ]);
            break;
          case 'remove-stock':
            $variants->decrement('stock', $request->quantity);
            ItemRecord::create([
              'variant_item_id' => $request->variantId,
              'stock_record' => $variants->stock,
              'stock_out' => $request->quantity,
            ]);
            break;
          case 'adjust-stock':
            $stockBefore = $variants->stock;
            $newStock = $request->quantity;
            $difference = $newStock - $stockBefore;

            $stockIn = 0;
            $stockOut = 0;

            if ($difference > 0) {
              $stockIn = $difference;
            } else {
              $stockOut = abs($difference);
            }
            $variants->update(['stock' => $newStock]);

            ItemRecord::create([
              'variant_item_id' => $request->variantId,
              'stock_record' => $stockBefore,
              'stock_in' => $stockIn,
              'stock_out' => $stockOut
            ]);
            break;
        }
        DB::commit();
      }
      return $variants->refresh();
    } catch (Exception $e) {
      DB::rollBack();
      throw $e;
    }
  }
}