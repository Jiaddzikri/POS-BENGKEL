<?php

namespace App\Service\Item;

use App\Models\Item;
use App\Models\VariantItem;
use App\Request\PostItemAttributeRequest;
use DB;

class ItemService
{
  public function store(PostItemAttributeRequest $request)
  {
    return DB::transaction((function () use ($request) {
      $path = $request->image->store("uploads", "public");
      $createdItem = Item::create([
        "tenant_id" => $request->tenant_id,
        "name" => $request->name,
        "category_id" => $request->category_id,
        "brand" => $request->brand,
        "purchase_price" => $request->purchase_price,
        "selling_price" => $request->selling_price,
        "description" => $request->desciption,
        "image_path" => $path
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

}