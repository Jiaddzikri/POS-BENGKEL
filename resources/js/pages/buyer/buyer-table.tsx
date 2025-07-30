import { Buyer, FormBuyer } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from "@/components/modal";

interface BuyerTableProps {
  buyers: Buyer[];
}

export default function BuyerTable({ buyers }: BuyerTableProps) {

  const { errors, delete: destroy } = useForm<FormBuyer>();

  const handleDelete = (id: string) => {
    destroy(route('buyer.destroy', id), {
      onError: () => console.log(errors)
    });
  };

  return (
    <div className="px-6 py-2">
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-center">
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Store Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Phone Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Discount</th>
                <th className="px-4 py-3 text-center text-xs font-medium tracking-wider uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {buyers.map((buyer) => (
                <tr key={buyer.id} className="">
                  <td className="px-4 py-4">
                    <span className="text-sm">{buyer.tenant.name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{buyer.name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{buyer.phone_number}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{buyer.discount?.name || 'None'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Link href={`/buyer/${buyer.id}/edit`}>
                        <Button className="transition-colors hover:text-green-600">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Modal
                        title={`Apakah kamu yakin ingin Menghapus Category ${buyer.name}?`}
                        description={'Tindakan ini tidak dapat dibatalkan.'}
                        onConfirm={() => handleDelete(buyer.id)}
                      >
                        <Button type={'button'} className="transition-colors hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Modal>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
