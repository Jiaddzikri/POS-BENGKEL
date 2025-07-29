import { FormDiscount, Tenant } from "@/types";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import ActionButton from "@/components/action-button";
import DiscountBasicInformation from "../discount-basic-information";


type FormDiscountKey = keyof FormDiscount;

interface AddDiscountFormProps {
  tenants: Tenant[];
}

export default function AddDiscountForm({ tenants }: AddDiscountFormProps) {
  const { data, setData, post, reset, errors, clearErrors } = useForm<FormDiscount>({
    name: '',
    desc: '',
    discount_percent: 0,
    tenant_id: ''
  });


  const handleInputChange = (field: FormDiscountKey, value: string | number | boolean) => {
    setData((prev: FormDiscount) => {
      const updated = { ...prev, [field as FormDiscountKey]: value };

      Object.entries(updated)
        .map(clear => clearErrors(clear[1].length > 0 ? clear[0] : 0));

      return updated;
    });

  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('discount.store'), {
      onSuccess: () => reset('name', 'desc', 'discount_percent', 'tenant_id'),
      onError: () => console.log(errors)
    });
  }

  return (
    <div className="px-6 py-6">
      <div className="mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <DiscountBasicInformation action="Add" errors={errors} formData={data} tenants={tenants} handleInputChange={handleInputChange} />
            </div>
          </div>

          <ActionButton backLink="/discount" />
        </form>
      </div>
    </div>
  );

}