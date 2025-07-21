<?php

namespace App\Exports\Sheets;

use App\Request\GetAnalyticalRequest;
use App\Service\Analytical\AnalyticalService;
use App\Request\GetSalesTrendRequest;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class SalesTrendSheet implements FromArray, WithTitle, WithHeadings, ShouldAutoSize
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
        $request->range = $this->requestData["range"];
        $request->tenantId = $this->requestData["tenantId"];
        $request->startDate = $this->requestData['startDate'];
        $request->endDate = $this->requestData['endDate'];
        $salesTrend = $this->analyticalService->getSalesTrend($request);

        $exportData = [];
        foreach ($salesTrend->labels as $index => $label) {
            $exportData[] = [
                'Jam' => $label,
                'Total Penjualan' => $salesTrend->value[$index],
            ];
        }
        return $exportData;
    }

    public function headings(): array
    {
        return ['Jam', 'Total Penjualan'];
    }

    public function title(): string
    {
        return 'Tren Penjualan';
    }
}