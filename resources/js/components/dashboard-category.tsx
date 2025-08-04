import { AnalyticBestSellingCategory } from '@/types';
import { generatePastelColors } from '@/utils/generate-color';
import { numberFormat } from '@/utils/number-format';
import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';

interface DashboardCategoryProps {
  bestSellingCategory: AnalyticBestSellingCategory[];
}

export default function DashboardCategory({ bestSellingCategory }: DashboardCategoryProps) {
  const categoryColors = useMemo(() => {
    return generatePastelColors(bestSellingCategory.length);
  }, [bestSellingCategory.length]);

  return (
    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kategori Produk Terlaris</h3>
      </div>

      {bestSellingCategory.length === 0 ? (
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
          <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Belum Ada Data Kategori</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Data kategori produk terlaris akan muncul setelah ada transaksi penjualan</p>
        </div>
      ) : (
        <>
          <div className="flex h-80 items-center justify-center">
            <div className="h-80 w-80">
              <Doughnut
                data={{
                  labels: bestSellingCategory.map((item) => item.category),
                  datasets: [
                    {
                      data: bestSellingCategory.map((item) => item.total_revenue),
                      backgroundColor: categoryColors,
                      borderColor: '#ffffff',
                      borderWidth: 3,
                      hoverBackgroundColor: categoryColors,
                      hoverBorderWidth: 4,
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
                      callbacks: {
                        label: function (context) {
                          return `${context.label}: Rp${numberFormat(context.parsed)}`;
                        },
                      },
                    },
                  },
                  cutout: '60%',
                }}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            {bestSellingCategory.map((item: AnalyticBestSellingCategory, index) => (
              <div key={item.category} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: categoryColors[index] }}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.category} (Rp. {numberFormat(item.total_revenue)})
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
