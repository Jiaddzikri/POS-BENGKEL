<?php

use App\Http\Controllers\Item\ItemController;
use App\Http\Controllers\Variant\VariantController;

Route::middleware('auth')->group(function () {

  Route::resource('item', ItemController::class);
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