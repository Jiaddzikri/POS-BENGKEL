import { AnalyticsAverageTransaction, AnalyticsGrossProfit, AnalyticsRevenue, AnalyticsTransaction } from '@/types';
import { numberFormat } from '@/utils/number-format';
import { BarChart3, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import StatCard from './stat-card';

interface AnalyticalRealtimeStatsProps {
  revenue: AnalyticsRevenue;
  transaction: AnalyticsTransaction;
  grossProfit: AnalyticsGrossProfit;
  averageTransaction: AnalyticsAverageTransaction;
}

export default function AnalyticalRealtimeStats({ revenue, transaction, grossProfit, averageTransaction }: AnalyticalRealtimeStatsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Pendapatan"
        value={`Rp ${numberFormat(revenue.revenue)}`}
        change={`${revenue.percentage}%`}
        changeType={revenue.trend}
        icon={<DollarSign className="h-6 w-6 text-indigo-600" />}
      />
      <StatCard
        title="Total Transaksi"
        value={`${transaction.total}`}
        change={`${transaction.percentage}%`}
        changeType={transaction.trend}
        icon={<ShoppingCart className="h-6 w-6 text-indigo-600" />}
      />
      <StatCard
        title="Laba Kotor"
        value={`Rp ${numberFormat(grossProfit.grossProfit)}`}
        change={`${grossProfit.percentage}%`}
        changeType={grossProfit.trend}
        icon={<TrendingUp className="h-6 w-6 text-indigo-600" />}
      />
      <StatCard
        title="Rata-rata Transaksi"
        value={`Rp ${numberFormat(averageTransaction.averageValue)}`}
        change={`${averageTransaction.percentage}%`}
        changeType={averageTransaction.trend}
        icon={<BarChart3 className="h-6 w-6 text-indigo-600" />}
      />
    </div>
  );
}
