import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApi } from '@/hooks/use-api';
import { CartItem, Customer, ItemList } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';
import { router } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  Minus,
  MonitorSmartphone,
  Phone,
  Plus,
  Receipt,
  ShoppingCart,
  Smartphone,
  Store,
  Trash2,
  User,
  UserPlus,
  Wallet,
} from 'lucide-react';
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
  handleOrderType: (type: 'online' | 'offline') => void;
  orderType: 'online' | 'offline';
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
  handleOrderType,
  orderType,
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
  // new: tracks whether a lookup has completed (for "not found" feedback)
  const [phoneLookedUp, setPhoneLookedUp] = useState<boolean>(false);
  // new: phone validation error
  const [phoneError, setPhoneError] = useState<string>('');
  // new: name validation error
  const [nameError, setNameError] = useState<string>('');

  const subtotal: number = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount: number = subtotal * (discount / 100);
  const total: number = subtotal - discountAmount;
  const change: number = cashReceived ? parseInt(cashReceived) - total : 0;

  const [findBuyer, { isLoading: buyerLoading, error: buyerError, data: buyerData }] = useApi<Customer>();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (customerPhone.length >= 10) {
        setIsSearchingCustomer(true);
        setPhoneLookedUp(false);
        findBuyer(`/api/buyer?phone_number=${customerPhone}`);
      } else {
        // reset feedback when phone is cleared / too short
        setPhoneLookedUp(false);
        setCustomerFound(false);
        setCustomerName('');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [customerPhone]);

  useEffect(() => {
    // Only process when not currently loading (i.e., the call finished)
    if (buyerLoading) return;
    setIsSearchingCustomer(false);
    if (customerPhone.length < 10) return;
    setPhoneLookedUp(true);
    if (buyerData) {
      setCustomerFound(true);
      setCustomerName(buyerData.name || '');
    } else {
      setCustomerFound(false);
      setCustomerName('');
    }
  }, [buyerData, buyerError, buyerLoading]);

  useEffect(() => {
    handlePaymentMethod(paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    addCustomerData({ phone_number: customerPhone, name: customerName });
  }, [customerName, customerPhone]);

  const handleCustomerPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setCustomerPhone(phone);
    if (phone) setPhoneError('');
  };

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (customerFound) return;

    const name = e.target.value;
    setCustomerName(name);
    if (name) setNameError('');
  };

  const resetCustomerData = () => {
    setCustomerPhone('');
    setCustomerName('');
    setCustomerFound(false);
    setIsSearchingCustomer(false);
    setPhoneLookedUp(false);
    setPhoneError('');
    setNameError('');
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
    if (!customerPhone.trim()) {
      setPhoneError('Nomor telepon wajib diisi sebelum memproses pembayaran.');
      return;
    }
    if (!customerName.trim()) {
      setNameError('Nama customer wajib diisi. Jika pelanggan baru, silakan masukkan namanya terlebih dahulu.');
      return;
    }
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

                    <p className="mt-1 font-bold text-green-600">Rp {numberFormat(item.price)}</p>
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
                    <p className="text-sm font-bold">Rp {numberFormat(item.price * item.quantity)}</p>
                    <p className="text-xs">
                      {item.quantity} × Rp {numberFormat(item.price)}
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
                <span className="font-medium">Rp {numberFormat(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Diskon ({discount}%):</span>
                  <span className="font-medium">-Rp {numberFormat(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total:</span>
                <span>Rp {numberFormat(total)}</span>
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
                    <span className="ml-2 text-sm opacity-90">Rp {numberFormat(total)}</span>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="flex max-h-[90vh] max-w-md flex-col overflow-hidden p-0">
                <DialogHeader className="shrink-0 border-b px-5 py-4">
                  <DialogTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="h-4 w-4" />
                    Proses Pembayaran
                  </DialogTitle>
                  <DialogClose />
                </DialogHeader>

                {/* Scrollable body */}
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                  {/* ── Customer Info ── */}
                  <div className="rounded-xl border p-3">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <User className="h-4 w-4" />
                      Informasi Customer
                    </h3>

                    {/* Phone */}
                    <div className="mb-2">
                      <Label className="mb-1 block text-xs font-medium">
                        Nomor Telepon <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="tel"
                          value={customerPhone}
                          onChange={handleCustomerPhoneChange}
                          className={`w-full rounded-lg py-2 pr-10 pl-10 text-sm focus:ring-2 focus:ring-blue-500/20 ${
                            phoneError ? 'border-red-400 focus:ring-red-300' : ''
                          }`}
                          placeholder="08xxxxxxxxxx"
                        />
                        {/* right-side icon: loading / found / new */}
                        <div className="absolute top-1/2 right-3 -translate-y-1/2">
                          {isSearchingCustomer && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                          {!isSearchingCustomer && phoneLookedUp && customerFound && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {!isSearchingCustomer && phoneLookedUp && !customerFound && <UserPlus className="h-4 w-4 text-yellow-500" />}
                        </div>
                      </div>
                      {/* Phone error */}
                      {phoneError && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                          <span>⚠</span> {phoneError}
                        </p>
                      )}
                    </div>

                    {/* Lookup result feedback banner */}
                    {!isSearchingCustomer && phoneLookedUp && (
                      <div
                        className={`mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                          customerFound
                            ? 'border border-green-200 bg-green-50 text-green-700'
                            : 'border border-yellow-200 bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {customerFound ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            <span>Customer ditemukan — nama terisi otomatis</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-3.5 w-3.5 shrink-0" />
                            <span>Belum terdaftar — isi nama untuk mendaftarkan customer baru</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <Label className="mb-1 block text-xs font-medium">Nama Customer</Label>
                      <div className="relative">
                        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          value={customerName}
                          onChange={handleCustomerNameChange}
                          className={`w-full rounded-lg border py-2 pr-3 pl-10 text-sm focus:ring-2 focus:ring-blue-500 ${
                            customerFound ? 'border-green-300 bg-green-50' : nameError ? 'border-red-400 focus:ring-red-300' : ''
                          }`}
                          placeholder="Masukkan nama customer"
                          disabled={customerFound}
                        />
                      </div>
                      {nameError && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                          <span>⚠</span> {nameError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ── Order Type ── */}
                  <div>
                    <Label className="mb-1 block text-xs font-medium">Tipe Order</Label>
                    <div className="grid grid-cols-2 gap-2 rounded-xl border p-1">
                      <button
                        type="button"
                        onClick={() => handleOrderType('offline')}
                        className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                          orderType === 'offline' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Store className="h-4 w-4" />
                        <span>Offline</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOrderType('online')}
                        className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                          orderType === 'online' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <MonitorSmartphone className="h-4 w-4" />
                        <span>Online</span>
                      </button>
                    </div>
                  </div>

                  {/* ── Payment method ── */}
                  <div>
                    <Label className="mb-1 block text-xs font-medium">Metode Pembayaran</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Pilih Metode Pembayaran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {paymentMethods.map((method) => {
                            const IconComponent = method.icon;
                            return (
                              <SelectItem key={method.id} value={method.id}>
                                <div className="flex items-center gap-3">
                                  <div className={`flex h-5 w-5 items-center justify-center rounded-full text-white ${method.color}`}>
                                    <IconComponent className="h-3 w-3 text-white" />
                                  </div>
                                  <span className="font-medium">{method.name}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ── Payment summary ── */}
                  <div className="rounded-xl border p-3 text-sm">
                    <h3 className="mb-2 font-semibold">Ringkasan Pembayaran</h3>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">Rp {numberFormat(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Diskon ({discount}%):</span>
                          <span className="font-medium">-Rp {numberFormat(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-2 text-base font-bold">
                        <span>Total Bayar:</span>
                        <span>Rp {numberFormat(total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Cash received ── */}
                  <div>
                    <Label className="mb-1 block text-xs font-medium">Uang Diterima</Label>
                    <Input
                      type="text"
                      value={numberFormat(Number(cashReceived))}
                      onChange={handleCashReceivedChange}
                      className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Masukkan jumlah uang"
                    />
                    {change > 0 && (
                      <div className="mt-2 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Kembalian: Rp {numberFormat(change)}
                      </div>
                    )}
                    {change < 0 && cashReceived && (
                      <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Uang kurang: Rp {numberFormat(Math.abs(change))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Footer actions (sticky) ── */}
                <div className="shrink-0 border-t px-5 py-3">
                  <div className="flex gap-3">
                    <Button onClick={closePaymentModal} variant="outline" className="flex-1 rounded-lg py-2 text-sm" type="button">
                      Batal
                    </Button>
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={parseInt(cashReceived) < total || parseInt(cashReceived) == 0 || cashReceived == ''}
                      className="flex-1 rounded-lg bg-green-600 py-2 text-sm text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
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
