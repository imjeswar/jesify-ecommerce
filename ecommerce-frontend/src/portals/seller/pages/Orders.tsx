
import React from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { OrderService } from '../../../shared/services/order.service';
import { formatCurrency } from '../../../shared/utils/helpers';
import { useSocket } from '../../../shared/context/SocketContext';

export const SellerOrders: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [orders, setOrders] = React.useState(OrderService.getOrdersBySeller(user?.id || ''));

  const handleStatusChange = async (orderId: string, newStatus: any) => {
    await OrderService.updateOrderStatus(orderId, newStatus, socket);
    setOrders((prev: any[]) => prev.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-primary-100 text-primary-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      Placed by {order.userName} on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-medium px-3 py-1 rounded-full border-none focus:ring-2 focus:ring-primary-500 cursor-pointer ${getStatusColor(order.status)}`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.filter((item: any) => item.sellerId === user.id).map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2 bg-gray-50 rounded-lg px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                          {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Shipping to: {order.shippingAddress}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(
                        order.items
                          .filter((item: any) => item.sellerId === user.id)
                          .reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
