import { SalesTransaction, SalesTransactionDetails } from '@/types';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import React, { useState } from 'react';
import { convertDate } from '@/utils/date-convert';
import { convertCurrency } from '@/utils/currency-convert';

interface SalesTransactionProps {
  sales_transaction: SalesTransaction[];
}

export default function SalesTransactionTable({ sales_transaction }: SalesTransactionProps) {

  const [openDetails, setOpenDetails] = useState<string | null>(null);

  function renderDetailsTransaction(
    sales_transaction: SalesTransaction,
    sales_detail_transactions: SalesTransactionDetails[],
    invoice_number: string
  ) {

    if (openDetails !== invoice_number) return null;

    return (

      <tr className='gap-5 bg-muted/20'>
        <td className="py-4 px-4 d-block" colSpan={8}>
          <Accordion type='single'
            collapsible
            className='w-full'
            value={invoice_number}
          >
            <AccordionItem value={invoice_number}>
              <AccordionContent className="accordion-content flex flex-col text-balance p-0">
                <table className='w-full text-xs '>
                  <thead className='border rounded-[100px] text-left mx-5'>
                    <tr className='text-sm font-semibold'>
                      <th className='px-2 py-2 text-center'>No</th>
                      <th className='px-2 py-2'>Item Name</th>
                      <th className='px-2 py-2'>SKU</th>
                      <th className='px-2 py-2'>Variant Name</th>
                      <th className='px-2 py-2 text-center'>Quantity</th>
                      <th className='px-2 py-2'>Price</th>
                      <th className='px-2 py-2'>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales_detail_transactions.map((detail, idx) => (
                      <tr key={detail.id}>
                        <td className='px-2 py-2 text-center'>{idx + 1}</td>
                        <td className='px-2 py-2'>{detail.item_name}</td>
                        <td className='px-2 py-2'>{detail.sku}</td>
                        <td className='px-2 py-2'>{detail.variant_name}</td>
                        <td className='px-2 py-2 text-center'>x {detail.quantity}</td>
                        <td className='px-2 py-2 text-right'>{convertCurrency(detail.price_at_sale)}</td>
                        <td className='px-2 py-2 text-right'>{convertCurrency(detail.sub_total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className='text-xs'>
                    <tr className="border-t">
                      <td colSpan={6} className="text-right pr-4 pt-3 font-semibold">Total</td>
                      <td className="text-right py-1 pr-2 pt-3">{convertCurrency(sales_transaction.total_amount)}</td>
                    </tr>

                    {sales_transaction.buyer?.discount?.active &&
                      <tr className='align-top'>
                        <td colSpan={6} className="text-right pr-4 py-1 font-semibold">Discount</td>
                        <td className="text-right py-1 pr-2 text-destructive-foreground space-y-1">
                          <div> ({sales_transaction.buyer.discount.discount_percent}%) <span className="text-muted-foreground">- { }</span></div>
                        </td>
                      </tr>
                    }

                    <tr>
                      <td colSpan={6} className="text-right pr-4 py-1 font-semibold">Final Amount</td>
                      <td className="text-right py-1 pr-2">{convertCurrency(sales_transaction.final_amount)}</td>
                    </tr>

                    <tr>
                      <td colSpan={6} className="text-right pr-4 py-1 font-semibold">Amount Paid</td>
                      <td className="text-right py-1 pr-2">{convertCurrency(sales_transaction.amount_paid)}</td>
                    </tr>

                    <tr>
                      <td colSpan={6} className="text-right pr-4 py-1 font-semibold">Change</td>
                      <td className="text-right py-1 pr-2">{convertCurrency(sales_transaction.change)}</td>
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
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Store Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Invoice Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sales_transaction.map((sales) => (
                <React.Fragment key={sales.invoice_number}>
                  <tr onClick={() => setOpenDetails(openDetails === sales.invoice_number ? null : sales.invoice_number)} className="hover:bg-accent-foreground hover:text-background transition duration-700 ease-out cursor-pointer">
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium">{sales.tenant_name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium">{sales.invoice_number}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm">{sales.buyer.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm">{sales.payment_method}</span>
                    </td>
                    <td>
                      <span className="text-sm">{convertDate(sales.date)}</span>
                    </td>
                  </tr>

                  {renderDetailsTransaction(sales, sales.transaction_details, sales.invoice_number)}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
}
