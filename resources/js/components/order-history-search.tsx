import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, Filter, Search, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface OrderHistoryProps {
  handleApplyDateFilter: () => void;
  clearAllFilters: () => void;
  querySearch: string;
  dateRange: DateRange;
  setQuerySearch: React.Dispatch<React.SetStateAction<string>>;
  hasActiveFilters: string;
  selectedStatus: string;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  showFilters: boolean;
  setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
}

export default function OrderHistorySearch({
  handleApplyDateFilter,
  clearAllFilters,
  querySearch,
  dateRange,
  setQuerySearch,
  hasActiveFilters,
  selectedStatus,
  setShowFilters,
  showFilters,
  setSelectedStatus,
  setDateRange,
}: OrderHistoryProps) {
  return (
    <div className="px-6 py-2">
      <div className="bordershadow-sm mb-6 rounded-lg">
        <div className="border-b p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                type="text"
                placeholder="Search items..."
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                className="w-full rounded-md border py-2 pr-4 pl-9 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <span className="rounded px-2 py-1 text-xs">
                  {
                    Object.values({
                      search: querySearch,
                      status: selectedStatus,
                    }).filter(Boolean).length
                  }
                  filter(s) active
                </span>
              )}

              <Button
                variant={'outline'}
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors`}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="0 inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium text-red-700 transition-colors"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="border-t p-4">
            <div className="flex gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Status</label>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="pilih status order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="cancelled">cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Pilih Tanggal</label>
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
              </div>
              <div>
                <Button className="mt-6 w-[150px]" onClick={handleApplyDateFilter} disabled={!dateRange.from || !dateRange.to}>
                  Terapkan Tanggal
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
