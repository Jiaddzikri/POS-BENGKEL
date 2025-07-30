import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, CategoryData, Filter, TenantData } from "@/types";
import CategoryHeader from "./category/category-header";
import { Head } from "@inertiajs/react";
import CategoryTable from "./category/category-table";
import SearchHeader from "@/components/ui/search-header";
import { Pagination } from "@/components/ui/pagination";

interface CategoryProps {
  categories: CategoryData;
  tenants: TenantData;
  filters: Filter;
  route_name: string;
}

export default function Category({ categories, tenants, filters, route_name }: CategoryProps) {

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Category Management',
      href: '/category'
    }
  ];


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={'Category Management'} />
      <CategoryHeader />
      <SearchHeader link={route_name} filters={filters} dropdowns={tenants.data} />
      <CategoryTable categories={categories.data} />
      <Pagination link={route_name} filters={filters} pagination={categories.meta} data={categories.data} />
    </AppLayout>
  );
}