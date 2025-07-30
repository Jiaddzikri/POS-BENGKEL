import InventoryHeader from '@/components/inventory-header';
import InventoryOverview from '@/components/inventory-overview';
import InventoryStats from '@/components/inventory-stats';
import StockMovement from '@/components/stock-movement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import {
  AdjustItemInventoryForm,
  BreadcrumbItem,
  InventoryData,
  InventoryFilters,
  InventoryStats as InventoryStatsType,
  StockMovementData,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inventory Management',
    href: '/inventory',
  },
];

interface InventoryProps {
  stats: InventoryStatsType;
  filters: InventoryFilters;
  inventoryData: InventoryData;
  stockMovementData: StockMovementData;
}

type adjustInventoryFormKey = keyof AdjustItemInventoryForm;

export default function Inventory({ stats, filters, inventoryData, stockMovementData }: InventoryProps) {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isAdjustModalOpen, setAdjustModalOpen] = useState<boolean>(false);
  const { data, setData, post, reset, processing, errors } = useForm<AdjustItemInventoryForm>({
    variant_id: null,
    adjust_type: null,
    quantity: 0,
  });

  const handleInputChange = (field: adjustInventoryFormKey, value: string | null | number) => {
    setData((prev) => ({
      ...prev,
      [field as adjustInventoryFormKey]: value,
    }));
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('inventory.adjust'), {
      onSuccess: () => {
        toast.success('Stock Successfully Adjust');
        reset();
        setModalOpen(false);
      },
      onError: (errors) => {
        toast.error(errors.message);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Inventory Management" />
      <InventoryHeader
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        handleSubmit={handleSubmit}
        data={data}
        handleInputChange={handleInputChange}
        items={inventoryData.data}
      />
      <InventoryStats stats={stats} />
      <div className="px-6 py-2">
        <Tabs defaultValue="inventory-overview" className="w-full">
          <TabsList>
            <TabsTrigger value="inventory-overview">Current Inventory</TabsTrigger>
            <TabsTrigger value="stock-movements">Stock Movements</TabsTrigger>
          </TabsList>
          <TabsContent value="inventory-overview">
            <InventoryOverview
              data={data}
              handleSubmit={handleSubmit}
              handleInputChange={handleInputChange}
              isModalOpen={isAdjustModalOpen}
              setModalOpen={setAdjustModalOpen}
              filters={filters}
              inventoryData={inventoryData}
            />
          </TabsContent>
          <TabsContent value="stock-movements">
            <StockMovement filters={filters} stockMovementData={stockMovementData} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
