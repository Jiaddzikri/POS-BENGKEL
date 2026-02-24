<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Color;

class ItemImportTemplateExport implements FromArray, WithHeadings, WithStyles, WithColumnWidths
{
  public function headings(): array
  {
    return [
      'Item Name',
      'Part Number',
      'Category',
      'Brand',
      'Unit',
      'Purchase Price',
      'Selling Price',
      'Initial Stock',
      'Min Stock',
      'Rack Location',
      'Compatibility',
    ];
  }

  public function array(): array
  {
    // Example row so users understand the format
    return [
      [
        'Oli Mesin 10W-40',
        'OIL-10W40-1L',
        'Oli & Pelumas',
        'Castrol',
        'Liter',
        '45000',
        '65000',
        '50',
        '5',
        'R-A1',
        'Honda Beat, Honda Vario',
      ],
      [
        'Oli Mesin 10W-40',
        'OIL-10W40-2L',
        'Oli & Pelumas',
        'Castrol',
        'Liter',
        '85000',
        '120000',
        '30',
        '3',
        'R-A1',
        'Honda Beat, Honda Vario',
      ],
    ];
  }

  public function styles(Worksheet $sheet): array
  {
    return [
      1 => [
        'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1D4ED8']],
        'alignment' => ['horizontal' => 'center'],
      ],
    ];
  }

  public function columnWidths(): array
  {
    return [
      'A' => 28,
      'B' => 20,
      'C' => 20,
      'D' => 16,
      'E' => 10,
      'F' => 16,
      'G' => 16,
      'H' => 14,
      'I' => 12,
      'J' => 14,
      'K' => 30,
    ];
  }
}
