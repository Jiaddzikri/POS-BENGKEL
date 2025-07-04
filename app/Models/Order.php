<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory, HasUuids;
    protected $table = "orders";
    protected $fillable = [
        "tenant_id",
        "buyer_id",
        "user_id",
        "discount_id",
        "total_amount",
        "final_amount",
        "order_status",
    ];

    public function orderItem(): HasMany
    {
        return $this->hasMany(OrderItem::class, "order_id", "id");
    }
}
