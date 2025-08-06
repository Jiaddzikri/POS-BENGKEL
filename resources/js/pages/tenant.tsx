import SearchHeader from '@/components/ui/search-header';
import TenantHeader from './tenant/tenant-header';
import TenantTable from './tenant/tenant-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DropdownData, Filter, PageProps, TenantData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Pagination } from '@/components/ui/pagination';

interface TenantProps {
  tenants: TenantData;
  status: DropdownData[];
  route_name: string;
  filters: Filter;
}

export default function Tenant({ tenants, filters, route_name, status }: TenantProps) {

  const { auth } = usePage<PageProps>().props;

  const title: string = 'Tenant Management';
  const link: string = '/tenant';

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: title,
      href: link,
    },
  ];


  return (

    (auth.user?.role !== 'super_admin' ? (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={title} />
        <TenantHeader role={auth.user?.role} />
        <SearchHeader link={route_name} filters={filters} dropdowns={status} />
        <TenantTable tenants={tenants.data} />
        <Pagination link={route_name} filters={filters} pagination={tenants.meta} data={tenants.data} />
      </AppLayout>
    ) : (
      <section className='mx-52 mt-14'>
        <TenantHeader role={auth.user?.role} />
        <SearchHeader link={route_name} filters={filters} dropdowns={status} />
        <TenantTable tenants={tenants.data} user={auth.user} />
        <Pagination link={route_name} filters={filters} pagination={tenants.meta} data={tenants.data} />
      </section>
    )
    ));
}
