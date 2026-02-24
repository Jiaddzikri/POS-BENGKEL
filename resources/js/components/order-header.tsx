import { useApi } from '@/hooks/use-api';
import { CategoryList, ItemList } from '@/types';
import { router } from '@inertiajs/react';
import { Clock, LayoutGrid, Scan, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import QrScanner from './qr-scanner';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';

interface CashierHeaderProps {
  handleAddItem: (item: ItemList) => void;
  categories: CategoryList[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function CashierHeader({
  handleAddItem,
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}: CashierHeaderProps) {
  const path = window.location.pathname.split('/');
  const orderId = path[path.length - 1];
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [sku, setSku] = useState<string>('');

  const [findItem, { isLoading, error, data: findItemData }, setFindItemState] = useApi<ItemList[]>();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [debouncedQuery] = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      router.get(route('menu', { orderId: orderId }), { search: debouncedQuery }, { preserveState: true, preserveScroll: true, replace: true });
    } else {
      router.get(route('menu', { orderId: orderId }), {}, { preserveState: true, preserveScroll: true, replace: true });
    }
  }, [debouncedQuery]);

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
      <div className="p-4 pb-3">
        <div className="relative">
          <div className="absolute top-1/2 left-4 -translate-y-1/2 transform">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Cari produk berdasarkan nama atau SKU... (override kategori)"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border py-4 pr-10 pl-12 text-base shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      {!searchTerm && (
        <div className="overflow-x-auto px-4 pb-4">
          <div className="flex gap-2">
            {/* All */}
            <button
              type="button"
              onClick={() => onCategoryChange('')}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedCategory === ''
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Semua</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
