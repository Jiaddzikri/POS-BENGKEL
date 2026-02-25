import { format } from 'date-fns';
import { CalendarIcon, MonitorSmartphone, ShoppingBag, Store } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface DashboardHeaderProps {
  selectedPeriod: string | undefined;
  handlePeriodChange: (period: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  handleApplyCustomDate: () => void;
  selectedOrderType: 'online' | 'offline' | '';
  handleOrderTypeChange: (type: 'online' | 'offline' | '') => void;
}

export default function DashboardHeader({
  dateRange,
  handleApplyCustomDate,
  selectedPeriod,
  setDateRange,
  handlePeriodChange,
  selectedOrderType,
  handleOrderTypeChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Selamat datang kembali!</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {/* Order type filter */}
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <button
            type="button"
            onClick={() => handleOrderTypeChange('')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              selectedOrderType === ''
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Semua
          </button>
          <button
            type="button"
            onClick={() => handleOrderTypeChange('offline')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              selectedOrderType === 'offline'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <Store className="h-3.5 w-3.5" />
            Offline
          </button>
          <button
            type="button"
            onClick={() => handleOrderTypeChange('online')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              selectedOrderType === 'online'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <MonitorSmartphone className="h-3.5 w-3.5" />
            Online
          </button>
        </div>

        {/* Period select */}
        <Select value={selectedPeriod} onValueChange={(value) => handlePeriodChange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="week">1 Minggu Terakhir</SelectItem>
              <SelectItem value="month">1 Bulan Terakhir</SelectItem>
              <SelectItem value="year">1 Tahun Terakhir</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Custom date range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-[280px] justify-start text-left font-normal">
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
                <span>Pilih rentang tanggal</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
          </PopoverContent>
        </Popover>
        <Button onClick={handleApplyCustomDate}>Apply Custom Date</Button>
      </div>
    </div>
  );
}
