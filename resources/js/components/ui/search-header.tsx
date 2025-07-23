import { DropdownData, Filter } from '@/types';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import FilterDropdown from '@/components/ui/filter-dropdown';


interface SearchProps {
  filters: Filter;
  link: string;
  dropdowns?: DropdownData[];
}

export default function SearchHeader({ filters, dropdowns, link }: SearchProps) {
  const [querySearch, setQuerySearch] = useState<string>(filters.searchQuery || '');

  const [debouncedQuery] = useDebounce(querySearch, 300);

  useEffect(() => {
    router.get(route(link),
      {
        search: querySearch,
        filter: filters.filter
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
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
                placeholder="Search data..."
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                className="w-full rounded-md border py-2 pr-4 pl-9 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {dropdowns && (
              <FilterDropdown dropdowns={dropdowns} filters={filters} link={link} />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
