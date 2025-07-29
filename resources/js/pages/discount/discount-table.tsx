import { Discount, FormDiscount } from '@/types';
import { Link, router, useForm } from '@inertiajs/react';
import { Edit3, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from "@/components/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface DiscountTableProps {
  discounts: Discount[];
}

export default function DiscountTable({ discounts }: DiscountTableProps) {


  const { data, setData, errors, delete: destroy, patch } = useForm<FormDiscount>({
    name: '',
    desc: '',
    discount_percent: 0,
    tenant_id: '',
    active: true
  });


  const handleDelete = (id: string) => {

    destroy(route('discount.destroy', id), {
      onError: () => console.log(errors)
    });
  };

  const convertBool = function (value: string) {
    return (value != 'false' ? true : false);
  }

  const handleActiveChange = (
    select: { id: string, active: boolean },
    value: string
  ) => {

    const status = convertBool(value);

    setData('active', status);


    if (select.active == data.active) {
      toast.error('Terlalu banyak permintaan!');
    } else {
      handleSubmit(select.id);
    }

  };


  const handleSubmit = (id: string) => {
    patch(route('discount.update.active', id), {
      preserveScroll: true,
      onSuccess: () => {
        router.reload({ only: ['discounts'] });
      },
      onError: () => {
        console.log(errors)
      }
    });
  }




  return (
    <div className="px-6 py-2">
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-center">
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Store Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Discount (%)</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Active</th>
                <th className="px-4 py-3 text-center text-xs font-medium tracking-wider uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {discounts.map((dsc, index) => (
                <tr key={index} className="">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium">{dsc.tenant.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{dsc.name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{dsc.desc ||= '-'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{dsc.discount_percent}%</span>
                  </td>
                  <td className="px-4 py-4">
                    <Select
                      value={dsc.active ? 'true' : 'false'}
                      onValueChange={(value) => handleActiveChange({ id: dsc.id, active: dsc.active }, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Button className="transition-colors hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Link href={`/discount/${dsc.id}/edit`}>
                        <Button className="transition-colors hover:text-green-600">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Modal
                        title={`Apakah kamu yakin ingin Menghapus Category ${dsc.name}?`}
                        description={'Tindakan ini tidak dapat dibatalkan.'}
                        onConfirm={() => handleDelete(dsc.id)}
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
    </div >
  );
}
