import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Bell, TrendingUp, Package, DollarSign, ShoppingCart as OrdersIcon, Activity } from 'lucide-react';
import { ProductService } from '../../../shared/services/product.service';
import { OrderService } from '../../../shared/services/order.service';
import { useAuth } from '../../../shared/context/AuthContext';
import type { Product } from '../../../shared/types/product.types';
import { formatCurrency } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';
import { useSocket } from '../../../shared/context/SocketContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const { user, sellerProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0
  });
  const [newOrderNotify, setNewOrderNotify] = useState<any>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (user?.role === 'seller') {
      const myProducts = ProductService.getProductsBySeller(user.id);
      setProducts(myProducts);
      
      const myOrders = OrderService.getOrdersBySeller(user.id);
      const myRevenue = OrderService.getSellerRevenue(user.id);
      
      setStats({
        orders: myOrders.length,
        revenue: myRevenue
      });
    }

    if (socket) {
      socket.on('newOrder', (order: any) => {
        const hasMyItem = order.items?.some((item: any) => item.sellerId === user?.id);
        if (hasMyItem) {
          setNewOrderNotify(order);
          setTimeout(() => setNewOrderNotify(null), 10000);
          if (user) {
            const myOrders = OrderService.getOrdersBySeller(user.id);
            const myRevenue = OrderService.getSellerRevenue(user.id);
            setStats({
              orders: myOrders.length, revenue: myRevenue
            });
          }
        }
      });
    }

    return () => {
      if (socket) socket.off('newOrder');
    };
  }, [user, socket]);

  if (sellerProfile && !sellerProfile.isVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="bg-white p-8 rounded-sm border border-primary-100 max-w-2xl shadow-sm">
          <div className="w-16 h-16 bg-secondary-400 rounded-sm flex items-center justify-center mx-auto mb-6">
             <Activity className="w-8 h-8 text-primary-300" />
          </div>
          <h2 className="text-2xl font-black text-primary-500 mb-4 uppercase tracking-tighter">Verification in Progress</h2>
          <p className="text-primary-300 mb-8 font-medium">
            Your seller identity is being verified by our security team. 
            Estimated time: <span className="text-primary-500 font-black">24-48 Hours</span>.
          </p>
          <div className="text-[10px] font-black text-primary-500 bg-secondary-400/50 px-4 py-3 rounded-sm border border-primary-50 uppercase tracking-[0.2em]">
            Status: PENDING_APPROVAL
          </div>
        </div>
      </div>
    );
  }

  const revenueData = [
    { name: 'Jan', revenue: Math.max(0, stats.revenue * 0.4) },
    { name: 'Feb', revenue: Math.max(0, stats.revenue * 0.6) },
    { name: 'Mar', revenue: Math.max(0, stats.revenue * 0.55) },
    { name: 'Apr', revenue: Math.max(0, stats.revenue * 0.8) },
    { name: 'May', revenue: Math.max(0, stats.revenue * 0.9) },
    { name: 'Jun', revenue: stats.revenue },
  ];

  const topProducts = [...products].sort((a, b) => b.price - a.price).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-4 space-y-8">
      {/* Notification Toast */}
      {newOrderNotify && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:w-96 z-50 bg-primary-500 text-secondary-500 p-4 rounded-sm shadow-2xl flex items-center justify-between border-2 border-primary-600 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-secondary-500 rounded-sm text-primary-500">
              <Bell className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="font-black uppercase text-xs tracking-widest">Sale Alert!</p>
              <p className="text-[10px] font-bold opacity-80 truncate">Order #{newOrderNotify.id} • {formatCurrency(newOrderNotify.totalAmount)}</p>
            </div>
          </div>
          <button onClick={() => setNewOrderNotify(null)} className="p-2 hover:bg-white/10 rounded-sm">
            <Plus className="h-5 w-5 rotate-45" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4 sm:px-0">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-8 bg-primary-500 rounded-sm"></div>
              <p className="text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Live Insights</p>
           </div>
           <h1 className="text-3xl font-black text-primary-500 uppercase tracking-tighter italic">Merchant Desk</h1>
        </div>
        <Link to="/seller/products/add">
          <Button className="w-full sm:w-auto gap-2 py-6 rounded-sm font-black uppercase tracking-widest text-xs shadow-md">
            <Plus className="h-4 w-4" /> Add New Inventory
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 sm:px-0">
        <div className="bg-white p-6 rounded-sm border border-primary-50 shadow-sm relative overflow-hidden group transition-all hover:bg-secondary-50">
          <p className="text-[10px] font-black text-primary-300 uppercase tracking-widest mb-1 relative z-10">Active Products</p>
          <p className="text-4xl font-black text-primary-500 relative z-10">{products.length}</p>
          <Package className="absolute -bottom-4 -right-4 h-24 w-24 text-secondary-400 group-hover:text-primary-50 transition-colors" />
        </div>
        <div className="bg-white p-6 rounded-sm border border-primary-50 shadow-sm relative overflow-hidden group transition-all hover:bg-secondary-50">
          <p className="text-[10px] font-black text-primary-300 uppercase tracking-widest mb-1 relative z-10">Total Sales</p>
          <p className="text-4xl font-black text-primary-500 relative z-10">{stats.orders}</p>
          <OrdersIcon className="absolute -bottom-4 -right-4 h-24 w-24 text-secondary-400 group-hover:text-primary-50 transition-colors" />
        </div>
        <div className="bg-white p-6 rounded-sm border border-primary-50 shadow-sm relative overflow-hidden group transition-all hover:bg-secondary-50 bg-primary-50/50">
          <p className="text-[10px] font-black text-primary-300 uppercase tracking-widest mb-1 relative z-10">Revenue Net</p>
          <p className="text-4xl font-black text-primary-500 relative z-10">{formatCurrency(stats.revenue)}</p>
          <DollarSign className="absolute -bottom-4 -right-4 h-24 w-24 text-secondary-400 group-hover:text-primary-50 transition-colors" />
        </div>
      </div>

      {/* Analytics & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-0">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-sm border border-primary-50 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-secondary-400 rounded-sm text-primary-500">
               <TrendingUp className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-black text-primary-500 uppercase tracking-widest">Revenue Velocity</h2>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#082052" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#082052" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: '#A3B4CC', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis hide />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', border: '1px solid #082052', borderRadius: '0', fontSize: '10px' }}
                   formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#082052" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" dot={{ r: 4, fill: '#082052' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Movers */}
        <div className="bg-white p-6 rounded-sm border border-primary-50 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-secondary-400 rounded-sm text-primary-500">
               <Activity className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-black text-primary-500 uppercase tracking-widest">Top Inventory Movers</h2>
          </div>
          <div className="flex-1 space-y-4">
            {topProducts.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[10px] font-black text-primary-200 uppercase tracking-widest">
                Analytics engine awaiting initial sales data
              </div>
            ) : (
              topProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 border border-secondary-400/50 hover:border-primary-100 rounded-sm transition-all bg-secondary-50/50 group">
                  <div className="h-14 w-14 flex-shrink-0 bg-white border border-secondary-400 p-1 rounded-sm overflow-hidden">
                    <img src={p.imageUrl} alt="" className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-primary-500 uppercase truncate tracking-tight">{p.name}</p>
                    <p className="text-[10px] font-black text-primary-300 italic">{formatCurrency(p.price)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-primary-500 bg-secondary-400 px-2 py-1 rounded-sm uppercase tracking-tighter">
                      {p.stock} Units
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Inventory Table/List */}
      <div className="bg-white rounded-sm border border-primary-50 shadow-sm overflow-hidden mx-4 sm:mx-0">
        <div className="px-6 py-5 border-b border-primary-50 flex items-center justify-between">
          <h2 className="text-xs font-black text-primary-500 uppercase tracking-[0.2em]">Latest Inventory Items</h2>
          <Link to="/seller/products" className="text-[10px] font-black text-primary-300 uppercase tracking-widest hover:text-primary-500 transition-colors underline underline-offset-4">Manage All</Link>
        </div>
        <div className="divide-y divide-primary-50">
          {products.length === 0 ? (
            <div className="p-10 text-center text-[10px] font-black text-primary-200 uppercase tracking-widest">
              Digital warehouse is currently empty
            </div>
          ) : (
            products.slice(0, 5).map((p) => (
              <div key={p.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-secondary-50 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-sm bg-white border border-secondary-400/50 flex flex-shrink-0 items-center justify-center overflow-hidden p-1">
                    <img src={p.imageUrl} alt="" className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-primary-500 uppercase truncate tracking-tight">{p.name}</p>
                    <p className="text-[10px] font-bold text-primary-300">{formatCurrency(p.price)}</p>
                  </div>
                </div>
                <div className="hidden sm:block text-[10px] font-black text-primary-200 uppercase tracking-widest italic truncate max-w-[150px]">
                   {p.category}
                </div>
                <div className="text-[10px] font-black text-primary-500 bg-secondary-400 px-3 py-1.5 rounded-sm border border-primary-50 uppercase tracking-tighter ml-4">
                  STK: {p.stock}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
