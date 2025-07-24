import { FormTenant, Status } from "@/types";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import ActionButton from "@/components/action-button";
import TenantBasicInformation from "../tenant-basic-information";


type FormTenantKey = keyof FormTenant;

interface UpdateTenantFormProps {
  tenant?: FormTenant;
  status: Status[];
}

export default function UpdateTenantForm({ tenant, status }: UpdateTenantFormProps) {

  const { data, setData, put, reset, errors, clearErrors } = useForm<FormTenant>({
    id: tenant?.id,
    name: tenant?.name || '',
    status: tenant?.status || '',
  });


  const handleInputChange = (field: FormTenantKey, value: string | number | null) => {
    setData((prev: FormTenant) => {
      const updated = { ...prev, [field as FormTenantKey]: value };

      Object.entries(updated)
        .map(clear => clearErrors(clear[1].length > 0 ? clear[0] : 0));

      return updated;
    });


  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    put(route('tenant.update', data.id), {
      onSuccess: () => reset('name', 'status')
      ,
      onError: () => console.log(errors)
    });
  }

  return (
    <div className="px-6 py-6">
      <div className="mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <TenantBasicInformation action="Update" errors={errors} formData={data} status={status} handleInputChange={handleInputChange}/>
            </div>
          </div>
          <ActionButton backLink="/tenant"/>
        </form>
      </div>
    </div>
  );

}