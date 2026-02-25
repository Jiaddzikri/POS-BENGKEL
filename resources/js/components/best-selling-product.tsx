import { AnalyticBestSelling } from '@/types';
import { Package } from 'lucide-react';
import ProductRow from './product-row';

interface BestSellingProductProps {
  bestSelling: AnalyticBestSelling[];
}

export default function BestSellingProduct({ bestSelling }: BestSellingProductProps) {
  return (
    <div className="lg:col-span-2">
      <div className="rounded-lg border">
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Produk Terlaris</h3>
              <p className="text-xs text-gray-400">Top {bestSelling.length} produk berdasarkan jumlah terjual</p>
            </div>
            <Package className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="p-6">
          {bestSelling.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Package className="mb-2 h-10 w-10 opacity-30" />
              <p className="text-sm">Belum ada data penjualan</p>
            </div>
          ) : (
            <div className="space-y-1">
              {bestSelling.map((item, index) => (
                <ProductRow key={item.sku || index} rank={index + 1} {...item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
