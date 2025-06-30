import { ItemFilter } from '@/types';
import { Input } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface ItemProps {
  filters: ItemFilter;
}

export default function ItemSearchHeader({ filters }: ItemProps) {
  const [querySearch, setQuerySearch] = useState<string>(filters.searchQuery || '');

  const [debouncedQuery] = useDebounce(querySearch, 300);

  useEffect(() => {
    router.get(route('item.index'), { search: querySearch }, { preserveState: true, preserveScroll: true, replace: true });
  }, [debouncedQuery]);
  return (
    <div className="px-6 py-2">
      <div className="mb-6 rounded-lg border">
        <div className="border-b p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                type="text"
                placeholder="Search items..."
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                className="w-full rounded-md border py-2 pr-4 pl-9 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                // onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
