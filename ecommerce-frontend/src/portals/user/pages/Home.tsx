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
  ShieldCheck, Gift, ArrowRight, Zap, Star
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

      {/* 1. RESPONSIVE HERO SECTION */}
      <section className="relative min-h-[260px] sm:h-[300px] flex items-center justify-center overflow-hidden rounded-sm bg-primary-500 shadow-md mx-2 text-center border border-primary-400 p-6">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-400 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[50%] bg-primary-300 rounded-full blur-[80px]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl px-2 transform transition-all">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm bg-secondary-500/10 text-secondary-500 border border-secondary-500/20">
            <Zap className="w-3 h-3" />
            Summer Launch
          </div>
          <h1 className="mb-4 text-2xl sm:text-4xl font-black text-secondary-500 font-brand leading-tight">
            Experience <span className="text-white">Jesify</span> Premium
          </h1>
          <p className="max-w-xl mx-auto mb-8 text-xs sm:text-sm text-secondary-300 font-medium opacity-90 leading-relaxed tracking-wide">
            Curated collections from India's most innovative verified sellers. Quality and trust in every click.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link to="/products" className="w-full sm:w-auto">
              <Button className="w-full sm:px-8 py-3 font-bold rounded-sm bg-secondary-500 text-primary-500 hover:bg-white text-[10px] uppercase shadow-md transition-all">
                Explore Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PROMO GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 mx-auto max-w-7xl font-brand">
        <div className="relative col-span-1 md:col-span-2 overflow-hidden rounded-sm bg-primary-500 h-[240px] px-8 flex flex-col justify-center">
             <div className="flex items-center gap-2 text-secondary-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
               <Star className="w-3 h-3 fill-secondary-400" />
               Premium Selection
             </div>
             <h3 className="text-2xl font-black text-white mb-3 leading-tight">Professional Workstations</h3>
             <p className="text-secondary-300 mb-6 text-sm font-medium opacity-80">Up to 20% OFF for verified sellers.</p>
             <Link to="/products?category=Electronics">
               <button className="flex items-center gap-2 text-secondary-500 font-bold uppercase tracking-[0.2em] text-[10px] hover:text-white transition-colors underline decoration-secondary-500 underline-offset-4">
                 Explore Now <ArrowRight className="w-4 h-4" />
               </button>
             </Link>
        </div>
        <div className="relative overflow-hidden rounded-sm bg-secondary-500 h-[240px] flex flex-col items-center justify-center p-8 text-center">
             <h3 className="text-2xl font-black text-primary-500 mb-1 font-brand italic">Fashion Hub</h3>
             <p className="text-primary-400/70 font-bold mb-6 uppercase tracking-widest text-[10px]">Minimal Styles</p>
             <Link to="/products?category=Fashion" className="bg-primary-500 text-secondary-500 px-6 py-2 rounded-sm font-bold text-[10px] hover:bg-primary-600 transition-all uppercase tracking-widest">
               Browse
             </Link>
        </div>
      </section>

      {/* 3. RECENTLY VIEWED & RECOMMENDED */}
      <section className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8 border-b border-primary-100 pb-4">
          <h2 className="text-2xl font-black text-primary-500 font-brand">Picks For You</h2>
          <Link to="/products" className="flex items-center gap-2 text-primary-500 font-bold text-[10px] uppercase tracking-widest hover:text-primary-800 transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <div key={product.id} className="group relative flex flex-col bg-white rounded-sm border border-secondary-400/50 hover:border-primary-200 transition-all hover:shadow-md overflow-hidden">
              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary-300/10 m-2 rounded-sm">
                <img
                  src={product.images?.[0] || product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = placeholderDataUrl(600, 400, product.name); }}
                />
              </Link>
              <div className="p-4 pt-0 text-left">
                <h3 className="text-sm font-bold text-primary-500 line-clamp-1 group-hover:text-primary-700 transition-colors uppercase mt-2">{product.name}</h3>
                <span className="text-base font-black text-primary-500 mt-2 block">{formatCurrency(product.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRUST FOOTER BAR */}
      <section className="bg-primary-500 border border-primary-400/30 py-12 px-8 mx-2 rounded-sm shadow-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center group">
            <Truck className="w-8 h-8 text-secondary-500 mb-4" />
            <h4 className="font-bold text-white uppercase tracking-widest text-[10px] mb-2 font-brand">Jesify Express</h4>
            <p className="text-secondary-300/70 text-[10px] font-medium max-w-[200px]">Same-day dispatch and tracking.</p>
          </div>
          <div className="flex flex-col items-center group">
            <ShieldCheck className="w-8 h-8 text-secondary-500 mb-4" />
            <h4 className="font-bold text-white uppercase tracking-widest text-[10px] mb-2 font-brand">Safe Payment</h4>
            <p className="text-secondary-300/70 text-[10px] font-medium max-w-[200px]">Buyer protection guaranteed.</p>
          </div>
          <div className="flex flex-col items-center group">
            <Gift className="w-8 h-8 text-secondary-500 mb-4" />
            <h4 className="font-bold text-white uppercase tracking-widest text-[10px] mb-2 font-brand">Brand Rewards</h4>
            <p className="text-secondary-300/70 text-[10px] font-medium max-w-[200px]">Earn credits on every purchase.</p>
          </div>
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
