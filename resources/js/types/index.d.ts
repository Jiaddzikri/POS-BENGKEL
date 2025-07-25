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
  id?: string;
  name: string;
  sku: string;
  additional_price: number;
  stock: number;
  minimum_stock: number;
  [key: string]: any;
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

export interface ItemList {
  sku: string;
  item_name: string;
  item_id: string;
  variant_id: string;
  variant_name: string;
  stock: number;
  category_name: string;
  last_updated: string;
  price: number;
  low_stock: boolean;
  is_active: boolean;
  status: string;
  image_path: string;
  quantity?: number;
  description: string;
}

export interface Item {
  id: string;
  item_name: string;
  brand: string;
  category_id: string;
  purchase_price: number;
  selling_price: number;
  is_active: boolean;
  status: string;
  image_path?: string;
  description: string;
  variants: Variant[];
  new_image?: File | null;
  [key: string]: any;
}

export interface Links {
  url?: string;
  label?: string;
  active: boolean;
}

export interface Link {
  first?: string;
  last?: string;
  next?: string;
  prev?: string;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  links: Links[];
}

export interface ItemData {
  data: ItemList[];
  meta: Pagination;
  links: Link;
}

export interface ItemStats {
  total: number;
  active_items: number;
  low_stock: number;
  categories: number;
}

export interface ItemFilter {
  searchQuery: string;
  page: number;
}

export interface CartItem extends ItemList {
  quantity: number;
}

export interface OrderItemForm {
  item_id: string;
  variant_item_id: string;
  quantity: number;
  price_at_sale: number;
  [key: string]: any;
}

// Tenant

export interface Status {
  id: string;
  name: string;
}

export interface TenantList {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TenantData {
  data: TenantList[];
  meta: Pagination;
  links: Link;
}

export interface FormTenant {
  name: string;
  status: string;
  [key: string]: any;
}

// Tenant

// customer
interface Customer {
  name?: string;
  phone_number?: string;
  [key: string]: any;
}
// customer

// sales
interface SalesPerHour {
  time: string;
  sales: number;
}

interface BestSellingProducts {
  rank: number;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  trend: 'up' | 'down';
}

interface CategoryAnalysis {
  category: string;
  percentage: number;
  revenue: number;
  color: string;
}

interface AnalyticsRevenue {
  revenue: number;
  trend: 'increase' | 'decrease';
  percentage: number;
}

interface AnalyticsTransaction {
  total: number;
  trend: 'increase' | 'decrease';
  percentage: number;
}

interface AnalyticsGrossProfit {
  grossProfit: number;
  trend: 'increase' | 'decrease';
  percentage: number;
}

interface AnalyticsAverageTransaction {
  averageValue: number;
  trend: 'increase' | 'decrease';
  percentage: number;
}

interface AnalyticsFilter {
  startDate: string;
  endDate: string;
  range: string;
}

interface AnalyticsSalesTrend {
  labels: [];
  value: [];
}

interface AnalyticBestSelling {
  item_name: string;
  category: string;
  sku: string;
  total_revenue: number;
  total_quantity: number;
}

interface AnalyticBestSellingCategory {
  category: string;
  total_revenue: number;
  total_quantity: number;
}
// sales
