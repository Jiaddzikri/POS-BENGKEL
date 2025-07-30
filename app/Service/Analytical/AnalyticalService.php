<?php

namespace App\Service\Analytical;

use App\Models\SalesTransaction;
use App\Models\SalesTransactionDetail;
use App\Request\GetAnalyticalRequest;

use App\Response\GetAverageTransactionResponse;
use App\Response\GetBestSellingCategoryResponse;
use App\Response\GetGrossProfitResponse;
use App\Response\GetProductBestSellerResponse;
use App\Response\GetRevenueResponse;
use App\Response\GetSalesTrendResponse;
use App\Response\GetTotalTransactionResponse;
use DB;
use Illuminate\Support\Carbon;


class AnalyticalService
{
  public function getRevenue(GetAnalyticalRequest $request): GetRevenueResponse
  {

    [$currentStart, $currentEnd, $previousStart, $previousEnd] = $this->getDateRanges($request);

    $currentRevenue = $this->calculateRevenue($currentStart, $currentEnd, $request->tenantId);
    $previousRevenue = $this->calculateRevenue($previousStart, $previousEnd, $request->tenantId);

    $trend = 'stable';
    $percentageChange = 0.0;

    if ($previousRevenue > 0) {
      $percentageChange = (($currentRevenue - $previousRevenue) / $previousRevenue) * 100;
    } elseif ($currentRevenue > 0) {
      $percentageChange = 100.0;
    }

    if ($percentageChange > 0) {
      $trend = 'increase';
    } elseif ($percentageChange < 0) {
      $trend = 'decrease';
    }

    $getRevenueResponse = new GetRevenueResponse();
    $getRevenueResponse->revenue = $currentRevenue;
    $getRevenueResponse->trend = $trend;
    $getRevenueResponse->percentage = $percentageChange;

    return $getRevenueResponse;
  }

  public function getTotalTransaction(GetAnalyticalRequest $request)
  {
    [$currentStart, $currentEnd, $previousStart, $previousEnd] = $this->getDateRanges($request);

    $currentTransaction = $this->calculateTotalTransaction($currentStart, $currentEnd, $request->tenantId);

    $previousTransaction = $this->calculateTotalTransaction($previousStart, $previousEnd, $request->tenantId);

    $trend = 'stable';
    $percentageChange = 0.0;

    if ($previousTransaction > 0) {
      $percentageChange = (($currentTransaction - $previousTransaction) / $previousTransaction) * 100;
    } elseif ($currentTransaction > 0) {
      $percentageChange = 100.0;
    }

    if ($percentageChange > 0) {
      $trend = 'increase';
    } elseif ($percentageChange < 0) {
      $trend = 'decrease';
    }

    $geTransactionResponse = new GetTotalTransactionResponse();
    $geTransactionResponse->total = $currentTransaction;
    $geTransactionResponse->percentage = $percentageChange;
    $geTransactionResponse->trend = $trend;

    return $geTransactionResponse;
  }

  public function getGrossProfit(GetAnalyticalRequest $request)
  {
    [$currentStart, $currentEnd, $previousStart, $previousEnd] = $this->getDateRanges($request);

    $currentRevenue = $this->calculateRevenue($currentStart, $currentEnd, $request->tenantId);
    $previousRevenue = $this->calculateRevenue($previousStart, $previousEnd, $request->tenantId);


    $currentTotalCogs = $this->calculateCogs($currentStart, $currentEnd, $request->tenantId);
    $previousTotalCogs = $this->calculateCogs($previousStart, $previousEnd, $request->tenantId);

    $currentGrossProfit = $currentRevenue - $currentTotalCogs;
    $previousGrossProfit = $previousRevenue - $previousTotalCogs;

    $trend = 'stable';
    $percentageChange = 0.0;

    if ($previousGrossProfit != 0) {
      $percentageChange = (($currentGrossProfit - $previousGrossProfit) / abs($previousGrossProfit)) * 100;
    } elseif ($currentGrossProfit > 0) {

      $percentageChange = 100.0;
    }

    if ($percentageChange > 0) {
      $trend = 'increase';
    } elseif ($percentageChange < 0) {
      $trend = 'decrease';
    }

    $getGrossProfitResponse = new GetGrossProfitResponse();
    $getGrossProfitResponse->grossProfit = $currentGrossProfit;
    $getGrossProfitResponse->percentage = $percentageChange;
    $getGrossProfitResponse->trend = $trend;

    return $getGrossProfitResponse;
  }

