import SearchHeader from '@/components/ui/search-header';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DropdownData, Filter, TenantData } from '@/types';
import { Head } from '@inertiajs/react';
import { Pagination } from '@/components/ui/pagination';
import SuperListHeader from './super-list-header';
import SuperListTable from './super-list-table';

interface SuperItemListProps {
  tenants: TenantData;
  status: DropdownData[];
  route_name: string;
  filters: Filter;
  bread_crumbs: BreadcrumbItem[]
  title: string;
  route: string;
}

export default function SuperList({ tenants, filters, route_name, status, bread_crumbs, title, route }: SuperItemListProps) {


  const breadcrumbs: BreadcrumbItem[] = bread_crumbs.map(item => ({
    title: item.title,
    href: item.href,
  }));


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />
      <SuperListHeader />
      <SearchHeader link={route_name} filters={filters} dropdowns={status} />
      <SuperListTable tenants={tenants.data} route={route} />
      <Pagination link={route_name} filters={filters} pagination={tenants.meta} data={tenants.data} />
    </AppLayout>
  );
}
