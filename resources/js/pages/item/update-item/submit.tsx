import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { X } from 'lucide-react';
import { MouseEvent, useState } from 'react';

interface SubmitProps {
  handleUpdate: (e: MouseEvent<HTMLButtonElement>, closePaymentModal: any) => void;
}

export default function Submit({ handleUpdate }: SubmitProps) {
  const [isUpdateModalOpen, setShowUpdateModal] = useState<boolean>(false);

  return (
    <div className="space-y-3 py-4">
      <AlertDialog open={isUpdateModalOpen} onOpenChange={setShowUpdateModal}>
        <AlertDialogTrigger asChild>
          <Button onClick={() => setShowUpdateModal(true)} type="button">
            Update
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Update Item?</AlertDialogTitle>
            <AlertDialogDescription>Apakah Anda yakin ingin mengupdate item ini?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUpdateModal(false)}>
              <X className="h-4 w-4" />
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                handleUpdate(e, setShowUpdateModal(false));
              }}
              type="button"
            >
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
