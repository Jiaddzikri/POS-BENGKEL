<?php

namespace App\Http\Controllers\Analytical;

use App\Exports\AnalyticsReportExport;
use App\Http\Controllers\Controller;
use App\Request\GetAnalyticalRequest;
use App\Service\Analytical\AnalyticalService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class AnalyticalController extends Controller
{
  public function __construct(private AnalyticalService $analyticalService)
  {

  }
  public function index(Request $request)
  {
    $startDate = null;
    $endDate = null;
    $filterUsed = [];

    if ($request->filled('startDate') && $request->filled('endDate')) {
      $startDate = $request->get('startDate');
      $endDate = $request->get('endDate');
      $filterUsed = [
        'startDate' => $request->get('startDate'),
        'endDate' => $request->get('endDate'),
        'range' => ''

      ];
    } else {
      $range = $request->get('range', 'today') ?? 'today';
      $filterUsed = ['range' => $range, 'startDate' => null, 'endDate' => null];
    }

    $analyticalRequest = new GetAnalyticalRequest();
    $analyticalRequest->startDate = $startDate;
    $analyticalRequest->endDate = $endDate;
    $analyticalRequest->range = $filterUsed['range'] ?? null;
    $analyticalRequest->tenantId = $request->user()->tenant_id;


    $revenue = $this->analyticalService->getRevenue($analyticalRequest);
    $totalTransaction = $this->analyticalService->getTotalTransaction($analyticalRequest);
    $grossProfit = $this->analyticalService->getGrossProfit($analyticalRequest);
    $averageTransaction = $this->analyticalService->getAverageTransacation($analyticalRequest);
    $salesTrend = $this->analyticalService->getSalesTrend($analyticalRequest);
    $bestSellingItem = $this->analyticalService->getBestSellingItem($analyticalRequest);
    $bestSellingCategory = $this->analyticalService->getBestSellingCategory($analyticalRequest);

    return Inertia::render('report', [
      "revenue" => $revenue,
      "transaction" => $totalTransaction,
      "grossProfit" => $grossProfit,
      "averageTransaction" => $averageTransaction,
      "getSalesTrend" => [
        "labels" => $salesTrend->labels,
        'value' => $salesTrend->value
      ],
      "bestSellingItem" => $bestSellingItem->items,
      "bestSellingCategory" => $bestSellingCategory->category,
      "filters" => $filterUsed,
    ]);
  }

  public function export(Request $request)
  {
    $startDate = null;
    $endDate = null;
    $range = null;
    $fileName = null;


    if ($request->filled('startDate') && $request->filled('endDate')) {
      $startDate = $request->get('startDate', null);
      $endDate = $request->get('endDate', null);
    }

    if ($request->filled('range')) {
      $range = $request->get('range', 'today') ?? 'today';

    }

    $tenantId = $request->user()->tenant_id;

    if ($range) {
      $fileName = 'Laporan_Analitik_' . $range . '.xlsx';
    } else {
      $fileName = 'Laporan Analitik_' . $startDate . ' - ' . $endDate . '.xlsx';
    }
    return Excel::download(new AnalyticsReportExport($range, $tenantId, $startDate, $endDate), $fileName);
  }
}