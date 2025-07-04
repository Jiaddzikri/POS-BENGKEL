<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'sku' => $this->sku,
            'item_id' => $this->item_id,
            'item_name' => $this->whenLoaded('item', $this->item->name),
            'variant_id' => $this->id,
            'variant_name' => $this->name,
            'stock' => $this->stock,
            'image_path' => $this->whenLoaded('item', fn() => $this->item->image_path),
            'category_name' => $this->whenLoaded('item', fn() => $this->item->category?->name ?? 'Uncategorized'),
            'price' => $this->whenLoaded('item', fn() => $this->item->selling_price + $this->additional_price),
            'low_stock' => $this->stock <= $this->minimum_stock,
            'is_active' => $this->whenLoaded('item', fn() => $this->item->status === 'active'),
            'status' => $this->whenLoaded('item', fn() => $this->item->status),
        ];
    }
}