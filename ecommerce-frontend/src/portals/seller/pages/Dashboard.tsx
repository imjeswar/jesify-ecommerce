import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ProductService } from '../../../shared/services/product.service';
import { OrderService } from '../../../shared/services/order.service';
import { useAuth } from '../../../shared/context/AuthContext';
import type { Product } from '../../../shared/types/product.types';
import { formatCurrency } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';

export const Dashboard: React.FC = () => {
  const { user, sellerProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0
  });

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
  }, [user]);

  if (sellerProfile && !sellerProfile.isVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="bg-yellow-50 p-8 rounded-2xl border border-yellow-100 max-w-2xl">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Verification Pending</h2>
          <p className="text-yellow-700 mb-6">
            Thanks for registering! Your seller account is currently under review by the Admin.
            Once approved, you will be able to start selling products on Jesify.
          </p>
          <div className="text-sm text-yellow-600 bg-white/50 p-4 rounded-lg">
            Status: <span className="font-bold">PENDING APPROVAL</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/seller/products/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.revenue)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Products</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {products.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No products added yet. Click "Add Product" to get started.
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400">Img</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Stock: {product.stock}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
