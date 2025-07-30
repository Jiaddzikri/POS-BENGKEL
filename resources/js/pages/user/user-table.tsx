import { FormUser, User } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Edit3, Package, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from "@/components/modal";

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {

  const { errors, delete: destroy } = useForm<FormUser>();

  const handleDelete = (id: string | number) => {

    destroy(route('user.destroy', id), {
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
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Store Name</th>
                <th className="px-4 py-3 text-center text-xs font-medium tracking-wider uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user, index) => (
                <tr key={index} className="">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{user.email}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{user.role}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{user.tenant_name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center space-x-2">

                      <Link href={`/user/${user.id}/edit`}>
                        <Button className="transition-colors hover:text-green-600">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Modal
                        title={`Apakah kamu yakin ingin Menghapus toko ${user.name}?`}
                        description={'Tindakan ini tidak dapat dibatalkan.'}
                        onConfirm={() => handleDelete(user.id)}
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
