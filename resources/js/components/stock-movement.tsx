import { InventoryFilters, StockMovementData } from '@/types';
import { Input } from '@headlessui/react';
import { Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Download, Filter, Package, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useDebounce } from 'use-debounce';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface StockMovementProps {
  stockMovementData: StockMovementData;
  filters: InventoryFilters;
}

export default function StockMovement({ stockMovementData, filters }: StockMovementProps) {
  const { data, links, meta } = stockMovementData;
  const [querySearch, setQuerySearch] = useState<string>(filters?.search || '');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: filters?.startDate ? new Date(filters.startDate) : undefined,
    to: filters?.endDate ? new Date(filters.endDate) : undefined,
  });
  const [selectedStockCondition, setSelectedStockCondition] = useState<string>(filters?.stock_condition || '');

  const [debouncedQuery] = useDebounce(querySearch, 300);

  const hasActiveFilters = selectedStockCondition || querySearch || dateRange.from || dateRange.to;

  const handleApplyDateFilter = () => {
    if (!dateRange.from || !dateRange.to) {
      alert('Silakan pilih tanggal mulai dan akhir.');
      return;
    }

    const params = {
      search_stock_movement: querySearch,
      stock_condition: selectedStockCondition,
      startDate: format(dateRange.from, 'yyyy-MM-dd'),
      endDate: format(dateRange.to, 'yyyy-MM-dd'),
      page: 1,
    };

    router.get(route('inventory.index'), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const handlePageChange = (page: number) => {
    const params = {
      search_stock_movement: querySearch,
      stock_condition: selectedStockCondition,
      startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
      endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
      page: page,
    };

    router.get(route('inventory.index'), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const clearAllFilters = () => {
    setQuerySearch('');
    setSelectedStockCondition('');
    setDateRange({ from: undefined, to: undefined });
    router.get(route('inventory.index'), {
      search_stock_movement: '',
      stock_condition: '',
      startDate: '',
      endDate: '',
      page: 1,
    });
  };

  useEffect(() => {
    const params = {
      search_stock_movement: querySearch,
      stock_condition: selectedStockCondition,
    };
    router.get(route('inventory.index'), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }, [debouncedQuery, selectedStockCondition]);

  return (
    <div className="space-y-3 overflow-x-auto rounded-lg border px-6 py-3">
      <div className="mb-3">
        <h1 className="text-xl font-semibold">Stock Movement</h1>
        <p className="mt-1 text-sm">Track Your Item Stock Movement</p>
      </div>

      <div className="flex max-w-md gap-5">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            onChange={(e) => setQuerySearch(e.target.value)}
            value={querySearch} // Added: Controlled input
            type="text"
            placeholder="Search items..."
            className="w-full rounded-md border py-2 pr-4 pl-9 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>

          <Link
            href={route('inventory.print', {
              search_stock_movement: querySearch,
              stock_condition: selectedStockCondition,
              startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
              endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
              page: filters.page,
              export_type: 'stock_movement',
            })}
            target="_blank"
            className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Link>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearAllFilters} className="flex items-center gap-2 text-red-600 hover:text-red-700">
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range: DateRange | undefined) => {
                    setDateRange(range || { from: undefined, to: undefined });
                  }}
                  numberOfMonths={2}
                  required={false}
                />
              </PopoverContent>
            </Popover>

            <Button onClick={handleApplyDateFilter} disabled={!dateRange.from || !dateRange.to}>
              Terapkan Tanggal
            </Button>
          </div>
        </div>
      )}
      {stockMovementData.data.length === 0 ? (
        <div className="py-8 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="text-gray-500">No stock movement records found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Item Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stockMovementData.data.map((record, index) => (
                <tr key={record.variant_id || index} className="text-left">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <Package className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{record.created_at}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm">{record.item_name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm">{record.sku}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          record.stock_in > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.stock_in > 0 ? 'Stock In' : 'Stock Out'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-medium ${record.stock_in > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {record.stock_in > 0 ? `+${record.stock_in}` : `-${record.stock_out}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta.last_page > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="flex items-center text-sm text-gray-700"></div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {/* First page */}
              {meta.current_page > 3 && (
                <>
                  <Button
                    variant={1 === meta.current_page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className="min-w-[40px]"
                  >
                    1
                  </Button>
                  {meta.current_page > 4 && <span className="px-2 text-gray-500">...</span>}
                </>
              )}

              {/* Current page and surrounding pages */}
              {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                let pageNumber;
                if (meta.last_page <= 5) {
                  pageNumber = i + 1;
                } else if (meta.current_page <= 3) {
                  pageNumber = i + 1;
                } else if (meta.current_page >= meta.last_page - 2) {
                  pageNumber = meta.last_page - 4 + i;
                } else {
                  pageNumber = meta.current_page - 2 + i;
                }

                if (pageNumber < 1 || pageNumber > meta.last_page) return null;
                if (meta.current_page > 3 && pageNumber === 1) return null;
                if (meta.current_page < meta.last_page - 2 && pageNumber === meta.last_page) return null;

                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === meta.current_page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className="min-w-[40px]"
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              {/* Last page */}
              {meta.current_page < meta.last_page - 2 && (
                <>
                  {meta.current_page < meta.last_page - 3 && <span className="px-2 text-gray-500">...</span>}
                  <Button
                    variant={meta.last_page === meta.current_page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(meta.last_page)}
                    className="min-w-[40px]"
                  >
                    {meta.last_page}
                  </Button>
                </>
              )}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.current_page + 1)}
              disabled={meta.current_page === meta.last_page}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
