import { ItemFilter, ItemList, Pagination, Variant } from '@/types';
import { numberFormat } from '@/utils/number-format';
import { router } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Edit3, MoreVertical, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem } from './ui/accordion';
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
import { Badge } from './ui/badge';
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
  const [openDetails, setOpenDetails] = useState<string | null>(null);

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

  function renderDetailsItem(item: ItemList) {
    if (openDetails !== item.id) return null;

    return (
      <tr className="gap-5">
        <td className="px-4 py-4" colSpan={6}>
          <Accordion type="single" collapsible className="w-full" value={item.id}>
            <AccordionItem value={item.id}>
              <AccordionContent className="accordion-content flex flex-col p-0 text-balance">
                <div className="mt-2">
                  <h4 className="mb-2 text-xs font-bold uppercase">Varian Produk:</h4>
                  <table className="w-full rounded-md border text-xs">
                    <thead className="">
                      <tr className="text-left">
                        <th className="p-2 font-medium">Nama Varian</th>
                        <th className="p-2 font-medium">SKU</th>
                        <th className="p-2 text-center font-medium">Stok</th>
                        <th className="p-2 text-center font-medium">Harga Tambahan</th>
                        <th className="p-2 text-center font-medium">Harga Final</th>
                        <th className="p-2 text-center font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.variants.map((variant: Variant) => (
                        <tr key={variant.id} className="border-t">
                          <td className="p-2">{variant.name}</td>
                          <td className="p-2 font-mono">{variant.sku}</td>
                          <td className="p-2 text-center">{variant.stock}</td>
                          <td className="p-2 text-center font-semibold">{numberFormat(Number(variant.additional_price))}</td>
                          <td className="p-2 text-center font-semibold">
                            {numberFormat(Number(item.selling_price) + Number(variant.additional_price))}
                          </td>
                          <td className="p-2">
                            <div className="flex items-center justify-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="icon" className="h-7 w-7">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => handleShowQr(variant.sku)} className="cursor-pointer">
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </td>
      </tr>
    );
  }

  const handleDeleteItem = (itemId: string) => {
    router.delete(route('item.destroy', { item: itemId }), {
      onSuccess: () => {
        // Optional: Add success notification
      },
      onError: () => {
        // Optional: Add error notification
      },
    });
  };

  return (
    <div className="px-6 py-2">
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-center">
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Nama Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Harga Dasar</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  <tr
                    onClick={() => setOpenDetails(openDetails === item.id ? null : item.id)}
                    className="cursor-pointer transition duration-700 ease-out hover:bg-accent-foreground hover:text-background"
                  >
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium">{item.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm">{item.category_name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm">{item.brand}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm">{numberFormat(item.selling_price)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={item.is_active ? 'default' : 'destructive'}
                        className={`${item.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} `}
                      >
                        {item.is_active ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.get(route('item.edit', { item: item.id }));
                          }}
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 text-slate-600 hover:text-blue-600 dark:bg-black dark:text-white dark:hover:bg-black dark:hover:text-blue-600"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              onClick={(e) => e.stopPropagation()}
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 text-slate-600 hover:text-red-600 dark:bg-black dark:text-white dark:hover:bg-black dark:hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus item "{item.name}"? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua
                                data item termasuk variannya.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteItem(item.id)} className="bg-red-600 hover:bg-red-700">
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>

                  {renderDetailsItem(item)}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <span className="text-sm text-gray-600">
            Menampilkan {(pagination.current_page - 1) * pagination.per_page + 1}-
            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} dari {pagination.total} item
          </span>
          <div className="flex gap-2">
            <Button
              disabled={pagination.current_page === 1}
              onClick={() =>
                router.get(
                  route('item.index'),
                  { ...filters, page: pagination.current_page - 1 },
                  { preserveState: true, preserveScroll: true, replace: true },
                )
              }
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {paginationButton(pagination)}
            <Button
              disabled={pagination.current_page === pagination.last_page}
              onClick={() =>
                router.get(
                  route('item.index'),
                  { ...filters, page: pagination.current_page + 1 },
                  { preserveState: true, preserveScroll: true, replace: true },
                )
              }
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={openQr} onOpenChange={setOpenQrModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {sku && (
              <img
                className="mx-auto rounded-lg border"
                src={`/qr-code/${sku}`}
                alt={`QR Code untuk SKU: ${sku}`}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-qr.png';
                }}
              />
            )}
          </div>
          <div className="text-center text-sm text-gray-500">SKU: {sku}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
