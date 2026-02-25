<?php

namespace App\Service\Analytical;

use App\Models\Item;
use App\Models\Order;
use App\Models\SalesTransaction;
use App\Models\SalesTransactionDetail;
use App\Request\GetAnalyticalRequest;

use App\Response\GetActiveCustomerResponse;
use App\Response\GetAverageTransactionResponse;
use App\Response\GetBestSellingCategoryResponse;
use App\Response\GetCompletedTransactionResponse;
use App\Response\GetDailyServiceVolumeResponse;
use App\Response\GetDeadStockResponse;
use App\Response\GetGrossProfitResponse;
use App\Response\GetProductBestSellerResponse;
use App\Response\GetRevenueResponse;
use App\Response\GetSalesTrendResponse;
use App\Response\GetTotalProfitResponse;
use App\Response\GetTotalTransactionResponse;
use DB;
use Illuminate\Support\Carbon;


class AnalyticalService
{
  public function getRevenue(GetAnalyticalRequest $request): GetRevenueResponse
  {

    [$currentStart, $currentEnd, $previousStart, $previousEnd] = $this->getDateRanges($request);

    $currentRevenue = $this->calculateRevenue($currentStart, $currentEnd, $request->tenantId, $request->orderType);
    $previousRevenue = $this->calculateRevenue($previousStart, $previousEnd, $request->tenantId, $request->orderType);

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

    $currentTransaction = $this->calculateTotalTransaction($currentStart, $currentEnd, $request->tenantId, $request->orderType);

    $previousTransaction = $this->calculateTotalTransaction($previousStart, $previousEnd, $request->tenantId, $request->orderType);

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

    $currentRevenue = $this->calculateRevenue($currentStart, $currentEnd, $request->tenantId, $request->orderType);
    $previousRevenue = $this->calculateRevenue($previousStart, $previousEnd, $request->tenantId, $request->orderType);


    $currentTotalCogs = $this->calculateCogs($currentStart, $currentEnd, $request->tenantId, $request->orderType);
    $previousTotalCogs = $this->calculateCogs($previousStart, $previousEnd, $request->tenantId, $request->orderType);

    $currentGrossProfit = $currentRevenue - $currentTotalCogs;
    $previousGrossProfit = $previousRevenue - $previousTotalCogs;

    $trend = 'stable';
    $percentageChange = 0.0;

    if ($previousGrossProfit > 0) {
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

    $currentRevenue = $this->calculateRevenue($currentStart, $currentEnd, $request->tenantId, $request->orderType);
    $previousRevenue = $this->calculateRevenue($previousStart, $previousEnd, $request->tenantId, $request->orderType);

    $currentTotalTransaction = $this->calculateTotalTransaction($currentStart, $currentEnd, $request->tenantId, $request->orderType);
    $previousTotalTransaction = $this->calculateTotalTransaction($previousStart, $previousEnd, $request->tenantId, $request->orderType);

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
    [$currentStart, $currentEnd] = $this->getDateRanges($request);

    $labels = [];
    $data = [];

    $durationInDays = $currentStart->diffInDays($currentEnd);

    if ($durationInDays < 1) {
      $salesData = SalesTransaction::query()
        ->select(
          DB::raw('HOUR(sales_transactions.created_at) as hour'),
          DB::raw('SUM(sales_transactions.final_amount) as total_sales')
        )
        ->where('sales_transactions.tenant_id', $request->tenantId)
        ->whereBetween('sales_transactions.created_at', [$currentStart, $currentEnd])
        ->when($request->orderType, function ($q) use ($request) {
          $q->join('orders', 'sales_transactions.order_id', '=', 'orders.id')
            ->where('orders.order_type', $request->orderType);
        })
        ->groupBy('hour')
        ->orderBy('hour', 'asc')
        ->pluck('total_sales', 'hour');

      for ($hour = 0; $hour < 24; $hour++) {
        $labels[] = str_pad($hour, 2, '0', STR_PAD_LEFT) . ':00';
        $data[] = (float) ($salesData[$hour] ?? 0);
      }

    } else {
      $salesData = SalesTransaction::query()
        ->select(
          DB::raw('DATE(sales_transactions.created_at) as sale_date'),
          DB::raw('SUM(sales_transactions.final_amount) as total_sales')
        )
        ->where('sales_transactions.tenant_id', $request->tenantId)
        ->whereBetween('sales_transactions.created_at', [$currentStart, $currentEnd])
        ->when($request->orderType, function ($q) use ($request) {
          $q->join('orders', 'sales_transactions.order_id', '=', 'orders.id')
            ->where('orders.order_type', $request->orderType);
        })
        ->groupBy('sale_date')
        ->orderBy('sale_date', 'asc')
        ->pluck('total_sales', 'sale_date');

      $period = Carbon::parse($currentStart)->toPeriod($currentEnd);

      foreach ($period as $date) {
        $dateString = $date->toDateString();
        $labels[] = $date->format('d M');
        $data[] = (float) ($salesData[$dateString] ?? 0);
      }
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
        'items.id as item_id',
        'items.name as item_name',
        'items.part_number as part_number',
        'items.sku as sku',
        'categories.name as category',
        DB::raw('SUM(sales_transaction_details.quantity) as total_quantity'),
        DB::raw('SUM(sales_transaction_details.price_at_sale * sales_transaction_details.quantity) as total_revenue'),
        DB::raw('ROUND((MAX(items.selling_price) - MAX(items.purchase_price)) / NULLIF(MAX(items.selling_price), 0) * 100, 2) as profit_margin_pct')
      )
      ->join('sales_transactions', 'sales_transaction_details.sales_transaction_id', '=', 'sales_transactions.id')
      ->join('items', 'sales_transaction_details.item_id', '=', 'items.id')
      ->join('categories', 'items.category_id', '=', 'categories.id')
      ->when($request->tenantId, function ($q) use ($request) {
        $q->where('sales_transactions.tenant_id', $request->tenantId);
      })
      ->when($request->orderType, function ($q) use ($request) {
        $q->join('orders', 'sales_transactions.order_id', '=', 'orders.id')
          ->where('orders.order_type', $request->orderType);
      })
      ->whereBetween('sales_transactions.created_at', [$currentStart, $currentEnd])
      ->groupBy(
        'items.id',
        'items.name',
        'items.part_number',
        'items.sku',
        'categories.id',
        'categories.name'
      )
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
        'categories.id as category_id',
        'categories.name as category',
        DB::raw('SUM(sales_transaction_details.quantity) as total_quantity'),
        DB::raw('SUM(sales_transaction_details.price_at_sale * sales_transaction_details.quantity) as total_revenue')
      )
      ->join('sales_transactions', 'sales_transaction_details.sales_transaction_id', '=', 'sales_transactions.id')
      ->join('items', 'sales_transaction_details.item_id', '=', 'items.id')
      ->join('categories', 'items.category_id', '=', 'categories.id')
      ->where('sales_transactions.tenant_id', '=', $request->tenantId)
      ->when($request->orderType, function ($q) use ($request) {
        $q->join('orders', 'sales_transactions.order_id', '=', 'orders.id')
          ->where('orders.order_type', $request->orderType);
      })
      ->whereBetween('sales_transactions.created_at', [$currentStart, $currentEnd])
      ->groupBy('categories.id', 'categories.name')
      ->orderByDesc('total_quantity')
      ->limit(5)
      ->get();

    $getBestSellingCategoryResponse = new GetBestSellingCategoryResponse();
    $getBestSellingCategoryResponse->category = $bestSellingCategory;

    return $getBestSellingCategoryResponse;
  }

