import { AdjustItemInventoryForm, InventoryData, InventoryFilters } from '@/types';
import { numberFormat } from '@/utils/number-format';
import { Link, router } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import { AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, Download, Filter, Package, Search, X } from 'lucide-react';
import { Dispatch, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type adjustInventoryFormKey = keyof AdjustItemInventoryForm;

interface InventoryOverviewProps {
  inventoryData: InventoryData;
  filters: InventoryFilters;
  data: AdjustItemInventoryForm;
  handleSubmit: (e: React.FormEvent<Element>) => void;
  handleInputChange: (field: adjustInventoryFormKey, value: string | null | number) => void;
  isModalOpen: boolean;
  setModalOpen: Dispatch<React.SetStateAction<boolean>>;
}

export default function InventoryOverview({
  inventoryData,
  filters,
  data,
  handleSubmit,
  handleInputChange,
  isModalOpen,
  setModalOpen,
}: InventoryOverviewProps) {
  const { data: items, meta, links } = inventoryData;

  const [querySearch, setQuerySearch] = useState<string>(filters.search || '');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedStockCondition, setSelectedStockCondition] = useState<string>(filters.stock_condition || '');

  const [debouncedQuery] = useDebounce(querySearch, 300);

  const hasActiveFilters = selectedStockCondition || querySearch;

  const clearAllFilters = () => {
    setQuerySearch('');
    setSelectedStockCondition('');
    router.get(route('inventory.index'), {
      search: '',
      stock_condition: '',
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    const params = {
      search: querySearch,
      stock_condition: selectedStockCondition,
      page: page,
    };

    router.get(route('inventory.index'), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  useEffect(() => {
    const params = {
      search: querySearch,
      stock_condition: selectedStockCondition,
      page: 1,
    };
    router.get(route('inventory.index'), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }, [debouncedQuery, selectedStockCondition]);

  return (
    <div className="space-y-3 overflow-x-auto rounded-lg border px-6 py-3">
      <div className="mb-3">
        <h1 className="text-xl font-semibold">Inventory Management</h1>
        <p className="mt-1 text-sm">Manage your inventory</p>
      </div>

      <div className="flex max-w-md gap-5">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            onChange={(e) => setQuerySearch(e.target.value)}
            value={querySearch} // Added: Controlled input
            type="text"
            placeholder="Search items..."
            className="w-full rounded-md border py-2 pr-4 pl-9 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center">
            <Filter />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearAllFilters} className="flex items-center gap-2 text-red-600 hover:text-red-700">
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
        <Link
          href={route('inventory.print', {
            search: querySearch,
            stock_condition: selectedStockCondition,
            export_type: 'inventory',
          })}
          target="_blank"
          className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Link>
      </div>

      {showFilters && (
        <div className="borderp-4 rounded-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <Label className="mb-2 block text-xs font-medium tracking-wide uppercase">Stock Condition</Label>
              <Select value={selectedStockCondition} onValueChange={(value) => setSelectedStockCondition(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Kondisi Stok" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="normal">Normal Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="py-8 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="text-gray-500">No inventory items found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Current Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium tracking-wider uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item, index) => (
                <tr key={item.variant_id || index} className="text-left">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <Package className="h-5 w-5 text-gray-600" />
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
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${item.low_stock ? 'text-orange-600' : 'text-green-600'}`}>{item.stock}</span>
                      {item.low_stock && <AlertTriangle className="ml-2 h-4 w-4 text-orange-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium">{item.category_name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium">Rp {item.price.toLocaleString('id-ID')}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => handleInputChange('variant_id', item.variant_id)}
                            className="bg-blue-600 text-white transition-colors hover:bg-blue-700"
                            size="sm"
                          >
                            Adjust Stock
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adjust Stock</DialogTitle>
                            <DialogDescription>Select Item and Adjust its Quantity</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                              <Label className="mb-1 block text-sm font-medium">Item</Label>
                              <Input
                                onChange={(e) => handleInputChange('variant_id', e.target.value)}
                                value={`${item.item_name} (${item.sku})`}
                                readOnly
                                disabled
                                className="border"
                              />
                            </div>
                            <div>
                              <Label className="mb-1 block text-sm font-medium">Adjustment Type</Label>
                              <Select onValueChange={(value) => handleInputChange('adjust_type', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select adjustment type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="add-stock">Add Stock</SelectItem>
                                  <SelectItem value="remove-stock">Remove Stock</SelectItem>
                                  <SelectItem value="adjust-stock">Adjust Stock</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="mb-1 block text-sm font-medium">Quantity</Label>
                              <Input
                                onChange={(e) => handleInputChange('quantity', e.target.value)}
                                value={numberFormat(data.quantity)}
                                type="text"
                                inputMode="numeric"
                                placeholder="Enter quantity"
                              />
                            </div>
                            <DialogFooter>
                              <Button className="bg-blue-600 text-white hover:bg-blue-700" type="submit">
                                Adjust Stock
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta.last_page > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="flex items-center text-sm text-gray-700">
            <span>{/* Showing {meta.from} to {meta.to} of {meta.total} results */}</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Previous Button */}
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

            <div className="flex items-center space-x-1">
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

              {/* Current page and surrounding pages */}
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
