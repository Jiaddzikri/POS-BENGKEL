import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TenantList } from '@/types';
import { Head } from '@inertiajs/react';
import FormHeader from '@/components/form-header';
import AddCategoryForm from './add-category/add-category-form';

interface AddCategoryProps {
  tenants: TenantList[]
}

export default function AddCategory({ tenants }: AddCategoryProps) {

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Category Management',
      href: '/category',
    },
    {
      title: 'Add Category',
      href: '/category/create',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Category" />
      <FormHeader title="Add new category" subTitle="Create a new category" />
      <AddCategoryForm tenants={tenants}/>
    </AppLayout>
  );
}
