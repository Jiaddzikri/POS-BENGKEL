<?php

namespace App\Service\Discount;

use App\Models\Discount;
use App\Request\DiscountAttributeRequest;
use Illuminate\Support\Facades\DB;

class DiscountService
{

  public function store(DiscountAttributeRequest $request)
  {
    return DB::transaction((function () use ($request) {
      Discount::create([
        'name' => $request->name,
        'desc' => $request->desc,
        'discount_percent' => $request->discount_percent,
        'tenant_id' => $request->tenant_id
      ]);
    }));
  }

  public function update(DiscountAttributeRequest $request, string $id)
  {

    return DB::transaction((function () use ($request, $id) {
      Discount::findOrFail($id)->update([
        'name' => $request->name,
        'desc' => $request->desc,
        'discount_percent' => $request->discount_percent,
        'tenant_id' => $request->tenant_id
      ]);
    }));
  }


  public function updateActive(DiscountAttributeRequest $request, string $id)
  {
    return DB::transaction((function () use ($request, $id) {
      Discount::findOrFail($id)->update([
        'active' => $request->active
      ]);
    }));
  }


  public function delete(string $id)
  {
    return DB::transaction((function () use ($id) {
      Discount::findOrFail($id)->update([
        'is_deleted' => true,
      ]);
    }));
  }
}
