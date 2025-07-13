import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormTenant, Status } from '@/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';


type FormTenantKey = keyof FormTenant;

type Errors = Partial<Record<keyof FormTenant, string>>

interface TenantBasicInformation {
  formData: FormTenant;
  status: Status[];
  handleInputChange: (field: FormTenantKey, value: string | number) => void,
  errors: Errors
}

export default function TenantBasicInformation({ handleInputChange, formData, status, errors }: TenantBasicInformation) {

  const handleInputChangeWithValidation = (field: keyof Errors, value: string | number) => {
    handleInputChange(field, value);
  }

  const getInputClassName = (field: keyof Errors) => {
    return errors[field] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500';
  };

  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-medium">Create New Store</h3>
        <p className="mt-1 text-sm">Details about new store</p>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Store Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChangeWithValidation('name', e.target.value)}
            className={getInputClassName('name')}
            placeholder="Enter store name"
            maxLength={200}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Status <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Select value={formData.status} onValueChange={(value) => handleInputChangeWithValidation('status', value)}>

              <SelectTrigger id="status-select" className={`w-full ${getInputClassName('status')}`}>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>

              <SelectContent>
                {status.map((stats, key) => (
                  <SelectItem key={key} value={String(stats)}>
                    {String(stats)}
                  </SelectItem>

                ))}
              </SelectContent>

            </Select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />

          </div>
          {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
        </div>
      </div>

    </div>
  );
}