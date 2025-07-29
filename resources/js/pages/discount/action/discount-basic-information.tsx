import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormDiscount, Tenant } from '@/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';


type FormDiscountKey = keyof FormDiscount;

type Errors = Partial<Record<keyof FormDiscount, string>>

interface DiscountBasicInformationProps {
  formData: FormDiscount;
  tenants: Tenant[];
  handleInputChange: (field: FormDiscountKey, value: string | number) => void,
  errors: Errors,
  action: string;
}

export default function DiscountBasicInformation({ action, handleInputChange, formData, errors, tenants }: DiscountBasicInformationProps) {

  const handleInputChangeWithValidation = (field: keyof Errors, value: string | number) => {
    handleInputChange(field, value);
  }

  const getInputClassName = (field: keyof Errors) => {
    return errors[field] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500';
  };


  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-medium">{action} a Discount</h3>
        <p className="mt-1 text-sm">Details about discount</p>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Discount Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChangeWithValidation('name', e.target.value)}
            className={getInputClassName('name')}
            placeholder="Enter discount name"
            maxLength={200}
            required
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>


        <div>
          <Label className="mb-2 block text-sm font-medium">
            Discount Description <span className="text-red-500">*</span>
          </Label>

          <Textarea
            value={formData.desc}
            onChange={(e) => handleInputChangeWithValidation('desc', e.target.value)}
            className={getInputClassName('desc')}
            placeholder="Enter discount name" />

          {errors.desc && <p className="mt-1 text-sm text-red-500">{errors.desc}</p>}
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">
            Discount on Percent (%)<span className="text-red-500">*</span>
          </Label>

          <Input
            type="number"
            value={formData.discount_percent}
            onChange={(e) => handleInputChangeWithValidation('discount_percent', e.target.value)}
            className={getInputClassName('discount_percent')}
            placeholder="Enter discount name"
            maxLength={3}
            min={0}
            max={100}
            required
          />

          {errors.discount_percent && <p className="mt-1 text-sm text-red-500">{errors.discount_percent}</p>}
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">
            Tenant <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Select required value={formData.tenant_id} onValueChange={(value) => handleInputChangeWithValidation('tenant_id', value)}>

              <SelectTrigger id="tenant-select" className={`w-full ${getInputClassName('tenant')}`}>
                <SelectValue placeholder="Select Tenant" />
              </SelectTrigger>

              <SelectContent>
                {tenants && tenants.map((data) => (
                  <SelectItem key={data.id} value={data.id}>
                    {data.name}
                  </SelectItem>
                ))}
              </SelectContent>

            </Select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />

          </div>
          {errors.tenant && <p className="mt-1 text-sm text-red-500">{errors.tenant}</p>}
        </div>
      </div>

    </div>
  );
}