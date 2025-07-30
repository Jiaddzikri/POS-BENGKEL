<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemRecordResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'variant_id' => $this->id,
            'item_id' => $this->item_id,
            'sku' => $this->whenLoaded('variant', $this->variant->sku),
            'item_name' => $this->whenLoaded('variant', fn() => $this->variant->item->name),
            'variant_name' => $this->whenLoaded('variant', $this->variant->name),
            'category_name' => $this->whenLoaded('variant', fn() => $this->variant->item->category?->name),
            'stock_record' => $this->stock_record,
            'stock_in' => $this->stock_in,
            'stock_out' => $this->stock_out,
            'created_at' => $this->created_at->format('d M Y, H:i'),
        ];
    }
}
