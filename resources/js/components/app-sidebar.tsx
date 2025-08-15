import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { PageProps, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
  BarChart3,
  BookOpen,
  Building2,
  CircleDollarSign,
  ClipboardList,
  Folder,
  HistoryIcon,
  LayoutGrid,
  Package,
  ScanLine,
  Users,
  Warehouse,
} from 'lucide-react';

import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
    roles: ['super_admin', 'admin', 'manager', 'cashier'],
  },
  {
    title: 'Order',
    href: '/order',
    icon: ClipboardList,
    roles: ['super_admin', 'admin', 'manager', 'cashier'],
  },
];

const InventoryNavItems: NavItem[] = [
  {
    title: 'Item',
    href: '/item',
    icon: Package,
    roles: ['super_admin', 'admin', 'manager', 'cashier'],
  },
  {
    title: 'Inventory',
    href: '/inventory',
    icon: Warehouse,
    roles: ['super_admin', 'admin', 'manager', 'cashier'],
  },
];

const SalesAndCustomerNavItems: NavItem[] = [
  {
    title: 'Reports',
    href: '/analytics-report',
    icon: BarChart3,
    roles: ['super_admin', 'admin', 'manager'],
  },
  {
    title: 'Order History',
    href: '/order-history',
    icon: HistoryIcon,
    roles: ['super_admin', 'admin', 'cashier', 'manager'],
  },
];

const AdministrationNavItems: NavItem[] = [
  {
    title: 'Tenant',
    href: '/tenant',
    icon: Building2,
    roles: ['super_admin'],
  },
  {
    title: 'User',
    href: '/user',
    icon: Users,
    roles: ['super_admin', 'admin'],
  },
  {
    title: 'Category',
    href: '/category',
    icon: LayoutGrid,
    roles: ['super_admin', 'admin', 'manager'],
  },
  {
    title: 'Transaction',
    href: '/transaction',
    icon: CircleDollarSign,
    roles: ['super_admin', 'admin', 'manager', 'cashier'],
  },
  {
    title: 'Buyer',
    href: '/buyer/list',
    icon: ScanLine,
    roles: ['super_admin', 'admin', 'manager', 'cashier'],
  },
  // {
  //   title: 'Discount',
  //   href: '/discount',
  //   icon: TicketPercent,
  //   roles: ['super_admin', 'admin', 'cashier']
  //   // icon: ScanLine
  // }
];

const footerNavItems: NavItem[] = [
  {
    title: 'Repository',
    href: 'https://github.com/laravel/react-starter-kit',
    icon: Folder,
  },
  {
    title: 'Documentation',
    href: 'https://laravel.com/docs/starter-kits#react',
    icon: BookOpen,
  },
];

const filterByRole = (items: NavItem[], role: string | undefined): NavItem[] => {
  // if (role === 'super_admin') {

  //   const targetsToModify = ['order', 'inventory', 'item'] //sementara

  //   return items.map(item => {

  //     const isTarget = targetsToModify.includes(item.title.toLowerCase());

  //     if (isTarget) {
  //       return {
  //         ...item,
  //         href: `${item.href}/lists`
  //       }
  //     }

  //     return item;
  //   })
  //     .filter(item => item?.roles?.includes('super_admin'))
  // }

  return items.filter((item) => item.roles?.includes(role ?? ''));
};

export function AppSidebar() {
  const { auth } = usePage<PageProps>().props;

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                {/* <AppLogo /> */}
                <h1 className='text-lg sm:text-xl md:text-2xl font-bold'>Point Of Sale</h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          mainItems={filterByRole(mainNavItems, auth.user?.role)}
          inventoryItems={filterByRole(InventoryNavItems, auth.user?.role)}
          salesAndCustomerItems={filterByRole(SalesAndCustomerNavItems, auth.user?.role)}
          administrationItems={filterByRole(AdministrationNavItems, auth.user?.role)}
        />
      </SidebarContent>

      <SidebarFooter>
        {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
