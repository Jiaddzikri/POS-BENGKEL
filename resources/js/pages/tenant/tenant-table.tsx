import { FormTenant, FormUser, Tenant, User } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Edit3, LogInIcon, Package, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from "@/components/modal";
import { convertDate } from '@/utils/date-convert';
import { toast } from 'sonner';

interface TenantTableProps {
  tenants: Tenant[];
  user?: User;
}

export default function TenantTable({ tenants, user }: TenantTableProps) {



  const { errors: errorTenant, delete: destroy, processing } = useForm<FormTenant>();

  const { errors: errorUser, put, setData, data } = useForm<FormUser>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    tenant_id: user?.tenant_id ?? ''
  });




  const handleDelete = (id: string) => {
    destroy(route('tenant.destroy', id), {
      onError: () => console.log(errorTenant)
    });
  };


  const assignTenantId = (tenant_id: string) => {
    setData('tenant_id', tenant_id);
  }



  const handleLoginInToTenant = (id: string | number | undefined) => {  

    put(route('user.login.tenant', id), {
      onError: () => console.log(errorUser)
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


                      {(user?.role !== 'super_admin' && $user.tenant_id) ? null : (
                        <Modal
                          title={`Login ke toko ${tnt.name}?`}
                          onConfirm={() => handleLoginInToTenant(user?.id)}
                        >
                          <div>
                            <input type="hidden" name='tenant_id' value={data.tenant_id ?? ''} />
                            <Button
                              type={'button'}
                              disabled={processing}
                              className="transition-colors hover:text-blue-600"
                              onClick={() => assignTenantId(tnt.id)}
                            >
                              <LogInIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </Modal>

                      )}


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
