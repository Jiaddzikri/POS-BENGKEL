import { OrderCart } from '@/components/order-cart';
import CashierHeader from '@/components/order-header';
import CashierListItem from '@/components/order-list-item';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { CartItem, Customer, ItemData, ItemList, OrderItemForm } from '@/types';
import {} from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';

import { CheckCircle, Plus, X } from 'lucide-react';
import React, { MouseEvent, useEffect, useState } from 'react';

interface CashierProps {
  items: ItemData;
}

export default function Order({ items }: CashierProps) {
  const path = window.location.pathname.split('/');
  const orderId = path[path.length - 1];

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalAfterOrderOpen, setModalAfterOrder] = useState<boolean>(false);

  const { data, setData, post } = useForm({
    items: [] as OrderItemForm[],
    phone_number: '' as string | undefined,
    name: '' as string | undefined,
    amount_paid: 0 as number,
  });

  const [cashReceived, setCashReceived] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);

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

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value) || 0;
    setDiscount(Math.max(0, Math.min(100, value)));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setCashReceived('');
  };

  const submitOrder = (e: MouseEvent<HTMLButtonElement>, closePaymentModal: any, customerData?: Customer) => {
    e.preventDefault();

    post(route(`order.process`, { orderId: orderId }), {
      onSuccess: () => {
        closePaymentModal();
        openModalAfterOrder();
      },
    });
  };

  const openModalAfterOrder = () => {
    setModalAfterOrder(true);
  };

  const createNewOrder = () => {
    router.get(route('order.post'));
  };

  const finishOrder = () => {
    router.get(route('dashboard'));
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
              setCashReceived={setCashReceived}
              clearCart={clearCart}
              discount={discount}
              cart={cart}
              setCart={setCart}
              cashReceived={cashReceived}
              handleDiscountChange={handleDiscountChange}
              submitOrder={submitOrder}
              items={items.data}
              addCustomerData={addCustomerData}
            />
          </div>
        </div>
        <Dialog open={isModalAfterOrderOpen} onOpenChange={setModalAfterOrder}>
          <DialogContent>
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <CheckCircle className="h-24 w-24 text-green-600" />
              </div>
              <DialogTitle className="text-xl font-semibold">Pesanan Berhasil Dibuat!</DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex w-full justify-center gap-2">
              <Button onClick={finishOrder} className="w-full bg-red-500 outline-none">
                <X className="h-4 w-4" />
                Selesai
              </Button>
              <Button type="button" onClick={createNewOrder} className="w-full border">
                <Plus className="h-4 w-4" />
                Buat Pesanan Lagi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
