<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VariantItem extends Model
{
    use HasFactory, HasUuids;

    protected $table = "variant_items";

    protected $fillable = [
        "item_id",
        "name",
        "sku",
        "stock",
        "additional_price",
        "minimum_stock",
        "is_deleted"
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'item_id', 'id');
    }

    public function details(): HasMany
    {
        return $this->hasMany(SalesTransactionDetail::class);
    }
}
