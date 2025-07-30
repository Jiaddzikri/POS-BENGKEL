import { numberFormat } from '@/utils/number-format';

interface CategoryCardProps {
  category: string;
  total_revenue: number;
  total_quantity: number;
}

export default function CategoryCard({ category, total_revenue, total_quantity }: CategoryCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg p-4">
      <div className="flex items-center space-x-3">
        {/* <div className={`h-4 w-4 rounded-full ${color}`}></div> */}
        <div>
          <p className="text-sm font-medium">{category}</p>
          <p className="text-xs">{`Rp${numberFormat(total_revenue)}`}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold">{total_quantity}</p>
      </div>
    </div>
  );
}
