<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\VariantItemResource;
use App\Request\GetAnalyticalRequest;
use App\Service\Analytical\AnalyticalService;
use App\Service\Item\ItemService;
use App\Service\Transaction\TransactionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
  public function __construct(private AnalyticalService $analyticalService, private ItemService $itemService, private TransactionService $transactionService)
  {

  }

  public function index(Request $request)
  {
    $startDate = null;
    $endDate = null;
    $filterUsed = [];
    $orderType = $request->get('order_type') ?: null;

    if ($request->filled('startDate') && $request->filled('endDate')) {
      $startDate = $request->get('startDate');
      $endDate = $request->get('endDate');
      $filterUsed = [
        'startDate' => $request->get('startDate'),
        'endDate' => $request->get('endDate'),
        'range' => '',
        'order_type' => $orderType ?? '',
      ];
    } else {
      $range = $request->get('range', 'today') ?? 'today';
      $filterUsed = ['range' => $range, 'startDate' => null, 'endDate' => null, 'order_type' => $orderType ?? ''];
    }

    $analyticalRequest = new GetAnalyticalRequest();
    $analyticalRequest->startDate = $startDate;
    $analyticalRequest->endDate = $endDate;
    $analyticalRequest->range = $filterUsed['range'] ?? null;
    $analyticalRequest->tenantId = $request->user()->tenant_id;
    $analyticalRequest->orderType = $orderType;

    $revenue = $this->analyticalService->getRevenue($analyticalRequest);
    $totalTransaction = $this->analyticalService->getTotalTransaction($analyticalRequest);
    $getCompletedTransaction = $this->analyticalService->getCompletedTransaction($analyticalRequest);
    $getActiveCustomer = $this->analyticalService->getActiveCustomers($analyticalRequest);
    $salesTrend = $this->analyticalService->getSalesTrend($analyticalRequest);
    $bestSellingItem = $this->analyticalService->getBestSellingItem($analyticalRequest);
    $bestSellingCategory = $this->analyticalService->getBestSellingCategory($analyticalRequest);
    $totalProfit = $this->analyticalService->getTotalProfit($analyticalRequest);
    $dailyServiceVolume = $this->analyticalService->getDailyServiceVolume($analyticalRequest);
    $deadStock = $this->analyticalService->getDeadStock($analyticalRequest);
    $lowStockItems = $this->itemService->getLowStockItem($request->user()->tenant_id);
    $newestTransaction = $this->transactionService->getNewestTransaction($request->user()->tenant_id, 5);

    return Inertia::render('dashboard', [
      "revenue" => $revenue,
      'totalTransaction' => $totalTransaction,
      'completedTransaction' => $getCompletedTransaction,
      'activeCustomer' => $getActiveCustomer,
      'salesTrend' => $salesTrend,
      'bestSellingCategory' => $bestSellingCategory->category,
      'bestSellingItem' => $bestSellingItem->items,
      'totalProfit' => $totalProfit,
      'dailyServiceVolume' => $dailyServiceVolume,
      'deadStock' => ['items' => $deadStock->items->values(), 'total' => $deadStock->total],
      'lowStockItems' => VariantItemResource::collection($lowStockItems) ?? [],
      'newestTransactions' => $newestTransaction,
      'filters' => $filterUsed,
    ]);

  }
}
