import type { Filter, Pagination } from "@/types";
import { Button } from "@headlessui/react";
import { router } from "@inertiajs/react";
import { ArrowLeft, ArrowRight } from 'lucide-react';


interface PaginationProps<T> {
  pagination: Pagination;
  filters: Filter;
  link: string;
  data: T[];
}

export function Pagination<T>({ pagination, link, data, filters }: PaginationProps<T>) {

  const paginationButton = (pagination: Pagination) => {
    const { per_page, current_page, total, last_page } = pagination;

    const listNumber = [];

    const totalPages = Math.ceil(total / per_page);

    if (totalPages < 1) return null;

    const siblingCount = 2;

    let startPage = Math.max(1, current_page - siblingCount);
    let endPage = Math.min(last_page, current_page + siblingCount);

    if (current_page - siblingCount < 1) endPage = Math.min(last_page, 1 + siblingCount * 2);
    if (current_page + siblingCount > last_page) startPage = Math.max(1, last_page - siblingCount * 2);

    for (let i = startPage; i <= endPage; i++) {
      const isCurrentPage = i === current_page;

      listNumber.push(
        <Button
          key={i}
          disabled={isCurrentPage}
          onClick={() => router.get(route(link),
            {
              page: i
            },
            {
              preserveState: true,
              preserveScroll: true,
              replace: true
            })}
          className={`rounded-lg px-4 py-2 text-sm ${isCurrentPage ? 'cursor-default' : 'border'}`}
        >
          {i}
        </Button>
      );
    }

    return <div className="flex gap-2">{listNumber}</div>
  };


  return (
    <div className="px-6 py-2">
      <div className="mt-6 rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <span className="text-sm text-gray-100">
            Menampilkan {data.length}-{pagination.per_page} dari {pagination.total} item
          </span>
          <div className="flex gap-2">

            <Button
              disabled={pagination.current_page === 1}
              onClick={() =>
                router.get(
                  route(link),
                  { search: filters.searchQuery, page: pagination.current_page - 1 },
                  { preserveState: true, preserveScroll: true, replace: true },
                )
              }
              className={`rounded-lg border px-4 py-2 ${pagination.current_page === 1 ? 'hidden' : 'block'}`}
            >
              <ArrowLeft className="w-4 h-4"  />
            </Button>

            {paginationButton(pagination)}

            <Button
              disabled={pagination.current_page === pagination.last_page}
              onClick={() =>
                router.get(
                  route(link),
                  { search: filters.searchQuery, page: pagination.current_page + 1 },
                  { preserveState: true, preserveScroll: true, replace: true },
                )
              }
              className={`rounded-lg border px-3 py-2 ${pagination.current_page === pagination.last_page ? 'hidden' : 'block'}`}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}