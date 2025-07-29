<?php

namespace App\Exports\Sheets;

use App\Request\GetAnalyticalRequest;
use App\Service\Analytical\AnalyticalService;
use App\Request\GetProductBestSellerRequest;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class BestSellingItemSheet implements FromCollection, WithTitle, WithHeadings, WithMapping, ShouldAutoSize
{
  private $analyticalService;
  private $requestData;

  public function __construct($range, $tenantId, $startDate, $endDate)
  {
    $this->analyticalService = new AnalyticalService();
    $this->requestData = ['range' => $range, 'tenantId' => $tenantId, 'startDate' => $startDate, 'endDate' => $endDate];
  }

  public function collection()
  {
    $request = new GetAnalyticalRequest();
    $request->range = $this->requestData['range'];
    $request->tenantId = $this->requestData['tenantId'];
    $request->startDate = $this->requestData['startDate'];
    $request->endDate = $this->requestData['endDate'];

    $bestSellingItems = $this->analyticalService->getBestSellingItem($request);
    return $bestSellingItems->items;
  }

  public function headings(): array
  {
    return ['Peringkat', 'SKU', 'Nama Item', 'Kategori', 'Kuantitas Terjual', 'Total Pendapatan'];
  }

  public function map($item): array
  {
    static $rank = 0;
    return [
      ++$rank,
      $item->sku,
      $item->item_name,
      $item->category,
      $item->total_quantity,
      $item->total_revenue, // Pastikan query di service Anda sudah benar
    ];
  }

  public function title(): string
  {
    return 'Produk Terlaris';
  }
}