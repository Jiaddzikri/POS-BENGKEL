import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, DiscountData, Filter, TenantData } from "@/types";
import { Head } from "@inertiajs/react";
import SearchHeader from "@/components/ui/search-header";
import { Pagination } from "@/components/ui/pagination";
import DiscountTable from "./discount/discount-table";
import DiscountHeader from "./discount/discount-header";

interface DiscountProps {
  discounts: DiscountData;
  tenants: TenantData;
  filters: Filter;
  route_name: string;
}

export default function Category({ discounts, tenants, filters, route_name }: DiscountProps) {

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Discount Management',
      href: '/discount'
    }
  ];
  

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={'Discount Management'} />
      <DiscountHeader />
      <SearchHeader link={route_name} filters={filters} dropdowns={tenants.data} />
      <DiscountTable discounts={discounts.data} />
      <Pagination link={route_name} filters={filters} pagination={discounts.meta} data={discounts.data} />
    </AppLayout>
  );
}