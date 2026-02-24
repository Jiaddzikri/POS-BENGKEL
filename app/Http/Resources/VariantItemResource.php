<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Maps a flat Item model into a variant-shaped response for POS compatibility.
 * The underlying $resource is an \App\Models\Item instance.
 */
class VariantItemResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      // variant-shaped keys (sourced from Item)
      'variant_id' => $this->id,
      'variant_name' => $this->name,
      'item_id' => $this->id,
      'item_name' => $this->name,
      'sku' => $this->sku,
      'part_number' => $this->part_number,
      'stock' => (int) ($this->stock ?? 0),
      'minimum_stock' => (int) ($this->minimum_stock ?? 0),
      'low_stock' => $this->isLowStock(),
      'price' => $this->selling_price,
      'purchase_price' => $this->purchase_price,
      'profit_margin' => $this->calculateProfitMargin(),
      'category_name' => $this->category?->name ?? 'Uncategorized',
      'category_id' => $this->category_id,
      'uom' => $this->uom,
      'rack_location' => $this->rack_location,
      'compatibility' => $this->compatibility ?? [],
      'is_active' => $this->status === 'active',
      'status' => $this->status,
      'last_updated' => $this->updated_at?->format('Y-m-d H:i:s'),
    ];
  }
}
