import { Button } from "@/components/ui/button";
import { Filter as FilterIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { DropdownData, Filter } from "@/types";
import { useState } from "react";
import { router } from "@inertiajs/react";

interface FilterProps {
  filters: Filter;
  link: string;
  dropdowns: DropdownData[];
}

export default function FilterDropdown({ filters, link, dropdowns }: FilterProps) {

  const [showFilter, setShowFilters] = useState<boolean>(false);


  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={'ghost'}
            onClick={() => setShowFilters(!showFilter)}
            className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-foreground hover:text-background ${(!showFilter && !filters.filter) ? 'bg-background text-foreground' : 'bg-foreground text-background'}`}
          >
            <FilterIcon className="mr-1 h-4 w-4" />
            Filters
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            className="w-56 mr-12 rounded-md border border-border bg-popover p-2 shadow-lg animate-in fade-in-0 slide-in-from-top-2"
            sideOffset={5}
          >

            <DropdownMenuArrow className="fill-accent" />

            {dropdowns.map((data: DropdownData) => {

              const { id, name } = data;

              return (
                <DropdownMenuItem
                  key={id}
                  onClick={() => router.get(
                    route(link),
                    { search: filters.searchQuery, filter: id != filters.filter ? id : null },
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
  );
}