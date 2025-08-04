import { AnalyticBestSelling } from '@/types';
import { numberFormat } from '@/utils/number-format';

interface DashboardTopProductProps {
  bestSellingItem: AnalyticBestSelling[];
}

export default function DashboardTopProducts({ bestSellingItem }: DashboardTopProductProps) {
  return (
    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Produk Terlaris</h3>

      {bestSellingItem.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Belum Ada Data Penjualan</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Data produk terlaris akan muncul setelah ada transaksi penjualan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bestSellingItem.map((product: AnalyticBestSelling, index: number) => (
            <div key={product.item_name} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{product.item_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{product.total_quantity} terjual</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">Rp {numberFormat(product.total_revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
