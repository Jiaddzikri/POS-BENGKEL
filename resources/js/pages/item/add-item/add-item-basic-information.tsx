import { Category, FormItem } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';
import { ChevronDown } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

type FormItemKey = keyof FormItem;

type Errors = Partial<Record<keyof FormItem, string>>;

interface AddItemBasicInformationProps {
  formData: FormItem;
  categories: Category[];
  handleInputChange: (field: FormItemKey, value: string | number) => void;
  errors: Errors;
}

export default function AddItemBasicInformation({ categories, handleInputChange, formData, errors }: AddItemBasicInformationProps) {
  const handleInputChangeWithValidation = (field: FormItemKey, value: string | number) => {
    handleInputChange(field, value);
  };

  const getInputClassName = (field: keyof Errors) => {
    return errors[field] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500';
  };

  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <p className="mt-1 text-sm">Essential details about your product</p>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Category <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Select value={formData.category_id} onValueChange={(value) => handleInputChangeWithValidation('category_id', value)}>
              <SelectTrigger id="category-select" className={`w-full ${getInputClassName('category_id')}`}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="" disabled>
                    No categories available
                  </SelectItem>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
          </div>
          {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">Brand</Label>
          <Input
            type="text"
            value={formData.brand}
            onChange={(e) => handleInputChangeWithValidation('brand', e.target.value)}
            className={getInputClassName('brand')}
            placeholder="Product brand"
            maxLength={100}
          />
          {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand}</p>}
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">
            Item Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChangeWithValidation('name', e.target.value)}
            className={getInputClassName('name')}
            placeholder="Enter item name"
            maxLength={200}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">
            Purchase Price <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-sm">Rp</span>
            <Input
              type="text"
              inputMode="numeric"
              value={numberFormat(formData.purchase_price)}
              onChange={(e) => handleInputChangeWithValidation('purchase_price', getRawNumber(e.target.value))}
              className={`${getInputClassName('purchase_price')} w-full rounded-md border py-2 pl-8 text-sm focus:border-transparent focus:ring-2 focus:outline-none`}
              placeholder="0"
            />
          </div>
          {errors.purchase_price && <p className="mt-1 text-sm text-red-500">{errors.purchase_price}</p>}
        </div>
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Selling Price <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-sm">Rp</span>
            <Input
              type="text"
              inputMode="numeric"
              value={numberFormat(formData.selling_price)}
              onChange={(e) => handleInputChangeWithValidation('selling_price', getRawNumber(e.target.value))}
              className={`${getInputClassName('selling_price')} w-full rounded-md border py-2 pl-8 text-sm focus:border-transparent focus:ring-2 focus:outline-none`}
              placeholder="0"
            />
          </div>
          {errors.selling_price && <p className="mt-1 text-sm text-red-500">{errors.selling_price}</p>}
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">
            Description
            <span className="ml-1 text-xs text-gray-500">({formData.description?.length || 0}/1000)</span>
          </Label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChangeWithValidation('description', e.target.value)}
            rows={4}
            className={`${getInputClassName('description')} w-full rounded-md border px-3 py-2 text-sm focus:outline-none`}
            placeholder="Describe your product..."
            maxLength={1000}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>
      </div>
    </div>
  );
}
