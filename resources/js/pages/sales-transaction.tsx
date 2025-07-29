import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Filter, SalesTransactionData, Tenant } from "@/types";
import { Head } from "@inertiajs/react";
import SearchHeader from "@/components/ui/search-header";
import { Pagination } from "@/components/ui/pagination";
import SalesTransactionHeader from "./sales-transaction/sales-transaction-header";
import SalesTransactionTable from "./sales-transaction/sales-transaction-table";

interface SalesProps {
  sales_transactions: SalesTransactionData;
  tenants: Tenant[];
  filters: Filter;
  route_name: string;
}

export default function Sales({ route_name, filters, tenants, sales_transactions }: SalesProps) {

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Sales Management',
      href: '/sales'
    }
  ];


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={'Sales Management'} />
      <SalesTransactionHeader />

      <SearchHeader link={route_name} filters={filters} dropdowns={tenants} />

      <SalesTransactionTable sales_transaction={sales_transactions.data} />

      <Pagination link={route_name} filters={filters} pagination={sales_transactions.meta} data={sales_transactions.data} />
    </AppLayout>
  );
}