import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Status } from '@/types';
import { Head } from '@inertiajs/react';
import AddTenantForm from './add-tenant/add-tenant-form';
import FormHeader from '@/components/form-header';


interface AddTenantProps {
  status: Status[];
}


export default function AddTenant({ status }: AddTenantProps) {

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Tenant Management',
      href : '/tenant',
    },
    {
      title: 'Add Tenant',
      href: '/tenant/create',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Tenant" />
      <FormHeader title="Add new store" subTitle="Create a new store" />
      <AddTenantForm status={status} />
    </AppLayout>
  );
}
