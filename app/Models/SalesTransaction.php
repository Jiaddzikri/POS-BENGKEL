<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesTransaction extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'sales_transactions';

    protected $fillable = [
        'tenant_id',
        'buyer_id',
        'invoice_number',
        'name',
        'total_amount',
        'final_amount',
        'payment_method',
        'amount_paid',
        'change',
    ];

    public function details()
    {
        return $this->hasMany(SalesTransactionDetail::class, 'sales_transaction_id');
    }
}
