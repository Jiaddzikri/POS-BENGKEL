import { Order, OrderItem } from '@/types';
import { convertCurrency } from '@/utils/currency-convert';
import { convertDate } from '@/utils/date-convert';
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem } from './ui/accordion';

interface OrderHistoryTable {
  orderHistories: Order[];
}

export default function OrderHistoryTable({ orderHistories }: OrderHistoryTable) {
  const [openDetails, setOpenDetails] = useState<string | null>(null);

  function renderDetailsTransaction(orderHistory: Order, orderItems: OrderItem[], orderId: string) {
    if (openDetails !== orderId) return null;

    return (
      <tr className="gap-5 bg-muted/20">
        <td className="d-block px-4 py-4" colSpan={8}>
          <Accordion type="single" collapsible className="w-full" value={orderId}>
            <AccordionItem value={orderId}>
              <AccordionContent className="accordion-content flex flex-col p-0 text-balance">
                <table className="w-full text-xs">
                  <thead className="mx-5 rounded-[100px] border text-left">
                    <tr className="text-sm font-semibold">
                      <th className="px-2 py-2 text-center">No</th>
                      <th className="px-2 py-2">Item Name</th>
                      <th className="px-2 py-2">SKU</th>
                      <th className="px-2 py-2">Variant Name</th>
                      <th className="px-2 py-2 text-center">Quantity</th>
                      <th className="px-2 py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((detail, idx) => (
                      <tr key={detail.sku}>
                        <td className="px-2 py-2 text-center">{idx + 1}</td>
                        <td className="px-2 py-2">{detail.item_name}</td>
                        <td className="px-2 py-2">{detail.sku}</td>
                        <td className="px-2 py-2">{detail.variant_name}</td>
                        <td className="px-2 py-2 text-center">x {detail.quantity}</td>
                        <td className="px-2 py-2 text-right">{convertCurrency(detail.price_at_sale)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="text-xs">
                    <tr className="border-t">
                      <td colSpan={6} className="pt-3 pr-4 text-right font-semibold">
                        Total
                      </td>
                      <td className="py-1 pt-3 pr-2 text-right">{convertCurrency(orderHistory.total_amount)}</td>
                    </tr>

                    {orderHistory.discount > 0 && (
                      <tr className="align-top">
                        <td colSpan={6} className="py-1 pr-4 text-right font-semibold">
                          Discount
                        </td>
                        <td className="space-y-1 py-1 pr-2 text-right text-destructive-foreground">
                          <div>
                            {' '}
                            ({orderHistory.discount}%) <span className="text-muted-foreground">- {}</span>
                          </div>
                        </td>
                      </tr>
                    )}

                    <tr>
                      <td colSpan={6} className="py-1 pr-4 text-right font-semibold">
                        Final Amount
                      </td>
                      <td className="py-1 pr-2 text-right">{convertCurrency(orderHistory.final_amount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </td>
      </tr>
    );
  }

  return (
    <div className="px-6 py-2">
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-center">
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Order Id</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Cashier Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Buyer Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Status</th>

                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orderHistories.map((history) => (
                <React.Fragment key={history.id}>
                  <tr
                    onClick={() => setOpenDetails(openDetails === history.id ? null : history.id)}
                    className="cursor-pointer transition duration-700 ease-out hover:bg-accent-foreground hover:text-background"
                  >
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium">{history.id}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium">{history.cashier_name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium">{history.buyer_name}</span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm">{history.status}</span>
                    </td>
                    <td>
                      <span className="text-sm">{convertDate(history.created_at)}</span>
                    </td>
                  </tr>

                  {renderDetailsTransaction(history, history.details, history.id)}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
