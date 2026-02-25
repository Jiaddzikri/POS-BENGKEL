<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
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
      'tenant_id' => $this->tenant_id,
      'name' => $this->name,
      'category_name' => $this->category?->name ?? 'Uncategorized',
      'brand' => $this->brand,
      'purchase_price' => $this->purchase_price,
      'selling_price' => $this->selling_price,
      'description' => $this->description,
      'status' => $this->status,
      'is_active' => $this->status === 'active',
      // Bengkel-specific fields
      'part_number' => $this->part_number,
      'uom' => $this->uom,
      'rack_location' => $this->rack_location,
      'compatibility' => $this->compatibility ?? [],
      // Flat product model fields
      'sku' => $this->sku,
      'stock' => (int) ($this->stock ?? 0),
      'minimum_stock' => (int) ($this->minimum_stock ?? 0),
      'low_stock' => $this->isLowStock(),
      'profit_margin' => $this->calculateProfitMargin(),
      'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
      'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
    ];
  }
}
