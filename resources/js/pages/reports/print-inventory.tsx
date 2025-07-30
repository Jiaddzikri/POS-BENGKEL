import InventoryPdfReport from '@/components/inventory-reports';
import PdfWrapper from '@/components/pdf-wrapper';
import { InventoryData, InventoryFilters, InventoryStats } from '@/types';

interface PrintInventoryProps {
  stats: InventoryStats;
  filters: InventoryFilters;
  inventoryData: InventoryData;
}

export default function PrintInventory({ stats, inventoryData, filters }: PrintInventoryProps) {
  return (
    <PdfWrapper filename={`Laporan-Inventaris-${filters.startDate}`}>
      <InventoryPdfReport stats={stats} inventoryData={inventoryData} filters={filters} />
    </PdfWrapper>
  );
}
