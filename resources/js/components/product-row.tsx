import { numberFormat } from '@/utils/number-format';

interface ProductRowProps {
  rank: number;
  item_name: string;
  category: string;
  total_quantity: number;
  total_revenue: number;
  sku: string;
  part_number?: string;
  profit_margin_pct?: number;
}

function RankBadge({ rank }: { rank: number }) {
  const medals: Record<number, { bg: string; text: string; label: string }> = {
    1: { bg: 'bg-yellow-400', text: 'text-yellow-900', label: '🥇' },
    2: { bg: 'bg-gray-300', text: 'text-gray-700', label: '🥈' },
    3: { bg: 'bg-amber-600', text: 'text-white', label: '🥉' },
  };
  const medal = medals[rank];
  if (medal) {
    return (
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${medal.bg}`}>
        <span className="text-sm">{medal.label}</span>
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
      <span className={`text-xs font-bold text-slate-500`}>#{rank}</span>
    </div>
  );
}

export default function ProductRow({
  rank,
  item_name,
  category,
  total_quantity,
  total_revenue,
  sku,
  part_number,
  profit_margin_pct,
}: ProductRowProps) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-b-0">
      <div className="flex items-center space-x-3">
        <RankBadge rank={rank} />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm leading-tight font-semibold">{item_name}</p>
            {profit_margin_pct != null && (
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${profit_margin_pct >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {profit_margin_pct >= 0 ? '+' : ''}
                {profit_margin_pct}%
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-gray-400">
            {part_number ? `${part_number} · ` : ''}
            {sku}
          </p>
          <p className="text-xs text-gray-500">{category}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-semibold">
            {total_quantity} <span className="text-xs font-normal text-gray-500">terjual</span>
          </p>
          <p className="text-xs text-gray-500">{`Rp${numberFormat(total_revenue)}`}</p>
        </div>
      </div>
    </div>
  );
}
