import AnalyticalCategory from '@/components/analytical-category';
import AnalyticalHeader from '@/components/analytical-header';
import AnalyticalMain from '@/components/analytical-main';
import AnalyticalRealtimeStats from '@/components/analytical-realtime-stats';
import BestSellingProduct from '@/components/best-selling-product';
import SalesTrendChart from '@/components/sales-trend-chart';
import AppLayout from '@/layouts/app-layout';
import {
  AnalyticBestSelling,
  AnalyticBestSellingCategory,
  AnalyticsAverageTransaction,
  AnalyticsFilter,
  AnalyticsGrossProfit,
  AnalyticsRevenue,
  AnalyticsSalesTrend,
  AnalyticsTransaction,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { format as formatDate } from 'date-fns';
import { useEffect, useState } from 'react';

// const PaymentMethodCard: React.FC<{ method: string; transactions: number; percentage: number; icon: React.ReactNode }> = ({
//   method,
//   transactions,
//   percentage,
//   icon,
// }) => (
//   <div className="rounded-lg border border-gray-200 bg-white p-4">
//     <div className="mb-3 flex items-center justify-between">
//       <div className="flex items-center space-x-2">
//         {icon}
//         <span className="text-sm font-medium text-gray-900">{method}</span>
//       </div>
//       <span className="text-xs text-gray-500">{percentage}%</span>
//     </div>
//     <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
//       <div className="h-2 rounded-full bg-indigo-600 transition-all duration-300" style={{ width: `${percentage}%` }}></div>
//     </div>
//     <p className="text-xs text-gray-500">{transactions} transaksi</p>
//   </div>
// );

interface AnalyticReportProps {
  revenue: AnalyticsRevenue;
  transaction: AnalyticsTransaction;
  grossProfit: AnalyticsGrossProfit;
  averageTransaction: AnalyticsAverageTransaction;
  getSalesTrend: AnalyticsSalesTrend;
  bestSellingItem: AnalyticBestSelling[];
  bestSellingCategory: AnalyticBestSellingCategory[];
  filters: AnalyticsFilter;
}

const AnalyticReport = ({
  revenue,
  transaction,
  grossProfit,
  averageTransaction,
  filters,
  getSalesTrend,
  bestSellingItem,
  bestSellingCategory,
}: AnalyticReportProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState(filters.range);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(filters.startDate !== null ? new Date(filters.startDate) : null);
  const [endDate, setEndDate] = useState<Date | null>(filters.endDate !== null ? new Date(filters.endDate) : null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.get(route('analytical.index'), filters as {}, {
      preserveState: true,

      onFinish: () => setIsRefreshing(false),
    });
  };

  const handlePeriod = () => {
    setStartDate(null);
    setEndDate(null);

    router.get(
      route('analytical.index'),
      {
        range: selectedPeriod,
      },
      {
        preserveState: true,
        replace: true,
      },
    );
  };

  const handleCustomDate = () => {
    setSelectedPeriod('');

    if (!startDate || !endDate) return;

    if (endDate < startDate) {
      return;
    }

    const formattedStartDate = formatDate(startDate ?? '', 'yyyy-MM-dd');
    const formattedEndDate = formatDate(endDate ?? '', 'yyyy-MM-dd');

    router.get(
      route('analytical.index'),
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      },
      {
        preserveState: true,
        replace: true,
      },
    );
  };

  useEffect(() => {
    if (!selectedPeriod) return;

    handlePeriod();
  }, [selectedPeriod]);

  useEffect(() => {
    if (!startDate || !endDate) return;
    handleCustomDate();
  }, [startDate, endDate]);

  return (
    <AppLayout>
      <Head title="Analytical Reports " />
      <AnalyticalMain>
        {/* Header */}
        <AnalyticalHeader
          isRefreshing={isRefreshing}
          handleRefresh={handleRefresh}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          params={filters}
        />

        <div className="mx-auto max-w-7xl px-6">
          <AnalyticalRealtimeStats revenue={revenue} transaction={transaction} grossProfit={grossProfit} averageTransaction={averageTransaction} />
          <SalesTrendChart getSalesTrend={getSalesTrend} />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Best Selling Products */}
            <BestSellingProduct bestSelling={bestSellingItem} />

            <AnalyticalCategory bestSellingCategory={bestSellingCategory} />
          </div>

          {/* Payment Methods
          <div className="mt-8">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Analisis Metode Pembayaran</h3>
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {paymentMethods.map((method, index) => (
                    <PaymentMethodCard key={index} {...method} />
                  ))}
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </AnalyticalMain>
    </AppLayout>
  );
};

export default AnalyticReport;
