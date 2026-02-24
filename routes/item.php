<?php

use App\Http\Controllers\Item\ItemController;
use App\Http\Controllers\Variant\VariantController;

Route::middleware('auth')->group(function () {

  // Read-only: all authenticated roles (cashier needs to browse items)
  Route::get('/item', [ItemController::class, 'index'])->name('item.index');

  Route::prefix('api/item/variant')->name('api.variant.')->group(function () {
    Route::get('/', [ItemController::class, 'findItem'])->name('find');
  });

  // Write operations: super_admin, admin, manager only
  Route::middleware('whoCanIn:super_admin,admin,manager')->group(function () {
    Route::get('/item/create', [ItemController::class, 'create'])->name('item.create');
    Route::post('/item', [ItemController::class, 'store'])->name('item.store');
    Route::get('/item/{item}/edit', [ItemController::class, 'edit'])->name('item.edit');
    Route::put('/item/{item}', [ItemController::class, 'update'])->name('item.update');
    Route::delete('/item/{item}', [ItemController::class, 'destroy'])->name('item.destroy');

    Route::resource('item.variant', VariantController::class)->except([
      'index',
      'show',
      'create',
      'edit',
      'update'
    ])->names([
          'store' => 'item.variant.store',
          'destroy' => 'item.variant.destroy'
        ]);

    Route::post('/item/import', [ItemController::class, 'importItem'])->name('item.import');
    Route::get('/item/import/template', [ItemController::class, 'downloadImportTemplate'])->name('item.import.template');
  });
});