  public function getCompletedTransaction(GetAnalyticalRequest $request)
  {
    [$currentStart, $currentEnd, $previousStart, $previousEnd] = $this->getDateRanges($request);

    $currentCompleted = $this->calculateCompletedTransaction($currentStart, $currentEnd, $request->tenantId, $request->orderType);
    $previousCompleted = $this->calculateCompletedTransaction($previousStart, $previousEnd, $request->tenantId, $request->orderType);

    $trend = 'stable';
    $percentageChange = 0.0;

    if ($previousCompleted > 0) {
      $percentageChange = (($currentCompleted - $previousCompleted) / $previousCompleted) * 100;
    } elseif ($currentCompleted > 0) {
      $percentageChange = 100.0;
    }

    if ($percentageChange > 0) {
      $trend = 'increase';
    } elseif ($percentageChange < 0) {
      $trend = 'decrease';
    }

    $response = new GetCompletedTransactionResponse();
    $response->total = $currentCompleted;
    $response->percentage = $percentageChange;
    $response->trend = $trend;

    return $response;
  }

  public function getActiveCustomers(GetAnalyticalRequest $request)
  {
    [$currentStart, $currentEnd, $previousStart, $previousEnd] = $this->getDateRanges($request);

    $currentActiveCustomers = $this->calculateActiveCustomers($currentStart, $currentEnd, $request->tenantId, $request->orderType);
    $previousActiveCustomers = $this->calculateActiveCustomers($previousStart, $previousEnd, $request->tenantId, $request->orderType);

    $trend = 'stable';
    $percentageChange = 0.0;

    if ($previousActiveCustomers > 0) {
      $percentageChange = (($currentActiveCustomers - $previousActiveCustomers) / $previousActiveCustomers) * 100;
    } elseif ($currentActiveCustomers > 0) {
      $percentageChange = 100.0;
    }

    if ($percentageChange > 0) {
      $trend = 'increase';
    } elseif ($percentageChange < 0) {
      $trend = 'decrease';
    }

    $response = new GetActiveCustomerResponse();
    $response->total = $currentActiveCustomers;
    $response->percentage = $percentageChange;
    $response->trend = $trend;

    return $response;
  }


