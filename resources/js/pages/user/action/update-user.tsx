import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, FormUser, Tenant } from "@/types";
import { Head } from "@inertiajs/react";
import FormHeader from "@/components/form-header";
import UpdateUserForm from "./update-user/update-user-form";

interface UpdateUserProps {
  tenants: Tenant[];
  roles: string[];
  user: FormUser;
}

export default function UpdateUser({ user, tenants, roles }: UpdateUserProps) {

  const breadcrumbs: BreadcrumbItem[] = [

    {
      title: "User Management",
      href: '/user'
    },
    {
      title: 'Update User',
      href: '/user/id/edit'
    }
  ];


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Update User" />
      <FormHeader title="Update User" subTitle="Update a user" />
      <UpdateUserForm user={user} tenants={tenants} roles={roles} />
    </AppLayout>
  )
}