import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Category, Item } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { MouseEvent } from 'react';

import { Toaster } from '@/components/ui/sonner';
import BasicInformation from './update-item/basic-information';
import MainContent from './update-item/main-content';
import Sidebar from './update-item/sidebar';
import Status from './update-item/status';
import Submit from './update-item/submit';

interface UpdateItemProps {
  categories: Category[];
  item: Item;
}

export default function UpdateItem({ categories, item }: UpdateItemProps) {
  const { data, setData, put, errors } = useForm<Item>({
    id: item.id,
    item_name: item.item_name,
    brand: item.brand,
    category_id: item.category_id,
    purchase_price: item.purchase_price,
    selling_price: item.selling_price,
    is_active: item.is_active,
    status: item.status,
    image_path: item.image_path,
    description: item.description,
    part_number: item.part_number,
    uom: item.uom || 'Pcs',
    rack_location: item.rack_location,
    compatibility: item.compatibility || [],
    // Flat product fields
    sku: item.sku,
    stock: item.stock ?? 0,
    minimum_stock: item.minimum_stock ?? 0,
  });

  const handleItemChange = (field: keyof Item, value: string | number | File | string[]): void => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = (e: MouseEvent<HTMLButtonElement>, closeModal: any): void => {
    put(route('item.update', { item: item.id }), {
      onFinish: () => {
        closeModal();
      },
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Item Management',
      href: '/item',
    },
    {
      title: 'Edit Item',
      href: `/item/${item.id}/edit`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Item" />
      <MainContent>
        <BasicInformation data={data} handleItemChange={handleItemChange} categories={categories} errors={errors} />

        <Sidebar>
          <Status data={data} handleItemChange={handleItemChange} />
          <Submit handleUpdate={handleUpdate} />
        </Sidebar>
        <Toaster />
      </MainContent>
    </AppLayout>
  );
}
