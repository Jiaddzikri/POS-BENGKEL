import { FormDiscount, Tenant } from "@/types";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import ActionButton from "@/components/action-button";
import DiscountBasicInformation from "../discount-basic-information";


type FormDiscountKey = keyof FormDiscount;

interface UpdateDiscountFormProps {
  discount: FormDiscount;
  tenants: Tenant[];
}

export default function UpdateDiscountForm({ discount, tenants }: UpdateDiscountFormProps) {

  const { data, setData, put, reset, errors, clearErrors } = useForm<FormDiscount>({
    id: discount.id,
    name: discount.name || '',
    desc: discount.desc || '',
    discount_percent: discount.discount_percent || 0,
    active: discount.active || false,
    tenant_id: discount.tenant_id
  });


  const handleInputChange = (field: FormDiscountKey, value: string | number | null) => {
    setData((prev: FormDiscount) => {
      const updated = { ...prev, [field as FormDiscountKey]: value };

      Object.entries(updated)
        .map(clear => clearErrors(clear[1].length > 0 ? clear[0] : 0));

      return updated;
    });

  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    put(route('discount.update', data.id), {
      onSuccess: () => reset('name', 'desc', 'discount_percent', 'active', 'tenant_id'),
      onError: () => console.log(errors)
    });
  }

  return (
    <div className="px-6 py-6">
      <div className="mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <DiscountBasicInformation action="Update" errors={errors} formData={data} tenants={tenants} handleInputChange={handleInputChange} />
            </div>
          </div>
          <ActionButton backLink="/discount" />
        </form>
      </div>
    </div>
  );

}