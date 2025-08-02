import { Pagination } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface OrderHistoryPagination {
  meta: Pagination;
  handlePageChange: (page: number) => void;
}

export default function OrderHistoryPagination({ meta, handlePageChange }: OrderHistoryPagination) {
  return (
    <div>
      {meta.last_page > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="flex items-center text-sm text-gray-700"></div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {/* First page */}
              {meta.current_page > 3 && (
                <>
                  <Button
                    variant={1 === meta.current_page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className="min-w-[40px]"
                  >
                    1
                  </Button>
                  {meta.current_page > 4 && <span className="px-2 text-gray-500">...</span>}
                </>
              )}

              {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                let pageNumber;
                if (meta.last_page <= 5) {
                  pageNumber = i + 1;
                } else if (meta.current_page <= 3) {
                  pageNumber = i + 1;
                } else if (meta.current_page >= meta.last_page - 2) {
                  pageNumber = meta.last_page - 4 + i;
                } else {
                  pageNumber = meta.current_page - 2 + i;
                }

                if (pageNumber < 1 || pageNumber > meta.last_page) return null;
                if (meta.current_page > 3 && pageNumber === 1) return null;
                if (meta.current_page < meta.last_page - 2 && pageNumber === meta.last_page) return null;

                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === meta.current_page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className="min-w-[40px]"
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              {/* Last page */}
              {meta.current_page < meta.last_page - 2 && (
                <>
                  {meta.current_page < meta.last_page - 3 && <span className="px-2 text-gray-500">...</span>}
                  <Button
                    variant={meta.last_page === meta.current_page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(meta.last_page)}
                    className="min-w-[40px]"
                  >
                    {meta.last_page}
                  </Button>
                </>
              )}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.current_page + 1)}
              disabled={meta.current_page === meta.last_page}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
