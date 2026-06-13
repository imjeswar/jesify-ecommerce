import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { ProductService } from '../../../shared/services/product.service';
import type { Product } from '../../../shared/types/product.types';
import { formatCurrency, placeholderDataUrl } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';
import { 
  Smartphone, Laptop, Tv, Shirt, Sparkles, 
  Home as HomeIcon, ShoppingCart, Truck, 
  ShieldCheck, Gift, ArrowRight, Zap, Star, Heart
} from 'lucide-react';

export const Home: React.FC = () => {
  const { user, sellerProfile } = useAuth();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories] = React.useState([
    { id: 'Mobiles', name: 'Mobiles', icon: <Smartphone className="w-5 h-5" /> },
    { id: 'Electronics', name: 'Electronics', icon: <Laptop className="w-5 h-5" /> },
    { id: 'TVs & Appliances', name: 'Appliances', icon: <Tv className="w-5 h-5" /> },
    { id: 'Fashion', name: 'Fashion', icon: <Shirt className="w-5 h-5" /> },
    { id: 'Beauty, Toys & More', name: 'Beauty', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'Home & Furniture', name: 'Home', icon: <HomeIcon className="w-5 h-5" /> },
    { id: 'Grocery', name: 'Grocery', icon: <ShoppingCart className="w-5 h-5" /> },
  ]);

  React.useEffect(() => {
    setProducts(ProductService.getRecentlyViewedProducts(12));
  }, [user, sellerProfile]);

  return (
    <div className="pb-20 space-y-6 bg-secondary-300/30 min-h-screen font-main">
      
      {/* SCROLLABLE CATEGORY RIBBON (Single Straight Line) */}
      <section className="bg-white shadow-sm border-b border-secondary-400/30 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-nowrap items-center overflow-x-auto no-scrollbar gap-x-8 sm:justify-center">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/products?category=${cat.id}`}
              className="group flex flex-row items-center gap-2 transition-all p-1 flex-shrink-0"
            >
              <div className="flex items-center justify-center text-primary-400 group-hover:text-primary-600 transition-all transform group-hover:scale-110">
                {cat.icon}
              </div>
              <span className="text-[11px] sm:text-[12px] font-black text-primary-500 uppercase tracking-widest text-center leading-none group-hover:text-primary-800 transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 1. NEW HERO SECTION */}
      <section className="px-4 mx-auto max-w-7xl pt-4">
        <div className="relative flex flex-col md:flex-row items-center justify-between rounded-3xl bg-secondary-300/20 overflow-hidden shadow-sm border border-secondary-400/30 p-8 md:p-12 min-h-[400px]">
          {/* Left Text Content */}
          <div className="z-10 w-full md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-black text-primary-500 leading-[1.1] mb-6 font-brand tracking-tight">
              Your <span className="text-secondary-500 italic">One-Stop</span><br/>Shop for Everything<br/>You Need!
            </h1>
            <p className="text-primary-400 font-medium mb-8 max-w-sm">
              Fast shipping, friendly customer service, and secure transactions guaranteed!
            </p>
            {/* Promo Cards */}
            <div className="flex gap-4">
              <div className="bg-secondary-500 rounded-xl p-4 w-32 shadow-sm transform -rotate-2 hover:rotate-0 transition-transform">
                <h3 className="font-black text-primary-500 text-sm leading-tight mb-2 uppercase">Summer<br/>Sale</h3>
                <p className="text-[9px] text-primary-500/80 mb-3 font-medium leading-tight">Grab items at unbeatable prices!</p>
                <Link to="/products"><span className="bg-white text-primary-500 px-3 py-1 rounded-full text-[9px] font-bold shadow-sm inline-block">Claim discount</span></Link>
              </div>
              <div className="bg-white border border-secondary-400/50 rounded-xl p-4 w-32 shadow-sm transform rotate-2 hover:rotate-0 transition-transform flex flex-col justify-between">
                <div>
                  <span className="bg-secondary-500/20 text-secondary-600 text-[10px] font-bold px-2 py-1 rounded-sm mb-2 inline-block uppercase">20% OFF</span>
                  <h3 className="font-black text-primary-500 text-xs leading-tight mb-2">For All<br/>Cosmetic<br/>Products</h3>
                </div>
                <Link to="/products?category=Beauty, Toys & More"><span className="bg-primary-500 text-white px-3 py-1 rounded-full text-[9px] font-bold shadow-sm inline-block">Explore</span></Link>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="w-full md:w-1/2 flex justify-end relative h-[300px] md:h-[450px]">
             <img 
               src="/hero-image.png" 
               alt="Happy Shopper" 
               className="object-cover h-full w-full rounded-2xl md:rounded-l-full shadow-lg border-4 border-white"
             />
          </div>
        </div>
      </section>

      {/* 2. EXPLORE TRENDING CATEGORIES */}
      <section className="px-4 mx-auto max-w-7xl pt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-primary-500 font-brand">Explore Trending Categories</h2>
          <Link to="/products" className="flex items-center gap-2 text-secondary-500 font-bold text-xs uppercase tracking-widest hover:text-secondary-600 transition-colors bg-secondary-500/10 px-4 py-2 rounded-full">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[450px]">
          {/* Left Tall */}
          <div className="md:col-span-1 rounded-3xl bg-primary-500 overflow-hidden relative group p-6 flex flex-col justify-end min-h-[250px]">
             <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" alt="Electronics"/>
             <div className="absolute top-6 left-6 flex gap-2">
               <span className="bg-white text-primary-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm">Electronic</span>
             </div>
             <div className="relative z-10 flex flex-col items-center mt-auto">
               <Link to="/products?category=Electronics" className="bg-secondary-500 text-primary-500 px-6 py-2 rounded-full font-bold text-xs shadow-md hover:bg-white transition-colors w-full text-center">
                 Explore product &rarr;
               </Link>
             </div>
          </div>

          {/* Middle Column */}
          <div className="md:col-span-2 grid grid-rows-2 gap-4">
             {/* Top row */}
             <div className="rounded-3xl bg-white border border-secondary-400/30 overflow-hidden relative group flex flex-col sm:flex-row items-center p-6 min-h-[200px]">
               <div className="w-full sm:w-1/2 relative z-10 pr-0 sm:pr-4 mb-4 sm:mb-0">
                  <h3 className="text-2xl font-black text-primary-500 mb-4 leading-tight">Furniture and<br className="hidden sm:block"/>Home Essentials</h3>
                  <Link to="/products?category=Home & Furniture" className="bg-primary-500 text-white px-5 py-2 rounded-full font-bold text-[10px] shadow-sm hover:bg-primary-600 inline-block uppercase tracking-widest">
                    Explore product &rarr;
                  </Link>
               </div>
               <div className="w-full sm:w-1/2 h-40 sm:h-full relative sm:absolute sm:right-0 sm:top-0">
                  <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover rounded-2xl sm:rounded-none sm:rounded-l-3xl group-hover:scale-105 transition-transform duration-700" alt="Furniture"/>
               </div>
             </div>
             {/* Bottom row */}
             <div className="rounded-3xl bg-secondary-300/20 border border-secondary-400/30 overflow-hidden relative group flex flex-col sm:flex-row items-center p-6 min-h-[200px]">
               <div className="w-full sm:w-1/2 relative z-10 pr-0 sm:pr-4 mb-4 sm:mb-0">
                  <h3 className="text-xl font-black text-primary-500 mb-4 leading-tight">Fashion and<br className="hidden sm:block"/>Accessories</h3>
                  <Link to="/products?category=Fashion" className="bg-primary-500 text-white px-5 py-2 rounded-full font-bold text-[10px] shadow-sm hover:bg-primary-600 inline-block uppercase tracking-widest">
                    Explore product &rarr;
                  </Link>
               </div>
               <div className="w-full sm:w-1/2 h-40 sm:h-full relative sm:absolute sm:right-0 sm:top-0">
                  <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover rounded-2xl sm:rounded-none sm:rounded-l-3xl group-hover:scale-105 transition-transform duration-700" alt="Fashion"/>
               </div>
             </div>
          </div>

          {/* Right Tall */}
          <div className="md:col-span-1 rounded-3xl bg-secondary-500 overflow-hidden relative group p-6 flex flex-col justify-end min-h-[250px]">
             <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-multiply group-hover:scale-105 transition-transform duration-700" alt="Grocery"/>
             <div className="absolute top-6 right-6 flex gap-2 z-10">
               <span className="bg-white text-primary-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm">Grocery</span>
             </div>
             <div className="relative z-10 flex flex-col items-center mt-auto">
               <Link to="/products?category=Grocery" className="bg-primary-500 text-white px-6 py-2 rounded-full font-bold text-xs shadow-md hover:bg-primary-600 transition-colors w-full text-center">
                 Explore product &rarr;
               </Link>
             </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT OF THE MONTH */}
      <section className="px-4 mx-auto max-w-7xl py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-primary-500 font-brand">Product of The Month</h2>
          <Link to="/products" className="flex items-center gap-2 text-secondary-500 font-bold text-xs uppercase tracking-widest hover:text-secondary-600 transition-colors bg-secondary-500/10 px-4 py-2 rounded-full">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="group flex flex-col bg-white rounded-3xl border border-secondary-400/30 hover:border-primary-200 transition-all shadow-sm hover:shadow-xl overflow-hidden p-3 pb-4">
              
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-secondary-300/20 rounded-2xl mb-4 group-hover:bg-secondary-300/40 transition-colors">
                <Link to={`/product/${product.id}`} className="block h-full w-full p-6">
                  <img
                    src={product.images?.[0] || product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                    onError={(e) => { e.currentTarget.src = placeholderDataUrl(600, 400, product.name); }}
                  />
                </Link>
                {/* Badges */}
                <div className="absolute top-3 left-3">
                  <span className="bg-secondary-500 text-primary-500 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Popular</span>
                </div>
                {/* Action Icons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 duration-300">
                  <button className="bg-primary-500 p-2.5 rounded-full shadow-sm text-secondary-500 hover:text-white hover:bg-primary-600 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                  <button className="bg-primary-500 p-2.5 rounded-full shadow-sm text-secondary-500 hover:text-white hover:bg-primary-600 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Details Container */}
              <div className="px-2 flex flex-col flex-grow">
                <span className="text-xl font-black text-primary-500 mb-1">{formatCurrency(product.price)}</span>
                <Link to={`/product/${product.id}`}><h3 className="text-sm font-bold text-primary-400 line-clamp-1 group-hover:text-primary-600 transition-colors mb-4">{product.name}</h3></Link>
                <div className="mt-auto">
                  <Button className="w-full py-3 rounded-full bg-primary-500 text-white font-bold text-[11px] shadow-md hover:bg-primary-600 transition-colors uppercase tracking-widest">
                    Buy now
                  </Button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Tailwind Utility for hiding scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};
