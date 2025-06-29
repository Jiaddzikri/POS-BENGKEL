<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
        "image_path"
    ];

    public function variants(): HasMany
    {
        return $this->hasMany(VariantItem::class, 'item_id', 'id');
    }
}
