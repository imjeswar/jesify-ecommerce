import React, { useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { ProductService } from '../../../shared/services/product.service';
import { OrderService } from '../../../shared/services/order.service';
import { formatCurrency } from '../../../shared/utils/helpers';

export const Dashboard: React.FC = () => {
  const { user, getAllSellers, getAllUsers } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    sellers: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    pendingSellers: 0,
    activeSellers: 0,
    blockedUsers: 0
  });

  const fetchStats = React.useCallback(() => {
    const sellers = getAllSellers();
    const users = getAllUsers().filter(u => u.role === 'user');
    const products = ProductService.getAllProducts();
    const orders = OrderService.getAllOrders();
    const revenue = OrderService.getPlatformRevenue(); // 10% of total sales

    setStats({
      users: users.length,
      sellers: sellers.length,
      products: products.length,
      orders: orders.length,
      revenue: revenue,
      pendingSellers: sellers.filter(s => s.status === 'PENDING').length,
      activeSellers: sellers.filter(s => s.status === 'APPROVED').length,
      blockedUsers: users.filter(u => u.status === 'BLOCKED').length
    });
  }, [getAllSellers, getAllUsers]);

  useEffect(() => {
    fetchStats();

    // Optional: Add an interval to auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-red-600">Access Denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh Stats
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Sellers</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.sellers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.products}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Platform Revenue</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.revenue)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">System Status</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-600">Pending Sellers</span>
            <span className="font-bold text-orange-600">{stats.pendingSellers}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-600">Active Sellers</span>
            <span className="font-bold text-green-600">{stats.activeSellers}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-600">Blocked Users</span>
            <span className="font-bold text-red-600">{stats.blockedUsers}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
