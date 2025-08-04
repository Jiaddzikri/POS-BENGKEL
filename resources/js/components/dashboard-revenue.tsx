import { AnalyticsFilter, AnalyticsSalesTrend } from '@/types';
import convertDateDiffInfo from '@/utils/date-convert';
import { TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';

interface DashboardRevenueProps {
  salesTrend: AnalyticsSalesTrend;
  filters: AnalyticsFilter;
}

export default function DashboardRevenue({ salesTrend, filters }: DashboardRevenueProps) {
  const diffDateInfo = convertDateDiffInfo(filters.range, filters.startDate, filters.endDate);

  const hasData = salesTrend.labels.length > 0 && salesTrend.value.length > 0;

  return (
    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Grafik Penjualan </h3>
        <TrendingUp className="h-5 w-5 text-green-600" />
      </div>

      {!hasData ? (
        <div className="flex h-80 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Belum Ada Data Penjualan</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Grafik penjualan akan muncul setelah ada transaksi pada periode {diffDateInfo.toLowerCase()}
          </p>
        </div>
      ) : (
        <div className="h-80">
          <Line
            data={{
              labels: salesTrend.labels.map((label) => label),
              datasets: [
                {
                  label: 'Pendapatan (Rp)',
                  data: salesTrend.value.map((value) => value),
                  borderColor: '#8B5CF6',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  borderWidth: 3,
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: '#8B5CF6',
                  pointBorderColor: '#ffffff',
                  pointBorderWidth: 2,
                  pointRadius: 6,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: '#ffffff',
                  bodyColor: '#ffffff',
                  borderColor: '#8B5CF6',
                  borderWidth: 1,
                  callbacks: {
                    label: function (context) {
                      return `Pendapatan: Rp ${context.parsed.y.toLocaleString()}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  grid: {
                    color: 'rgba(156, 163, 175, 0.2)',
                  },
                  ticks: {
                    color: '#6B7280',
                  },
                },
                y: {
                  grid: {
                    color: 'rgba(156, 163, 175, 0.2)',
                  },
                  ticks: {
                    color: '#6B7280',
                    callback: function (value) {
                      return 'Rp ' + (value as number).toLocaleString();
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
