import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, FormDiscount, Tenant } from "@/types";
import { Head } from "@inertiajs/react";
import FormHeader from "@/components/form-header";
import UpdateDiscountForm from "./update-discount/update-discount-form";

interface UpdateDiscountProps {
  tenants: Tenant[];
  discount: FormDiscount;
}

export default function UpdateDiscount({ tenants, discount }: UpdateDiscountProps) {

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Discount Management",
      href: '/discount'
    },
    {
      title: 'Update Discount',
      href: '/discount/id/edit'
    }
  ];


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Update Discount" />
      <FormHeader title="Update discount" subTitle="Update a discount" />
      <UpdateDiscountForm tenants={tenants} discount={discount} />
    </AppLayout>
  )
}