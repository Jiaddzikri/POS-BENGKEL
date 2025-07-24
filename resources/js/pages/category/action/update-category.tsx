import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, FormCategory, Tenant } from "@/types";
import { Head } from "@inertiajs/react";
import FormHeader from "@/components/form-header";
import UpdateCategoryForm from "./update-category/update-category-form";

interface UpdateCategoryProps {
  tenants: Tenant[];
  category: FormCategory;
}

export default function UpdateCategory({ tenants, category }: UpdateCategoryProps) {

  const breadcrumbs: BreadcrumbItem[] = [

    {
      title: "Category Management",
      href: '/category'
    },
    {
      title: 'Update Category',
      href: '/category/id/edit'
    }
  ];


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Update Tenant" />
      <FormHeader title="Update category" subTitle="Update a category" />
      <UpdateCategoryForm tenants={tenants} category={category} />
    </AppLayout>
  )
}