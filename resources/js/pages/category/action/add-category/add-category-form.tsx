import { FormCategory, Tenant } from "@/types";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import ActionButton from "@/components/action-button";
import CategoryBasicInformation from "../category-basic-information";


type FormCategoryKey = keyof FormCategory;

interface AddCategoryFormProps {
  tenants?: Tenant[];
}

export default function AddCategoryForm({ tenants }: AddCategoryFormProps) {
  const { data, setData, post, reset, errors, clearErrors } = useForm<FormCategory>({
    name: '',
    tenant_id: '',
  });


  const handleInputChange = (field: FormCategoryKey, value: string | number | null) => {
    setData((prev: FormCategory) => {
      const updated = { ...prev, [field as FormCategoryKey]: value };

      Object.entries(updated)
        .map(clear => clearErrors(clear[1].length > 0 ? clear[0] : 0));

      return updated;
    });

  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('category.store'), {
      onSuccess: () => reset('name', 'tenant_id'),
      onError: () => console.log(errors)
    });
  }

  return (
    <div className="px-6 py-6">
      <div className="mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <CategoryBasicInformation action="Add" errors={errors} formData={data} tenants={tenants} handleInputChange={handleInputChange} />
            </div>
          </div>

          <ActionButton backLink="/category" />
        </form>
      </div>
    </div>
  );

}