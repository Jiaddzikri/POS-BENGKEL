import { router } from '@inertiajs/react';
import { Clock, Scan, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function CashierHeader() {
  const path = window.location.pathname.split('/');
  const orderId = path[path.length - 1];
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  return (
    <div className="mb-6 rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kasir POS</h1>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {currentTime.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              - {currentTime.toLocaleTimeString('id-ID')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2 rounded-lg px-4 py-2 transition-colors" type="button">
            <Scan className="h-4 w-4" />
            Scan Barcode
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
        <Input
          type="text"
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full rounded-lg border py-2 pr-4 pl-10 outline-none focus:border-transparent focus:ring-2"
        />
      </div>
    </div>
  );
}
