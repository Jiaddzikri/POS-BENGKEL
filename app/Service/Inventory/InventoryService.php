<?php

namespace App\Service\Inventory;

use App\Models\ItemRecord;
use App\Models\VariantItem;
use App\Request\AdjustStockRequest;
use Carbon\Carbon;
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

  private function baseStockMovementQuery(string $tenantId, $filters = [])
  {
    $baseQuery = ItemRecord::with('variant.item.category')
      ->whereHas('variant.item', function ($query) use ($tenantId) {
        $query->where('tenant_id', $tenantId)
          ->where('is_deleted', false);
      });

    if (isset($filters["searchStockMovement"])) {
      $baseQuery->where(function ($query) use ($filters) {
        $query->whereHas('variant', function ($varianQuery) use ($filters) {
          $varianQuery->where('name', 'like', '%' . $filters["searchStockMovement"] . '%')
            ->orWhere('sku', 'like', '%' . $filters["searchStockMovement"] . '%');
        })->orWhereHas('variant.item', function ($itemQuery) use ($filters) {
          $itemQuery->where('name', 'like', '%' . $filters["searchStockMovement"] . '%')
          ;
        })->orWhereHas('variant.item.category', function ($categoryQuery) use ($filters) {
          $categoryQuery->where('name', 'like', '%' . $filters["searchStockMovement"] . '%');
        });
      });
    }

    if (isset($filters['startDate']) && isset($filters['endDate'])) {
      $baseQuery->whereBetween('created_at', [Carbon::parse($filters['startDate'])->startOfDay(), Carbon::parse($filters['endDate'])->endOfDay()]);

    }
    return $baseQuery;
  }

  public function getStockMovementPaginated(string $tenantId, array $filters = [])
  {
    $query = $this->baseStockMovementQuery($tenantId, $filters);

    $stockMovements = $query->latest()->paginate(10)->withQueryString();

    return $stockMovements;
  }

  public function getStockMovementCount(string $tenantId, array $filters = [])
  {
    $query = $this->baseStockMovementQuery($tenantId, $filters);

    return $query->count();
  }
}