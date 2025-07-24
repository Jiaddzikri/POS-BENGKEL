import SearchHeader from '@/components/ui/search-header';
import TenantHeader from './tenant/tenant-header';
import TenantTable from './tenant/tenant-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DropdownData, Filter, TenantData } from '@/types';
import { Head } from '@inertiajs/react';
import { Pagination } from '@/components/ui/pagination';

interface TenantProps {
  tenants: TenantData;
  status: DropdownData[];
  route_name: string;
  filters: Filter;
}

export default function Tenant({ tenants, filters, route_name, status }: TenantProps) {

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
      <SearchHeader link={route_name} filters={filters} dropdowns={status} />
      <TenantTable tenants={tenants.data} />
      <Pagination link={route_name} filters={filters} pagination={tenants.meta} data={tenants.data} />
    </AppLayout>
  );
}
