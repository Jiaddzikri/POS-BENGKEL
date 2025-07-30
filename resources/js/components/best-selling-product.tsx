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
            <h3 className="text-lg font-semibold">Produk Terlaris</h3>
            <Package className="h-5 w-5" />
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-1">
            {bestSelling.map((item, index) => (
              <ProductRow key={item.sku} rank={index + 1} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
