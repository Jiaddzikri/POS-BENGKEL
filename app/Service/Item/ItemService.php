<?php

namespace App\Service\Item;

use App\Models\Item;
use App\Models\VariantItem;
use App\Request\PostItemAttributeRequest;
use App\Request\UpdateItemRequest;
use DB;
use Storage;

class ItemService
{
  public function store(PostItemAttributeRequest $request)
  {
    return DB::transaction((function () use ($request) {
      $createdItem = Item::create([
        "tenant_id" => $request->tenant_id,
        "name" => $request->name,
        "category_id" => $request->category_id,
        "brand" => $request->brand,
        "purchase_price" => $request->purchase_price,
        "selling_price" => $request->selling_price,
        "description" => $request->desciption,

      ]);

      foreach ($request->variants as $variant) {
        VariantItem::create([
          "item_id" => $createdItem->id,
          "name" => $variant->name,
          "additional_price" => $variant->additional_price,
          "stock" => $variant->stock,
          "minimum_stock" => $variant->minimum_stock,
          "sku" => $variant->sku
        ]);
      }

      return $createdItem->load('variants');
    }));
  }

  public function update(UpdateItemRequest $request, string $itemId)
  {
    return DB::transaction((function () use ($request, $itemId) {
      $path = null;

      $item = Item::findOrFail($itemId);

      if ($request->new_image != null) {
        $path = $request->new_image->store('uploads', 'public');
        Storage::disk('public')->delete($item->image_path);
      } else {
        $path = $item->image_path;
      }

      $item->update([
        "tenant_id" => $request->tenant_id,
        "name" => $request->name,
        "category_id" => $request->category_id,
        "brand" => $request->brand,
        "purchase_price" => $request->purchase_price,
        "selling_price" => $request->selling_price,
        "description" => $request->description,
        "image_path" => $path,
        "status" => $request->status,
      ]);

      if (sizeof($request->variants) > 0) {
        foreach ($request->variants as $variant) {
          VariantItem::where("id", $variant->id)->update([
            "item_id" => $item->id,
            "name" => $variant->name,
            "additional_price" => $variant->additional_price,
            "stock" => $variant->stock,
            "minimum_stock" => $variant->minimum_stock,
            "sku" => $variant->sku
          ]);
        }
      }
      return $item->load('variants');
    }));
  }
  private function baseLowStockQuery(string $tenantId)
  {
    return VariantItem::whereHas('item', function ($q) use ($tenantId) {
      $q->where('tenant_id', $tenantId);
      $q->where('is_deleted', false);
    })->whereColumn('stock', '<=', 'minimum_stock')->where('is_deleted', false);

  }

  public function getLowStockItem(string $tenantId)
  {
    return $this->baseLowStockQuery($tenantId)->get();
  }

  public function getLowStockCount(string $tenantId)
  {
    return $this->baseLowStockQuery($tenantId)->count();
  }


  public function getActiveItemCount(string $tenantId)
  {
    return Item::where(['tenant_id' => $tenantId])->where('status', "active")->where('is_deleted', false)->count();
  }

  public function getPaginatedVariants(string $tenantId, array $filters = [])
  {
    $query = $this->baseVariantQuery($tenantId, $filters);

    $variants = $query->paginate(10)->withQueryString();

    $variants->load(['item.category']);

    return $variants;
  }

  private function baseVariantQuery(string $tenantId, array $filters = [])
  {
    $query = VariantItem::query()
      ->select([
        'variant_items.*',
        'items.name as item_name',
        'categories.name as category_name'
      ])
      ->join('items', 'variant_items.item_id', '=', 'items.id')
      ->leftJoin('categories', 'items.category_id', '=', 'categories.id')
      ->where('items.tenant_id', $tenantId)
      ->where('variant_items.is_deleted', false);

    if (isset($filters['search'])) {
      $searchTerm = '%' . $filters['search'] . '%';
      $query->where(function ($q) use ($searchTerm) {
        $q->where('variant_items.sku', 'like', $searchTerm)
          ->orWhere('variant_items.name', 'like', $searchTerm)
          ->orWhere('items.name', 'like', $searchTerm)
          ->orWhere('categories.name', 'like', $searchTerm);
      });
    }
    if (isset($filters['category'])) {
      $query->where('categories.id', $filters['category']);
    }
    if (isset($filters['minPrice'])) {
      $query->whereRaw('items.selling_price + variant_items.additional_price >= ?', [$filters['minPrice']]);
    }
    if (isset($filters['maxPrice'])) {
      $query->whereRaw('items.selling_price + variant_items.additional_price <= ?', [$filters['maxPrice']]);
    }

    $sortBy = $filters['sortBy'] ?? 'created_at';
    $sortOrder = $filters['sortOrder'] ?? 'desc';

    switch ($sortBy) {
      case 'name':
        $query->orderBy('variant_items.name', $sortOrder);
        break;
      case 'price':
        $query->orderByRaw('items.selling_price + variant_items.additional_price ' . $sortOrder);
        break;
      case 'updated_at':
        $query->orderBy('variant_items.updated_at', $sortOrder);
        break;
      default:
        $query->orderBy('variant_items.created_at', $sortOrder);
    }

    return $query;
  }

}