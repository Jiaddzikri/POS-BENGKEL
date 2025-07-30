import { InventoryData, InventoryFilters, InventoryStats } from '@/types';
import { numberFormat } from '@/utils/number-format';

interface InventoryProps {
  stats: InventoryStats;
  filters: InventoryFilters;
  inventoryData: InventoryData;
}

const InventoryPdfReport = ({ stats, inventoryData, filters }: InventoryProps) => {
  const getStockStatus = (stock: number, minimumStock: number) => {
    if (stock === 0) return { label: 'Habis', class: 'bg-red-500 text-white' };
    if (stock <= minimumStock) return { label: 'Rendah', class: 'bg-yellow-500 text-black' };
    return { label: 'Normal', class: 'bg-green-500 text-white' };
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(amount || 0)}`;
  };

  const getStockConditionLabel = (condition: string) => {
    switch (condition) {
      case 'low':
        return 'Stok Rendah';
      case 'normal':
        return 'Stok Normal';
      case 'out_of_stock':
        return 'Habis';
      default:
        return condition;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Actions - Hidden in print */}

        {/* Report Content */}
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          {/* Report Header */}
          <div className="print-avoid-break border-b border-gray-200 px-6 py-4">
            <div className="mb-4 text-center">
              <h2 className="mb-2 text-xl font-bold text-gray-900">Laporan Inventory</h2>
              <p className="text-sm text-gray-600">Tanggal Export: {filters.startDate}</p>
            </div>

            {/* Statistics */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{numberFormat(stats.active_item)}</div>
                <div className="text-sm text-blue-600">Active Items</div>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{numberFormat(stats.low_stock)}</div>
                <div className="text-sm text-yellow-600">Low Stock</div>
              </div>
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{numberFormat(stats.out_of_stock)}</div>
                <div className="text-sm text-red-600">Out of Stock</div>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{numberFormat(stats.stock_movement)}</div>
                <div className="text-sm text-purple-600">Stock Movement (Bulan Ini)</div>
              </div>
            </div>

            {/* Filters Info */}
            {(filters.search || filters.stock_condition) && (
              <div className="mb-4 rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-900">Filter yang Diterapkan:</h3>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  {filters.search && (
                    <div>
                      <span className="font-medium">Pencarian:</span> {filters.search}
                    </div>
                  )}
                  {filters.stock_condition && (
                    <div>
                      <span className="font-medium">Kondisi Stok:</span> {getStockConditionLabel(filters.stock_condition)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-16 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Nama Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">Stok</th>
                  <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">Min Stok</th>
                  <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {inventoryData.data && inventoryData.data.length > 0 ? (
                  inventoryData.data.map((variant, index) => {
                    const status = getStockStatus(variant.stock, variant.minimum_stock);
                    return (
                      <tr key={variant.id} className="print-avoid-break hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{variant.sku}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {variant.item_name} - {variant.sku || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{variant.category_name || 'N/A'}</td>
                        <td className="px-6 py-4 text-center text-sm font-medium whitespace-nowrap text-gray-900">{numberFormat(variant.stock)}</td>
                        <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-900">{numberFormat(variant.minimum_stock)}</td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${status.class}`}>{status.label}</span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap text-gray-900">{formatCurrency(variant.price)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                      Tidak ada data inventory
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="text-center text-sm text-gray-600">
              <p>Laporan ini dibuat secara otomatis pada {filters.startDate}</p>
              <p className="mt-1">Total Item: {inventoryData.data ? inventoryData.data.length : 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPdfReport;