  private function calculateActiveCustomers($startDate, $endDate, $tenantId, ?string $orderType = null)
  {
    return SalesTransaction::query()
      ->where('sales_transactions.tenant_id', $tenantId)
      ->whereBetween('sales_transactions.created_at', [$startDate, $endDate])
      ->when($orderType, function ($q) use ($orderType) {
        $q->join('orders', 'sales_transactions.order_id', '=', 'orders.id')
          ->where('orders.order_type', $orderType);
      })
      ->distinct('sales_transactions.buyer_id')
      ->count('sales_transactions.buyer_id');
  }


  private function calculateCompletedTransaction($startDate, $endDate, $tenantId, ?string $orderType = null)
  {
    return Order::where('tenant_id', $tenantId)
      ->where('order_status', 'completed')
      ->whereBetween('created_at', [$startDate, $endDate])
      ->when($orderType, fn($q) => $q->where('order_type', $orderType))
      ->count();
  }


  private function calculateTotalTransaction($startDate, $endDate, $tenantId, ?string $orderType = null)
  {
    return SalesTransaction::query()
      ->where('sales_transactions.tenant_id', $tenantId)
      ->whereBetween('sales_transactions.created_at', [$startDate, $endDate])
      ->when($orderType, function ($q) use ($orderType) {
        $q->join('orders', 'sales_transactions.order_id', '=', 'orders.id')
          ->where('orders.order_type', $orderType);
      })
      ->count();
  }

  private function calculateRevenue($startDate, $endDate, $tenantId, ?string $orderType = null)
  {
    return SalesTransaction::query()
      ->where('sales_transactions.tenant_id', $tenantId)
      ->whereBetween('sales_transactions.created_at', [$startDate, $endDate])
      ->when($orderType, function ($q) use ($orderType) {
        $q->join('orders', 'sales_transactions.order_id', '=', 'orders.id')
          ->where('orders.order_type', $orderType);
      })
      ->sum('sales_transactions.final_amount');
  }

