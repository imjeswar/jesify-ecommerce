import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductService } from '../../../shared/services/product.service';
import type { Product } from '../../../shared/types/product.types';
import { formatCurrency, placeholderDataUrl } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  useEffect(() => {
    const all = ProductService.getActiveProducts();
    let filtered = all;

    if (categoryParam) {
      filtered = filtered.filter(p => p.category === categoryParam);
    }

    if (searchParam) {
      const q = searchParam.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    setProducts(filtered);
  }, [categoryParam, searchParam]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {searchParam ? `Search Results for "${searchParam}"` : (categoryParam ? categoryParam : 'All Products')}
        </h2>
        <Link to="/">
          <Button variant="outline" size="sm">Home</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg mb-4">No products found.</p>
          <p className="text-gray-400">
            {categoryParam ? `No products in "${categoryParam}" yet.` : 'Be the first seller to list a product!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100 rounded-xl mb-4">
                <img
                  src={product.images?.[0] || product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.currentTarget.src = placeholderDataUrl(600, 400, product.name); }}
                />
                {product.stock < 5 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Low Stock
                  </div>
                )}
              </Link>
              <Link to={`/product/${product.id}`} className="block">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
                  <span className="text-xs text-gray-400">Store: {product.sellerName}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
