<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory, HasUuids;
    protected $table = "orders";
    protected $fillable = [
        "tenant_id",
        "buyer_id",
        'discount',
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

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(Buyer::class, 'buyer_id', 'id');
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id', 'id');
    }
}