  private function calculateCogs($startDate, $endDate, $tenantId, ?string $orderType = null)
  {
    return SalesTransactionDetail::query()
      ->join('sales_transactions', 'sales_transaction_details.sales_transaction_id', '=', 'sales_transactions.id')
      ->join('items', 'sales_transaction_details.item_id', '=', 'items.id')
      ->when($orderType, function ($q) use ($orderType) {
        $q->join('orders', 'sales_transactions.order_id', '=', 'orders.id')
          ->where('orders.order_type', $orderType);
      })
      ->where('sales_transactions.tenant_id', $tenantId)
      ->whereBetween('sales_transactions.created_at', [$startDate, $endDate])
      ->sum(DB::raw('items.purchase_price * sales_transaction_details.quantity'));
  }

  // ─────────────────────────────────────────────────────────────
  //  NEW: Summary Service Methods
  // ─────────────────────────────────────────────────────────────

  /**
   * Total Profit = SUM((variant.price - item.purchase_price) * quantity)
   * for all completed sales in the date range.
   */
  public function getTotalProfit(GetAnalyticalRequest $request): GetTotalProfitResponse
  {
    [$currentStart, $currentEnd, $previousStart, $previousEnd] = $this->getDateRanges($request);

    $current = $this->calculateTotalProfit($currentStart, $currentEnd, $request->tenantId, $request->orderType);
    $previous = $this->calculateTotalProfit($previousStart, $previousEnd, $request->tenantId, $request->orderType);

    $trend = 'stable';
    $percentageChange = 0.0;

    if ($previous > 0) {
      $percentageChange = (($current - $previous) / $previous) * 100;
    } elseif ($current > 0) {
      $percentageChange = 100.0;
    }

    if ($percentageChange > 0)
      $trend = 'increase';
    elseif ($percentageChange < 0)
      $trend = 'decrease';

    $response = new GetTotalProfitResponse();
    $response->totalProfit = $current;
    $response->trend = $trend;
    $response->percentage = round($percentageChange, 2);

    return $response;
  }

  /**
   * Daily Service Volume = number of completed SalesTransactions per day
   * within the selected date range, plus period-over-period trend.
   */
  public function getDailyServiceVolume(GetAnalyticalRequest $request): GetDailyServiceVolumeResponse
  {
    [$currentStart, $currentEnd, $previousStart, $previousEnd] = $this->getDateRanges($request);

    $rows = SalesTransaction::query()
      ->select(
        DB::raw('DATE(sales_transactions.created_at) as date'),
        DB::raw('COUNT(*) as count')
      )
      ->where('sales_transactions.tenant_id', $request->tenantId)
      ->whereBetween('sales_transactions.created_at', [$currentStart, $currentEnd])
      ->when($request->orderType, function ($q) use ($request) {
        $q->join('orders', 'sales_transactions.order_id', '=', 'orders.id')
          ->where('orders.order_type', $request->orderType);
      })
      ->groupBy('date')
      ->orderBy('date')
      ->get()
      ->map(fn($r) => ['date' => $r->date, 'count' => (int) $r->count])
      ->values()
      ->toArray();

    $currentTotal = array_sum(array_column($rows, 'count'));
    $previousTotal = SalesTransaction::query()
      ->where('sales_transactions.tenant_id', $request->tenantId)
      ->whereBetween('sales_transactions.created_at', [$previousStart, $previousEnd])
      ->when($request->orderType, function ($q) use ($request) {
        $q->join('orders', 'sales_transactions.order_id', '=', 'orders.id')
          ->where('orders.order_type', $request->orderType);
      })
      ->count();

    $trend = 'stable';
    $percentageChange = 0.0;

    if ($previousTotal > 0) {
      $percentageChange = (($currentTotal - $previousTotal) / $previousTotal) * 100;
    } elseif ($currentTotal > 0) {
      $percentageChange = 100.0;
    }

    if ($percentageChange > 0)
      $trend = 'increase';
    elseif ($percentageChange < 0)
      $trend = 'decrease';

    $response = new GetDailyServiceVolumeResponse();
    $response->data = $rows;
    $response->total = $currentTotal;
    $response->trend = $trend;
    $response->percentage = round($percentageChange, 2);

    return $response;
  }

