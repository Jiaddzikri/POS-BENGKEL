<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalesTransactionDetailResource extends JsonResource
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
            'quantity' => $this->quantity,
            'price_at_sale' => $this->price_at_sale,
            'sub_total' => $this->sub_total,
            'sku' => $this->variant?->sku,
            'item_name' => $this->item?->name,
            'variant_name' => $this->variant?->name,
        ];
    }
}
