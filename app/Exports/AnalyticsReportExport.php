<?php

namespace App\Exports;

use App\Exports\Sheets\BestSellingCategorySheet;
use App\Exports\Sheets\BestSellingItemSheet;
use App\Exports\Sheets\SalesTrendSheet;
use App\Exports\Sheets\SummarySheet;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class AnalyticsReportExport implements WithMultipleSheets
{
    public function __construct(private $range, private $tenantId, private $startDate, private $endDate)
    {

    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [
            'Ringkasan' => new SummarySheet($this->range, $this->tenantId, $this->startDate, $this->endDate),
            'Tren Penjualan' => new SalesTrendSheet($this->range, $this->tenantId, $this->startDate, $this->endDate),
            'Produk Terlaris' => new BestSellingItemSheet($this->range, $this->tenantId, $this->startDate, $this->endDate),
            'Analisis Kategori' => new BestSellingCategorySheet($this->range, $this->tenantId, $this->startDate, $this->endDate),
        ];

        return $sheets;
    }
}
