import { numberFormat } from '@/utils/number-format';

interface CategoryCardProps {
  rank: number;
  category: string;
  total_revenue: number;
  total_quantity: number;
  totalQty: number;
}

const RANK_COLORS = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-orange-400', 'bg-rose-400'];

export default function CategoryCard({ rank, category, total_revenue, total_quantity, totalQty }: CategoryCardProps) {
  const pct = totalQty > 0 ? Math.round((total_quantity / totalQty) * 100) : 0;
  const barColor = RANK_COLORS[(rank - 1) % RANK_COLORS.length];

  return (
    <div className="rounded-lg border px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${barColor}`}>{rank}</span>
          <p className="text-sm font-semibold">{category}</p>
        </div>
        <span className="text-xs font-semibold text-gray-500">{pct}%</span>
      </div>
      <div className="mb-2 h-1.5 w-full rounded-full bg-gray-100">
        <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{total_quantity} terjual</span>
        <span>Rp{numberFormat(total_revenue)}</span>
      </div>
    </div>
  );
}
