import { FormUser, Tenant } from "@/types";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import ActionButton from "@/components/action-button";
import UserBasicInformation from "../user-basic-information";


type FormUserKey = keyof FormUser;

interface UpdateTenantFormProps {
  user?: FormUser;
  tenants: Tenant[];
  roles: string[];
}

export default function UpdateUserForm({ user, tenants, roles }: UpdateTenantFormProps) {

  const { data, setData, put, reset, errors, clearErrors } = useForm<FormUser>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    tenant_id: user?.tenant_id || ''
  });



  const handleInputChange = (field: FormUserKey, value: string | number | null) => {
    setData((prev: FormUser) => {
      const updated = { ...prev, [field as FormUserKey]: value };

      Object.entries(updated)
        .map(clear => clearErrors(clear[1].length > 0 ? clear[0] : 0));

      return updated;
    });

  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    put(route('user.update', data.id), {
      onSuccess: () => reset('name', 'email', 'password', 'role', 'tenant_id'),
      onError: () => console.log(errors)
    });
  }

  return (
    <div className="px-6 py-6">
      <div className="mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <UserBasicInformation action="Update" errors={errors} formData={data} tenants={tenants} roles={roles} handleInputChange={handleInputChange} />
            </div>
          </div>
          <ActionButton backLink="/user" />
        </form>
      </div>
    </div>
  );

}