<?php

namespace App\Exports\Sheets;

use App\Request\GetAnalyticalRequest;
use App\Service\Analytical\AnalyticalService;
use App\Request\GetRevenueRequest;
use App\Request\GetTotalTransactionRequest;
use App\Request\GetGrossProfitRequest;
use App\Request\GetAverageTransactionRequest;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class SummarySheet implements FromArray, WithTitle, WithHeadings, ShouldAutoSize
{
    private $analyticalService;
    private $requestData;

    public function __construct($range, $tenantId, $startDate, $endDate)
    {
        $this->analyticalService = new AnalyticalService();
        $this->requestData = ['range' => $range, 'tenantId' => $tenantId, 'startDate' => $startDate, 'endDate' => $endDate];
    }

    public function array(): array
    {
        $request = new GetAnalyticalRequest();
        $request->range = $this->requestData['range'];
        $request->tenantId = $this->requestData['tenantId'];
        $request->startDate = $this->requestData['startDate'];
        $request->endDate = $this->requestData['endDate'];

        $revenue = $this->analyticalService->getRevenue($request);
        $totalTransaction = $this->analyticalService->getTotalTransaction($request);
        $grossProfit = $this->analyticalService->getGrossProfit($request);
        $avgTransaction = $this->analyticalService->getAverageTransacation($request);


        return [
            [
                'Metrik' => 'Pendapatan',
                'Nilai' => $revenue->revenue,
                'Tren' => $revenue->trend,
                'Perubahan (%)' => round($revenue->percentage, 2),
            ],
            [
                'Metrik' => 'Laba Kotor',
                'Nilai' => $grossProfit->grossProfit,
                'Tren' => $grossProfit->trend,
                'Perubahan (%)' => round($grossProfit->percentage, 2),
            ],
            [
                'Metrik' => 'Total Transaksi',
                'Nilai' => $totalTransaction->total,
                'Tren' => $totalTransaction->trend,
                'Perubahan (%)' => round($totalTransaction->percentage, 2),
            ],
            [
                'Metrik' => 'Rata-rata Transaksi',
                'Nilai' => (int) $avgTransaction->averageValue,
                'Tren' => $avgTransaction->trend,
                'Perubahan (%)' => round($avgTransaction->percentage, 2),
            ],
        ];
    }

    public function headings(): array
    {
        return ['Metrik', 'Nilai', 'Tren', 'Perubahan (%)'];
    }

    public function title(): string
    {
        return 'Ringkasan';
    }
}