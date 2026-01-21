import { ItemFilter } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';
import { router } from '@inertiajs/react';
import { ChevronDown, Filter, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ItemProps {
  filters: ItemFilter;
  categories?: Array<{ id: string; name: string }>;
  statuses?: Array<{ id: string; name: string; color?: string }>;
}

export default function ItemSearchHeader({ filters, categories = [] }: ItemProps) {
  const [querySearch, setQuerySearch] = useState<string>(filters.searchQuery || '');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(filters.category || '');
  const [selectedStatus, setSelectedStatus] = useState<string>(filters.status || '');
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState<string>(filters.maxPrice?.toString() || '');
  const [sortBy, setSortBy] = useState<string>(filters.sortBy || 'created_at');
  const [sortOrder, setSortOrder] = useState<string>(filters.sortOrder || 'desc');

  const [debouncedQuery] = useDebounce(querySearch, 300);
  const [debouncedMinPrice] = useDebounce(minPrice, 500);
  const [debouncedMaxPrice] = useDebounce(maxPrice, 500);

  useEffect(() => {
    applyFilters();
  }, [debouncedQuery]);

  useEffect(() => {
    if (debouncedMinPrice !== (filters.minPrice?.toString() || '') || debouncedMaxPrice !== (filters.maxPrice?.toString() || '')) {
      applyFilters();
    }
  }, [debouncedMinPrice, debouncedMaxPrice]);

  const applyFilters = () => {
    const filterParams: any = {
      search: querySearch || undefined,
      category: selectedCategory || undefined,
      status: selectedStatus || undefined,
      minPrice: minPrice ? getRawNumber(minPrice) : undefined,
      maxPrice: maxPrice ? getRawNumber(maxPrice) : undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
    };

    Object.keys(filterParams).forEach((key) => {
      if (filterParams[key] === '' || filterParams[key] === undefined || filterParams[key] === null) {
        delete filterParams[key];
      }
    });

    router.get(route('item.index'), filterParams, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const clearFilters = () => {
    setQuerySearch('');
    setSelectedCategory('');
    setSelectedStatus('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('created_at');
    setSortOrder('desc');

    router.get(
      route('item.index'),
      {},
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      },
    );
  };

  const hasActiveFilters = selectedCategory || selectedStatus || minPrice || maxPrice || querySearch || sortBy || sortOrder;

  const activeFilterCount = [
    querySearch,
    selectedCategory,
    selectedStatus,
    minPrice,
    maxPrice,
    sortBy !== 'created_at' ? sortBy : null,
    sortOrder !== 'desc' ? sortOrder : null,
  ].filter(Boolean).length;

  const handleMinPriceChange = (value: string) => {
    const rawValue = getRawNumber(value);
    setMinPrice(rawValue);
  };

  const handleMaxPriceChange = (value: string) => {
    const rawValue = getRawNumber(value);
    setMaxPrice(rawValue);
  };

  return (
    <div className="px-6 py-2">
      <div className="mb-6 rounded-lg border">
        <div className="border-b p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                type="text"
                placeholder="Cari item..."
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                className="w-full rounded-md border py-2 pr-4 pl-9 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {querySearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuerySearch('')}
                  className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 transform p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <span className="rounded-full px-2 py-1 text-xs text-blue-700">
                  {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                </span>
              )}

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 hover:text-red-800"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Category Filter */}
              {categories.length > 0 && (
                <div>
                  <Label className="mb-2 block text-sm font-medium">Kategori</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Semua Kategori</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Price Range */}
              <div>
                <Label className="mb-2 block text-sm font-medium">Range Harga</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Min"
                    value={minPrice ? numberFormat(parseInt(minPrice)) : ''}
                    onChange={(e) => handleMinPriceChange(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <Input
                    type="text"
                    placeholder="Max"
                    value={maxPrice ? numberFormat(parseInt(maxPrice)) : ''}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <Label className="mb-2 block text-sm font-medium">Urutkan Berdasarkan</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Tanggal Dibuat</SelectItem>
                    <SelectItem value="updated_at">Tanggal Diperbarui</SelectItem>
                    <SelectItem value="name">Nama</SelectItem>
                    <SelectItem value="price">Harga</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block text-sm font-medium">Urutan</Label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Urutan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Terbaru/Tertinggi</SelectItem>
                    <SelectItem value="asc">Terlama/Terendah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end justify-end">
                <Button onClick={applyFilters} className="bg-blue-600 text-white hover:bg-blue-700">
                  Terapkan Filter
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