  public function getAverageTransacation(GetAnalyticalRequest $request)
  {
    [$currentStart, $currentEnd, $previousStart, $previousEnd] = $this->getDateRanges($request);

    $currentRevenue = $this->calculateRevenue($currentStart, $currentEnd, $request->tenantId);
    $previousRevenue = $this->calculateRevenue($previousStart, $previousEnd, $request->tenantId);

    $currentTotalTransaction = $this->calculateTotalTransaction($currentStart, $currentEnd, $request->tenantId);
    $previousTotalTransaction = $this->calculateTotalTransaction($previousStart, $previousEnd, $request->tenantId);

    $currentTransactionAverageValue = $currentTotalTransaction > 0 ? ($currentRevenue / $currentTotalTransaction) : 0;
    $previousTransactionAverageValue = $previousTotalTransaction > 0 ? ($previousRevenue / $previousTotalTransaction) : 0;

    $trend = "stable";
    $percentageChange = 0.0;

    if ($previousTransactionAverageValue > 0) {
      $percentageChange = (($currentTransactionAverageValue - $previousTransactionAverageValue) / $previousTransactionAverageValue) * 100;
    } elseif ($currentTransactionAverageValue > 0) {
      $percentageChange = 100.0;
    }

    if ($percentageChange > 0) {
      $trend = 'increase';
    } else if ($percentageChange < 0) {
      $trend = 'decrease';
    }

    $getAverageTransactionResponse = new GetAverageTransactionResponse();
    $getAverageTransactionResponse->trend = $trend;
    $getAverageTransactionResponse->percentage = $percentageChange;
    $getAverageTransactionResponse->averageValue = $currentTransactionAverageValue;

    return $getAverageTransactionResponse;
  }

  public function getSalesTrend(GetAnalyticalRequest $request)
  {
    $salesData = SalesTransaction::query()
      ->select(
        DB::raw('HOUR(created_at) as hour'),
        DB::raw('SUM(final_amount) as total_sales')
      )
      ->where('tenant_id', $request->tenantId)
      ->whereDate('created_at', today())
      ->groupBy('hour')
      ->orderBy('hour', 'asc')
      ->pluck('total_sales', 'hour');

    $hours = range(8, 17);
    $labels = [];
    $data = [];

    foreach ($hours as $hour) {
      $labels[] = str_pad($hour, 2, '0', STR_PAD_LEFT) . ':00';
      $data[] = (float) ($salesData[$hour] ?? 0);
    }

    $getSalesTrendResponse = new GetSalesTrendResponse();
    $getSalesTrendResponse->labels = $labels;
    $getSalesTrendResponse->value = $data;

    return $getSalesTrendResponse;

  }

  public function getBestSellingItem(GetAnalyticalRequest $request)
  {
    [$currentStart, $currentEnd] = $this->getDateRanges($request);

    $bestSellingItem = SalesTransactionDetail::query()
      ->select(
        'items.name as item_name',
        'categories.name as category',
        'variant_items.sku as sku',
        DB::raw('SUM(sales_transaction_details.quantity) as total_quantity'),
        DB::raw('SUM((items.selling_price + variant_items.additional_price) * sales_transaction_details.quantity) as total_revenue')
      )
      ->join('sales_transactions', 'sales_transaction_details.sales_transaction_id', '=', 'sales_transactions.id')
      ->join('items', 'sales_transaction_details.item_id', '=', 'items.id')
      ->join('variant_items', 'sales_transaction_details.variant_id', '=', 'variant_items.id')
      ->join('categories', 'items.category_id', "=", 'categories.id')
      ->where('sales_transactions.tenant_id', '=', $request->tenantId)
      ->whereBetween('sales_transactions.created_at', [$currentStart, $currentEnd])

      ->groupBy('sales_transaction_details.item_id', 'items.name')
      ->groupBy('sales_transaction_details.variant_id', 'variant_items.sku')
      ->orderByDesc('total_quantity')
      ->limit(5)
      ->get();

    $getProductBestSellerResponse = new GetProductBestSellerResponse();
    $getProductBestSellerResponse->items = $bestSellingItem;

    return $getProductBestSellerResponse;
  }

