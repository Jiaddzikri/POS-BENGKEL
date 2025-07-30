import { InventoryFilters, StockMovementData } from '@/types';
import { numberFormat } from '@/utils/number-format';

interface StockReportProps {
  stockMovementData: StockMovementData;
  filters: InventoryFilters;
}
export default function StockReport({ stockMovementData, filters }: StockReportProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMovementTypeLabel = (stock_in: number, stock_out: number) => {
    return stock_in > stock_out ? 'Masuk' : 'Keluar';
  };

  const getMovementTypeClass = (stock_in: number, stock_out: number) => {
    return stock_in > stock_out ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="print-avoid-break border-b border-gray-200 px-6 py-4">
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-600">Dicetak pada: {filters.startDate}</p>
            </div>

            {(filters.search || filters.startDate || filters.endDate) && (
              <div className="mb-4 rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-900">Filter yang Diterapkan:</h3>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                  {filters.search && (
                    <div>
                      <span className="font-medium">Pencarian:</span> {filters.search}
                    </div>
                  )}
                  {filters.startDate && (
                    <div>
                      <span className="font-medium">Tanggal Mulai:</span> {new Date(filters.startDate).toLocaleDateString('id-ID')}
                    </div>
                  )}
                  {filters.endDate && (
                    <div>
                      <span className="font-medium">Tanggal Akhir:</span> {new Date(filters.endDate).toLocaleDateString('id-ID')}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Produk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Varian</th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Jenis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {stockMovementData.data.length > 0 ? (
                    stockMovementData.data.map((movement, index) => (
                      <tr key={movement.variant_id} className="print-avoid-break hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{formatDate(movement.created_at)}</td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{movement.sku}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{movement.item_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{movement.variant_name}</td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{movement.category_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getMovementTypeClass(movement.stock_in, movement.stock_out)}`}
                          >
                            {getMovementTypeLabel(movement.stock_in, movement.stock_out)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                          {movement.stock_in > movement.stock_out ? '+' : '-'}
                          {numberFormat(Math.abs(movement.stock_in > movement.stock_out ? movement.stock_in : movement.stock_out))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-6 py-8 text-center text-sm text-gray-500">
                        Tidak ada data pergerakan stok
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="text-center text-sm text-gray-600">
                <p>Total {stockMovementData.data.length} pergerakan stok</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
