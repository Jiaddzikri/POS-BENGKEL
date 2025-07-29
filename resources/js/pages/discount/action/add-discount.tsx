import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Tenant } from '@/types';
import { Head } from '@inertiajs/react';
import FormHeader from '@/components/form-header';
import AddDiscountForm from './add-discount/add-discount-form';

interface AddDiscountProps {
  tenants: Tenant[];
}

export default function AddDiscount({ tenants }: AddDiscountProps) {

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Discount Management',
      href: '/discount',
    },
    {
      title: 'Add Discount',
      href: '/discount/create',
    },
  ];


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Discount" />
      <FormHeader title="Add new discount" subTitle="Create a new discount" />
      <AddDiscountForm tenants={tenants}/>
    </AppLayout>
  );
}
