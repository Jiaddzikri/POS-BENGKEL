import {
  AnalyticBestSelling,
  AnalyticBestSellingCategory,
  AnalyticsAverageTransaction,
  AnalyticsFilter,
  AnalyticsGrossProfit,
  AnalyticsRevenue,
  AnalyticsSalesTrend,
  AnalyticsTransaction,
} from '@/types';
import React from 'react';

interface AnalyticReportProps {
  revenue: AnalyticsRevenue;
  transaction: AnalyticsTransaction;
  grossProfit: AnalyticsGrossProfit;
  averageTransaction: AnalyticsAverageTransaction;
  getSalesTrend: AnalyticsSalesTrend;
  bestSellingItem: AnalyticBestSelling[];
  bestSellingCategory: AnalyticBestSellingCategory[];
  filters: AnalyticsFilter;
}

const AnalyticalReportPdf: React.FC<AnalyticReportProps> = ({
  revenue,
  transaction,
  grossProfit,
  averageTransaction,
  getSalesTrend,
  bestSellingItem,
  bestSellingCategory,
  filters,
}) => {
  const formatCurrency = (amount: number) => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(amount || 0)}`;
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('id-ID').format(number || 0);
  };

  const getRangeLabel = (range: string) => {
    switch (range) {
      case 'today':
        return 'Hari Ini';
      case 'week':
        return '7 Hari Terakhir';
      case 'month':
        return 'Bulan Ini';
      case 'year':
        return 'Tahun Ini';
      default:
        return range;
    }
  };

  const getDateRangeText = () => {
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate).toLocaleDateString('id-ID');
      const endDate = new Date(filters.endDate).toLocaleDateString('id-ID');
      return `${startDate} - ${endDate}`;
    }
    return getRangeLabel(filters.range || 'today');
  };

  const getCurrentDateTime = () => {
    return new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const maxSalesValue = Math.max(...getSalesTrend.value);

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="print-avoid-break border-b border-gray-200 px-6 py-4">
              <div className="mb-6 text-center">
                <h2 className="mb-2 text-xl font-bold text-gray-900">Laporan Analytical</h2>
                <p className="mb-1 text-sm text-gray-600">Periode: {getDateRangeText()}</p>
                <p className="text-sm text-gray-600">Dicetak pada: {getCurrentDateTime()}</p>
              </div>

              {/* Key Metrics */}
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(revenue.revenue)}</div>
                  <div className="text-sm text-blue-600">Total Revenue</div>
                </div>
                <div className="rounded-lg bg-green-50 p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{formatNumber(transaction.total)}</div>
                  <div className="text-sm text-green-600">Total Transaksi</div>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(grossProfit.grossProfit)}</div>
                  <div className="text-sm text-purple-600">Gross Profit</div>
                </div>
                <div className="rounded-lg bg-orange-50 p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{formatCurrency(averageTransaction.averageValue)}</div>
                  <div className="text-sm text-orange-600">Rata-rata Transaksi</div>
                </div>
              </div>
            </div>

            <div className="print-avoid-break border-b border-gray-200 px-6 py-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Tren Penjualan</h3>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-end justify-between space-x-2" style={{ height: '200px' }}>
                  {getSalesTrend.labels.map((label, index) => {
                    const value = getSalesTrend.value[index];
                    const height = maxSalesValue > 0 ? (value / maxSalesValue) * 160 : 0;

                    return (
                      <div key={index} className="flex flex-1 flex-col items-center">
                        <div className="mb-2 text-xs text-gray-600">{formatCurrency(value)}</div>
                        <div className="chart-bar rounded-t bg-blue-500" style={{ height: `${height}px`, minHeight: '4px' }}></div>
                        <div className="mt-2 text-center text-xs text-gray-700">{label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
              <div className="print-avoid-break">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Produk Terlaris</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {bestSellingItem && bestSellingItem.length > 0 ? (
                        bestSellingItem.slice(0, 10).map((item, index) => (
                          <tr key={item.sku} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900">{index + 1}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.item_name}</td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900">{item.sku}</td>
                            <td className="px-4 py-3 text-center text-sm whitespace-nowrap text-gray-900">{formatNumber(item.total_quantity)}</td>
                            <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap text-gray-900">
                              {formatCurrency(item.total_revenue)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                            Tidak ada data produk terlaris
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="print-avoid-break">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Kategori Terlaris</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {bestSellingCategory && bestSellingCategory.length > 0 ? (
                        bestSellingCategory.slice(0, 10).map((category, index) => (
                          <tr key={category.category} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900">{index + 1}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{category.category}</td>
                            <td className="px-4 py-3 text-center text-sm whitespace-nowrap text-gray-900">{formatNumber(category.total_quantity)}</td>
                            <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap text-gray-900">
                              {formatCurrency(category.total_revenue)}
                            </td>
                            <td className="px-4 py-3 text-center text-sm whitespace-nowrap text-gray-900">{category.total_quantity}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                            Tidak ada data kategori terlaris
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="text-center text-sm text-gray-600">
                <p>Laporan ini dibuat secara otomatis pada {getCurrentDateTime()}</p>
                <p className="mt-1">
                  Total Produk Terlaris: {bestSellingItem ? bestSellingItem.length : 0} | Total Kategori:{' '}
                  {bestSellingCategory ? bestSellingCategory.length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticalReportPdf;
