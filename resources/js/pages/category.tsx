import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import CategoryHeader from "./category/category-header";
import { Head } from "@inertiajs/react";

export default function Category() {

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
    </AppLayout>
  );
}