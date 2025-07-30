<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SalesTransaction extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'sales_transactions';

    protected $fillable = [
        'tenant_id',
        'buyer_id',
        'order_id',
        'invoice_number',
        'name',
        'total_amount',
        'final_amount',
        'payment_method',
        'amount_paid',
        'change',
    ];

    public function details(): HasMany
    {
        return $this->hasMany(SalesTransactionDetail::class, 'sales_transaction_id');
    }


    public function tenant()
    {
        return $this->belongsTo(Tenant::class, 'tenant_id', 'id');
    }

    public function buyer()
    {
        return $this->belongsTo(Buyer::class, 'buyer_id', 'id');
    }
}
