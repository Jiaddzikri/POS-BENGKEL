<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids; // Import trait
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    use HasFactory, HasUuids; // Gunakan trait di sini

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

    public function categories(): HasMany {
        return $this->hasMany(Category::class);
    }
}