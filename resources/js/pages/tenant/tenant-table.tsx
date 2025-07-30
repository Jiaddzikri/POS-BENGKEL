import { FormTenant, Tenant } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Edit3, Package, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from "@/components/modal";
import { convertDate } from '@/utils/date-convert';

interface TenantTableProps {
  tenants: Tenant[];
}

export default function TenantTable({ tenants }: TenantTableProps) {

  const { errors, delete: destroy } = useForm<FormTenant>();

  const handleDelete = (id: string) => {
    destroy(route('tenant.destroy', id), {
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
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Created At</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Updated At</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tenants.map((tnt, index) => (
                <tr key={index} className="">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{tnt.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{tnt.status}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{convertDate(tnt.created_at)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{convertDate(tnt.updated_at)}</span>
                  </td>
                  {/* <td className="px-4 py-4">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${tnt.low_stock ? 'text-orange-600' : ''}`}>{tnt.stock}</span>
                      {tnt.low_stock && <AlertTriangle className="ml-2 h-4 w-4 text-orange-500" />}
                    </div>
                  </td> */}
                  {/* <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tnt.is_active ? 'text-green-800' : ''}`}
                    >
                      {tnt.status}
                    </span>
                  </td> */}
                  {/* <td className="px-4 py-4">
                    <span className="text-sm">{tnt.last_updated}</span>
                  </td> */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      {/* <Button className="transition-colors hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </Button> */}

                      <Link href={`/tenant/${tnt.id}/edit`}>
                        <Button className="transition-colors hover:text-green-600">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Modal
                        title={`Apakah kamu yakin ingin Menghapus toko ${tnt.name}?`}
                        description={'Tindakan ini tidak dapat dibatalkan.'}
                        onConfirm={() => handleDelete(tnt.id)}
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
