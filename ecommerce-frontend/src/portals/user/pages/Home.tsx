import React from 'react';
import { Link } from 'react-router-dom';
import { ProductService } from '../../../shared/services/product.service';
import type { Product } from '../../../shared/types/product.types';
import { formatCurrency, placeholderDataUrl } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';
import { Smartphone, Laptop, Tv, Shirt, Sparkles, Home as HomeIcon, ShoppingCart } from 'lucide-react';

export const Home: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    setProducts(ProductService.getActiveProducts());
  }, []);

  return (
    <div className="space-y-8">
      <section className="relative rounded-2xl overflow-hidden px-4 sm:px-8 py-12 sm:py-20 text-center shadow-2xl bg-white/30 backdrop-blur-md border border-white/50 hover:scale-[1.01] transition-transform duration-500 group">
        {/* Background Orbs */}
        <div className="absolute top-[-30%] left-[-20%] w-48 h-48 sm:w-96 sm:h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 sm:opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-30%] right-[-20%] w-48 h-48 sm:w-96 sm:h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 sm:opacity-50 animate-pulse delay-700"></div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 sm:mb-6 font-brand bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
            Welcome to Jesify
          </h1>
          <p className="text-base sm:text-xl text-gray-700 max-w-2xl mx-auto mb-8 sm:mb-10 font-medium leading-relaxed">
            Your one-stop shop for everything unique. Discover amazing products from verified sellers.
          </p>
          <Link to="/seller/register" className="inline-block relative">
            <div className="absolute inset-0 bg-orange-400 blur-lg opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
            <Button className="relative rounded-full px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-bold tracking-wide">
              Start Selling Today
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Link to={`/products?category=Mobiles`} className="group">
            <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <Smartphone className="w-8 h-8 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Mobiles</span>
            </div>
          </Link>
          <Link to={`/products?category=Electronics`} className="group">
            <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <Laptop className="w-8 h-8 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Electronics</span>
            </div>
          </Link>
          <Link to={`/products?category=TVs & Appliances`} className="group">
            <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <Tv className="w-8 h-8 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">TVs & Appliances</span>
            </div>
          </Link>
          <Link to={`/products?category=Fashion`} className="group">
            <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <Shirt className="w-8 h-8 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Fashion</span>
            </div>
          </Link>
          <Link to={`/products?category=Beauty, Toys & More`} className="group">
            <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <Sparkles className="w-8 h-8 text-gray-700" />
              <span className="text-sm font-medium text-gray-900 text-center">Beauty, Toys & More</span>
            </div>
          </Link>
          <Link to={`/products?category=Home & Furniture`} className="group">
            <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <HomeIcon className="w-8 h-8 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Home & Furniture</span>
            </div>
          </Link>
          <Link to={`/products?category=Grocery`} className="group">
            <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <ShoppingCart className="w-8 h-8 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Grocery</span>
            </div>
          </Link>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Featured Products</h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg mb-4">No products available yet.</p>
          <p className="text-gray-400">Be the first seller to list a product!</p>
          <Link to="/seller/register" className="mt-4 inline-block">
            <Button>Become a Seller</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
};
