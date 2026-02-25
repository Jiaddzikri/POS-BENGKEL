import { AnalyticsDeadStock } from '@/types';
import { convertCurrency } from '@/utils/currency-convert';
import { AlertTriangle } from 'lucide-react';
import { Badge } from './ui/badge';

interface DashboardDeadStockProps {
  deadStock: AnalyticsDeadStock;
}

export default function DashboardDeadStock({ deadStock }: DashboardDeadStockProps) {
  return (
    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dead Stock</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {deadStock.total} item · tidak terjual 90 hari
        </Badge>
      </div>

      {deadStock.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <AlertTriangle className="h-7 w-7 text-green-500" />
          </div>
          <p className="font-medium text-gray-900 dark:text-white">Tidak ada dead stock</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Semua item aktif terjual dalam 90 hari terakhir</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                <th className="pr-3 pb-2">Item</th>
                <th className="pr-3 pb-2">Part Number</th>
                <th className="pr-3 pb-2">Lokasi Rak</th>
                <th className="pr-3 pb-2 text-center">Stok</th>
                <th className="pb-2 text-right">Harga Jual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {deadStock.items.map((item) => (
                <tr key={item.variant_id} className="group">
                  <td className="py-2 pr-3">
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 dark:text-white">{item.item_name}</p>
                    <p className="text-xs text-gray-400">
                      {item.variant_name} · {item.sku ?? '—'}
                    </p>
                  </td>
                  <td className="py-2 pr-3">
                    {item.part_number ? (
                      <Badge variant="outline" className="font-mono text-xs">
                        {item.part_number}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-xs text-gray-500">{item.rack_location ?? '—'}</td>
                  <td className="py-2 pr-3 text-center">
                    <Badge variant={item.stock > 10 ? 'secondary' : 'destructive'} className="text-xs">
                      {item.stock}
                    </Badge>
                  </td>
                  <td className="py-2 text-right font-medium text-gray-900 dark:text-white">{convertCurrency(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
