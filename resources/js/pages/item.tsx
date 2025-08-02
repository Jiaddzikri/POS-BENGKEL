import ItemHeader from '@/components/item-header';
import ItemStatsCard from '@/components/item-stats-card';
import ItemTable from '@/components/item-table';
import ItemSearchHeader from '@/components/items-search-header';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Category, ItemData, ItemFilter, ItemStats } from '@/types';
import { Head } from '@inertiajs/react';

interface ItemProps {
  items: ItemData;
  stats: ItemStats;
  filters: ItemFilter;
  categories: Category[];
}

export default function Item({ items, filters, stats, categories }: ItemProps) {
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
      <ItemStatsCard stats={stats} />
      <ItemSearchHeader filters={filters} />
      <ItemTable filters={filters} pagination={items.meta} items={items.data} />
    </AppLayout>
  );
}
