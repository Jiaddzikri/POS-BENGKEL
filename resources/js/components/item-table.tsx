import { ItemFilter, ItemList, Pagination } from '@/types';
import { router } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, ArrowRight, Edit3, MoreVertical, Package, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface ItemTableProps {
  items: ItemList[];
  filters: ItemFilter;
  pagination: Pagination;
}
export default function ItemTable({ items, pagination, filters }: ItemTableProps) {
  const [openQr, setOpenQrModal] = useState<boolean>(false);
  const [sku, setSku] = useState<string | null>(null);
  const paginationButton = (pagination: Pagination) => {
    const { per_page, current_page, total, last_page } = pagination;
    const listNumber = [];

    const totalPages = Math.ceil(total / per_page);

    if (totalPages < 1) {
      return null;
    }

    const siblingCount = 2;

    let startPage = Math.max(1, current_page - siblingCount);
    let endPage = Math.min(last_page, current_page + siblingCount);

    if (current_page - siblingCount < 1) {
      endPage = Math.min(last_page, 1 + siblingCount * 2);
    }

    if (current_page + siblingCount > last_page) {
      startPage = Math.max(1, last_page - siblingCount * 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      const isCurrentPage = i === current_page;
      listNumber.push(
        <Button
          key={i}
          disabled={isCurrentPage}
          onClick={() => router.get(route('item.index'), { page: i }, { preserveState: true, preserveScroll: true, replace: true })}
          className={`rounded-lg px-3 py-2 ${isCurrentPage ? 'cursor-default' : 'border'}`}
        >
          {i}
        </Button>,
      );
    }
    return <div className="flex gap-2">{listNumber}</div>;
  };

  const handleShowQr = (sku: string) => {
    setSku(sku);

    setTimeout(() => {
      setOpenQrModal(true);
    }, 300);
  };

  return (
    <div className="px-6 py-2">
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-center">
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Last Updated</th>
                <th className="px-4 py-3 text-center text-xs font-medium tracking-wider uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item, index) => (
                <tr key={index} className="">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.item_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm">{item.sku}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{item.category_name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium">Rp {item.price.toLocaleString('id-ID')}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${item.low_stock ? 'text-orange-600' : ''}`}>{item.stock}</span>
                      {item.low_stock && <AlertTriangle className="ml-2 h-4 w-4 text-orange-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.is_active ? 'text-green-800' : ''}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{item.last_updated}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        onClick={() =>
                          router.get(
                            route('item.edit', {
                              item: item.item_id,
                            }),
                          )
                        }
                        className="transition-colors hover:text-green-600"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="transition-colors hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your item and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => router.delete(route('item.destroy', { item: item.item_id }))}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleShowQr(item.sku)} className="cursor-pointer">
                            Tampilkan QrCode
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <span className="text-sm">
            Menampilkan {items.length}-{pagination.per_page} dari {pagination.total} item
          </span>
          <div className="flex gap-2">
            <Button
              disabled={pagination.current_page === 1}
              onClick={() =>
                router.get(
                  route('item.index'),
                  { search: filters.searchQuery, page: pagination.current_page - 1 },
                  { preserveState: true, preserveScroll: true, replace: true },
                )
              }
              className={`rounded-lg border py-2`}
            >
              <ArrowLeft />
            </Button>
            {paginationButton(pagination)}
            <Button
              disabled={pagination.current_page === pagination.last_page}
              onClick={() =>
                router.get(
                  route('item.index'),
                  { search: filters.searchQuery, page: pagination.current_page + 1 },
                  { preserveState: true, preserveScroll: true, replace: true },
                )
              }
              className={`rounded-lg border px-3 py-2`}
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={openQr} onOpenChange={setOpenQrModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Qr Code</DialogTitle>
          </DialogHeader>
          <img className="mx-auto" src={`/qr-code/${sku}`} alt="qr-code" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
