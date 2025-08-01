import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Filter, TenantData, UserData } from "@/types";
import { Head } from "@inertiajs/react";
import SearchHeader from "@/components/ui/search-header";
import { Pagination } from "@/components/ui/pagination";
import UserHeader from "./user/user-header";
import UserTable from "./user/user-table";

interface UserProps {
  users: UserData;
  tenants?: TenantData;
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
      <Head title={'User Management'} />
      <UserHeader />
      <SearchHeader link={route_name} filters={filters} dropdowns={tenants?.data ?? []} />
      <UserTable users={users.data} />
      <Pagination link={route_name} filters={filters} pagination={users.meta} data={users.data} />
    </AppLayout>
  );
}