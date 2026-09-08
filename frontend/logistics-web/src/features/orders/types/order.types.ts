export type OrderStatus =
  | 'CREATED'
  | 'PENDING_STOCK'
  | 'STOCK_RESERVED'
  | 'CONFIRMED'
  | 'READY_FOR_DELIVERY'
  | 'DELIVERING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'OUT_OF_STOCK';

export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'CREDIT_CARD';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export interface OrderItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface OrderStatusHistory {
  id: string;
  fromStatus?: OrderStatus;
  toStatus: OrderStatus;
  reason?: string;
  updatedBy: string;
  role: string;
  createdAt: string;
}

export interface Order {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  warehouseId: string;
  warehouseName: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  driverName?: string;
  driverPhone?: string;
  vehiclePlate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusHistory[];
}

export interface ProductInventoryOption {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  availableStock: number;
  reservedStock: number;
  totalStock: number;
  warehouseId: string;
  warehouseName: string;
}

export interface CustomerOption {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: string[];
}
