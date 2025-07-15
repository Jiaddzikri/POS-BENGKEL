import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, CategoryData } from "@/types";
import CategoryHeader from "./category/category-header";
import { Head } from "@inertiajs/react";
import CategoryTable from "./category/category-table";

interface CategoryProps {
  categories: CategoryData;
}

export default function Category({ categories }: CategoryProps) {

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Category Management',
      href: '/category'
    }
  ];

  console.log(categories.data);


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={'Category Management'} />
      <CategoryHeader />
      <CategoryTable categories={categories.data} />
    </AppLayout>
  );
}