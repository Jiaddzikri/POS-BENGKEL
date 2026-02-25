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
    // Support both flat-model records (item_id set) and legacy variant records
    $item = $this->item ?? $this->variant?->item;

    return [
      'variant_id' => $this->id,
      'item_id' => $item?->id,
      'sku' => $item?->sku ?? $this->variant?->sku,
      'item_name' => $item?->name,
      'variant_name' => $item?->name ?? $this->variant?->name,
      'category_name' => $item?->category?->name,
      'part_number' => $item?->part_number,
      'rack_location' => $item?->rack_location,
      'stock_record' => $this->stock_record,
      'stock_in' => $this->stock_in,
      'stock_out' => $this->stock_out,
      'movement_type' => $this->movement_type,
      'created_at' => $this->created_at->format('d M Y, H:i'),
    ];
  }
}
