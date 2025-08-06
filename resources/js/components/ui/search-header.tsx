import { AnalyticsFilter, DropdownData, Filter } from '@/types';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import FilterDropdown from '@/components/ui/filter-dropdown';

import FilterByDate from '@/components/ui/filter-by-date';
import SelectPeriod from '@/components/ui/filter-by-select-period';
import RefreshButton from '@/components/ui/refresh-button';
// import ExportButton from '@/components/ui/export-button';
import { format as formatDate } from 'date-fns';

interface SearchProps {
  filters: Filter;
  link: string;
  dropdowns?: DropdownData[];
  date?: AnalyticsFilter;
}

export default function SearchHeader({ filters, dropdowns, link, date }: SearchProps) {
  const [querySearch, setQuerySearch] = useState<string>(filters.searchQuery || '');
  const [debouncedQuery] = useDebounce(querySearch, 300);

  const [startDate, setStartDate] = useState<Date | null>(date?.startDate ? new Date(date.startDate) : null);
  const [endDate, setEndDate] = useState<Date | null>(date?.endDate ? new Date(date.endDate) : null);
  const [selectedPeriod, setSelectedPeriod] = useState(date?.range || '');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search
  useEffect(() => {
    router.get(route(link),
      {
        search: querySearch,
        filter: filters.filter,
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      });
  }, [debouncedQuery]);

  // Date filtering logic
  useEffect(() => {
    if (!startDate || !endDate) return;
    if (endDate < startDate) return;

    const formattedStartDate = formatDate(startDate, 'yyyy-MM-dd');
    const formattedEndDate = formatDate(endDate, 'yyyy-MM-dd');

    router.get(route(link),
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      },
      {
        preserveState: true,
        replace: true,
      });
  }, [startDate, endDate]);

  useEffect(() => {
    if (!selectedPeriod) return;

    setStartDate(null);
    setEndDate(null);

    router.get(route(link),
      {
        range: selectedPeriod,
      },
      {
        preserveState: true,
        replace: true,
      });
  }, [selectedPeriod]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.get(route(link), filters as {}, {
      preserveState: true,
      onFinish: () => setIsRefreshing(false),
    });
  };

  // console.log(date);

  

  return (
    <div className="px-6 py-2">
      <div className="mb-6 rounded-lg border">
        <div className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                type="text"
                placeholder="Search data..."
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                className="w-full rounded-md border py-2 pr-4 pl-9 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {(dropdowns && dropdowns?.length > 0) && (
              <FilterDropdown dropdowns={dropdowns} filters={filters} link={link} />
            )}

            {date && (
              <div className="flex flex-wrap gap-3">
                <FilterByDate
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                />
                <SelectPeriod selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
                <RefreshButton onClick={handleRefresh} isRefreshing={isRefreshing} />
                {/* <ExportButton
                  href={route(`${link}`, {
                    range: selectedPeriod,
                    startDate,
                    endDate,
                  })}
                /> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
