export type UserRole = 'cashier' | 'manager' | 'owner';

export interface Product {
  id: string;
  name: string;
  category: string;
  packSize: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  image?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'cash' | 'pos' | 'transfer';

export interface Sale {
  id: string;
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  cashier: string;
  date: string;
  timestamp: number;
}

export interface InventoryInflow {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  date: string;
  addedBy: string;
}

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  topProduct: string;
  cashCount: number;
  posCount: number;
  transferCount: number;
}
