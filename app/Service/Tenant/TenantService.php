<?php

namespace App\Service\Tenant;

use App\Models\Tenant;
use App\Request\TenantAttributeRequest;
use Illuminate\Support\Facades\DB;

class TenantService
{
  public function store(TenantAttributeRequest $request)
  {
    return DB::transaction((function () use ($request) {
      Tenant::create([
        'name' => $request->name,
        'status' => $request->status,
      ]);
    }));
  }

  public function update(TenantAttributeRequest $request, string $id)
  {
    return DB::transaction((function () use ($request, $id) {
      Tenant::findOrFail($id)->update([
        'name' => $request->name,
        'status' => $request->status
      ]);
    }));
  }

  public function delete(string $id)
  {

    return DB::transaction((function () use ($id) {
      Tenant::findOrFail($id)->update([
        'is_deleted' => true,
      ]);
    }));
  }
}
