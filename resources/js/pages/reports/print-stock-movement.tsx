import PdfWrapper from '@/components/pdf-wrapper';
import StockReport from '@/components/stock-report';
import { InventoryFilters, StockMovementData } from '@/types';

interface PrintInventoryProps {
  filters: InventoryFilters;
  stockMovementData: StockMovementData;
}

export default function PrintInventory({ stockMovementData, filters }: PrintInventoryProps) {
  return (
    <PdfWrapper filename={`Laporan-Inventaris-${filters.startDate}`}>
      <StockReport stockMovementData={stockMovementData} filters={filters} />
    </PdfWrapper>
  );
}
