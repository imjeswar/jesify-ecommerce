import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, Search, Filter, ChevronRight, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { OrderService } from '../../../shared/services/order.service';
import type { Order } from '../../../shared/types/order.types';
import { formatCurrency } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';

export const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const showSuccess = searchParams.get('success') === 'true';

  const loadOrders = useCallback(() => {
    if (user?.id) {
      const userOrders = OrderService.getOrdersByUser(user.id);
      userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(userOrders);
    }
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600';
      case 'SHIPPED': return 'text-purple-600';
      case 'CANCELLED': return 'text-red-600';
      case 'PROCESSING': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle className="w-4 h-4" />;
      case 'SHIPPED': return <Truck className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Please Login</h2>
        <p className="text-gray-500">You need to be logged in to view your orders.</p>
        <Link to="/login">
          <Button>Login Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       {/* Breadcrumb / Header */}
       <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">My Orders</span>
       </div>

       {showSuccess && (
         <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Order placed successfully!
         </div>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar (Visual only for now) */}
          <div className="hidden lg:block space-y-4">
             <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                   <Filter className="w-4 h-4" /> Filters
                </h3>
                
                <div className="space-y-4">
                   <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Order Status</h4>
                      <div className="space-y-2">
                         {['On the way', 'Delivered', 'Cancelled', 'Returned'].map(status => (
                            <div key={status} className="flex items-center gap-2">
                               <input type="checkbox" id={status} className="rounded border-gray-300" />
                               <label htmlFor={status} className="text-sm text-gray-700">{status}</label>
                            </div>
                         ))}
                      </div>
                   </div>
                   
                   <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Order Time</h4>
                      <div className="space-y-2">
                         {['Last 30 days', '2025', '2024', 'Older'].map(time => (
                            <div key={time} className="flex items-center gap-2">
                               <input type="checkbox" id={time} className="rounded border-gray-300" />
                               <label htmlFor={time} className="text-sm text-gray-700">{time}</label>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-3 space-y-4">
             {/* Search Bar */}
             <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-4">
                <div className="relative">
                   <input 
                      type="text" 
                      placeholder="Search your orders here..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-primary-500"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                   />
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                   {searchTerm && (
                      <Button 
                         variant="ghost" 
                         size="sm" 
                         className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white hover:bg-primary-700 rounded-sm px-4 h-8"
                      >
                         Search Orders
                      </Button>
                   )}
                </div>
             </div>

             {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-8 text-center">
                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-12 h-12 text-gray-400" />
                   </div>
                   <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                   <p className="text-gray-500 mt-2 mb-6">Looks like you haven't placed any orders yet.</p>
                   <Link to="/">
                      <Button className="bg-primary-600 hover:bg-primary-700 text-white px-8 rounded-sm">
                         Start Shopping
                      </Button>
                   </Link>
                </div>
             ) : (
                filteredOrders.map(order => (
                   <div key={order.id} className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      {/* Order Header */}
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center text-sm">
                         <div className="flex gap-8">
                            <div>
                               <span className="uppercase text-xs font-bold text-gray-500 block">Order Placed</span>
                               <span className="text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                               <span className="uppercase text-xs font-bold text-gray-500 block">Total</span>
                               <span className="text-gray-700">{formatCurrency(order.totalAmount)}</span>
                            </div>
                            <div>
                               <span className="uppercase text-xs font-bold text-gray-500 block">Ship To</span>
                               <span className="text-gray-700 relative group cursor-pointer">
                                  {order.userName}
                                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-white shadow-lg border border-gray-200 p-3 rounded text-xs hidden group-hover:block z-10">
                                     <p className="font-bold mb-1">{order.userName}</p>
                                     <p>{order.shippingAddress}</p>
                                  </div>
                               </span>
                            </div>
                         </div>
                         <div className="text-gray-500">
                            Order # {order.id}
                         </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                         {order.items.map((item, index) => (
                            <div key={`${order.id}-${index}`} className="flex gap-6 mb-6 last:mb-0">
                               <div className="w-20 h-20 flex-shrink-0 border border-gray-200 p-1 bg-white">
                                  <img 
                                     src={item.imageUrl || 'https://via.placeholder.com/150'} 
                                     alt={item.name} 
                                     className="w-full h-full object-contain"
                                  />
                               </div>
                               <div className="flex-1">
                                  <Link to={`/product/${item.productId}`} className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2">
                                     {item.name}
                                  </Link>
                                  <div className="text-sm text-gray-500 mt-1">Seller: {item.sellerId}</div>
                                  <div className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(item.price)} x {item.quantity}</div>
                               </div>
                               <div className="w-48">
                                  <div className={`flex items-center gap-2 font-medium ${getStatusColor(order.status)}`}>
                                     {getStatusIcon(order.status)}
                                     <span>{order.status}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                     Your item has been {order.status.toLowerCase()}
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end gap-4">
                         {order.status === 'DELIVERED' && (
                            <Button variant="outline" size="sm" className="text-primary-600 border-primary-600 hover:bg-primary-50">
                               Write a Product Review
                            </Button>
                         )}
                         <Button variant="outline" size="sm">
                            View Order Details
                         </Button>
                         <Button variant="outline" size="sm">
                            Invoice
                         </Button>
                      </div>
                   </div>
                ))
             )}
          </div>
       </div>
    </div>
  );
};
