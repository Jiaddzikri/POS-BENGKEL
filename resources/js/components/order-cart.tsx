import { useApi } from '@/hooks/use-api';
import { CartItem, Customer, ItemList } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';
import { Label } from '@radix-ui/react-label';
import { CreditCard, Minus, Percent, Phone, Plus, Receipt, ShoppingCart, Trash2, User } from 'lucide-react';
import React, { MouseEvent, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';

interface OrderCartProps {
  setCashReceived: (param: string) => void;
  clearCart: () => void;
  discount: number;
  cashReceived: string;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  handleDiscountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitOrder: (e: MouseEvent<HTMLButtonElement>, closePaymentModal: any, customerData?: Customer) => void;
  items: ItemList[];
  addCustomerData: (customerData?: Customer) => void;
}

type PaymentMethod = 'cash' | 'card';

export function OrderCart({
  items,
  submitOrder,
  setCashReceived,
  clearCart,
  discount,
  cashReceived,
  cart,
  setCart,
  handleDiscountChange,
  addCustomerData,
}: OrderCartProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
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
  }, [buyerData]); //

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

  const checkIsStockOutOfQuantity = (sku: string): boolean => {
    const findItem: ItemList = items.filter((i) => {
      return i.sku === sku;
    })[0];
    const findItemOnCart: ItemList = cart.filter((c) => c.sku === sku)[0];

    return findItem.stock === findItemOnCart.quantity;
  };

  const updateQuantity = (sku: string, change: number): void => {
    if (checkIsStockOutOfQuantity(sku)) return;
    setCart(
      cart
        .map((c) => {
          if (c.sku === sku) {
            const newQuantity = c.quantity + change;
            return newQuantity > 0 ? { ...c, quantity: newQuantity } : c;
          }
          return c;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (sku: string): void => {
    setCart(cart.filter((c) => c.sku !== sku));
  };

  const showPaymentModal = () => {
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    resetCustomerData();
  };

  const handleSubmitOrder = (e: MouseEvent<HTMLButtonElement>) => {
    submitOrder(e, closePaymentModal);
  };

  return (
    <>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="py-8 text-center">
            <ShoppingCart className="mx-auto mb-3 h-12 w-12" />
            <p>Keranjang masih kosong</p>
            <p className="text-sm">Pilih produk untuk memulai transaksi</p>
          </div>
        ) : (
          cart.map((item: CartItem) => (
            <div key={item.sku} className="rounded-lg p-3">
              <div className="flex items-start gap-3">
                <img src={`${import.meta.env.VITE_STORAGE_URL}/${item.image_path}`} alt={item.sku} className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-medium">
                    {item.variant_name} {item.sku}
                  </h4>
                  <p className="font-semibold text-green-600">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <Button onClick={() => removeFromCart(item.sku)} className="bg-red-500" type="button">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.sku, -1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    type="button"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button onClick={() => updateQuantity(item.sku, 1)} className="flex h-8 w-8 items-center justify-center rounded-full" type="button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            <Input
              type="number"
              placeholder="Diskon %"
              value={discount || ''}
              onChange={handleDiscountChange}
              className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
            />
          </div>

          {/* Ringkasan Total */}
          <div className="space-y-2 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Diskon ({discount}%):</span>
                <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total:</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Dialog open={isPaymentModalOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={showPaymentModal}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700"
                  type="button"
                >
                  <CreditCard className="h-5 w-5" />
                  Bayar Sekarang
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Proses Pembayaran</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Customer Information Section */}
                  <div className="space-y-3 rounded-lg border p-4">
                    <h3 className="text-sm font-medium text-gray-700">Informasi Customer (Opsional)</h3>

                    {/* Customer Phone */}
                    <div>
                      <Label className="mb-2 block text-sm font-medium">Nomor Telepon</Label>
                      <div className="relative">
                        <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="tel"
                          value={customerPhone}
                          onChange={handleCustomerPhoneChange}
                          className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          placeholder="08xxxxxxxxxx"
                        />
                        {isSearchingCustomer && (
                          <div className="absolute top-1/2 right-3 -translate-y-1/2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Name */}
                    <div>
                      <Label className="mb-2 block text-sm font-medium">Nama Customer</Label>
                      <div className="relative">
                        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          value={customerName}
                          onChange={handleCustomerNameChange}
                          className={`w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                            customerFound ? 'border-green-300 bg-green-50' : ''
                          }`}
                          placeholder="Masukkan nama customer"
                          disabled={customerFound}
                        />
                        {customerFound && (
                          <div className="absolute top-1/2 right-3 -translate-y-1/2">
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                              <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                                <path d="M6.5 0l-.5.5-2 2-1-1-.5-.5-1 1 .5.5 1.5 1.5.5.5.5-.5 2.5-2.5.5-.5-1-1z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      {customerFound && <p className="mt-1 text-xs text-green-600">Customer ditemukan di database</p>}
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span>Subtotal:</span>
                      <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="mb-2 flex items-center justify-between text-green-600">
                        <span>Diskon ({discount}%):</span>
                        <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t pt-2 text-lg font-bold">
                      <span>Total:</span>
                      <span>Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  {paymentMethod === 'cash' && (
                    <div>
                      <Label className="mb-2 block text-sm font-medium">Uang Diterima</Label>
                      <Input
                        type="text"
                        value={numberFormat(Number(cashReceived))}
                        onChange={(e) => setCashReceived(getRawNumber(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan jumlah uang"
                      />
                      {change > 0 && (
                        <div className="mt-2 rounded border border-green-200 bg-green-50 p-2 text-green-700">
                          Kembalian: Rp {change.toLocaleString('id-ID')}
                        </div>
                      )}
                      {change < 0 && cashReceived && (
                        <div className="mt-2 rounded border border-red-200 bg-red-50 p-2 text-red-700">
                          Uang kurang: Rp {Math.abs(change).toLocaleString('id-ID')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button onClick={closePaymentModal} variant="outline" className="flex-1" type="button">
                      Batal
                    </Button>
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={paymentMethod === 'cash' && change < 0}
                      className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                      type="submit"
                    >
                      Proses Bayar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={clearCart}
                className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 transition-colors hover:bg-red-200"
                type="button"
              >
                Clear All
              </Button>
              <Button
                className="flex items-center justify-center gap-1 rounded-lg bg-blue-100 px-4 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-200"
                type="button"
              >
                <Receipt className="h-4 w-4" />
                Hold
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
