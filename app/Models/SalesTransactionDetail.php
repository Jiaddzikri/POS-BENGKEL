<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SalesTransactionDetail extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'sales_transaction_details';

    protected $fillable = [
        'sales_transaction_id',
        'item_id',
        'variant_id',
        'quantity',
        'price_at_sale',
        'total_price',
        'sub_total'
    ];

    public function salesTransaction(): BelongsTo
    {
        return $this->belongsTo(SalesTransaction::class, 'sales_transaction_id');
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(VariantItem::class, 'variant_id', 'id');
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}
