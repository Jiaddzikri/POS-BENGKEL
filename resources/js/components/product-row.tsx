import { numberFormat } from '@/utils/number-format';

interface ProductRowProps {
  rank: number;
  item_name: string;
  category: string;
  total_quantity: number;
  total_revenue: number;
  sku: string;
}

export default function ProductRow({ rank, item_name, category, total_quantity, total_revenue, sku }: ProductRowProps) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
          <span className="text-sm font-medium text-gray-700">#{rank}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{`${item_name} ${sku}`}</p>
          <p className="text-xs text-gray-500">{category}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{total_quantity} terjual</p>
          <p className="text-xs text-gray-500">{`Rp${numberFormat(total_revenue)}`}</p>
        </div>
        {/* {trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-500" /> : <ArrowDown className="h-4 w-4 text-red-500" />} */}
      </div>
    </div>
  );
}
