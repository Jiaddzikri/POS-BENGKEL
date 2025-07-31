import { ItemFilter } from '@/types';

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

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(filters.category || '');
  const [selectedStatus, setSelectedStatus] = useState<string>(filters.status || '');
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState<string>(filters.maxPrice?.toString() || '');
  const [sortBy, setSortBy] = useState<string>(filters.sortBy || 'created_at');
  const [sortOrder, setSortOrder] = useState<string>(filters.sortOrder || 'desc');

  const [debouncedQuery] = useDebounce(querySearch, 300);
  const [debouncedMinPrice] = useDebounce(minPrice, 500);
  const [debouncedMaxPrice] = useDebounce(maxPrice, 500);

  const applyFilters = () => {
    const filterParams: any = {
      search: querySearch,
      category: selectedCategory || undefined,

      minPrice: debouncedMinPrice || undefined,
      maxPrice: debouncedMaxPrice || undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
    };

    // Remove empty values
    Object.keys(filterParams).forEach((key) => {
      if (filterParams[key] === '' || filterParams[key] === undefined) {
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

  // Check if any filters are active
  const hasActiveFilters = selectedCategory || selectedStatus || minPrice || maxPrice || querySearch;

  useEffect(() => {
    applyFilters();
  }, [debouncedQuery, selectedCategory, selectedStatus, debouncedMinPrice, debouncedMaxPrice, sortBy, sortOrder]);

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
                      category: selectedCategory,
                      status: selectedStatus,
                      price: minPrice || maxPrice,
                      sortOrder: sortOrder,
                      sortBy: sortBy,
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
                  onClick={clearFilters}
                  className="0 inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium text-red-700 transition-colors"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </button>
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
                  <Label className="mb-1 block text-sm font-medium">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
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
                <label className="mb-1 block text-sm font-medium">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={`Min`}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                  />
                  <Input
                    type="text"
                    placeholder={`Max`}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="borderpx-3 w-full rounded-md py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="mb-1 block text-sm font-medium">Sort By</label>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Date Created</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="updated_at">Date Updated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger>
                      <SelectValue placeholder="Order By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">ASC</SelectItem>
                      <SelectItem value="desc">DESC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
