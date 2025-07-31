import { FormBuyer, Tenant } from "@/types";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import ActionButton from "@/components/action-button";
import BuyerBasicInformation from "../buyer-basic-information";


type FormBuyerKey = keyof FormBuyer;

interface UpdateBuyerFormProps {
  buyer: FormBuyer;
  tenants: Tenant[];
}

export default function UpdateBuyerForm({ buyer, tenants }: UpdateBuyerFormProps) {

  const { data, setData, put, reset, errors, clearErrors } = useForm<FormBuyer>({
    id: buyer.id,
    name: buyer.name || '',
    phone_number: buyer.phone_number || '',
    tenant_id: buyer.tenant_id || '',
  });


  const handleInputChange = (field: FormBuyerKey, value: string | number | null) => {
    setData((prev: FormBuyer) => {
      const updated = { ...prev, [field as FormBuyerKey]: value };

      Object.entries(updated)
        .map(clear => clearErrors(clear[1].length > 0 ? clear[0] : 0));

      return updated;
    });


  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    put(route('buyer.update', data.id), {
      onSuccess: () => reset('name', 'phone_number', 'tenant_id'),
      onError: () => console.log(errors)
    });
  }

  return (
    <div className="px-6 py-6">
      <div className="mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <BuyerBasicInformation action="Update" errors={errors} formData={data} tenants={tenants} handleInputChange={handleInputChange} />
            </div>
          </div>
          <ActionButton backLink="/category" />
        </form>
      </div>
    </div>
  );

}