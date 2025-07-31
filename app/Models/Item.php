<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    use HasFactory, HasUuids;

    protected $table = "items";

    protected $fillable = [
        "tenant_id",
        "category_id",
        "name",
        "description",
        "brand",
        "purchase_price",
        "selling_price",
        "status",
        'is_deleted'
    ];

    public function variants(): HasMany
    {
        return $this->hasMany(VariantItem::class, 'item_id', 'id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function details(): HasMany
    {
        return $this->hasMany(SalesTransactionDetail::class);
    }
}
