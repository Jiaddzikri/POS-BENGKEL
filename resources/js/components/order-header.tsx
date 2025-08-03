import { useApi } from '@/hooks/use-api';
import { ItemList } from '@/types';
import { router } from '@inertiajs/react';
import { Clock, Scan, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import QrScanner from './qr-scanner';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';

interface CashierHeaderProps {
  handleAddItem: (item: ItemList) => void;
}

export default function CashierHeader({ handleAddItem }: CashierHeaderProps) {
  const path = window.location.pathname.split('/');
  const orderId = path[path.length - 1];
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [sku, setSku] = useState<string>('');

  const [findItem, { isLoading, error, data: findItemData }, setFindItemState] = useApi<ItemList[]>();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [debouncedQuery] = useDebounce(searchTerm, 300);

  useEffect(() => {
    router.get(route('menu', { orderId: orderId }), { search: searchTerm }, { preserveState: true, preserveScroll: true, replace: true });
  }, [debouncedQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const onScanSuccess = (decodeText: string): void => {
    setSku(decodeText);
  };

  useEffect(() => {
    if (findItemData == null) return;

    handleAddItem(findItemData[0]);

    setSku('');
  }, [findItemData]);

  useEffect(() => {
    if (!sku || sku === '') return;

    findItem(`/api/item/variant?sku=${sku}`);
  }, [sku]);

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border shadow-sm">
      {/* Header Section */}
      <div className="border-b p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo/Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div>
              <h1 className="bg-clip-text text-2xl font-bold">Kasir POS</h1>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {currentTime.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="400 h-1 w-1 rounded-full" />
                <span className="font-mono text-sm tabular-nums">{currentTime.toLocaleTimeString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* QR Scanner Button */}
          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
              <Button
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                type="button"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  <span className="font-semibold">Scan QR</span>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <QrScanner onScanSuccess={onScanSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Section */}
      <div className="p-6 pt-4">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 transform">
            <Search className="h-5 w-5" />
          </div>

          {/* Search Input */}
          <Input
            type="text"
            placeholder="Cari produk berdasarkan nama atau SKU..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-xl border-1 py-4 pr-4 pl-12 text-base shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
          />
        </div>
      </div>
    </div>
  );
}
