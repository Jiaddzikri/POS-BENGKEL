<?php

use App\Http\Controllers\Analytical\AnalyticalController;

Route::middleware('auth')->group(function () {
  Route::get('/analytics-report', [AnalyticalController::class, 'index'])->name('analytical.index');
  Route::get('/analytics-report/preview', [AnalyticalController::class, 'pdfPreview'])->name('analytical.preview');
});