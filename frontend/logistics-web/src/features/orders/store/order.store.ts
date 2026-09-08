import { create } from 'zustand';

import { INITIAL_ORDERS } from '../mock/orders.mock';
import type { Order, OrderStatus } from '../types/order.types';

interface OrderStore {
  orders: Order[];
  getOrderById: (id: string) => Order | undefined;
  createOrder: (data: {
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    shippingAddress: string;
    warehouseId: string;
    warehouseName: string;
    items: {
      productId: string;
      sku: string;
      name: string;
      unitPrice: number;
      quantity: number;
    }[];
    notes?: string;
    paymentMethod: 'COD' | 'BANK_TRANSFER' | 'CREDIT_CARD';
  }) => Order;
  confirmOrder: (id: string, operatorName?: string) => boolean;
  dispatchOrder: (id: string, driverName: string, vehiclePlate: string) => boolean;
  completeOrder: (id: string) => boolean;
  cancelOrder: (id: string, reason: string, operatorName?: string) => boolean;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: INITIAL_ORDERS,

  getOrderById: (id: string) => {
    return get().orders.find((o) => o.id === id || o.code === id);
  },

  createOrder: (data) => {
    const nextIndex = get().orders.length + 1;
    const orderCode = `ORD-2026-${String(nextIndex).padStart(3, '0')}`;
    const orderId = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    const items = data.items.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      productId: item.productId,
      sku: item.sku,
      name: item.name,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      subtotal: item.unitPrice * item.quantity,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingFee = subtotal > 100000000 ? 0 : 500000;
    const tax = Math.round(subtotal * 0.1);
    const totalAmount = subtotal + shippingFee + tax;

    const newOrder: Order = {
      id: orderId,
      code: orderCode,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      shippingAddress: data.shippingAddress,
      warehouseId: data.warehouseId,
      warehouseName: data.warehouseName,
      items,
      subtotal,
      shippingFee,
      tax,
      totalAmount,
      status: 'PENDING_STOCK',
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          id: `h-${Date.now()}-1`,
          toStatus: 'CREATED',
          updatedBy: 'Hệ thống Quản trị Đơn hàng',
          role: 'SYSTEM',
          reason: 'Tạo đơn hàng thành công từ cổng quản trị.',
          createdAt: now,
        },
        {
          id: `h-${Date.now()}-2`,
          fromStatus: 'CREATED',
          toStatus: 'PENDING_STOCK',
          updatedBy: 'Hệ thống Orchestrator',
          role: 'SYSTEM',
          reason: 'Đang kiểm tra và giữ tồn kho (Reserve Stock) tại kho xuất hàng.',
          createdAt: now,
        },
      ],
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
    }));

    return newOrder;
  },

  confirmOrder: (id: string, operatorName = 'Nguyễn Thu Trang (Operator)') => {
    const order = get().getOrderById(id);
    if (!order) return false;
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') return false;

    const now = new Date().toISOString();
    const updatedHistory = [
      ...order.statusHistory,
      {
        id: `h-${Date.now()}`,
        fromStatus: order.status,
        toStatus: 'CONFIRMED' as OrderStatus,
        updatedBy: operatorName,
        role: 'OPERATOR',
        reason: 'Xác nhận giữ kho thành công (Stock Reserved) & Duyệt điều kiện thanh toán.',
        createdAt: now,
      },
    ];

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: 'CONFIRMED',
              updatedAt: now,
              statusHistory: updatedHistory,
            }
          : o
      ),
    }));

    return true;
  },

  dispatchOrder: (id: string, driverName: string, vehiclePlate: string) => {
    const order = get().getOrderById(id);
    if (!order) return false;

    const now = new Date().toISOString();
    const updatedHistory = [
      ...order.statusHistory,
      {
        id: `h-${Date.now()}`,
        fromStatus: order.status,
        toStatus: 'DELIVERING' as OrderStatus,
        updatedBy: 'Phòng Điều Phối Vận Tải',
        role: 'DELIVERY_MANAGER',
        reason: `Bàn giao kiện hàng cho tài xế ${driverName} (${vehiclePlate}) bắt đầu hành trình.`,
        createdAt: now,
      },
    ];

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: 'DELIVERING',
              driverName,
              vehiclePlate,
              updatedAt: now,
              statusHistory: updatedHistory,
            }
          : o
      ),
    }));

    return true;
  },

  completeOrder: (id: string) => {
    const order = get().getOrderById(id);
    if (!order) return false;

    const now = new Date().toISOString();
    const updatedHistory = [
      ...order.statusHistory,
      {
        id: `h-${Date.now()}`,
        fromStatus: order.status,
        toStatus: 'COMPLETED' as OrderStatus,
        updatedBy: order.driverName ? `Tài xế ${order.driverName}` : 'Hệ thống Bàn Giao',
        role: 'DRIVER',
        reason: 'Khách hàng đã kiểm tra và ký nhận e-POD thành công. Đơn hàng hoàn tất (BR-04: Cấm hủy).',
        createdAt: now,
      },
    ];

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: 'COMPLETED',
              paymentStatus: 'PAID',
              updatedAt: now,
              statusHistory: updatedHistory,
            }
          : o
      ),
    }));

    return true;
  },

  cancelOrder: (id: string, reason: string, operatorName = 'Nguyễn Thu Trang (Operator)') => {
    const order = get().getOrderById(id);
    if (!order) return false;

    // BR-04: COMPLETED order cannot be cancelled
    if (order.status === 'COMPLETED') {
      return false;
    }

    const now = new Date().toISOString();
    const updatedHistory = [
      ...order.statusHistory,
      {
        id: `h-${Date.now()}`,
        fromStatus: order.status,
        toStatus: 'CANCELLED' as OrderStatus,
        updatedBy: operatorName,
        role: 'OPERATOR',
        reason: `Hủy đơn: ${reason}. Đã kích hoạt giải phóng tồn kho đã giữ (Release Reservation theo BR-05).`,
        createdAt: now,
      },
    ];

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: 'CANCELLED',
              paymentStatus: o.paymentStatus === 'PAID' ? 'REFUNDED' : o.paymentStatus,
              updatedAt: now,
              statusHistory: updatedHistory,
            }
          : o
      ),
    }));

    return true;
  },
}));
