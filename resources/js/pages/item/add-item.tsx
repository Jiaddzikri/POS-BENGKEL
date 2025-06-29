import AddItemHeader from '@/components/add-item-header';
import AppLayout from '@/layouts/app-layout';
import AddItemForm from '@/pages/item/add-item/add-item-form';
import { BreadcrumbItem, Category } from '@/types';
import { Head } from '@inertiajs/react';
import { Toaster } from 'sonner';

interface AddItemProps {
  categories: Category[];
}
export default function AddItem({ categories }: AddItemProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Item Management',
      href: '/item',
    },
    {
      title: 'Add Item',
      href: '/item/add',
    },
  ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Item" />
      <AddItemHeader />
      <AddItemForm categories={categories} />
      <Toaster />
    </AppLayout>
  );
}
