import { Filter } from '@/types';
import { router } from '@inertiajs/react';
import { Filter as FilterComponent, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuArrow, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';


interface DataSelectItem {
  id: number | string;
  // slug
  name: string;
}

interface SearchProps {
  filters: Filter;
  link: string;
  data_select?: DataSelectItem[];
}

export default function SearchHeader({ filters, data_select, link }: SearchProps) {
  const [querySearch, setQuerySearch] = useState<string>(filters.searchQuery || '');
  
  const [debouncedQuery] = useDebounce(querySearch, 300);

  const [showFilter, setShowFilters] = useState<boolean>(false);

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
                placeholder="Search items..."
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                className="w-full rounded-md border py-2 pr-4 pl-9 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowFilters(!showFilter)}
                    className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-foreground hover:text-background ${(!showFilter && !filters.filter) ? 'bg-background text-foreground' : 'bg-foreground text-background'}`}
                  >
                    <FilterComponent className="mr-1 h-4 w-4" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuContent
                    className="w-56 mr-12 rounded-md border border-border bg-popover p-2 shadow-lg animate-in fade-in-0 slide-in-from-top-2"
                    sideOffset={5}
                  >

                    <DropdownMenuArrow className="fill-accent" />

                    {data_select?.map((data: DataSelectItem) => {

                      const { id, name } = data;

                      return (
                        <DropdownMenuItem
                          key={id}
                          onClick={() => router.get(
                            route(link),
                            { search: querySearch, filter: id != filters.filter ? id : null },
                            { preserveState: true, preserveScroll: true, replace: true },
                          )}
                          className={`cursor-pointer select-none rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-backgorund focus:bg-foreground focus:text-background focus:outline-0 focus:border-0 my-1 ${filters.filter != id ? 'text-popover-foreground' : 'bg-foreground text-background border-0 outline-0'}`}
                        >
                          {name}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>

                </DropdownMenuPortal>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
