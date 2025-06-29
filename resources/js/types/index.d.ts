import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}

export interface Dimension {
  length: string | number;
  width: string | number;
  height: string | number;
}

export interface Variant {
  name: string;
  sku: string;
  additional_price: string | number;
  stock: string | number;
  minimum_stock: string | number;
}

export interface FormItem {
  tenant_id?: string | number;
  name: string;
  category_id: string;
  description: string;
  purchase_price: string | number | any;
  selling_price: string | number | any;
  brand: string;
  variants: Variant[];
  image: File | null;
  [key: string]: any;
}

export interface Category {
  id: string;
  name: string;
}
