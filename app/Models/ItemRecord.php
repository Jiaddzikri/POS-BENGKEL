<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemRecord extends Model
{
    use HasFactory, HasUuids;

    protected $table = "item_records";

    protected $fillable = [
        "variant_item_id",
        "stock_record",
        "stock_in",
        "stock_out"
    ];

    public function variant(): BelongsTo
    {
        return $this->belongsTo(VariantItem::class, 'variant_item_id', 'id');
    }
}
