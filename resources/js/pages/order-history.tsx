import OrderHistoriesHeader from '@/components/order-histories-header';
import OrderHistoryPagination from '@/components/order-history-pagination';
import OrderHistorySearch from '@/components/order-history-search';
import OrderHistoryTable from '@/components/order-history-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, OrderHistories, OrderHistoryFilter } from '@/types';
import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useDebounce } from 'use-debounce';

interface OrderHistory {
  order_histories: OrderHistories;
  filters: OrderHistoryFilter;
}

export default function OrderHistory({ order_histories, filters }: OrderHistory) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Order History',
      href: '/sales',
    },
  ];

  const [querySearch, setQuerySearch] = useState<string>(filters.search || '');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: filters?.startDate ? new Date(filters.startDate) : undefined,
    to: filters?.endDate ? new Date(filters.endDate) : undefined,
  });

  const [selectedStatus, setSelectedStatus] = useState<string>(filters.status || '');

  const [debouncedQuery] = useDebounce(querySearch, 300);

  const handlePageChange = (page: number) => {
    const params = {
      search: querySearch,
      status: selectedStatus,
      startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
      endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
      page: page,
    };

    router.get(route('order.histories'), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const handleApplyDateFilter = () => {
    if (!dateRange.from || !dateRange.to) {
      alert('Silakan pilih tanggal mulai dan akhir.');
      return;
    }

    const params = {
      search: querySearch,
      status: selectedStatus,
      startDate: format(dateRange.from, 'yyyy-MM-dd'),
      endDate: format(dateRange.to, 'yyyy-MM-dd'),
      page: 1,
    };

    router.get(route('order.histories'), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const clearAllFilters = () => {
    setQuerySearch('');
    setSelectedStatus('');
    setDateRange({ from: undefined, to: undefined });
    router.get(route('order.histories'), {
      search: '',
      stock_condition: '',
      startDate: '',
      endDate: '',
      page: 1,
    });
  };

  useEffect(() => {
    const params = {
      search: querySearch,
      status: selectedStatus,
    };
    router.get(route('order.histories'), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }, [debouncedQuery, selectedStatus]);

  const hasActiveFilters = selectedStatus || querySearch;
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={'Order History'} />
      <OrderHistoriesHeader />
      <OrderHistorySearch
        clearAllFilters={clearAllFilters}
        setDateRange={setDateRange}
        handleApplyDateFilter={handleApplyDateFilter}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        setQuerySearch={setQuerySearch}
        setShowFilters={setShowFilters}
        querySearch={querySearch}
        showFilters={showFilters}
        hasActiveFilters={hasActiveFilters}
        dateRange={dateRange}
      />
      <OrderHistoryTable orderHistories={order_histories.data} />
      <OrderHistoryPagination meta={order_histories.meta} handlePageChange={handlePageChange} />
    </AppLayout>
  );
}
