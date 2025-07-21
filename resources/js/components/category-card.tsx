import { numberFormat } from '@/utils/number-format';

interface CategoryCardProps {
  category: string;
  total_revenue: number;
  total_quantity: number;
}

export default function CategoryCard({ category, total_revenue, total_quantity }: CategoryCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
      <div className="flex items-center space-x-3">
        {/* <div className={`h-4 w-4 rounded-full ${color}`}></div> */}
        <div>
          <p className="text-sm font-medium text-gray-900">{category}</p>
          <p className="text-xs text-gray-500">{`Rp${numberFormat(total_revenue)}`}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-gray-900">{total_quantity}</p>
      </div>
    </div>
  );
}
