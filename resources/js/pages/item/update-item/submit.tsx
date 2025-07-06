import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { X } from 'lucide-react';
import { MouseEvent, useState } from 'react';

interface SubmitProps {
  handleUpdate: (e: MouseEvent<HTMLButtonElement>, closePaymentModal: any) => void;
}

export default function Submit({ handleUpdate }: SubmitProps) {
  const [isUpdateModalOpen, setShowUpdateModal] = useState<boolean>(false);

  return (
    <div className="space-y-3 py-4">
      <Dialog onOpenChange={setShowUpdateModal} open={isUpdateModalOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setShowUpdateModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-semibold transition-colors"
            type="button"
          >
            Update
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Update Item?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex w-full justify-center gap-2">
            <Button onClick={() => setShowUpdateModal(false)} className="w-full bg-red-500 transition outline-none hover:bg-red-600 dark:text-white">
              <X className="h-4 w-4" />
              Batal
            </Button>
            <Button onClick={(e) => handleUpdate(e, setShowUpdateModal(false))} type="button" className="w-full border transition">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
