<?php

namespace App\Service\Inventory;

use App\Models\Item;
use App\Models\ItemRecord;
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

      $item = Item::where('id', '=', $request->itemId)->lockForUpdate()->first();

      if ($item === null) {
        throw new Exception('item not found', 404);
      }

      if ($request->quantity > 0) {
        switch ($request->adjusmentType) {
          case 'add-stock':
            $item->increment('stock', $request->quantity);
            ItemRecord::create([
              'item_id' => $item->id,
              'stock_record' => $item->stock,
              'stock_in' => $request->quantity,
              'stock_out' => 0,
              'movement_type' => 'added',
            ]);
            break;

          case 'remove-stock':
            $item->decrement('stock', $request->quantity);
            ItemRecord::create([
              'item_id' => $item->id,
              'stock_record' => $item->stock,
              'stock_in' => 0,
              'stock_out' => $request->quantity,
              'movement_type' => 'removed',
            ]);
            break;

          case 'adjust-stock':
            $stockBefore = $item->stock;
            $newStock = $request->quantity;
            $difference = $newStock - $stockBefore;

            $stockIn = $difference > 0 ? $difference : 0;
            $stockOut = $difference < 0 ? abs($difference) : 0;

            $item->update(['stock' => $newStock]);

            ItemRecord::create([
              'item_id' => $item->id,
              'stock_record' => $stockBefore,
              'stock_in' => $stockIn,
              'stock_out' => $stockOut,
              'movement_type' => 'adjusted',
            ]);
            break;
        }
        DB::commit();
      }

      return $item->refresh();
    } catch (Exception $e) {
      DB::rollBack();
      throw $e;
    }
  }

  private function baseStockMovementQuery(?string $tenantId, $filters = [])
  {
    $baseQuery = ItemRecord::with(['item.category', 'variant.item.category'])
      ->where(function ($q) use ($tenantId) {
        if ($tenantId === null) {
          // super_admin without an active tenant — return nothing
          $q->whereRaw('1 = 0');
          return;
        }
        // flat-model records
        $q->whereHas('item', function ($query) use ($tenantId) {
          $query->where('tenant_id', $tenantId)
            ->where('is_deleted', false);
        })
          // legacy records (variant_item_id)
          ->orWhereHas('variant.item', function ($query) use ($tenantId) {
          $query->where('tenant_id', $tenantId)
            ->where('is_deleted', false);
        });
      });

    if (!empty($filters['searchStockMovement'])) {
      $term = '%' . $filters['searchStockMovement'] . '%';
      $baseQuery->whereHas('item', function ($itemQuery) use ($term) {
        $itemQuery->where('name', 'like', $term)
          ->orWhere('sku', 'like', $term)
          ->orWhere('part_number', 'like', $term)
          ->orWhere('rack_location', 'like', $term);
      })->orWhereHas('item.category', function ($catQuery) use ($term) {
        $catQuery->where('name', 'like', $term);
      });
    }

    if (isset($filters['startDate']) && isset($filters['endDate'])) {
      $baseQuery->whereBetween('created_at', [
        Carbon::parse($filters['startDate'])->startOfDay(),
        Carbon::parse($filters['endDate'])->endOfDay(),
      ]);
    }

    return $baseQuery;
  }

  public function getStockMovementPaginated(?string $tenantId, array $filters = [])
  {
    return $this->baseStockMovementQuery($tenantId, $filters)
      ->latest()
      ->paginate(10)
      ->withQueryString();
  }

  public function getStockMovementCount(?string $tenantId, array $filters = [])
  {
    return $this->baseStockMovementQuery($tenantId, $filters)->count();
  }
}
