<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buyer extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'buyers';

    protected $fillable = [
        'tenant_id',
        'discount_id',
        'name',
        'phone_number',
    ];

    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }

}
