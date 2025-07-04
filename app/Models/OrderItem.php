<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory, HasUuids;
    protected $table = "order_items";

    protected $fillable = [
        "order_id",
        "item_id",
        "variant_item_id",
        "quantity",
        "price_at_sale",

    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, "order_id", "id");
    }
}
