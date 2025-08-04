import { AnalyticActiveCustomer, AnalyticsCompletedTransaction, AnalyticsFilter, AnalyticsRevenue, AnalyticsTransaction } from '@/types';
import convertDateDiffInfo from '@/utils/date-convert';
import { numberFormat } from '@/utils/number-format';
import { ArrowDownRight, ArrowUpRight, DollarSign, LucideIcon, Package, ShoppingCart, Users } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: number | string;
  icon: LucideIcon;
  positive?: boolean;
}

interface DashboardMetricProps {
  revenue: AnalyticsRevenue;
  filters: AnalyticsFilter;
  totalTransaction: AnalyticsTransaction;
  completedTransaction: AnalyticsCompletedTransaction;
  activeCustomer: AnalyticActiveCustomer;
}

export default function DashboardMetric({ revenue, filters, totalTransaction, completedTransaction, activeCustomer }: DashboardMetricProps) {
  const diffDateInfo = convertDateDiffInfo(filters.range, filters.startDate, filters.endDate);
  const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, positive = true }) => (
    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
          <div className={`mt-2 flex items-center text-[0.75rem] ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {positive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
            <span>
              {change}% {diffDateInfo}
            </span>
          </div>
        </div>
        <div className={`rounded-full p-3 ${positive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
          <Icon className={`h-6 w-6 ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
      <MetricCard
        title="Total Penjualan"
        value={`Rp ${numberFormat(revenue.revenue)}`}
        change={revenue.percentage}
        icon={DollarSign}
        positive={revenue.trend === 'increase'}
      />
      <MetricCard
        title={`Total Transaksi`}
        value={`${totalTransaction.total}`}
        change={`${totalTransaction.percentage}`}
        icon={ShoppingCart}
        positive={totalTransaction.trend === 'increase'}
      />
      <MetricCard
        title="Pelanggan Aktif"
        value={`${activeCustomer.total}`}
        change={activeCustomer.percentage}
        icon={Users}
        positive={activeCustomer.trend === 'increase'}
      />
      <MetricCard
        title="Produk Terjual"
        value={`${completedTransaction.total}`}
        change={completedTransaction.percentage}
        icon={Package}
        positive={completedTransaction.trend === 'increase'}
      />
    </div>
  );
}
