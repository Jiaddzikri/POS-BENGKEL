import { ItemList } from '@/types';
import { AlertTriangle } from 'lucide-react';

interface DashboardLowStockProps {
  lowStockItems: ItemList[];
}

export default function DashboardLowStock({ lowStockItems }: DashboardLowStockProps) {
  return (
    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-900">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stok Menipis</h3>
      </div>

      {lowStockItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Semua Stok Aman</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada produk dengan stok menipis saat ini</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lowStockItems.map((item: ItemList) => (
            <div key={item.sku} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.item_name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Minimal: {item.minimum_stock} unit</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${item.status === 'critical' ? 'text-red-600' : 'text-orange-600'}`}>{item.stock} unit</p>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    item.low_stock
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : item.quantity === 0
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                        : ''
                  }`}
                >
                  {item.low_stock ? 'Peringatan' : item.quantity === 0 ? 'Stock Kosong' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
