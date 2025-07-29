<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids; // Import trait
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Tenant extends Model
{
    use HasFactory, HasUuids;

    protected $table = "tenants";

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'status',
        'is_deleted'
    ];

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function salesTransactions(): HasMany
    {
        return $this->hasMany(SalesTransaction::class);
    }

    public function Discounts(): HasMany
    {
        return $this->hasMany(Discount::class);
    }
}
