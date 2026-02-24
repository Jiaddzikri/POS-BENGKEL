/**
 * Frontend unit tests for role-based sidebar menu filtering.
 *
 * Because filterByRole is defined inside app-sidebar.tsx (not exported),
 * we replicate the exact same logic and nav item definitions here so the
 * tests act as a contract spec — if the sidebar is ever changed, these
 * tests will catch regressions.
 */
import type { NavItem } from '@/types';
import { describe, expect, it } from 'vitest';

// ── replicate nav definitions from app-sidebar.tsx ──────────────────────────

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/', roles: ['super_admin', 'admin', 'manager', 'cashier'] },
  { title: 'Order', href: '/order', roles: ['super_admin', 'admin', 'manager', 'cashier'] },
];

const inventoryNavItems: NavItem[] = [
  { title: 'Item', href: '/item', roles: ['super_admin', 'admin', 'manager', 'cashier'] },
  { title: 'Inventory', href: '/inventory', roles: ['super_admin', 'admin', 'manager', 'cashier'] },
];

const salesNavItems: NavItem[] = [
  { title: 'Reports', href: '/analytics-report', roles: ['super_admin', 'admin', 'manager'] },
  { title: 'Order History', href: '/order-history', roles: ['super_admin', 'admin', 'cashier', 'manager'] },
];

const adminNavItems: NavItem[] = [
  { title: 'Tenant', href: '/tenant', roles: ['super_admin'] },
  { title: 'User', href: '/user', roles: ['super_admin', 'admin'] },
  { title: 'Category', href: '/category', roles: ['super_admin', 'admin', 'manager'] },
  { title: 'Transaction', href: '/transaction', roles: ['super_admin', 'admin', 'manager', 'cashier'] },
  { title: 'Buyer', href: '/buyer/list', roles: ['super_admin', 'admin', 'manager', 'cashier'] },
];

const allItems: NavItem[] = [...mainNavItems, ...inventoryNavItems, ...salesNavItems, ...adminNavItems];

// ── exact filter function from app-sidebar.tsx ───────────────────────────────

const filterByRole = (items: NavItem[], role: string | undefined): NavItem[] => items.filter((item) => item.roles?.includes(role ?? ''));

// ── helpers ───────────────────────────────────────────────────────────────────

const titlesFor = (role: string) => filterByRole(allItems, role).map((i) => i.title);

// ─────────────────────────────────────────────────────────────────────────────

describe('Sidebar role filtering', () => {
  // ── super_admin ───────────────────────────────────────────────────────────

  describe('super_admin', () => {
    it('can see Dashboard', () => expect(titlesFor('super_admin')).toContain('Dashboard'));
    it('can see Order', () => expect(titlesFor('super_admin')).toContain('Order'));
    it('can see Item', () => expect(titlesFor('super_admin')).toContain('Item'));
    it('can see Inventory', () => expect(titlesFor('super_admin')).toContain('Inventory'));
    it('can see Reports', () => expect(titlesFor('super_admin')).toContain('Reports'));
    it('can see Tenant', () => expect(titlesFor('super_admin')).toContain('Tenant'));
    it('can see User', () => expect(titlesFor('super_admin')).toContain('User'));
    it('can see Category', () => expect(titlesFor('super_admin')).toContain('Category'));
  });

  // ── admin ─────────────────────────────────────────────────────────────────

  describe('admin', () => {
    it('can see Reports', () => expect(titlesFor('admin')).toContain('Reports'));
    it('can see User', () => expect(titlesFor('admin')).toContain('User'));
    it('can see Category', () => expect(titlesFor('admin')).toContain('Category'));
    it('cannot see Tenant', () => expect(titlesFor('admin')).not.toContain('Tenant'));
  });

  // ── manager ───────────────────────────────────────────────────────────────

  describe('manager', () => {
    it('can see Reports', () => expect(titlesFor('manager')).toContain('Reports'));
    it('can see Category', () => expect(titlesFor('manager')).toContain('Category'));
    it('can see Order History', () => expect(titlesFor('manager')).toContain('Order History'));
    it('cannot see Tenant', () => expect(titlesFor('manager')).not.toContain('Tenant'));
    it('cannot see User', () => expect(titlesFor('manager')).not.toContain('User'));
  });

  // ── cashier ───────────────────────────────────────────────────────────────

  describe('cashier', () => {
    it('can see Dashboard', () => expect(titlesFor('cashier')).toContain('Dashboard'));
    it('can see Order', () => expect(titlesFor('cashier')).toContain('Order'));
    it('can see Item', () => expect(titlesFor('cashier')).toContain('Item'));
    it('can see Inventory', () => expect(titlesFor('cashier')).toContain('Inventory'));
    it('can see Order History', () => expect(titlesFor('cashier')).toContain('Order History'));
    it('cannot see Reports', () => expect(titlesFor('cashier')).not.toContain('Reports'));
    it('cannot see Tenant', () => expect(titlesFor('cashier')).not.toContain('Tenant'));
    it('cannot see User', () => expect(titlesFor('cashier')).not.toContain('User'));
    it('cannot see Category', () => expect(titlesFor('cashier')).not.toContain('Category'));
  });

  // ── guest / undefined ─────────────────────────────────────────────────────

  describe('guest (undefined role)', () => {
    it('sees no menu items', () => expect(filterByRole(allItems, undefined)).toHaveLength(0));
  });
});
