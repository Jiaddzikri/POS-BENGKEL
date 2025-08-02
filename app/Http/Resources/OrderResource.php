<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'buyer_name' => $this->buyer?->name,
            'buyer_phone_number' => $this->buyer?->phone_number,
            'total_amount' => $this->total_amount,
            'final_amount' => $this->final_amount,
            'discount' => $this->discount,
            'cashier_name' => $this->user?->name,
            'created_at' => $this->created_at,
            'status' => $this->order_status,
            'details' => OrderItemResource::collection($this->orderItem)
        ];
    }
}