  public function getBestSellingCategory(GetAnalyticalRequest $request)
  {
    [$currentStart, $currentEnd] = $this->getDateRanges($request);

    $bestSellingCategory = SalesTransactionDetail::query()
      ->select(
        'categories.name as category',
        DB::raw('SUM(sales_transaction_details.quantity) as total_quantity'),
        DB::raw('SUM(sales_transaction_details.price_at_sale) * SUM(sales_transaction_details.quantity) as total_revenue')
      )
      ->join('sales_transactions', 'sales_transaction_details.sales_transaction_id', '=', 'sales_transactions.id')
      ->join('items', 'sales_transaction_details.item_id', '=', 'items.id')
      ->join('variant_items', 'sales_transaction_details.variant_id', '=', 'variant_items.id')
      ->join('categories', 'items.category_id', "=", 'categories.id')
      ->where('sales_transactions.tenant_id', '=', $request->tenantId)
      ->whereBetween('sales_transactions.created_at', [$currentStart, $currentEnd])

      ->groupBy('categories.id', 'categories.name')
      ->orderByDesc('total_quantity')
      ->limit(5)
      ->get();

    $getBestSellingCategoryResponse = new GetBestSellingCategoryResponse();
    $getBestSellingCategoryResponse->category = $bestSellingCategory;

    return $getBestSellingCategoryResponse;
  }

  private function calculateTotalTransaction($startDate, $endDate, $tenantId)
  {
    return SalesTransaction::whereBetween('created_at', [$startDate, $endDate])->where('tenant_id', $tenantId)
      ->count();
  }

  private function calculateRevenue($startDate, $endDate, $tenantId)
  {
    return SalesTransaction::query()
      ->where('tenant_id', $tenantId)
      ->whereBetween('created_at', [$startDate, $endDate])
      ->sum('final_amount');
  }

  private function calculateCogs($startDate, $endDate, $tenantId)
  {
    return SalesTransactionDetail::query()
      ->join('sales_transactions', 'sales_transaction_details.sales_transaction_id', '=', 'sales_transactions.id')
      ->join('variant_items', 'sales_transaction_details.variant_id', '=', 'variant_items.id')
      ->join('items', 'variant_items.item_id', '=', 'items.id')
      ->where('sales_transactions.tenant_id', $tenantId)
      ->whereBetween('sales_transactions.created_at', [$startDate, $endDate])
      ->sum(DB::raw('(items.purchase_price + variant_items.additional_price) * sales_transaction_details.quantity'));
  }

  protected function getDateRanges(GetAnalyticalRequest $request): array
  {

    if ($request->startDate && $request->endDate) {
      $start = Carbon::parse($request->startDate)->startOfDay();
      $end = Carbon::parse($request->endDate)->endOfDay();

      $durationInDays = $start->diffInDays($end) + 1;
      $previousEnd = $start->copy()->subSecond();
      $previousStart = $previousEnd->copy()->subDays($durationInDays - 1)->startOfDay();

      return [$start, $end, $previousStart, $previousEnd];
    }


    $range = $request->range ?? 'today';
    $currentStart = now()->startOfDay();
    $currentEnd = now()->endOfDay();

    switch ($range) {
      case 'week':
        $currentStart = now()->subDays(6)->startOfDay();
        break;
      case 'month':
        $currentStart = now()->subDays(29)->startOfDay();
        break;
      case 'year':
        $currentStart = now()->subDays(364)->startOfDay();
        break;
    }


    $durationInDays = $currentStart->diffInDays($currentEnd) + 1;
    $previousEnd = $currentStart->copy()->subSecond();
    $previousStart = $previousEnd->copy()->subDays($durationInDays - 1)->startOfDay();

    return [$currentStart, $currentEnd, $previousStart, $previousEnd];
  }

}