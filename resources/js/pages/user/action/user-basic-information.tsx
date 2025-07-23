import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormUser, Tenant } from '@/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';


type FormUserKey = keyof FormUser;

type Errors = Partial<Record<keyof FormUser, string>>

interface UserBasicInformation {
  formData: FormUser;
  tenants: Tenant[];
  roles: string[];
  handleInputChange: (field: FormUserKey, value: string | number) => void,
  errors: Errors,
  action: string;
}

export default function UserBasicInformation({ action, handleInputChange, formData, errors, tenants, roles }: UserBasicInformation) {

  const handleInputChangeWithValidation = (field: keyof Errors, value: string | number) => {
    handleInputChange(field, value);
  }

  const getInputClassName = (field: keyof Errors) => {
    return errors[field] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500';
  };


  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-medium">{action} a User</h3>
        <p className="mt-1 text-sm">Details about user</p>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <Label className="mb-2 block text-sm font-medium">
            User Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChangeWithValidation('name', e.target.value)}
            className={getInputClassName('name')}
            placeholder="Enter full name"
            maxLength={200}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            value={formData.email}
            onChange={(e) => handleInputChangeWithValidation('email', e.target.value)}
            className={getInputClassName('email')}
            placeholder="Enter email"
            maxLength={200}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Role <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Select value={formData.role} onValueChange={(value) => handleInputChangeWithValidation('role', value)}>

              <SelectTrigger id="role-select" className={`w-full ${getInputClassName('role')}`}>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>

              <SelectContent>

                {roles && roles.map((data, key) => (
                  <SelectItem key={key} value={data}>
                    {data}
                  </SelectItem>
                ))}
              </SelectContent>

            </Select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />

          </div>
          {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
        </div>
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Tenant <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Select value={formData.tenant_id} onValueChange={(value) => handleInputChangeWithValidation('tenant_id', value)}>

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