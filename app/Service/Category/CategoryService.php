<?php

namespace App\Service\Category;

use App\Models\Category;
use App\Request\CategoryAttributeRequest;
use Illuminate\Support\Facades\DB;

class CategoryService
{
  public function store(CategoryAttributeRequest $request)
  {
    return DB::transaction(function () use ($request) {
      Category::create([
        'name' => $request->name,
        'tenant_id' => $request->tenant_id
      ]);
    });
  }

  public function update(CategoryAttributeRequest $request, string $id)
  {
    return DB::transaction((function () use ($request, $id) {
      Category::findOrFail($id)->update([
        'name' => $request->name,
        'tenant_id' => $request->tenant_id
      ]);
    }));
  }

  public function delete(string $id)
  {

    return DB::transaction((function () use ($id) {
      Category::findOrFail($id)->update([
        'is_deleted' => true,
      ]);
    }));
  }
}
