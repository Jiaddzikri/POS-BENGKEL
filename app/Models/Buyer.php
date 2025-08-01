<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Buyer extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'buyers';

    protected $fillable = [
        'tenant_id',
        'discount_id',
        'name',
        'phone_number',
        // 'is_deleted'
    ];

    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }

    public function salesTransaction(): HasMany
    {
        return $this->hasMany(SalesTransaction::class);
    }
}
