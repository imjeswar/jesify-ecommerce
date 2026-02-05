import React, { useState, useEffect } from 'react';
import { ProductService } from '../../../shared/services/product.service';
import { formatCurrency } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';
import type { Product } from '../../../shared/types/product.types';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(ProductService.getAllProducts());
  }, []);

  const handleToggleStatus = (id: string) => {
    ProductService.toggleProductStatus(id);
    setProducts(ProductService.getAllProducts()); // Refresh list
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Seller</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden">
                      {product.imageUrl && <img className="h-10 w-10 object-cover" src={product.imageUrl} alt="" />}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.sellerName}
                </td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status || 'ACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={product.status === 'ACTIVE' || !product.status ? "text-red-600 border-red-200 hover:bg-red-50" : ""}
                    onClick={() => handleToggleStatus(product.id)}
                  >
                    {product.status === 'ACTIVE' || !product.status ? 'Block' : 'Unblock'}
                  </Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
