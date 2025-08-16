import DashboardCategory from '@/components/dashboard-category';
import DashboardChart from '@/components/dashboard-chart';
import DashboardHeader from '@/components/dashboard-header';
import DashboardLayout from '@/components/dashboard-layout';
import DashboardLowStock from '@/components/dashboard-low-stock';
import DashboardMetric from '@/components/dashboard-metric';
import DashboardRevenue from '@/components/dashboard-revenue';
import DashboardTable from '@/components/dashboard-table';
import DashboardTopProducts from '@/components/dashboard-top-product';
import DashboardTransactions from '@/components/dashboard-transaction';
import DashboardTransactionTable from '@/components/dashboard-transaction-table';
import AppLayout from '@/layouts/app-layout';
import {
  AnalyticActiveCustomer,
  AnalyticBestSelling,
  AnalyticBestSellingCategory,
  AnalyticsCompletedTransaction,
  AnalyticsFilter,
  AnalyticsRevenue,
  AnalyticsSalesTrend,
  AnalyticsTransaction,
  DashboardTransaction,
  ItemData,
  type BreadcrumbItem,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { formatDate } from 'date-fns';
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/',
  },
];

interface DashboardProps {
  revenue: AnalyticsRevenue;
  totalTransaction: AnalyticsTransaction;
  completedTransaction: AnalyticsCompletedTransaction;
  activeCustomer: AnalyticActiveCustomer;
  salesTrend: AnalyticsSalesTrend;
  bestSellingCategory: AnalyticBestSellingCategory[];
  bestSellingItem: AnalyticBestSelling[];
  lowStockItems: ItemData;
  newestTransactions: DashboardTransaction[];
  filters: AnalyticsFilter;
}

export default function Dashboard({
  revenue,
  totalTransaction,
  filters,
  completedTransaction,
  activeCustomer,
  salesTrend,
  bestSellingCategory,
  bestSellingItem,
  lowStockItems,
  newestTransactions,
}: DashboardProps): React.JSX.Element {
  const [selectedPeriod, setSelectedPeriod] = useState<string | undefined>(filters.range);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: filters?.startDate ? new Date(filters.startDate) : undefined,
    to: filters?.endDate ? new Date(filters.endDate) : undefined,
  });

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);

    setDateRange({ from: undefined, to: undefined });

    router.get(route('dashboard'), { range: period }, { preserveState: true, replace: true });
  };

  const handleApplyCustomDate = () => {
    if (!dateRange?.from || !dateRange.to) {
      alert('Silakan pilih tanggal mulai dan akhir.');
      return;
    }

    if (dateRange.to < dateRange.from) {
      alert('Tanggal akhir tidak boleh lebih awal dari tanggal mulai.');
      return;
    }
    setSelectedPeriod('');

    router.get(
      route('dashboard'),
      {
        startDate: formatDate(dateRange.from, 'yyyy-MM-dd'),
        endDate: formatDate(dateRange.to, 'yyyy-MM-dd'),
      },
      { preserveState: true, replace: true },
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard POS" />
      <DashboardLayout>
        <DashboardHeader
          selectedPeriod={selectedPeriod}
          handlePeriodChange={handlePeriodChange}
          dateRange={dateRange}
          handleApplyCustomDate={handleApplyCustomDate}
          setDateRange={setDateRange}
        />
        <DashboardMetric
          activeCustomer={activeCustomer}
          completedTransaction={completedTransaction}
          filters={filters}
          totalTransaction={totalTransaction}
          revenue={revenue}
        />
        <DashboardChart>
          <DashboardRevenue filters={filters} salesTrend={salesTrend} />
          <DashboardCategory bestSellingCategory={bestSellingCategory} />
        </DashboardChart>
        <DashboardTable>
          <DashboardTopProducts bestSellingItem={bestSellingItem} />
          <DashboardLowStock lowStockItems={lowStockItems.data} />
        </DashboardTable>
        <DashboardTransactions>
          <DashboardTransactionTable newestTransactions={newestTransactions} />
        </DashboardTransactions>
      </DashboardLayout>
    </AppLayout>
  );
}
