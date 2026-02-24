<?php

use App\Http\Controllers\Analytical\AnalyticalController;

Route::middleware(['auth', 'whoCanIn:super_admin,admin,manager'])->group(function () {
  Route::get('/analytics-report', [AnalyticalController::class, 'index'])->name('analytical.index');
  Route::get('/analytics-report/preview', [AnalyticalController::class, 'pdfPreview'])->name('analytical.preview');
  Route::get('/analytics-report/pdf', [AnalyticalController::class, 'downloadAnalyticsPdf'])->name('analytical.pdf');
});