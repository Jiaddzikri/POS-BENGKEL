import TenantHeader from './tenant/tenant-header';
import TenantTable from './tenant/tenant-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TenantData } from '@/types';
import { Head } from '@inertiajs/react';

interface TenantProps {
  tenants: TenantData;
}

export default function Tenant({ tenants }: TenantProps) {

  const title: string = 'Tenant Management';
  const link: string = '/tenant';

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: title,
      href: link,
    },
  ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />
      <TenantHeader />
      <TenantTable tenants={tenants.data} />
    </AppLayout>
  );
}
