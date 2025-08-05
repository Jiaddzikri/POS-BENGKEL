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
import { CartItem, Customer, ItemData, ItemList, OrderCart as OrderCartType, OrderItemForm } from '@/types';
import {} from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';

import { MouseEvent, useEffect, useState } from 'react';

interface CashierProps {
  items: ItemData;
  discount: number;
  isOrderCompleted: boolean;
  isOrderHold: boolean;
  isOrderCancelled: boolean;
  orderDetail: OrderCartType;
}

export default function Order({ items, discount, isOrderCompleted, orderDetail, isOrderHold, isOrderCancelled }: CashierProps) {
  const path = window.location.pathname.split('/');
  const orderId = path[path.length - 1];

  const [cart, setCart] = useState<CartItem[]>(orderDetail.data);
  const [isOrderAlreadyProcessedModalOpen, setOrderAlreadyProcessedModal] = useState<boolean>(false);
  const [isOrderHoldModalOpen, setOrderHoldModal] = useState<boolean>(false);
  const [isOrderCancelledModalOpen, setOrderCancelledModal] = useState<boolean>(false);

  const { data, setData, post } = useForm({
    phone_number: '' as string | undefined,
    name: '' as string | undefined,
    amount_paid: 0 as number,
    discount: discount as number,
    payment_method: '' as string,
  });

  const [cashReceived, setCashReceived] = useState<string>('');

  const handleAddItem = (item: ItemList): void => {
    addToCart(item);

    router.post(route('order.post.detail', { orderId: orderId }), {
      item_id: item.item_id,
      variant_id: item.variant_id,
      quantity: 1,
      price_at_sale: item.price,
    });
  };

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
    setData('discount', Math.max(0, Math.min(100, value)));
  };

  const handlePaymentMethod = (method?: string): void => {
    setData('payment_method', method || 'cash');
  };

  const clearCart = () => {
    setCart([]);
    setData('discount', 0);
    setCashReceived('');

    router.delete(
      route('order.detail.clear', {
        orderId: orderId,
      }),
    );
  };

  const submitOrder = (e: MouseEvent<HTMLButtonElement>, closePaymentModal: any, customerData?: Customer) => {
    e.preventDefault();

    post(route(`order.process`, { orderId: orderId }), {
      onSuccess: () => {
        closePaymentModal();
      },
    });
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
    if (isOrderCompleted) {
      setOrderAlreadyProcessedModal(true);
    }
  }, [isOrderCompleted]);

  useEffect(() => {
    if (isOrderHold) {
      setOrderHoldModal(true);
    }
  }, [isOrderHold]);

  useEffect(() => {
    if (isOrderCancelled) {
      setOrderCancelledModal(true);
    }
  }, [isOrderCancelled]);

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
            <CashierHeader handleAddItem={handleAddItem} />
            <CashierListItem handleAddItem={handleAddItem} items={items.data} />
          </div>
          <div className="flex w-96 flex-col border-l">
            <OrderCart
              discount={data.discount}
              handlePaymentMethod={handlePaymentMethod}
              setCashReceived={setCashReceived}
              clearCart={clearCart}
              cart={cart}
              setCart={setCart}
              handleDiscountChange={handleDiscountChange}
              cashReceived={cashReceived}
              submitOrder={submitOrder}
              items={items.data}
              addCustomerData={addCustomerData}
            />
          </div>
        </div>
        <AlertDialog open={isOrderAlreadyProcessedModalOpen} onOpenChange={setOrderAlreadyProcessedModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="">Order Sudah Diproses</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="py-4">
              <p className="text-sm">
                Order dengan ID <strong>{orderId}</strong> sudah berhasil
              </p>
              <div className="mt-4 rounded-md border p-3">
                <p className="text-sm">
                  <strong>Status:</strong> {isOrderCompleted ? 'Completed' : 'failed'}
                </p>
              </div>
            </div>
            <AlertDialogFooter>
              <Button variant="outline" onClick={handleDownloadReceipt}>
                Download Struk
              </Button>
              <AlertDialogCancel onClick={() => router.get(route('dashboard'))}>Kembali ke Dashboard</AlertDialogCancel>
              <AlertDialogAction onClick={() => router.get(route('order.post'))}>Buat Order Baru</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isOrderHoldModalOpen} onOpenChange={setOrderHoldModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-yellow-600">Order Sedang Ditahan</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="py-4">
              <p className="text-sm">
                Order dengan ID <strong>{orderId}</strong> sedang dalam status hold
              </p>
              <div className="border-yellow- mt-4 rounded-md border p-3">
                <p className="text-sm">
                  <strong>Status:</strong> On Hold
                </p>
                <p className="mt-1 text-xs">Order ini dapat dilanjutkan atau dibatalkan</p>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => router.get(route('dashboard'))}>Kembali ke Dashboard</AlertDialogCancel>
              <Button variant="outline" onClick={() => setOrderHoldModal(false)}>
                Lanjutkan Order
              </Button>
              <AlertDialogAction onClick={() => router.get(route('order.post'))}>Buat Order Baru</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Modal Order Cancelled */}
        <AlertDialog open={isOrderCancelledModalOpen} onOpenChange={setOrderCancelledModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600">Order Dibatalkan</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="py-4">
              <p className="text-sm">
                Order dengan ID <strong>{orderId}</strong> telah dibatalkan
              </p>
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
                <p className="text-sm">
                  <strong>Status:</strong> Cancelled
                </p>
                <p className="mt-1 text-xs text-gray-600">Order ini dapat dipulihkan jika diperlukan</p>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => router.get(route('dashboard'))}>Kembali ke Dashboard</AlertDialogCancel>
              <Button variant="outline">Pulihkan Order</Button>
              <AlertDialogAction onClick={() => router.get(route('order.post'))}>Buat Order Baru</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
