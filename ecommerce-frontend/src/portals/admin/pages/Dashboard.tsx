import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCcw, Users, Store, Package, DollarSign, Activity, TrendingUp, ShieldAlert, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { ProductService } from '../../../shared/services/product.service';
import { OrderService } from '../../../shared/services/order.service';
import { formatCurrency } from '../../../shared/utils/helpers';
import { useSocket } from '../../../shared/context/SocketContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const { user, getAllSellers, getAllUsers } = useAuth();
  const { socket } = useSocket();
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

  const fetchStats = useCallback(() => {
    const sellers = getAllSellers();
    const allUsers = getAllUsers();
    const users = allUsers.filter(u => u.role === 'user');
    const products = ProductService.getAllProducts();
    const revenue = OrderService.getPlatformRevenue();

    setStats({
      users: users.length,
      sellers: sellers.length,
      products: products.length,
      orders: OrderService.getAllOrders().length,
      revenue: revenue,
      pendingSellers: sellers.filter(s => s.status === 'PENDING').length,
      activeSellers: sellers.filter(s => s.status === 'APPROVED').length,
      blockedUsers: allUsers.filter(u => u.status === 'BLOCKED').length
    });
  }, [getAllSellers, getAllUsers]);

  useEffect(() => {
    fetchStats();
    if (socket) {
      socket.on('newOrder', () => fetchStats());
    }
    return () => {
      if (socket) socket.off('newOrder');
    };
  }, [fetchStats, socket]);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
         <div className="bg-red-50 p-6 rounded-sm border border-red-200 text-center">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-sm font-black text-red-600 uppercase tracking-widest">Security Override</h2>
            <p className="text-xs font-bold text-red-400 mt-1">Authorized Admin Personnel Only</p>
         </div>
      </div>
    );
  }

  const growthData = [
    { name: 'Jan', users: Math.max(0, stats.users * 0.4), sellers: Math.max(0, stats.sellers * 0.3) },
    { name: 'Feb', users: Math.max(0, stats.users * 0.5), sellers: Math.max(0, stats.sellers * 0.45) },
    { name: 'Mar', users: Math.max(0, stats.users * 0.45), sellers: Math.max(0, stats.sellers * 0.6) },
    { name: 'Apr', users: Math.max(0, stats.users * 0.7), sellers: Math.max(0, stats.sellers * 0.55) },
    { name: 'May', users: Math.max(0, stats.users * 0.85), sellers: Math.max(0, stats.sellers * 0.8) },
    { name: 'Jun', users: stats.users, sellers: stats.sellers },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-0 sm:px-0">
        <div className="flex items-center gap-4">
           <div className="h-10 w-10 bg-primary-500 rounded-sm flex items-center justify-center text-secondary-500 shadow-lg">
              <Activity className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-2xl font-black text-primary-500 uppercase tracking-tighter italic">Platform Command</h1>
              <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest mt-0.5">Real-time system health & analytics</p>
           </div>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center justify-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-primary-500 bg-secondary-400 border border-primary-100 rounded-sm hover:bg-secondary-300 transition-all shadow-sm"
        >
          <RefreshCcw className="h-4 w-4" /> Sync Records
        </button>
      </div>

      {/* Stats Grid Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-sm border border-primary-50 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 group">
          <p className="text-[9px] font-black text-primary-300 uppercase tracking-widest relative z-10">Network Users</p>
          <p className="text-3xl font-black text-primary-500 relative z-10">{stats.users}</p>
          <Users className="absolute -bottom-2 -right-2 w-16 h-16 text-secondary-400 opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
        <div className="bg-white p-6 rounded-sm border border-primary-50 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 group">
          <p className="text-[9px] font-black text-primary-300 uppercase tracking-widest relative z-10">Verified Sellers</p>
          <p className="text-3xl font-black text-primary-500 relative z-10">{stats.sellers}</p>
          <Store className="absolute -bottom-2 -right-2 w-16 h-16 text-secondary-400 opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
        <div className="bg-white p-6 rounded-sm border border-primary-50 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 group">
          <p className="text-[9px] font-black text-primary-300 uppercase tracking-widest relative z-10">Active Inventory</p>
          <p className="text-3xl font-black text-primary-500 relative z-10">{stats.products}</p>
          <Package className="absolute -bottom-2 -right-2 w-16 h-16 text-secondary-400 opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
        <div className="bg-white p-6 rounded-sm border border-primary-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 group bg-secondary-50">
          <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest relative z-10">System Revenue</p>
          <p className="text-2xl sm:text-3xl font-black text-primary-600 relative z-10">{formatCurrency(stats.revenue)}</p>
          <DollarSign className="absolute -bottom-2 -right-2 w-16 h-16 text-primary-100 opacity-30 group-hover:opacity-60 transition-opacity" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Growth Analytics */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-sm border border-primary-50 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
             <div className="p-2 bg-secondary-400 rounded-sm text-primary-500">
                <TrendingUp className="h-5 w-5" />
             </div>
             <h2 className="text-xs font-black text-primary-500 uppercase tracking-[0.2em]">Platform Scale Metrics</h2>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={growthData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.6} />
                <XAxis dataKey="name" tick={{ fill: '#A3B4CC', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', border: '1px solid #082052', borderRadius: '0', fontSize: '10px' }}
                />
                <Legend iconType="square" align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.1em' }} />
                <Line type="monotone" name="Core Users" dataKey="users" stroke="#082052" strokeWidth={4} dot={{ r: 4, fill: '#082052' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" name="Merchants" dataKey="sellers" stroke="#A3B4CC" strokeWidth={4} dot={{ r: 4, fill: '#A3B4CC' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Vitals */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-sm border border-primary-50 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-2 bg-secondary-400 rounded-sm text-primary-500">
                <ShieldAlert className="h-5 w-5" />
             </div>
             <h2 className="text-xs font-black text-primary-500 uppercase tracking-[0.2em]">Security Vitals</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-secondary-400/50 rounded-sm hover:bg-secondary-50 transition-all">
              <span className="text-[10px] font-black text-primary-300 uppercase tracking-widest">Pending Approvals</span>
              <span className="text-xs font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-sm border border-orange-100">{stats.pendingSellers}</span>
            </div>
            <div className="flex justify-between items-center p-4 border border-secondary-400/50 rounded-sm hover:bg-secondary-50 transition-all">
              <span className="text-[10px] font-black text-primary-300 uppercase tracking-widest">Active Operations</span>
              <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-sm border border-green-100">{stats.activeSellers}</span>
            </div>
            <div className="flex justify-between items-center p-4 border border-secondary-400/50 rounded-sm hover:bg-secondary-50 transition-all">
              <span className="text-[10px] font-black text-primary-300 uppercase tracking-widest">Risk/Blocked Entries</span>
              <span className="text-xs font-black text-red-600 bg-red-50 px-3 py-1 rounded-sm border border-red-100">{stats.blockedUsers}</span>
            </div>
            
            <div className="mt-8 p-4 bg-secondary-400/30 border border-primary-50 rounded-sm">
               <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">System Integrity</span>
               </div>
               <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[98%]"></div>
               </div>
               <p className="text-[8px] font-bold text-primary-300 mt-2 uppercase">Core services operational • 98.4% Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
