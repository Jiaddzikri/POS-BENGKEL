import { Download, RefreshCw } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from './ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AnalyticalHeaderProps {
  selectedPeriod: string;
  setSelectedPeriod: Dispatch<SetStateAction<string>>;
  isRefreshing: boolean;
  handleRefresh: () => void;
  startDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
  params: any;
}

export default function AnalyticalHeader({
  selectedPeriod,
  setSelectedPeriod,
  isRefreshing,
  handleRefresh,
  setStartDate,
  setEndDate,
  startDate,
  endDate,
  params,
}: AnalyticalHeaderProps) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Laporan Analitik</h1>
          <p className="text-sm">Dashboard analitik Point of Sale</p>
        </div>
        <div className="flex items-center gap-3">
          <DatePicker
            placeholderText="Start Date"
            portalId="root"
            dateFormat="yyyy-MM-dd"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="w-32 cursor-pointer rounded-[8px] border px-3 py-[.3rem] outline-none placeholder:text-sm"
          />

          <DatePicker
            portalId="root"
            placeholderText="End Date"
            dateFormat="yyyy-MM-dd"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="w-32 cursor-pointer rounded-[8px] border px-2 py-[.3rem] outline-none placeholder:text-sm"
          />

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="select date" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="week">Minggu Ini</SelectItem>
                <SelectItem value="month">Bulan Ini</SelectItem>
                <SelectItem value="year">Tahun Ini</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            onClick={handleRefresh}
            className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <a href={route('analytical.download', params)} download>
            <Button className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
