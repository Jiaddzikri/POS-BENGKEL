import { AnalyticsDailyServiceVolume, AnalyticsFilter, AnalyticsTotalProfit } from '@/types';
import convertDateDiffInfo from '@/utils/date-convert';
import { numberFormat } from '@/utils/number-format';
import { ArrowDownRight, ArrowUpRight, TrendingUp, Wrench } from 'lucide-react';

interface DashboardSummaryMetricsProps {
  totalProfit: AnalyticsTotalProfit;
  dailyServiceVolume: AnalyticsDailyServiceVolume;
  filters: AnalyticsFilter;
}

export default function DashboardSummaryMetrics({ totalProfit, dailyServiceVolume, filters }: DashboardSummaryMetricsProps) {
  const diffDateInfo = convertDateDiffInfo(filters.range, filters.startDate, filters.endDate);

  const isProfit = totalProfit.trend === 'increase';
  const isVolumeUp = dailyServiceVolume.trend === 'increase';

  const ProfitArrow = isProfit ? ArrowUpRight : ArrowDownRight;
  const VolumeArrow = isVolumeUp ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
      {/* Total Profit Card */}
      <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Profit</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">Rp {numberFormat(totalProfit.totalProfit)}</p>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">(Harga Jual − Harga Beli) × Qty Terjual</p>
            <div className={`mt-2 flex items-center text-[0.75rem] ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              <ProfitArrow className="mr-1 h-4 w-4" />
              <span>
                {totalProfit.percentage.toFixed(1)}% {diffDateInfo}
              </span>
            </div>
          </div>
          <div className={`rounded-full p-3 ${isProfit ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
            <TrendingUp className={`h-6 w-6 ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
          </div>
        </div>
      </div>

      {/* Daily Service Volume Card */}
      <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-900">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Volume Servis Harian</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{dailyServiceVolume.total} transaksi</p>
            <div className={`mt-2 flex items-center text-[0.75rem] ${isVolumeUp ? 'text-green-600' : 'text-red-600'}`}>
              <VolumeArrow className="mr-1 h-4 w-4" />
              <span>
                {dailyServiceVolume.percentage.toFixed(1)}% {diffDateInfo}
              </span>
            </div>
            {/* Mini bar chart of daily counts */}
            {dailyServiceVolume.data.length > 0 && (
              <div className="mt-3 flex items-end gap-1" style={{ height: 40 }}>
                {dailyServiceVolume.data.map((entry) => {
                  const max = Math.max(...dailyServiceVolume.data.map((d) => d.count), 1);
                  const heightPct = Math.round((entry.count / max) * 100);
                  return (
                    <div
                      key={entry.date}
                      title={`${entry.date}: ${entry.count}`}
                      className="flex-1 rounded-sm bg-blue-400 dark:bg-blue-600"
                      style={{ height: `${heightPct}%`, minHeight: 4 }}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <div className={`ml-4 rounded-full p-3 ${isVolumeUp ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
            <Wrench className={`h-6 w-6 ${isVolumeUp ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
