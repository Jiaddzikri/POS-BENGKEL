import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, FormBuyer, Tenant } from "@/types";
import { Head } from "@inertiajs/react";
import FormHeader from "@/components/form-header";
import UpdateBuyerForm from "./update-buyer/update-buyer-form";

interface UpdateBuyerProps {
  tenants: Tenant[];
  buyer: FormBuyer;
}

export default function UpdateBuyer({ tenants, buyer }: UpdateBuyerProps) {

  const breadcrumbs: BreadcrumbItem[] = [

    {
      title: "Buyer List",
      href: '/buyer/list'
    },
    {
      title: 'Update Category',
      href: '/buyer/id/edit'
    }
  ];


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Update Buyer" />
      <FormHeader title="Update buyer" subTitle="Update a buyer" />
      <UpdateBuyerForm tenants={tenants} buyer={buyer} />
    </AppLayout>
  )
}