import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, BuyerData, DiscountData, Filter, TenantData } from "@/types";
import { Head } from "@inertiajs/react";
import BuyerHeader from "./buyer/buyer-header";
import BuyerTable from "./buyer/buyer-table";
import SearchHeader from "@/components/ui/search-header";
import { Pagination } from "@/components/ui/pagination";

interface BuyerProps {
  buyers: BuyerData;
  tenants: TenantData;
  discounts: DiscountData;
  filters: Filter;
  route_name: string;
}

export default function Buyer({ buyers, tenants, filters, route_name }: BuyerProps) {

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Buyer List',
      href: '/buyer/list'
    }
  ];



  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={'Buyer List'} />
      <BuyerHeader />
      <SearchHeader link={route_name} filters={filters} dropdowns={tenants.data} />
      <BuyerTable buyers={buyers.data} />
      <Pagination link={route_name} filters={filters} pagination={buyers.meta} data={buyers.data} />
    </AppLayout>
  );
}