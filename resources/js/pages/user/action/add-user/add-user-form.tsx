import { DropdownData, FormUser, Tenant } from "@/types";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import ActionButton from "@/components/action-button";
import UserBasicInformation from "../user-basic-information";


type FormUserKey = keyof FormUser;

interface AddUserFormProps {
  tenants: Tenant[];
  roles: DropdownData[];
}

export default function AddUserForm({ tenants, roles }: AddUserFormProps) {
  const { data, setData, post, reset, errors, clearErrors } = useForm<FormUser>({
    name: '',
    email: '',
    role: '',
    tenant_id: '',
    password: '',
    password_confirmation: '',
  });


  console.log(data);


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

    post(route('user.store'), {
      onSuccess: () => reset('name', 'email', 'password', 'password_confirmation', 'role', 'tenant_id'),
      onError: () => console.log(errors)
    });
  }

  return (
    <div className="px-6 py-6">
      <div className="mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <UserBasicInformation action="Add" errors={errors} formData={data} tenants={tenants} roles={roles} handleInputChange={handleInputChange} />
            </div>
          </div>

          <ActionButton backLink="/user" />
        </form>
      </div>
    </div>
  );

}