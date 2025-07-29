import { AdjustItemInventoryForm, InventoryItems } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';
import { Plus } from 'lucide-react';
import { Dispatch } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type adjustInventoryFormKey = keyof AdjustItemInventoryForm;

interface InventoryHeaderProps {
  items: InventoryItems[];
  data: AdjustItemInventoryForm;
  handleSubmit: (e: React.FormEvent<Element>) => void;
  handleInputChange: (field: adjustInventoryFormKey, value: string | null | number) => void;
  isModalOpen: boolean;
  setModalOpen: Dispatch<React.SetStateAction<boolean>>;
}

export default function InventoryHeader({ items, handleSubmit, data, handleInputChange, isModalOpen, setModalOpen }: InventoryHeaderProps) {
  return (
    <div className="px-6 py-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Inventory Management</h1>
          <p className="mt-1 text-sm">Manage your inventory</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                <Plus />
                Stock Adjusment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adjust Stock</DialogTitle>
                <DialogDescription>Select Item and Adjust its Quantity</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label>Item</Label>
                  <Select value={data.variant_id ?? undefined} onValueChange={(value) => handleInputChange('variant_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Item Name" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item, index) => (
                        <SelectItem key={index} value={item.variant_id}>{`${item.item_name} ${item.sku}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Adjustment Type</Label>
                  <Select onValueChange={(value) => handleInputChange('adjust_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Adjustment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add-stock">Add Stock</SelectItem>
                      <SelectItem value="remove-stock">Remove Stock</SelectItem>
                      <SelectItem value="adjust-stock">Adjust Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    value={numberFormat(data.quantity)}
                    type="text"
                    inputMode="numeric"
                    onChange={(e) => handleInputChange('quantity', parseInt(getRawNumber(e.target.value)))}
                  />
                </div>
                <DialogFooter>
                  <Button className="bg-blue-600" type="submit">
                    Adjust stock
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
