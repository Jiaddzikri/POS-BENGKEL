import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApi } from '@/hooks/use-api';
import { CartItem, Customer, ItemList } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';
import { router } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import { CreditCard, Minus, Phone, Plus, Receipt, ShoppingCart, Smartphone, Trash2, User, Wallet } from 'lucide-react';
import React, { MouseEvent, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from './ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';

interface OrderCartProps {
  setCashReceived: (param: string) => void;
  clearCart: () => void;
  cashReceived: string;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  submitOrder: (e: MouseEvent<HTMLButtonElement>, closePaymentModal: any, customerData?: Customer) => void;
  items: ItemList[];
  addCustomerData: (customerData?: Customer) => void;
  handlePaymentMethod: (method?: string) => void;
  discount: number;
  handleDiscountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function OrderCart({
  items,
  submitOrder,
  setCashReceived,
  clearCart,
  cashReceived,
  discount,
  cart,
  setCart,
  addCustomerData,
  handlePaymentMethod,
  handleDiscountChange,
}: OrderCartProps) {
  const path = window.location.pathname.split('/');
  const orderId = path[path.length - 1];
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [isPaymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [isSearchingCustomer, setIsSearchingCustomer] = useState<boolean>(false);
  const [customerFound, setCustomerFound] = useState<boolean>(false);

  const subtotal: number = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount: number = subtotal * (discount / 100);
  const total: number = subtotal - discountAmount;
  const change: number = cashReceived ? parseInt(cashReceived) - total : 0;

  const [findBuyer, { isLoading: buyerLoading, error: buyerError, data: buyerData }] = useApi<Customer>();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (customerPhone.length >= 10) {
        findBuyer(`/api/buyer?phone_number=${customerPhone}`);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [customerPhone]);

  useEffect(() => {
    if (buyerData) {
      setCustomerFound(true);
      setCustomerName(buyerData.name || '');
    } else {
      setCustomerFound(false);
      setCustomerName('');
    }
  }, [buyerData]);

  useEffect(() => {
    handlePaymentMethod(paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    addCustomerData({ phone_number: customerPhone, name: customerName });
  }, [customerName, customerPhone]);

  const handleCustomerPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setCustomerPhone(phone);
  };

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (customerFound) return;

    const name = e.target.value;
    setCustomerName(name);
  };

  const resetCustomerData = () => {
    setCustomerPhone('');
    setCustomerName('');
    setCustomerFound(false);
    setIsSearchingCustomer(false);
  };

  const canAddMoreQuantity = (sku: string): boolean => {
    const findItem: ItemList | undefined = items.find((i) => i.sku === sku);

    if (!findItem) return false;

    return findItem.stock > 0;
  };

  const getCurrentStock = (sku: string): number => {
    const findItem: ItemList | undefined = items.find((i) => i.sku === sku);

    if (!findItem) return 0;

    return findItem.stock;
  };

  const debouncedUpdateStock = useDebouncedCallback((item: ItemList) => {
    router.put(route('order.put.detail.quantity', { orderId: orderId }), {
      item_id: item.item_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      price_at_sale: item.price,
    });
  }, 500);

  const updateQuantity = (sku: string, change: number): void => {
    if (change > 0 && !canAddMoreQuantity(sku)) return;

    const newCart = cart
      .map((c) => {
        if (c.sku === sku) {
          const newQuantity = c.quantity + change;
          return newQuantity > 0 ? { ...c, quantity: newQuantity } : c;
        }
        return c;
      })
      .filter((item) => item.quantity > 0);

    setCart(newCart);

    const updatedItem = newCart.find((item) => item.sku === sku);
    if (updatedItem) {
      debouncedUpdateStock(updatedItem);
    }
  };

  const holdOrder = () => {
    router.put(route('order.hold', { orderId: orderId }), {
      discount: discount,
    });
  };

  const removeFromCart = (sku: string): void => {
    const findItem = cart.find((item) => item.sku === sku);
    setCart(cart.filter((c) => c.sku !== sku));

    router.delete(
      route('order.detail.delete', {
        orderId: orderId,
        variantId: findItem?.variant_id,
      }),
    );
  };

  const showPaymentModal = () => {
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    resetCustomerData();
  };

  const handleCashReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = getRawNumber(e.target.value);
    setCashReceived(value);
  };

  const handleSubmitOrder = (e: MouseEvent<HTMLButtonElement>) => {
    submitOrder(e, closePaymentModal);
  };

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Tunai',
      icon: Wallet,
      description: 'Pembayaran cash',
      color: 'bg-green-500',
    },
    {
      id: 'qris',
      name: 'QRIS',
      icon: Smartphone,
      description: 'Scan QR Code',
      color: 'bg-blue-500',
    },
  ];

  return (
    <>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                <ShoppingCart className="h-10 w-10" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Keranjang Kosong</h3>
              <p className="text-sm">Pilih produk untuk memulai transaksi</p>
            </div>
          </div>
        ) : (
          cart.map((item: CartItem, index: number) => {
            const canAddMore = canAddMoreQuantity(item.sku);
            const currentStock = getCurrentStock(item.sku);

            return (
              <div key={item.sku} className="group rounded-xl border p-4 transition-all duration-200 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="text-lg font-bold text-blue-600">{item.variant_name.charAt(0).toUpperCase()}</div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-semibold">{item.variant_name}</h4>
                        <p className="text-xs font-medium">SKU: {item.sku}</p>
                        {/* Stock indicator */}
                        <p className="text-xs text-gray-500">
                          Stock tersedia: {currentStock}
                          {!canAddMore && <span className="ml-1 text-red-500">(Habis)</span>}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.sku)}
                        className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                        type="button"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="mt-1 font-bold text-green-600">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-lg border p-1">
                    <button
                      onClick={() => updateQuantity(item.sku, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white shadow-sm transition-colors active:scale-95"
                      type="button"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="mx-2 min-w-[24px] text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.sku, 1)}
                      disabled={!canAddMore}
                      className={`flex h-7 w-7 items-center justify-center rounded-md shadow-sm transition-colors active:scale-95 ${
                        !canAddMore ? 'cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                      type="button"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                    <p className="text-xs">
                      {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {cart.length > 0 && (
        <div className="border-t p-4">
          <Input
            type="number"
            placeholder="Diskon %"
            value={discount || ''}
            onChange={handleDiscountChange}
            className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            min="0"
            max="100"
          />

          <div className="mb-4 rounded-lg p-4 shadow-sm">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} item):</span>
                <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Diskon ({discount}%):</span>
                  <span className="font-medium">-Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total:</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Dialog open={isPaymentModalOpen} onOpenChange={setPaymentModalOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={showPaymentModal}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                  type="button"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-semibold">Bayar Sekarang</span>
                    <span className="ml-2 text-sm opacity-90">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md overflow-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Proses Pembayaran
                  </DialogTitle>
                  <DialogClose></DialogClose>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-3 rounded-xl border p-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <User className="h-4 w-4" />
                      Informasi Customer
                    </h3>

                    <div>
                      <Label className="mb-2 block text-sm font-medium">Nomor Telepon</Label>
                      <div className="relative">
                        <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          type="tel"
                          value={customerPhone}
                          onChange={handleCustomerPhoneChange}
                          className="w-full rounded-lg py-2.5 pr-10 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          placeholder="08xxxxxxxxxx"
                        />
                        {isSearchingCustomer && (
                          <div className="absolute top-1/2 right-3 -translate-y-1/2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block text-sm font-medium">Nama Customer</Label>
                      <div className="relative">
                        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          type="text"
                          value={customerName}
                          onChange={handleCustomerNameChange}
                          className={`w-full rounded-lg border py-2 pr-3 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                            customerFound ? 'border-green-300' : ''
                          }`}
                          placeholder="Masukkan nama customer"
                          disabled={customerFound}
                        />
                        {customerFound && (
                          <div className="absolute top-1/2 right-3 -translate-y-1/2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 8 8">
                                <path d="M6.5 0l-.5.5-2 2-1-1-.5-.5-1 1 .5.5 1.5 1.5.5.5.5-.5 2.5-2.5.5-.5-1-1z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      {customerFound && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                          <div className="h-1 w-1 rounded-full bg-green-500" />
                          Customer ditemukan di database
                        </p>
                      )}
                    </div>
                  </div>

                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Metode Pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {paymentMethods.map((method) => {
                          const IconComponent = method.icon;
                          return (
                            <SelectItem key={method.id} value={method.id}>
                              <div className="flex items-center gap-3">
                                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-white ${method.color}`}>
                                  <IconComponent className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <div className="font-medium">{method.name}</div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="rounded-xl border p-4">
                    <h3 className="mb-3 font-semibold">Ringkasan Pembayaran</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Subtotal:</span>
                        <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex items-center justify-between text-sm text-green-600">
                          <span>Diskon ({discount}%):</span>
                          <span className="font-medium">-Rp {discountAmount.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between border-t pt-2 text-lg font-bold">
                        <span>Total Bayar:</span>
                        <span>Rp {total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    {discount > 0 && (
                      <div className="mb-2 flex items-center justify-between text-green-600">
                        <span>Diskon ({discount}%):</span>
                        <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                  </div>

                  <div className="borderp-4 rounded-xl">
                    <Label className="mb-2 block text-sm font-medium">Uang Diterima</Label>
                    <Input
                      type="text"
                      value={numberFormat(Number(cashReceived))}
                      onChange={handleCashReceivedChange}
                      className="w-full rounded-lg px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Masukkan jumlah uang"
                    />
                    {change > 0 && (
                      <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm font-medium text-green-700">Kembalian: Rp {change.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    )}
                    {change < 0 && cashReceived && (
                      <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-sm font-medium text-red-700">Uang kurang: Rp {Math.abs(change).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={closePaymentModal} variant="outline" className="flex-1 rounded-lg border-gray-300 py-2.5" type="button">
                      Batal
                    </Button>
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={parseInt(cashReceived) < total || parseInt(cashReceived) == 0 || cashReceived == ''}
                      className="flex-1 rounded-lg bg-green-600 py-2.5 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                      type="submit"
                    >
                      Proses Bayar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={clearCart}
                className="rounded-lg border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
                type="button"
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Clear All
              </Button>
              <Button
                className="rounded-lg border border-blue-200 bg-blue-50 py-2.5 text-sm font-medium text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100"
                type="button"
                onClick={holdOrder}
              >
                <Receipt className="mr-1.5 h-4 w-4" />
                Hold
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
