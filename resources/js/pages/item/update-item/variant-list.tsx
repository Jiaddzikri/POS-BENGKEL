import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Variant } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';
import { DialogClose } from '@radix-ui/react-dialog';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface VariantListProps {
  variants: Variant[];
  handleVariantChange: (field: keyof Variant, value: string | number, id?: string) => void;
  handleDeleteVariant: (handleCloseDeleteModal: any, variantId?: string) => void;
  errors: Partial<Record<string, string>>;
}

export default function VariantList({ variants, handleVariantChange, handleDeleteVariant, errors }: VariantListProps) {
  const [isDeleteModalOpen, setShowDeleteModal] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>('');

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const getVariantError = (variantIndex: number, fieldName: keyof Variant): string | undefined => {
    return errors[`variants.${variantIndex}.${fieldName}`];
  };

  const hasFieldError = (variantIndex: number, fieldName: keyof Variant): boolean => {
    return !!getVariantError(variantIndex, fieldName);
  };

  return (
    <div className="space-y-3">
      {variants.map((variant, index) => {
        return (
          <div key={variant.id} className="flex items-center space-x-3 rounded-lg border p-3">
            <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-5">
              <div>
                <Label className="mb-1 block text-xs">Name</Label>
                <input
                  type="text"
                  value={variant.name}
                  onChange={(e) => handleVariantChange('name', e.target.value, variant.id)}
                  className={`w-full rounded border px-2 py-1 text-sm focus:ring-1 focus:outline-none ${
                    hasFieldError(index, 'name') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {getVariantError(index, 'name') && <p className="mt-1 text-xs text-red-600">{getVariantError(index, 'name')}</p>}
              </div>
              <div>
                <Label className="mb-1 block text-xs">Stock</Label>
                <input
                  type="text"
                  value={numberFormat(variant.stock)}
                  onChange={(e) => handleVariantChange('stock', parseInt(getRawNumber(e.target.value)) || 0, variant.id)}
                  className={`w-full rounded border px-2 py-1 text-sm focus:ring-1 focus:outline-none ${
                    hasFieldError(index, 'stock') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {getVariantError(index, 'stock') && <p className="mt-1 text-xs text-red-600">{getVariantError(index, 'stock')}</p>}
              </div>
              <div>
                <Label className="mb-1 block text-xs">Minimum Stock</Label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={variant.minimum_stock}
                  onChange={(e) => handleVariantChange('minimum_stock', parseInt(e.target.value) || 0, variant.id)}
                  className={`w-full rounded border px-2 py-1 text-sm focus:outline-none ${
                    hasFieldError(index, 'minimum_stock') ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                />
                {getVariantError(index, 'minimum_stock') && <p className="mt-1 text-xs text-red-600">{getVariantError(index, 'minimum_stock')}</p>}
              </div>
              <div>
                <Label className="mb-1 block text-xs">Additional Price</Label>
                <input
                  type="text"
                  value={numberFormat(variant.additional_price)}
                  onChange={(e) => handleVariantChange('additional_price', parseInt(getRawNumber(e.target.value)) || 0, variant.id)}
                  className={`w-full rounded border px-2 py-1 text-sm focus:ring-1 focus:outline-none ${
                    hasFieldError(index, 'additional_price') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {getVariantError(index, 'additional_price') && (
                  <p className="mt-1 text-xs text-red-600">{getVariantError(index, 'additional_price')}</p>
                )}
              </div>
              <div>
                <Label className="mb-1 block text-xs">SKU</Label>
                <input
                  type="text"
                  value={variant.sku}
                  onChange={(e) => handleVariantChange('sku', e.target.value, variant.id)}
                  className={`w-full rounded border px-2 py-1 text-sm focus:outline-none ${
                    hasFieldError(index, 'sku') ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                />
                {getVariantError(index, 'sku') && <p className="mt-1 text-xs text-red-600">{getVariantError(index, 'sku')}</p>}
              </div>
            </div>
            <Button
              onClick={() => {
                setShowDeleteModal(true);
                setSelectedVariant(variant.id);
              }}
              variant="ghost"
              size="icon"
              className="flex-shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
      <Dialog onOpenChange={setShowDeleteModal} open={isDeleteModalOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-background/10" />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Anda yakin ingin menghapus varian ini?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Anda akan menghapus varian ini?</p>
            <DialogFooter className="mt-4 gap-2 sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Batal
                </Button>
              </DialogClose>
              <Button variant="destructive" onClick={(e) => handleDeleteVariant(closeDeleteModal, selectedVariant)}>
                Ya, Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
