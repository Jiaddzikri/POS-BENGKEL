import ItemHeader from '@/components/item-header';
import ItemStatsCard from '@/components/item-stats-card';
import ItemTable from '@/components/item-table';
import ItemSearchHeader from '@/components/items-search-header';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Item() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Item Management',
      href: '/item',
    },
  ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Item Management" />
      <ItemHeader />
      <ItemStatsCard />
      <ItemSearchHeader />
      <ItemTable />
    </AppLayout>
  );
}
