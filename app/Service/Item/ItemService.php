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

  public function getLowStockItem(string $tenantId)
  {
    $lowStockCount = VariantItem::whereHas('item', function ($q) use ($tenantId) {
      $q->where('tenant_id', $tenantId);
      $q->where('is_deleted', false);
    })->whereColumn('stock', '<=', 'minimum_stock')->where('is_deleted', false)->get();

    return $lowStockCount;
  }

}