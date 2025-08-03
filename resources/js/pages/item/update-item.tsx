import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Category, Item, Variant } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { MouseEvent, useEffect, useState } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import AddVariant from './update-item/add-variant';
import BasicInformation from './update-item/basic-information';
import MainContent from './update-item/main-content';
import Sidebar from './update-item/sidebar';
import Status from './update-item/status';
import Submit from './update-item/submit';
import VariantContent from './update-item/variant';
import VariantList from './update-item/variant-list';

interface UpdateItemProps {
  categories: Category[];
  item: Item;
}

export default function UpdateItem({ categories, item }: UpdateItemProps) {
  const { data, setData, post, errors } = useForm<Item>({
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
    variants: item.variants,
    new_image: null,
  });

  const [variants, setVariants] = useState<Variant[]>(item.variants);

  const [showAddVariant, setShowAddVariant] = useState<boolean>(false);

  const {
    setData: setNewVariantData,
    data: newVariantData,
    post: postVariant,
    reset: resetVariantData,
  } = useForm<Variant>({
    name: '',
    minimum_stock: 0,
    stock: 0,
    additional_price: 0,
    sku: '',
  });

  const handleItemChange = (field: keyof Item, value: string | number | File): void => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (field: keyof Variant, value: string | number, id?: string): void => {
    setVariants((prev) => prev.map((variant) => (variant.id === id ? { ...variant, [field]: value } : variant)));
  };

  const handleAddVariant = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    postVariant(
      route('variant.post', {
        itemId: item.id,
      }),
      {
        onSuccess: () => {
          toast.success('sukses menambahkan variant baru');
        },
        onError: () => {
          toast.error('gagal menambahkan variant baru');
        },
        onFinish: () => {
          resetVariantData('name', 'minimum_stock', 'stock', 'additional_price', 'sku');
          setShowAddVariant(false);
        },
      },
    );
  };

  const handleDeleteVariant = (e: MouseEvent<HTMLButtonElement>, handleCloseDeleteModal: any, variantId?: string): void => {
    e.preventDefault();
    router.delete(
      route('variant.delete', {
        itemId: item.id,
        variantId: variantId,
      }),
      {
        onSuccess: () => {
          toast.success('sukses menghapus variant');
        },
        onError: () => {
          toast.error('gagal menghapus variant');
        },
        onFinish: () => {
          handleCloseDeleteModal();
        },
      },
    );
  };

  const handleUpdate = (e: MouseEvent<HTMLButtonElement>, closeModal: any): void => {
    post(route('item.update.put', { itemId: item.id }), {
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
      title: 'Add Item',
      href: '/item/add',
    },
  ];

  useEffect(() => {
    setData((prev) => ({ ...prev, variants: variants }));
  }, [variants]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Item" />
      <MainContent>
        <BasicInformation data={data} handleItemChange={handleItemChange} categories={categories} errors={errors} />
        <VariantContent setShowAddVariant={setShowAddVariant}>
          {showAddVariant && (
            <AddVariant
              newVariant={newVariantData}
              setShowAddVariant={setShowAddVariant}
              handleAddVariant={handleAddVariant}
              setNewVariant={setNewVariantData}
            />
          )}
          <VariantList errors={errors} variants={variants} handleVariantChange={handleVariantChange} handleDeleteVariant={handleDeleteVariant} />
        </VariantContent>

        <Sidebar>
          <Status data={data} handleItemChange={handleItemChange} />
          <Submit handleUpdate={handleUpdate} />
        </Sidebar>
        <Toaster />
      </MainContent>
    </AppLayout>
  );
}
