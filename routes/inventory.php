<?php

use App\Http\Controllers\Invetory\InventoryController;

Route::middleware('auth')->group(function () {
  Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
  Route::get('/inventory/preview', [InventoryController::class, 'showPdfPreview'])->name('inventory.print');

  // Stock adjustment: super_admin, admin, manager only
  Route::post('/inventory/adjust', [InventoryController::class, 'adjustStock'])->name('inventory.adjust')->middleware('whoCanIn:super_admin,admin,manager');
});