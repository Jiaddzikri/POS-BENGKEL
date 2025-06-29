import { Category, FormData } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

type FormDataKey = keyof FormData;

interface ValidationErrors {
  category_id?: string;
  name?: string;
  brand?: string;
  price?: string;
  description?: string;
}

interface AddItemBasicInformationProps {
  formData: FormData;
  categories: Category[];
  handleInputChange: (field: FormDataKey, value: string | number) => void;
  onValidationChange?: (isValid: boolean, errors: ValidationErrors) => void;
}

export default function AddItemBasicInformation({ categories, handleInputChange, formData, onValidationChange }: AddItemBasicInformationProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: FormDataKey, value: any): string | undefined => {
    switch (field) {
      case 'category_id':
        if (!value || value === '') {
          return 'Category is required';
        }
        if (!categories.find((cat) => cat.id.toString() === value.toString())) {
          return 'Please select a valid category';
        }
        break;

      case 'name':
        if (!value || value.trim() === '') {
          return 'Item name is required';
        }
        if (value.trim().length < 2) {
          return 'Item name must be at least 2 characters';
        }
        if (value.trim().length > 200) {
          return 'Item name must not exceed 200 characters';
        }
        break;

      case 'brand':
        if (value && value.trim().length > 100) {
          return 'Brand name must not exceed 100 characters';
        }
        if (value && value.trim().length > 0 && value.trim().length < 2) {
          return 'Brand name must be at least 2 characters if provided';
        }
        break;

      case 'price':
        const numericPrice = typeof value === 'string' ? getRawNumber(value) : value;
        if (numericPrice === undefined || numericPrice === null || numericPrice === '') {
          return 'Price is required';
        }
        if (numericPrice <= 0) {
          return 'Price must be greater than 0';
        }
        if (numericPrice > 999999999) {
          return 'Price is too large';
        }
        break;

      case 'description':
        if (value && value.trim().length > 1000) {
          return 'Description must not exceed 1000 characters';
        }
        break;

      default:
        break;
    }
    return undefined;
  };

  const validateAllFields = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    const fieldsToValidate: FormDataKey[] = ['category_id', 'name', 'brand', 'price', 'description'];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
      }
    });

    return newErrors;
  };

  const handleInputChangeWithValidation = (field: FormDataKey, value: string | number) => {
    handleInputChange(field, value);
    setTouched((prev) => ({ ...prev, [field]: true }));

    const error = validateField(field, value);

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleBlur = (field: FormDataKey) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const error = validateField(field, formData[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  useEffect(() => {
    const allErrors = validateAllFields();
    const isValid = Object.keys(allErrors).length === 0;

    if (onValidationChange) {
      onValidationChange(isValid, allErrors);
    }
  }, [formData, categories, onValidationChange]);

  const getInputClassName = (field: keyof ValidationErrors) => {
    const baseClass = 'w-full rounded-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none';
    const errorClass = 'border-red-500 focus:ring-red-500';
    const normalClass = 'focus:ring-blue-500';

    const hasError = touched[field] && errors[field];
    return `${baseClass} ${hasError ? errorClass : normalClass}`;
  };

  const getPriceInputClassName = () => {
    const baseClass = 'w-full rounded-md border py-2 pl-8 text-sm focus:border-transparent focus:ring-2 focus:outline-none';
    const errorClass = 'border-red-500 focus:ring-red-500';
    const normalClass = 'focus:ring-blue-500';

    const hasError = touched.price && errors.price;
    return `${baseClass} ${hasError ? errorClass : normalClass}`;
  };

  const getTextareaClassName = () => {
    const baseClass = 'w-full rounded-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none';
    const errorClass = 'border-red-500 focus:ring-red-500';
    const normalClass = 'focus:ring-blue-500';

    const hasError = touched.description && errors.description;
    return `${baseClass} ${hasError ? errorClass : normalClass}`;
  };

  const getSelectClassName = () => {
    const hasError = touched.category_id && errors.category_id;
    return hasError ? 'border-red-500 focus:ring-red-500' : '';
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
            <Select
              value={formData.category_id}
              onValueChange={(value) => handleInputChangeWithValidation('category_id', value)}
              onOpenChange={(open) => {
                if (!open) {
                  handleBlur('category_id');
                }
              }}
            >
              <SelectTrigger id="category-select" className={`w-full ${getSelectClassName()}`}>
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
          {touched.category_id && errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">Brand</Label>
          <Input
            type="text"
            value={formData.brand}
            onChange={(e) => handleInputChangeWithValidation('brand', e.target.value)}
            onBlur={() => handleBlur('brand')}
            className={getInputClassName('brand')}
            placeholder="Product brand"
            maxLength={100}
          />
          {touched.brand && errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand}</p>}
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">
            Item Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChangeWithValidation('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className={getInputClassName('name')}
            placeholder="Enter item name"
            maxLength={200}
          />
          {touched.name && errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">
            Price <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-sm">Rp</span>
            <Input
              type="text"
              inputMode="numeric"
              value={numberFormat(formData.price)}
              onChange={(e) => handleInputChangeWithValidation('price', getRawNumber(e.target.value))}
              onBlur={() => handleBlur('price')}
              className={getPriceInputClassName()}
              placeholder="0"
            />
          </div>
          {touched.price && errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">
            Description
            <span className="ml-1 text-xs text-gray-500">({formData.description?.length || 0}/1000)</span>
          </Label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChangeWithValidation('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            rows={4}
            className={getTextareaClassName()}
            placeholder="Describe your product..."
            maxLength={1000}
          />
          {touched.description && errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>
      </div>
    </div>
  );
}
