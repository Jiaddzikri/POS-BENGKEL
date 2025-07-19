import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, FormCategory, TenantList } from "@/types";
import { Head } from "@inertiajs/react";
import FormHeader from "@/components/form-header";
import UpdateCategoryForm from "./update-category/update-category-form";

interface UpdateCategoryProps {
  tenants: TenantList[];
  category: FormCategory;
}

export default function UpdateCategory({ tenants, category }: UpdateCategoryProps) {

  const breadcrumbs: BreadcrumbItem[] = [

    {
      title: "Tenant Management",
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