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
  orderType: 'online' | 'offline' | '';
  setOrderType: Dispatch<SetStateAction<'online' | 'offline' | ''>>;
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
  orderType,
  setOrderType,
  params,
}: AnalyticalHeaderProps) {
  const buildPdfUrl = () => {
    const entries: Record<string, string> = {};
    if (startDate && endDate) {
      entries.startDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
      entries.endDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
    } else if (selectedPeriod) {
      entries.range = selectedPeriod;
    }
    if (orderType) entries.order_type = orderType;
    return route('analytical.pdf') + '?' + new URLSearchParams(entries).toString();
  };

  return (
    <div className="px-6 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Laporan Analitik</h1>
          <p className="text-sm">Dashboard analitik Point of Sale</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* ── Date pickers ── */}
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

          {/* ── Period select ── */}
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

          {/* ── Order type segmented toggle ── */}
          <div className="flex overflow-hidden rounded-lg border">
            {(['', 'online', 'offline'] as const).map((type) => {
              const label = type === '' ? 'Semua' : type === 'online' ? 'Online' : 'Offline';
              const active = orderType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── Refresh ── */}
          <Button
            onClick={handleRefresh}
            className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          {/* ── Download PDF ── */}
          <a
            href={buildPdfUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
          >
            <Download className="h-4 w-4" />
            <span>Unduh PDF</span>
          </a>
        </div>
      </div>
    </div>
  );
}
