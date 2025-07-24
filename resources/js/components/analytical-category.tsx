import { AnalyticBestSellingCategory } from '@/types';
import { PieChart } from 'lucide-react';
import CategoryCard from './category-card';

interface AnalyticalCategoryProps {
  bestSellingCategory: AnalyticBestSellingCategory[];
}

export default function AnalyticalCategory({ bestSellingCategory }: AnalyticalCategoryProps) {
  return (
    <div>
      <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Analisis Kategori</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {bestSellingCategory.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
