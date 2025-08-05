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
            'variant_id' => $this->variant?->id,
            'variant_name' => $this->variant?->name,
            'sku' => $this->variant?->sku,
            'quantity' => (int) $this->quantity,
            'price_at_sale' => (int) $this->price_at_sale,
            'price' => (int) $this->price_at_sale,

        ];
    }
}
