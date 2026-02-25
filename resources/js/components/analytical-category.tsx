import { AnalyticBestSellingCategory } from '@/types';
import { numberFormat } from '@/utils/number-format';
import { PieChart } from 'lucide-react';
import CategoryCard from './category-card';

interface AnalyticalCategoryProps {
  bestSellingCategory: AnalyticBestSellingCategory[];
}

export default function AnalyticalCategory({ bestSellingCategory }: AnalyticalCategoryProps) {
  const totalQty = bestSellingCategory.reduce((sum, c) => sum + c.total_quantity, 0);
  const totalRevenue = bestSellingCategory.reduce((sum, c) => sum + c.total_revenue, 0);

  return (
    <div>
      <div className="mb-6 rounded-lg border shadow-sm">
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Analisis Kategori</h3>
              <p className="text-xs text-gray-400">Rp{numberFormat(totalRevenue)} total pendapatan</p>
            </div>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="p-6">
          {bestSellingCategory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <PieChart className="mb-2 h-8 w-8 opacity-30" />
              <p className="text-sm">Belum ada data kategori</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bestSellingCategory.map((category, index) => (
                <CategoryCard key={index} rank={index + 1} totalQty={totalQty} {...category} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
