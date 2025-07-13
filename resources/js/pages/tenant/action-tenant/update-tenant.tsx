import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, FormTenant, Status } from "@/types";
import { Head } from "@inertiajs/react";
import UpdateTenantForm from "./update-tenant/update-tenant-form";
import FormHeader from "@/components/form-header";

interface UpdateTenantProps {
  status: Status[];
  tenant: FormTenant;
}

export default function UpdateTenant({ status, tenant }: UpdateTenantProps) {

  const breadcrumbs: BreadcrumbItem[] = [

    {
      title: "Tenant Management",
      href: '/tenant'
    },
    {
      title: 'Update Tenant',
      href: 'tenant/id/edit'
    }

  ];


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Update Tenant" />
      <FormHeader title="Update store" subTitle="Update a store" />
      <UpdateTenantForm status={status} tenant={tenant} />
    </AppLayout>
  )
}