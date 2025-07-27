<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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

    ];

    public function buyers(): HasMany
    {
        return $this->hasMany(Buyer::class);
    }
}
