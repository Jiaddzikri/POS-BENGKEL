<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemRecord extends Model
{
  use HasFactory, HasUuids;

  protected $table = "item_records";

  protected $fillable = [
    "item_id",
    "variant_item_id",
    "stock_record",
    "stock_in",
    "stock_out",
    "movement_type",
  ];

  /** Flat-model relation: stock movement → item */
  public function item(): BelongsTo
  {
    return $this->belongsTo(Item::class, 'item_id', 'id');
  }

  /** Legacy relation kept for historical records that still have variant_item_id */
  public function variant(): BelongsTo
  {
    return $this->belongsTo(VariantItem::class, 'variant_item_id', 'id');
  }
}
