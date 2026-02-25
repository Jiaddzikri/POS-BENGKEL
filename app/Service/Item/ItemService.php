<?php

namespace App\Service\Item;

use App\Models\Item;
use App\Models\VariantItem;
use App\Request\PostItemAttributeRequest;
use App\Request\UpdateItemRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ItemService
{
  // ── WRITE METHODS ────────────────────────────────────────────────────────

  /**
   * Create a single flat Item row (no variant sub-rows).
   */
  public function store(PostItemAttributeRequest $request)
  {
    return DB::transaction(function () use ($request) {
      return Item::create([
        "tenant_id" => $request->tenant_id,
        "name" => $request->name,
        "category_id" => $request->category_id,
        "brand" => $request->brand,
        "purchase_price" => $request->purchase_price,
        "selling_price" => $request->selling_price,
        "description" => $request->desciption,
        "part_number" => $request->part_number,
        "sku" => $request->sku ?? strtoupper(Str::random(8)),
        "stock" => $request->stock ?? 0,
        "minimum_stock" => $request->minimum_stock ?? 0,
        "uom" => $request->uom ?? 'Pcs',
        "rack_location" => $request->rack_location,
        "compatibility" => $request->compatibility ?? [],
      ]);
    });
  }

  public function update(UpdateItemRequest $request, string $itemId)
  {
    return DB::transaction(function () use ($request, $itemId) {
      $item = Item::findOrFail($itemId);

      $item->update([
        "tenant_id" => $request->tenant_id,
        "name" => $request->name,
        "category_id" => $request->category_id,
        "brand" => $request->brand,
        "purchase_price" => $request->purchase_price,
        "selling_price" => $request->selling_price,
        "description" => $request->description,
        "status" => $request->status,
        "part_number" => $request->part_number,
        "sku" => $request->sku,
        "stock" => $request->stock,
        "minimum_stock" => $request->minimum_stock,
        "uom" => $request->uom ?? 'Pcs',
        "rack_location" => $request->rack_location,
        "compatibility" => $request->compatibility ?? [],
      ]);

      return $item->fresh();
    });
  }

  // ── READ METHODS ─────────────────────────────────────────────────────────

  public function getOutOfStockCount(?string $tenantId)
  {
    return Item::when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
      ->where('is_deleted', false)
      ->where('stock', 0)
      ->count();
  }

  public function getLowStockItem(?string $tenantId)
  {
    return $this->baseLowStockQuery($tenantId)->get();
  }

  public function getLowStockCount(?string $tenantId)
  {
    return $this->baseLowStockQuery($tenantId)->count();
  }

  public function getActiveItemCount(?string $tenantId)
  {
    return Item::when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
      ->where('is_deleted', false)
      ->where('status', 'active')
      ->count();
  }

  public function getItemCount(?string $tenantId)
  {
    return Item::when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
      ->where('is_deleted', false)
      ->count();
  }

  /** @deprecated Use getPaginatedItems() */
  public function getPaginatedVariants(?string $tenantId, array $filters = [])
  {
    return $this->getPaginatedItems($tenantId, $filters);
  }

  public function getPaginatedItems(?string $tenantId, array $filters = [])
  {
    return $this->baseItemQuery($tenantId, $filters)->paginate(10)->withQueryString();
  }

  // ── BASE QUERIES ─────────────────────────────────────────────────────────

  private function baseLowStockQuery(?string $tenantId = null)
  {
    return Item::when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
      ->where('is_deleted', false)
      ->whereColumn('stock', '<=', 'minimum_stock');
  }

  private function baseItemQuery(?string $tenantId, array $filters = [])
  {
    $query = Item::query()
      ->with(['category'])
      ->leftJoin('categories', 'items.category_id', '=', 'categories.id')
      ->select('items.*', 'categories.name as category_name')
      ->where('items.is_deleted', false);

    $query->when($tenantId, fn($q) => $q->where('items.tenant_id', $tenantId));

    $query->when($filters['search'] ?? null, function ($q, $search) {
      $term = '%' . $search . '%';
      $q->where(function ($sub) use ($term) {
        $sub->where('items.name', 'like', $term)
          ->orWhere('items.part_number', 'like', $term)
          ->orWhere('items.sku', 'like', $term)
          ->orWhere('categories.name', 'like', $term);
      });
    });

    $query->when($filters['category'] ?? null, fn($q, $id) => $q->where('items.category_id', $id));
    $query->when($filters['minPrice'] ?? null, fn($q, $p) => $q->where('items.selling_price', '>=', $p));
    $query->when($filters['maxPrice'] ?? null, fn($q, $p) => $q->where('items.selling_price', '<=', $p));
    $query->when($filters['status'] ?? null, fn($q, $s) => $q->where('items.status', $s));

    if (isset($filters['stockCondition'])) {
      switch ($filters['stockCondition']) {
        case 'low':
          $query->whereColumn('items.stock', '<=', 'items.minimum_stock');
          break;
        case 'out_of_stock':
          $query->where('items.stock', 0);
          break;
        case 'in_stock':
          $query->where('items.stock', '>', 0);
          break;
      }
    }

    $sortBy = $filters['sortBy'] ?? 'created_at';
    $sortOrder = $filters['sortOrder'] ?? 'desc';

    switch ($sortBy) {
      case 'name':
        $query->orderBy('items.name', $sortOrder);
        break;
      case 'price':
        $query->orderBy('items.selling_price', $sortOrder);
        break;
      case 'updated_at':
        $query->orderBy('items.updated_at', $sortOrder);
        break;
      default:
        $query->orderBy('items.created_at', $sortOrder);
    }

    return $query;
  }

  // ── IMPORT ───────────────────────────────────────────────────────────────

  public function importFromExcel(\Illuminate\Http\UploadedFile $file, string $tenantId): \App\Response\ImportResultResponse
  {
    $result = new \App\Response\ImportResultResponse();
    $import = new \App\Imports\ItemImport($tenantId, $result);

    \Maatwebsite\Excel\Facades\Excel::import($import, $file);

    return $result;
  }
}

