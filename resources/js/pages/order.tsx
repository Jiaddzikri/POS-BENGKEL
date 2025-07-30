import { OrderCart } from '@/components/order-cart';
import CashierHeader from '@/components/order-header';
import CashierListItem from '@/components/order-list-item';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { CartItem, Customer, Discount, DiscountData, ItemData, ItemList, OrderItemForm } from '@/types';
import { } from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';

import React, { MouseEvent, useEffect, useState } from 'react';

interface CashierProps {
  items: ItemData;
  discounts: DiscountData;
}

export default function Order({ items, discounts }: CashierProps) {
  const path = window.location.pathname.split('/');
  const orderId = path[path.length - 1];

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalAfterOrderOpen, setModalAfterOrder] = useState<boolean>(false);

  const { data, setData, post } = useForm({
    items: [] as OrderItemForm[],
    phone_number: '' as string | undefined,
    name: '' as string | undefined,
    amount_paid: 0 as number,
    // discount: {} as Discount | undefined,
    // discount: 0 as number,
  });

  console.log(data);

  const [cashReceived, setCashReceived] = useState<string>('');

  const addToCart = (item: ItemList): void => {
    if (item.stock === 0) return;
    const existingItem = cart.find((c) => c.sku === item.sku);
    if (existingItem) {
      setCart(cart.map((c) => (c.sku === item.sku ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const addCustomerData = (customerData?: Customer): void => {
    setData('phone_number', customerData?.phone_number || '');
    setData('name', customerData?.name || '');
  };

  // const handleDiscountSelectChange = (value: string): void => {

  //   const findDiscount: Discount | undefined = discounts.data.find(dsc => dsc.id === value);

  //   // setData('discount', Math.max(0, Math.min(100, findDiscount?.discount_percent ?? 0)));

  //   setData('discount', findDiscount);

  // }

  // const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   const value = parseInt(e.target.value) || 0;
  //   setData('discount', Math.max(0, Math.min(100, value)));
  // };

  const handlePaymentMethod = (method?: string): void => {
    setData('payment_method', method || 'cash');
  };

  const clearCart = () => {
    setCart([]);
    setData('discount', 0);
    setCashReceived('');
  };

  const submitOrder = (e: MouseEvent<HTMLButtonElement>, closePaymentModal: any, customerData?: Customer) => {
    e.preventDefault();

    post(route(`order.process`, { orderId: orderId }), {
      onSuccess: (response) => {
        closePaymentModal();
        openModalAfterOrder();
      },
    });
  };

  const openModalAfterOrder = () => {
    setModalAfterOrder(true);
  };

  const handleDownloadReceipt = async () => {
    try {
      const response = await fetch(route('receipt.download', { orderId: orderId }));

      if (!response.ok) {
        throw new Error('Gagal mengunduh struk dari server.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `struk-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Gagal mengunduh file.');
    }
  };

  useEffect(() => {
    const items: OrderItemForm[] = [];
    cart.map((c) => {
      const item: OrderItemForm = {
        item_id: c.item_id,
        variant_item_id: c.variant_id,
        quantity: c.quantity,
        price_at_sale: c.price,
      };

      items.push(item);
    });

    setData('items', items);
  }, [cart]);

  useEffect(() => {
    setData('amount_paid', parseInt(cashReceived));
  }, [cashReceived]);
  return (
    <AppLayout>
      <Head title="Cashier" />
      <div className="min-h-screen">
        <div className="flex h-screen">
          <div className="flex-1 overflow-y-auto p-6">
            <CashierHeader addToCart={addToCart} />
            <CashierListItem addToCart={addToCart} items={items.data} />
          </div>
          <div className="flex w-96 flex-col border-l">
            <OrderCart
              handlePaymentMethod={handlePaymentMethod}
              setCashReceived={setCashReceived}
              clearCart={clearCart}
              discount={data.discount}
              cart={cart}
              setCart={setCart}
              cashReceived={cashReceived}
              handleDiscountSelectChange={handleDiscountSelectChange}
              submitOrder={submitOrder}
              items={items.data}
              discounts={discounts.data}
              addCustomerData={addCustomerData}
            />
          </div>
        </div>
        <AlertDialog open={isModalAfterOrderOpen} onOpenChange={setModalAfterOrder}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Lanjut membuat order?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => router.get(route('dashboard'))}>Cancel</AlertDialogCancel>

              <Button variant="outline" onClick={handleDownloadReceipt}>
                Download Struk
              </Button>

              <AlertDialogAction onClick={() => router.get(route('order.post'))}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
