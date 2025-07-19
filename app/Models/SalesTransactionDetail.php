<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function salesTransaction()
    {
        return $this->belongsTo(SalesTransaction::class, 'sales_transaction_id');
    }
}
