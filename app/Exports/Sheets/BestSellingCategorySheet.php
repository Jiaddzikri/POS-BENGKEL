<?php

namespace App\Exports\Sheets;

use App\Request\GetAnalyticalRequest;
use App\Service\Analytical\AnalyticalService;
use App\Request\GetBestSellingCategoryRequest;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class BestSellingCategorySheet implements FromCollection, WithTitle, WithHeadings, WithMapping, ShouldAutoSize
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
    $request->range = $this->requestData["range"];
    $request->tenantId = $this->requestData["tenantId"];
    $request->startDate = $this->requestData["startDate"];
    $request->endDate = $this->requestData["endDate"];
    ;

    $bestSellingCategory = $this->analyticalService->getBestSellingCategory($request);
    return $bestSellingCategory->category;
  }

  public function headings(): array
  {
    return ['Peringkat', 'Nama Kategori', 'Kuantitas Terjual', 'Total Pendapatan'];
  }

  public function map($category): array
  {
    static $rank = 0;
    return [
      ++$rank,
      $category->category,
      $category->total_quantity,
      $category->total_revenue, // Pastikan query di service Anda sudah benar
    ];
  }

  public function title(): string
  {
    return 'Kategori Terlaris';
  }
}