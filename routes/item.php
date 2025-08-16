<?php

use App\Http\Controllers\Item\ItemController;
use App\Http\Controllers\Variant\VariantController;

Route::middleware('auth')->group(function () {

  Route::resource('item', ItemController::class)->except([
    'show'
  ])->names([
        'index' => 'item.index',
        'create' => 'item.create',
        'store' => 'item.store',
        'edit' => 'item.edit',
        'update' => 'item.update',
        'destroy' => 'item.destroy'
      ]);
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

  Route::prefix('api/item/variant')->name('api.variant.')->group(function () {
    Route::get('/', [ItemController::class, 'findItem'])->name('find');
  });
});