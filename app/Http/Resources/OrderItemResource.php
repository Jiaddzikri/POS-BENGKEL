<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
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
      'item_id' => $this->item?->id,
      'item_name' => $this->item?->name,
      'part_number' => $this->item?->part_number,
      'variant_id' => $this->variant?->id,
      'variant_name' => $this->variant?->name ?? $this->item?->name,
      // flat model: variant is null, fall back to item.sku
      'sku' => $this->variant?->sku ?? $this->item?->sku,
      'quantity' => (int) $this->quantity,
      'price_at_sale' => (int) $this->price_at_sale,
      'price' => (int) $this->price_at_sale,
      'current_price' => (int) ($this->variant?->price ?? $this->item?->selling_price ?? $this->price_at_sale),
      // fields needed for CartItem shape (order.tsx cart initialisation)
      'stock' => (int) ($this->item?->stock ?? 0),
      'minimum_stock' => (int) ($this->item?->minimum_stock ?? 0),
      'low_stock' => $this->item ? $this->item->isLowStock() : false,
      'category_name' => $this->item?->category?->name ?? '',
      'category_id' => $this->item?->category_id ?? '',
      'is_active' => $this->item?->status === 'active',
      'status' => $this->item?->status ?? 'active',
      'last_updated' => $this->item?->updated_at?->format('Y-m-d H:i:s'),
      'image_path' => '',
      'description' => $this->item?->description ?? '',
    ];
  }
}
