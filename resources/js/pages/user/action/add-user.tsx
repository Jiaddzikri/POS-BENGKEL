import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DropdownData, Tenant } from '@/types';
import { Head } from '@inertiajs/react';
import FormHeader from '@/components/form-header';
import AddUserForm from './add-user/add-user-form';

interface AddUserProps {
  tenants?: Tenant[];
  roles: DropdownData[];
}

export default function AddUser({ tenants, roles }: AddUserProps) {

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'User Management',
      href: '/user',
    },
    {
      title: 'Add User',
      href: '/user/create',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add User" />
      <FormHeader title="Add new user" subTitle="Create a new user" />
      <AddUserForm tenants={tenants} roles={roles} />
    </AppLayout>
  );
}
