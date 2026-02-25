<?php

namespace App\Http\Controllers\Analytical;

use App\Exports\AnalyticsReportExport;
use App\Http\Controllers\Controller;
use App\Helpers\AppLog;
use App\Models\Tenant;
use App\Request\GetAnalyticalRequest;
use App\Service\Analytical\AnalyticalService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
        'range' => '',
        'order_type' => $request->get('order_type', ''),
      ];
    } else {
      $range = $request->get('range', 'today') ?? 'today';
      $filterUsed = [
        'range' => $range,
        'startDate' => null,
        'endDate' => null,
        'order_type' => $request->get('order_type', ''),
      ];
    }

    $analyticalRequest = new GetAnalyticalRequest();
    $analyticalRequest->startDate = $startDate;
    $analyticalRequest->endDate = $endDate;
    $analyticalRequest->range = $filterUsed['range'] ?? null;
    $analyticalRequest->tenantId = $request->user()->tenant_id;
    $analyticalRequest->orderType = $filterUsed['order_type'] ?: null;


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

  public function pdfPreview(Request $request)
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
        'range' => '',
        'order_type' => $request->get('order_type', ''),
      ];
    } else {
      $range = $request->get('range', 'today') ?? 'today';
      $filterUsed = [
        'range' => $range,
        'startDate' => null,
        'endDate' => null,
        'order_type' => $request->get('order_type', ''),
      ];
    }

    $analyticalRequest = new GetAnalyticalRequest();
    $analyticalRequest->startDate = $startDate;
    $analyticalRequest->endDate = $endDate;
    $analyticalRequest->range = $filterUsed['range'] ?? null;
    $analyticalRequest->tenantId = $request->user()->tenant_id;
    $analyticalRequest->orderType = $filterUsed['order_type'] ?: null;


    $revenue = $this->analyticalService->getRevenue($analyticalRequest);
    $totalTransaction = $this->analyticalService->getTotalTransaction($analyticalRequest);
    $grossProfit = $this->analyticalService->getGrossProfit($analyticalRequest);
    $averageTransaction = $this->analyticalService->getAverageTransacation($analyticalRequest);
    $salesTrend = $this->analyticalService->getSalesTrend($analyticalRequest);
    $bestSellingItem = $this->analyticalService->getBestSellingItem($analyticalRequest);
    $bestSellingCategory = $this->analyticalService->getBestSellingCategory($analyticalRequest);

    return Inertia::render('reports/print-analytical-report', [
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
    try {
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
    } catch (\Throwable $e) {

      AppLog::execption($e);

      return back()->with('error', 'Export gagal, silakan coba lagi');
    }
  }

  public function downloadAnalyticsPdf(Request $request)
  {
    try {
      // ── Build filter ──────────────────────────────────────────────
      $startDate = null;
      $endDate = null;
      $filterUsed = [];

      if ($request->filled('startDate') && $request->filled('endDate')) {
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $filterUsed = [
          'startDate' => $startDate,
          'endDate' => $endDate,
          'range' => '',
          'order_type' => $request->get('order_type', ''),
        ];
      } else {
        $range = $request->get('range', 'today') ?? 'today';
        $filterUsed = [
          'range' => $range,
          'startDate' => null,
          'endDate' => null,
          'order_type' => $request->get('order_type', ''),
        ];
      }

      $tenantId = $request->user()->tenant_id;
      $tenant = Tenant::find($tenantId);

      $analyticalRequest = new GetAnalyticalRequest();
      $analyticalRequest->startDate = $startDate;
      $analyticalRequest->endDate = $endDate;
      $analyticalRequest->range = $filterUsed['range'] ?? null;
      $analyticalRequest->tenantId = $tenantId;
      $analyticalRequest->orderType = $filterUsed['order_type'] ?: null;

      // ── Gather all data ───────────────────────────────────────────
      $revenue = $this->analyticalService->getRevenue($analyticalRequest);
      $totalTransaction = $this->analyticalService->getTotalTransaction($analyticalRequest);
      $grossProfit = $this->analyticalService->getGrossProfit($analyticalRequest);
      $averageTransaction = $this->analyticalService->getAverageTransacation($analyticalRequest);
      $totalProfit = $this->analyticalService->getTotalProfit($analyticalRequest);
      $transactions = $this->analyticalService->getDetailedTransactions($analyticalRequest);

      // ── Resolve period label ──────────────────────────────────────
      if ($startDate && $endDate) {
        $periodLabel = Carbon::parse($startDate)->format('d M Y') . ' – ' . Carbon::parse($endDate)->format('d M Y');
      } else {
        $rangeLabels = ['today' => 'Hari Ini', 'week' => '7 Hari Terakhir', 'month' => '30 Hari Terakhir', 'year' => '1 Tahun Terakhir'];
        $periodLabel = $rangeLabels[$filterUsed['range'] ?? 'today'] ?? 'Hari Ini';
      }

      // ── Build detail rows (flat, grouped by transaction) ─────────
      $detailRows = [];
      $no = 0;
      foreach ($transactions as $tx) {
        $txTotal = 0;
        foreach ($tx->details as $detail) {
          $no++;
          $unitPrice = $detail->price_at_sale;
          $purchasePrice = $detail->item?->purchase_price ?? 0;
          $qty = $detail->quantity;
          $subtotal = $unitPrice * $qty;
          $profit = ($unitPrice - $purchasePrice) * $qty;
          $marginPct = $unitPrice > 0 ? round(($unitPrice - $purchasePrice) / $unitPrice * 100, 1) : 0;
          $txTotal += $subtotal;

          $detailRows[] = [
            'no' => $no,
            'tx_id' => $tx->invoice_number ?? substr($tx->id, 0, 8),
            'date' => Carbon::parse($tx->created_at)->format('d/m/Y H:i'),
            'buyer' => $tx->buyer?->name ?? 'Umum',
            'part_number' => $detail->item?->part_number ?? '—',
            'item' => ($detail->item?->name ?? '—') . ' / ' . ($detail->variant?->name ?? ''),
            'qty' => $qty,
            'unit_price' => $unitPrice,
            'subtotal' => $subtotal,
            'margin_pct' => $marginPct,
            'is_first_row' => $detail->is($tx->details->first()),
            'row_count' => $tx->details->count(),
            'tx_total' => $txTotal,
          ];
        }
      }

      // Grand total
      $grandTotal = $transactions->sum('final_amount');

      $orderTypeLabels = ['online' => 'Online', 'offline' => 'Offline'];
      $orderTypeLabel = isset($analyticalRequest->orderType) && $analyticalRequest->orderType
        ? ($orderTypeLabels[$analyticalRequest->orderType] ?? 'Semua')
        : 'Semua';

      $pdf = Pdf::loadView('reports.analytics-pdf', [
        'tenant' => $tenant,
        'periodLabel' => $periodLabel,
        'orderTypeLabel' => $orderTypeLabel,
        'printedBy' => $request->user()->name,
        'printedAt' => now()->format('d M Y, H:i'),
        'revenue' => $revenue->revenue,
        'totalTransaction' => $totalTransaction->total,
        'grossProfit' => $grossProfit->grossProfit,
        'avgTransaction' => $averageTransaction->averageValue,
        'totalProfit' => $totalProfit->totalProfit,
        'detailRows' => $detailRows,
        'grandTotal' => $grandTotal,
      ]);

      $pdf->setPaper('A4', 'landscape');
      $pdf->setOptions([
        'dpi' => 110,
        'defaultFont' => 'Helvetica',
        'isRemoteEnabled' => false,
        'isHtml5ParserEnabled' => true,
        'chroot' => public_path(),
      ]);

      $fileName = 'Laporan_Analitik_' . now()->format('Ymd_His') . '.pdf';
      return $pdf->download($fileName);

    } catch (\Throwable $e) {
      AppLog::execption($e);
      return back()->with('error', 'Gagal menghasilkan PDF: ' . $e->getMessage());
    }
  }
}
