
import type { Order } from '../types/order.types';

const ORDERS_KEY = 'jesify_orders';

export const OrderService = {
  getAllOrders: (): Order[] => {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getOrdersBySeller: (sellerId: string): Order[] => {
    const all = OrderService.getAllOrders();
    // Filter orders that contain items from this seller
    // Note: An order might have items from multiple sellers. 
    // For a seller dashboard, we might want to show the whole order or just their items.
    // For simplicity, we'll return the whole order if it contains any item from the seller.
    return all.filter(order => order.items.some(item => item.sellerId === sellerId));
  },

  getOrdersByUser: (userId: string): Order[] => {
    const all = OrderService.getAllOrders();
    return all.filter(order => order.userId === userId);
  },

  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const all = OrderService.getAllOrders();
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    };
    all.unshift(newOrder); // Add to top
    localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
    return newOrder;
  },

  updateOrderStatus: async (orderId: string, status: Order['status'], socket?: any) => {
    // 1. Update Local Storage (Mock)
    const all = OrderService.getAllOrders();
    const updated = all.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));

    // 2. Call Backend API
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      // The backend will emit the socket event, 
      // but we can also emit locally for immediate UI update if needed
      if (socket) {
        socket.emit('orderUpdate', { id: orderId, status });
      }
    } catch (error) {
      console.error('Failed to update order status on backend:', error);
    }
  },

  // Helper to calculate revenue for a specific seller
  getSellerRevenue: (sellerId: string): number => {
    const orders = OrderService.getOrdersBySeller(sellerId);
    return orders.reduce((total, order) => {
      const sellerItems = order.items.filter(item => item.sellerId === sellerId);
      const orderRevenue = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return total + orderRevenue;
    }, 0);
  },

  // Helper for platform revenue (10% commission mock)
  getPlatformRevenue: (): number => {
    const all = OrderService.getAllOrders();
    const totalSales = all.reduce((sum, order) => sum + order.totalAmount, 0);
    return totalSales * 0.1; // 10% commission
  }
};
