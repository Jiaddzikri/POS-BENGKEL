<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Discount extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'discounts';

    protected $fillable = [
        'tenant_id',
        'name',
        'desc',
        'discount_percent',
        'description',
        'active',
        'is_deleted'
    ];

    public function buyers(): HasMany
    {
        return $this->hasMany(Buyer::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }
}
