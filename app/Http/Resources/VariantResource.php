<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VariantResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'price' => $this->price,
      'profit_margin' => $this->whenLoaded('item', function () {
        return $this->item->calculateProfitMargin($this->price);
      }),
      'stock' => $this->stock,
      'minimum_stock' => $this->minimum_stock,
      'sku' => $this->sku,
      'item_id' => $this->item_id,
    ];
  }
}
