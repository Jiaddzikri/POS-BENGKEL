import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavMainProps {
  mainItems: NavItem[];
  inventoryItems: NavItem[];
  salesAndCustomerItems: NavItem[];
  administrationItems: NavItem[];
}

export function NavMain({ mainItems = [], inventoryItems = [], salesAndCustomerItems, administrationItems }: NavMainProps) {
  const page = usePage();

  return (
    <>
      {mainItems.length < 1 ? (
        ''
      ) : (
        <SidebarGroup className="px-2 py-0">
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            {mainItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                  <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}

      {inventoryItems.length < 1 ? (
        ''
      ) : (
        <SidebarGroup className="px-2 py-0">
          <SidebarGroupLabel>Inventory Management</SidebarGroupLabel>
          <SidebarMenu>
            {inventoryItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                  <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}

      {salesAndCustomerItems.length < 1 ? (
        ''
      ) : (
        <SidebarGroup className="px-2 py-0">
          <SidebarGroupLabel>Sales And Customer</SidebarGroupLabel>
          <SidebarMenu>
            {salesAndCustomerItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                  <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}

      {administrationItems.length < 1 ? (
        ''
      ) : (
        <SidebarGroup className="px-2 py-0">
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarMenu>
            {administrationItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                  <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </>
  );
}
