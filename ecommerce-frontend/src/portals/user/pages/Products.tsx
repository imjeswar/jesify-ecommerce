import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductService } from '../../../shared/services/product.service';
import type { Product } from '../../../shared/types/product.types';
import { formatCurrency, placeholderDataUrl } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';
import { Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '../../../shared/components/Input';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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

    if (minPrice && !isNaN(Number(minPrice))) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }

    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    setProducts(filtered);
  }, [categoryParam, searchParam, sortBy, minPrice, maxPrice]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-500 font-heading">
          {searchParam ? `Search Results for "${searchParam}"` : (categoryParam ? categoryParam : 'All Products')}
        </h2>
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="hidden md:flex gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Link to="/">
            <Button variant="outline" size="sm">Home</Button>
          </Link>
        </div>
      </div>

      <div className={`transition-all duration-300 ease-in-out ${showFilters ? 'block' : 'hidden md:block'} bg-secondary-500 border border-primary-100 p-4 rounded-sm shadow-sm`}>
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Filter className="h-5 w-5 text-primary-400 hidden md:block" />
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                placeholder="Min ₹" 
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 h-10 bg-white"
              />
              <span className="text-primary-400">-</span>
              <Input 
                type="number" 
                placeholder="Max ₹" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 h-10 bg-white"
              />
            </div>
            {(minPrice || maxPrice) && (
              <Button variant="ghost" size="sm" onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="text-primary-400 hover:text-primary-600">
                Clear
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <ArrowUpDown className="h-5 w-5 text-primary-400 hidden md:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-48 h-10 rounded-sm border border-primary-200 bg-white px-3 py-2 text-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-secondary-500 rounded-sm shadow-sm border border-primary-100">
          <p className="text-primary-400 text-lg mb-4">No products found.</p>
          <p className="text-primary-300">
            {categoryParam ? `No products in "${categoryParam}" yet.` : 'Be the first seller to list a product!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group bg-secondary-500 rounded-sm p-4 shadow-sm hover:shadow-md hover:border-primary-300 transition-all border border-primary-100">
              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary-400 rounded-sm mb-4">
                <img
                  src={product.images?.[0] || product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-contain p-4 bg-white object-center group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.currentTarget.src = placeholderDataUrl(600, 400, product.name); }}
                />
                {product.stock < 5 && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm">
                    Low Stock
                  </div>
                )}
              </Link>
              <Link to={`/product/${product.id}`} className="block">
                <h3 className="font-semibold text-primary-500 mb-1 group-hover:text-primary-600 transition-colors uppercase tracking-wide text-sm">{product.name}</h3>
                <p className="text-primary-400 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-500">{formatCurrency(product.price)}</span>
                  <span className="text-xs text-primary-300 uppercase tracking-widest">Store: {product.sellerName}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
