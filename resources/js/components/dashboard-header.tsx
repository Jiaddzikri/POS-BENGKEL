import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
}

export default function DashboardHeader({
  dateRange,
  handleApplyCustomDate,
  selectedPeriod,
  setDateRange,
  handlePeriodChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Selamat datang kembali!</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
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
