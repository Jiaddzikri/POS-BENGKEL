import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Menu() {
  return (
    <AppLayout>
      <Head title="Menu" />
      <div className="flex h-full w-full">
        <div className="w-[60%]">
          <div className=""></div>
        </div>
        <div className="w-[40%]"></div>
      </div>
    </AppLayout>
  );
}
