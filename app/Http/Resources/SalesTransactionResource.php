<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalesTransactionResource extends JsonResource
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
            'invoice_number' => $this->invoice_number,
            'total_amount' => $this->total_amount,
            'final_amount' => $this->final_amount,
            'payment_method' => $this->payment_method,
            'amount_paid' => $this->amount_paid,
            'change' => $this->change,
            'date' => $this->created_at,
            'tenant_name' => $this->tenant?->name,
            'transaction_details' => SalesTransactionDetailResource::collection($this->whenLoaded('details')),
            'buyer' => new BuyerResource($this->whenLoaded('buyer'))
        ];
    }
}
