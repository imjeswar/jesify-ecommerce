import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, Search, ChevronRight, Truck, CheckCircle, Clock, XCircle, MapPin, Receipt, MessageSquare } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { useSocket } from '../../../shared/context/SocketContext';
import { OrderService } from '../../../shared/services/order.service';
import type { Order } from '../../../shared/types/order.types';
import { formatCurrency } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';
import { cn } from '../../../shared/utils/cn';

export const Orders: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const showSuccess = searchParams.get('success') === 'true';

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadOrders = useCallback(() => {
    if (user?.id) {
      const userOrders = OrderService.getOrdersByUser(user.id);
      userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(userOrders);
    }
  }, [user]);

  useEffect(() => {
    loadOrders();
    if (socket) {
      socket.on('orderUpdate', (updatedOrder: Order) => {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        OrderService.updateOrderStatus(updatedOrder.id, updatedOrder.status);
      });
    }
    return () => {
      if (socket) socket.off('orderUpdate');
    };
  }, [loadOrders, socket]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600';
      case 'SHIPPED': return 'text-primary-500';
      case 'CANCELLED': return 'text-red-600';
      case 'PROCESSING': return 'text-orange-600';
      default: return 'text-primary-300';
    }
  };

  const getDemoStatus = (order: Order, currentTimestamp: number) => {
    if (order.status === 'CANCELLED') return { step: -1, text: 'Order Cancelled', displayStatus: 'CANCELLED', icon: <XCircle className="w-4 h-4" /> };
    const ageInSeconds = Math.floor((currentTimestamp - new Date(order.createdAt).getTime()) / 1000);
    if (ageInSeconds < 24) return { step: 1, text: 'Order Placed', displayStatus: 'PENDING', icon: <Clock className="w-4 h-4" /> };
    if (ageInSeconds < 48) return { step: 2, text: 'Packed & Dispatched', displayStatus: 'PROCESSING', icon: <Package className="w-4 h-4" /> };
    if (ageInSeconds < 72) return { step: 3, text: 'Arrived at Hub', displayStatus: 'SHIPPED', icon: <Truck className="w-4 h-4" /> };
    if (ageInSeconds < 96) return { step: 4, text: 'Out for Delivery', displayStatus: 'SHIPPED', icon: <Truck className="w-4 h-4" /> };
    return { step: 6, text: 'Delivered Successfully', displayStatus: 'DELIVERED', icon: <CheckCircle className="w-4 h-4" /> };
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4 text-center">
        <div className="w-20 h-20 bg-secondary-400 rounded-sm flex items-center justify-center">
           <ShieldAlert className="w-10 h-10 text-primary-300" />
        </div>
        <div>
           <h2 className="text-2xl font-black text-primary-500 uppercase tracking-tighter">Access Denied</h2>
           <p className="text-primary-300 font-medium">Please authorize your account to view order history.</p>
        </div>
        <Link to="/login">
          <Button className="px-10 py-6 rounded-sm uppercase font-black tracking-widest text-xs">Authorize Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
       {/* Mobile Header */}
       <div className="px-4 sm:px-0 space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary-200 uppercase tracking-[0.2em]">
             <Link to="/" className="hover:text-primary-500">Home</Link>
             <ChevronRight className="w-3 h-3" />
             <span className="text-primary-500">History</span>
          </div>
          <h1 className="text-3xl font-black text-primary-500 uppercase tracking-tighter italic">Order Vault</h1>
       </div>

       {showSuccess && (
         <div className="mx-4 sm:mx-0 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-sm flex items-center gap-4 animate-in slide-in-from-left duration-300 shadow-sm font-bold text-sm">
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <div>
               <p className="uppercase tracking-widest text-[10px] font-black opacity-80 mb-0.5">Success</p>
               Order confirmed. Transmission received.
            </div>
         </div>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 sm:px-0">
          {/* Desktop Filters (Hidden on Mobile) */}
          <div className="hidden lg:block space-y-6">
             <div className="bg-white rounded-sm border border-primary-50 p-6 shadow-sm">
                <h3 className="text-xs font-black text-primary-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   <div className="h-1 w-4 bg-primary-500 rounded-sm"></div> Filter Params
                </h3>
                <div className="space-y-6">
                   <div>
                      <h4 className="text-[10px] font-black text-primary-200 uppercase mb-3">Status Matrix</h4>
                      <div className="space-y-3">
                         {['On the way', 'Delivered', 'Cancelled'].map(s => (
                            <label key={s} className="flex items-center gap-3 cursor-pointer group">
                               <input type="checkbox" className="w-4 h-4 rounded-sm border-primary-100 text-primary-500 focus:ring-0" />
                               <span className="text-xs font-medium text-primary-400 group-hover:text-primary-500">{s}</span>
                            </label>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
             {/* Search Component */}
             <div className="bg-white rounded-sm border border-primary-50 p-4 shadow-sm">
                <div className="relative">
                   <input 
                      type="text" 
                      placeholder="Locate order ID or item name..." 
                      className="w-full pl-12 pr-4 py-4 border-none bg-secondary-400/30 font-bold text-xs uppercase tracking-tight text-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-sm placeholder:opacity-50"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                   />
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-200 w-5 h-5" />
                </div>
             </div>

             {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-sm border border-primary-50 p-20 text-center shadow-sm">
                   <Package className="w-16 h-16 text-secondary-400 mx-auto mb-6" />
                   <h3 className="text-lg font-black text-primary-500 uppercase tracking-tighter">No Records Found</h3>
                   <p className="text-primary-300 text-xs font-medium mt-2 mb-8">Your digital shipment history is currently clear.</p>
                   <Link to="/">
                      <Button className="px-10 py-5 rounded-sm uppercase font-black tracking-widest text-[10px] shadow-lg">Start Scouting</Button>
                   </Link>
                </div>
             ) : (
                filteredOrders.map(order => {
                   const demo = getDemoStatus(order, now);
                   return (
                    <div key={order.id} className="bg-white rounded-sm border border-primary-50 shadow-sm overflow-hidden hover:border-primary-100 transition-all group">
                       {/* Mobile-Friendly Header */}
                       <div className="bg-secondary-400/30 px-4 sm:px-6 py-4 border-b border-primary-50 flex flex-col sm:flex-row gap-4 sm:justify-between items-start sm:items-center">
                          <div className="grid grid-cols-2 sm:flex gap-6 sm:gap-10 w-full sm:w-auto">
                             <div>
                                <span className="text-[10px] font-black text-primary-200 uppercase tracking-widest block mb-1">TX Date</span>
                                <span className="text-xs font-black text-primary-500 uppercase">{new Date(order.createdAt).toLocaleDateString()}</span>
                             </div>
                             <div>
                                <span className="text-[10px] font-black text-primary-200 uppercase tracking-widest block mb-1">Total Net</span>
                                <span className="text-xs font-black text-primary-500">{formatCurrency(order.totalAmount)}</span>
                             </div>
                             <div className="hidden sm:block">
                                <span className="text-[10px] font-black text-primary-200 uppercase tracking-widest block mb-1">Method</span>
                                <span className="text-xs font-black text-primary-500 uppercase">{order.paymentMethod === 'DUMMY' ? 'Digital' : (order.paymentMethod || 'COD')}</span>
                             </div>
                          </div>
                          <div className="text-[10px] font-black text-primary-300 uppercase tracking-[0.2em] font-mono w-full sm:w-auto text-left sm:text-right border-t sm:border-none pt-2 sm:pt-0">
                             TX-#{order.id.slice(-12).toUpperCase()}
                          </div>
                       </div>

                       {/* Items Section */}
                       <div className="p-4 sm:p-6 space-y-6">
                           {order.items.map((item, index) => (
                             <div key={`${order.id}-${index}`} className="flex flex-col sm:flex-row gap-5 sm:gap-8 pb-6 last:pb-0 border-b last:border-0 border-primary-50">
                                <div className="flex gap-5 sm:gap-8 flex-1">
                                   <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-white border border-secondary-400 p-2 rounded-sm group-hover:scale-105 transition-transform duration-300">
                                      <img src={item.imageUrl} alt="" className="w-full h-full object-contain" />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                      <Link to={`/product/${item.productId}`} className="text-xs sm:text-sm font-black text-primary-500 uppercase tracking-tight line-clamp-2 hover:text-primary-700 leading-tight">
                                         {item.name}
                                      </Link>
                                      <div className="flex items-center gap-3 mt-2">
                                         <span className="text-[10px] font-black text-primary-500 tabular-nums">{formatCurrency(item.price)}</span>
                                         <span className="text-[10px] font-bold text-primary-200 uppercase">Q: {item.quantity}</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="sm:w-56 flex flex-row sm:flex-col justify-between items-center sm:items-start pt-2 sm:pt-0 border-t sm:border-none border-primary-50/50">
                                   <div className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", getStatusColor(demo.displayStatus))}>
                                      {demo.icon}
                                      <span>{demo.displayStatus}</span>
                                   </div>
                                   <div className="text-[10px] font-bold text-primary-300 mt-1 uppercase italic">
                                      {demo.text}
                                   </div>
                                </div>
                             </div>
                           ))}
                       </div>

                       {/* Mobile-Friendly Footer */}
                       <div className="bg-white px-4 sm:px-6 py-4 border-t border-primary-50 flex flex-col sm:flex-row justify-end gap-3">
                           <button 
                             onClick={() => { setSelectedOrder(order); setShowOrderDetails(true); }}
                             className="flex-1 sm:flex-none px-6 py-3 bg-secondary-400/50 hover:bg-secondary-400 rounded-sm text-[10px] font-black text-primary-500 uppercase tracking-widest transition-all"
                           >
                              Trace Log
                           </button>
                           <button 
                             onClick={() => { setSelectedOrder(order); setShowInvoice(true); }}
                             className="flex-1 sm:flex-none px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-sm text-[10px] font-black text-secondary-500 uppercase tracking-widest transition-all shadow-md"
                           >
                              Asset Invoice
                           </button>
                       </div>
                    </div>
                   );
                })
             )}
          </div>
       </div>

       {/* TRACKING MODAL */}
       {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-primary-600/80 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-t-xl sm:rounded-sm shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
              <div className="px-6 py-5 bg-primary-500 text-secondary-500 flex justify-between items-center">
                 <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em]">Operational Trace</h2>
                    <p className="text-[10px] font-bold opacity-80 mt-0.5 font-mono">ID: #{selectedOrder.id}</p>
                 </div>
                 <button onClick={() => setShowOrderDetails(false)} className="p-2 hover:bg-white/10 rounded-sm">
                    <XCircle className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="p-6 sm:p-8 space-y-8">
                 <div className="space-y-8 relative">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-primary-50"></div>
                    {['Dispatched', 'Transit', 'Arrived', 'Delivery', 'Delivered'].map((label, idx) => {
                       const currentStep = getDemoStatus(selectedOrder, now).step;
                       const stepIdx = idx + 1;
                       const isDone = currentStep > stepIdx;
                       const isNow = currentStep === stepIdx;
                       
                       return (
                         <div key={label} className={cn("relative pl-12 transition-opacity", currentStep < stepIdx && "opacity-30")}>
                            <div className={cn(
                              "absolute left-0 top-1 w-6.5 h-6.5 rounded-sm border-2 flex items-center justify-center transition-all",
                              isDone ? "bg-primary-500 border-primary-500 text-secondary-500" : 
                              isNow ? "bg-white border-primary-500 text-primary-500 animate-pulse shadow-lg scale-110" : 
                              "bg-white border-primary-50 text-primary-100"
                            )}>
                               {isDone ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-3 h-3" />}
                            </div>
                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest leading-none">{label}</p>
                            <p className="text-[9px] font-bold text-primary-200 mt-1 lowercase">Transmission record verified</p>
                         </div>
                       );
                    })}
                 </div>
                 
                 <div className="bg-secondary-400/30 p-4 rounded-sm border border-primary-50">
                    <div className="flex items-center gap-2 mb-3">
                       <MapPin className="w-4 h-4 text-primary-500" />
                       <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Delivery Coordinates</span>
                    </div>
                    <p className="text-[10px] font-bold text-primary-300 leading-relaxed uppercase">{selectedOrder.shippingAddress}</p>
                 </div>
              </div>
            </div>
          </div>
       )}

       {/* INVOICE MODAL (Simplified for Mobile) */}
       {showInvoice && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-600/90 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl p-6 sm:p-10 my-10 relative">
               <button onClick={() => setShowInvoice(false)} className="absolute top-4 right-4 p-2 text-primary-200 hover:text-primary-500">
                  <XCircle className="w-6 h-6" />
               </button>

               <div className="border-b-4 border-primary-500 pb-8 mb-8 text-center sm:text-left">
                  <h1 className="text-4xl font-black text-primary-500 uppercase italic tracking-tighter">Jesify Vault</h1>
                  <p className="text-[10px] font-black text-primary-200 uppercase tracking-[0.3em] mt-2">Official Digital Receipt</p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest">Billed To</p>
                     <p className="text-xs font-black text-primary-500 uppercase">{selectedOrder.userName}</p>
                     <p className="text-[9px] font-bold text-primary-300 uppercase leading-relaxed max-w-xs">{selectedOrder.shippingAddress}</p>
                  </div>
                  <div className="space-y-2 sm:text-right">
                     <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest">Transaction Log</p>
                     <p className="text-[10px] font-black text-primary-500 uppercase">TX_ID: {selectedOrder.id.toUpperCase()}</p>
                     <p className="text-[10px] font-black text-primary-500 uppercase">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
               </div>

               <div className="space-y-4 mb-10">
                  <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-primary-50 pb-2">
                     <div className="col-span-8 text-[10px] font-black text-primary-200 uppercase tracking-widest">Asset Details</div>
                     <div className="col-span-1 text-[10px] font-black text-primary-200 uppercase tracking-widest text-center">Qty</div>
                     <div className="col-span-3 text-[10px] font-black text-primary-200 uppercase tracking-widest text-right">Value</div>
                  </div>
                  {selectedOrder.items.map(item => (
                    <div key={item.productId} className="grid grid-cols-12 gap-4 items-center">
                       <div className="col-span-10 sm:col-span-8">
                          <p className="text-xs font-black text-primary-500 uppercase truncate">{item.name}</p>
                       </div>
                       <div className="col-span-2 sm:col-span-1 text-center">
                          <p className="text-xs font-bold text-primary-500">{item.quantity}</p>
                       </div>
                       <div className="hidden sm:block col-span-3 text-right">
                          <p className="text-xs font-black text-primary-500 tabular-nums">{formatCurrency(item.price * item.quantity)}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="border-t-2 border-primary-500 pt-6 flex flex-col items-end gap-2">
                  <div className="flex justify-between w-full sm:w-64">
                     <span className="text-[10px] font-black text-primary-200 uppercase tracking-widest">Total Asset Value</span>
                     <span className="text-sm font-black text-primary-500 tabular-nums">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between w-full sm:w-64 pt-2 border-t border-primary-50 mt-2">
                     <span className="text-xs font-black text-primary-500 uppercase tracking-widest">Payment Settlement</span>
                     <span className="text-xs font-black text-primary-500 uppercase tracking-widest">{selectedOrder.paymentMethod === 'DUMMY' ? 'PROCCESSED' : 'COD'}</span>
                  </div>
               </div>

               <div className="mt-12 flex flex-col sm:flex-row gap-4 print:hidden">
                  <Button onClick={() => window.print()} className="flex-1 rounded-sm py-5 font-black uppercase text-[10px] tracking-widest gap-2">
                     <Receipt className="w-4 h-4" /> Download Certificate
                  </Button>
                  <Button variant="outline" onClick={() => setShowInvoice(false)} className="flex-1 rounded-sm py-5 font-black uppercase text-[10px] tracking-widest border-primary-100">
                     Close Record
                  </Button>
               </div>
            </div>
          </div>
       )}
    </div>
  );
};
