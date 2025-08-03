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
  roles?: string[];
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
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  tenant_id: string | null;
  tenant_name: string;
  role: string;
  [key: string]: unknown; // This allows for additional properties...
}

export interface UserData {
  data: User[];
  meta: Pagination;
  links: Link;
}

export interface FormUser {
  name: string;
  email?: string;
  role: string;
  tenant_id?: string;
  password?: string;
  password_confirmation?: string;
  [key: string]: any;
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
  tenant_id?: string;
  name: string;
  category_id: string;
  description: string;
  purchase_price: number | any;
  selling_price: number | any;
  brand: string;
  variants: Variant[];
  [key: string]: any;
}

export interface Category {
  id: string;
  name: string;
  tenant_name?: string;
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

interface ItemFilter {
  searchQuery?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: string;
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

export interface OrderCart {
  data: CartItem[];
}

export interface OrderItemForm {
  item_id: string;
  variant_item_id: string;
  quantity: number;
  price_at_sale: number;
  [key: string]: any;
}

export interface PaymentMethod {
  payment_method: 'cash' | 'qris';
}

// Tenant

export interface Status {
  id: string;
  name: string;
}

export interface Tenant {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TenantData {
  data: Tenant[];
  meta: Pagination;
  links: Link;
}

export interface FormTenant {
  name: string;
  [key: string]: any;
}

// Tenant

// Category

export interface CategoryData {
  data: Category[];
  meta: Pagination;
  links: Link;
}

export interface FormCategory {
  name: string;
  [key: string]: any;
}

// export interface CategoryFilter {
//   searchQuery: string;
//   page: number;

// }

// Category

export interface Filter {
  searchQuery: string;
  page: number;
  filter: string | number;
}

export interface DropdownData {
  id: number | string;
  // slug
  name?: string;
}

// customer
interface Customer {
  name?: string;
  phone_number?: string;
  [key: string]: any;
}
// customer

// export interface DropdownGroups {
//   label: string;
//   name: string;
//   options: DropdownData[];
// }

export interface SalesTransactionData {
  data: SalesTransaction[];
  meta: Pagination;
  links: Link;
}

export interface Buyer {
  id: string;
  name: string;
  phone_number: string;

  discount: Discount | null;

  [key: string]: any;
}

export interface SalesTransaction {
  id: string;
  name: string;
  invoice_number: string;
  total_amount: number;
  final_amount: number;
  payment_method: string;
  amount_paid: number;
  change: number;
  date: string;
  tenant: Tenant;
  buyer: Buyer;
  transaction_details: SalesTransactionDetails[];
  [key: string]: any;
}

export interface SalesTransactionDetails {
  id: string;
  sku: string;
  quantity: string;
  price_at_sale: number;
  sub_total: number;

  item_name: string;
  variant_name: string;

  [key: string]: any;
}

export interface Discount {
  id: string;
  name: string;
  desc: string;
  discount_percent: number;
  active: boolean;

  tenant: Tenant;

  [key: string]: any;
}

export interface BuyerData {
  data: Buyer[];
  meta: Pagination;
  links: Link;
}

export interface Buyer {
  id: string;
  name: string;
  phone_number: string;

  tenant: Tenant;
  discount: Discount;

  [key: string]: any;
}

export interface FormBuyer {
  name: string;
  phone_number: string;
  tenant_id: string;
  [key: string]: any;
}

export interface FormDiscount {
  name: string;
  desc: string;
  discount_percent: number;
  tenant_id: string;
  active?: boolean;

  [key: string]: any;
}

export interface FormDiscountActive {
  active: boolean;
}

export interface DiscountData {
  data: Discount[];
  meta: Pagination;
  links: Link;
}
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

// sales
interface InventoryStats {
  active_item: number;
  low_stock: number;
  out_of_stock: 0;
  stock_movement: 0;
}

interface InventoryFilters {
  page: number;
  search: string;
  stock_condition: string;
  startDate: string;
  endDate: string;
}

export interface InventoryItems {
  id: string;
  item_id: string;
  item_name: string;
  sku: string;
  stock: number;
  low_stock: boolean;
  price: number;
  minimum_stock: number;
  is_active: boolean;
  category_name: string;
  variant_id: string;
}

interface InventoryData {
  data: InventoryItems[];
  meta: Pagination;
  links: Link;
}

interface AdjustItemInventoryForm {
  variant_id: string | null;
  adjust_type: string | null;
  quantity: number;
  [key: string]: any;
}

interface StockMovementRecord {
  variant_id: string;
  item_id: string;
  sku: string;
  item_name: string;
  variant_name: string;
  category_name: string | null;
  stock_record: number;
  stock_in: number;
  stock_out: number;
  created_at: string;
}

interface StockMovementData {
  data: StockMovementRecord[];
  meta: Pagination;
  links: Link;
}

export interface PageProps {
  auth: {
    user: User | null;
  };
  [key: string]: any;
}

// order

export interface OrderHistories {
  data: Order[];
  meta: Pagination;
  links: Link;
}

export interface OrderItem {
  item_name: string;
  variant_name: string;
  sku: string | null;
  quantity: number;
  price_at_sale: number;
}

export interface Order {
  id: string;
  buyer_name: string;
  buyer_phone_number: string;
  total_amount: number;
  final_amount: number;
  discount: number;
  cashier_name: string;
  created_at: string;
  status: string;
  details: OrderItem[];
}

export interface OrderHistoryFilter {
  page: string;
  status: string;
  startDate: string;
  endDate: string;
  search: string;
}

// order
