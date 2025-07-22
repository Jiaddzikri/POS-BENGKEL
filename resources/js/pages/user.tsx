import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Filter, Tenant, UserData } from "@/types";
import CategoryHeader from "./category/category-header";
import { Head } from "@inertiajs/react";
import SearchHeader from "@/components/ui/search-header";
import { Pagination } from "@/components/ui/pagination";

interface UserProps {
  users: UserData;
  tenants: Tenant[];
  filters: Filter;
  route_name: string;
}

export default function User({ route_name, filters, tenants, users }: UserProps) {

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'User Management',
      href: '/user'
    }
  ];


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={'Category Management'} />
      <CategoryHeader />
      <SearchHeader link={route_name} filters={filters} dropdowns={tenants} />
      {/* <CategoryTable categories={users.data} /> */}
      <Pagination link={route_name} filters={filters} pagination={users.meta} data={users.data} />
    </AppLayout>
  );
}