  /**
   * Dead Stock = Items belonging to this tenant that have had
   * NO sales in the last 90 days (fixed window, independent of date range).
   */
  public function getDeadStock(GetAnalyticalRequest $request): GetDeadStockResponse
  {
    $cutoff = now()->subDays(90)->startOfDay();

    // Sub-query: item IDs that have sold within the last 90 days
    $activeItemIds = SalesTransactionDetail::query()
      ->join('sales_transactions', 'sales_transaction_details.sales_transaction_id', '=', 'sales_transactions.id')
      ->where('sales_transactions.tenant_id', $request->tenantId)
      ->where('sales_transactions.created_at', '>=', $cutoff)
      ->pluck('sales_transaction_details.item_id');

    $deadItems = Item::query()
      ->with('category:id,name')
      ->whereNotIn('id', $activeItemIds)
      ->where('is_deleted', false)
      ->where('tenant_id', $request->tenantId)
      ->where('status', 'active')
      ->where('stock', '>', 0)
      ->orderByDesc('stock')
      ->get()
      ->map(fn($item) => [
        'item_id' => $item->id,
        'item_name' => $item->name,
        'part_number' => $item->part_number,
        'rack_location' => $item->rack_location,
        'sku' => $item->sku,
        'stock' => $item->stock,
        'price' => $item->selling_price,
        'purchase_price' => $item->purchase_price,
        'category' => $item->category?->name,
      ]);

    $response = new GetDeadStockResponse();
    $response->items = $deadItems;
    $response->total = $deadItems->count();

    return $response;
  }

  // ─────────────────────────────────────────────────────────────
  //  Private helpers
  // ─────────────────────────────────────────────────────────────

  /**
   * SUM((items.selling_price - items.purchase_price) * quantity)
   * for all details that belong to completed sales transactions in the window.
   */
  private function calculateTotalProfit($startDate, $endDate, $tenantId, ?string $orderType = null): float
  {
    return (float) SalesTransactionDetail::query()
      ->join('sales_transactions', 'sales_transaction_details.sales_transaction_id', '=', 'sales_transactions.id')
      ->join('items', 'sales_transaction_details.item_id', '=', 'items.id')
      ->when($orderType, function ($q) use ($orderType) {
        $q->join('orders', 'sales_transactions.order_id', '=', 'orders.id')
          ->where('orders.order_type', $orderType);
      })
      ->where('sales_transactions.tenant_id', $tenantId)
      ->whereBetween('sales_transactions.created_at', [$startDate, $endDate])
      ->sum(DB::raw('(items.selling_price - items.purchase_price) * sales_transaction_details.quantity'));
  }

  /**
   * Full transaction list for PDF report, grouped by transaction.
   * Returns a Collection of SalesTransaction models with loaded relations.
   *
   * NOTE: order_type filter uses whereHas (not a JOIN) so that eager-loaded
   * relations (details, buyer, etc.) are not broken by a clobbered PK.
   */
  public function getDetailedTransactions(GetAnalyticalRequest $request)
  {
    [$currentStart, $currentEnd] = $this->getDateRanges($request);

    return SalesTransaction::with([
      'buyer:id,name,phone_number',
      'user:id,name',
      'details.item:id,name,part_number,purchase_price',
      'details.variant:id,name,sku,price',
    ])
      ->where('sales_transactions.tenant_id', $request->tenantId)
      ->whereBetween('sales_transactions.created_at', [$currentStart, $currentEnd])
      ->when($request->orderType, function ($q) use ($request) {
        $q->whereHas('order', function ($oq) use ($request) {
          $oq->where('order_type', $request->orderType);
        });
      })
      ->orderBy('sales_transactions.created_at')
      ->get();
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