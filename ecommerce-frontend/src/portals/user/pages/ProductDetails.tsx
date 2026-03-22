import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck, ShieldCheck, Star, Zap, ChevronLeft, Share2 } from 'lucide-react';
import { ProductService } from '../../../shared/services/product.service';
import type { Product } from '../../../shared/types/product.types';
import { formatCurrency, placeholderDataUrl } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';
import { useCart } from '../../../shared/context/CartContext';
import { useAuth } from '../../../shared/context/AuthContext';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      const found = ProductService.getProductById(id);
      if (found && found.status === 'BLOCKED') {
        setProduct(undefined);
        setLoading(false);
        return;
      }
      setProduct(found);
      if (found) {
        ProductService.trackViewedProduct(found.id);
        setActiveImage(found.images?.[0] || found.imageUrl);
        const allProducts = ProductService.getActiveProducts();
        const related = allProducts
          .filter(p => p.category === found.category && p.id !== found.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.status === 'BLOCKED') return;
    if (!user) { navigate('/login'); return; }
    addToCart(product);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    if (!product || product.status === 'BLOCKED') return;
    if (!user) { navigate('/login'); return; }
    addToCart(product);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-primary-100 rounded-sm mb-4"></div>
          <div className="h-4 w-32 bg-primary-50 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-8 rounded-sm shadow-sm border border-primary-100 w-full max-w-sm">
          <h2 className="text-xl font-black text-primary-500 mb-4 uppercase tracking-tighter">Product Not Available</h2>
          <Button onClick={() => navigate('/')} className="w-full uppercase font-black tracking-widest text-[10px]">Back to Home</Button>
        </div>
      </div>
    );
  }

  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;

  return (
    <div className="min-h-screen bg-secondary-500 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:py-6">
        
        {/* Breadcrumb (Desktop Only) */}
        <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-300 mb-6 px-4">
          <Link to="/" className="hover:text-primary-500">Home</Link>
          <ChevronLeft className="w-3 h-3 rotate-180" />
          <Link to={`/products?category=${product.category}`} className="hover:text-primary-500">{product.category}</Link>
          <ChevronLeft className="w-3 h-3 rotate-180" />
          <span className="text-primary-500">{product.name}</span>
        </div>

        <div className="bg-white shadow-sm md:rounded-sm md:border border-primary-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* IMAGE SECTION */}
          <div className="lg:col-span-5 p-0 md:p-6 border-b lg:border-b-0 lg:border-r border-primary-100 bg-white">
            <div className="relative aspect-square flex items-center justify-center bg-secondary-50 sm:rounded-sm overflow-hidden group">
               <img
                src={activeImage || product.imageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = placeholderDataUrl(600, 600, product.name); }}
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                 <button className="p-2 bg-white/80 backdrop-blur-sm rounded-sm shadow-sm text-primary-400 hover:text-primary-600">
                    <Share2 className="w-5 h-5" />
                 </button>
              </div>
              {product.stock < 5 && product.stock > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-widest shadow-md">
                   Limited Stock: {product.stock} Left
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 p-4 md:px-0 md:mt-4 overflow-x-auto no-scrollbar justify-start sm:justify-center">
              {(product.images || [product.imageUrl]).map((img, idx) => (
                <button
                  key={idx}
                  className={`w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 border rounded-sm p-1 transition-all bg-white ${activeImage === img ? 'border-primary-500 ring-1 ring-primary-500' : 'border-primary-100 hover:border-primary-300'}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = placeholderDataUrl(200, 200, product.name); }} />
                </button>
              ))}
            </div>

            {/* Action Buttons (Desktop Only) */}
            <div className="hidden lg:grid grid-cols-2 gap-3 mt-6">
              <Button 
                onClick={handleAddToCart}
                variant="secondary"
                disabled={product.stock === 0}
                className="py-4 font-black uppercase tracking-widest text-sm rounded-sm shadow-sm"
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="py-4 font-black uppercase tracking-widest text-sm rounded-sm shadow-sm"
              >
                <Zap className="w-5 h-5 mr-2" /> Buy Now
              </Button>
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-300">{product.category}</span>
                 <div className="h-1 w-8 bg-primary-100 rounded-sm"></div>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-primary-500 font-brand leading-tight mb-4 uppercase tracking-tight">{product.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-sm text-xs font-black shadow-sm">
                   {rating} <Star className="w-3 h-3 fill-white" />
                </div>
                <span className="text-xs font-bold text-primary-300 uppercase tracking-widest">{reviewCount} Ratings & Reviews</span>
              </div>
            </div>

            <div className="mb-8 p-6 bg-secondary-300/30 rounded-sm border border-secondary-400/50">
               <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-4xl font-black text-primary-500">{formatCurrency(product.price)}</span>
                  <span className="text-lg text-primary-200 line-through font-bold">{formatCurrency(product.price * 1.3)}</span>
                  <span className="text-green-600 font-black text-xs uppercase tracking-widest bg-green-100 px-2 py-1 rounded-sm">30% OFF</span>
               </div>
               <p className="text-[10px] font-black text-primary-300 uppercase tracking-widest italic">+ ₹99 Secure Packaging Fee</p>
            </div>

            {/* Core Info Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 border-b border-primary-50 pb-10">
               <div className="flex gap-4">
                  <div className="p-3 bg-secondary-400 rounded-sm text-primary-500">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-300 mb-1">Fast Delivery</h4>
                    <p className="text-xs font-bold text-primary-500">Free delivery within 3-5 days</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="p-3 bg-secondary-400 rounded-sm text-primary-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-300 mb-1">Authenticity</h4>
                    <p className="text-xs font-bold text-primary-500">Official Brand Warranty & Returns</p>
                  </div>
               </div>
            </div>

            {/* Specifications (Responsive Table) */}
            <div className="space-y-8">
               <div className="bg-white border border-primary-50 rounded-sm overflow-hidden">
                  <div className="bg-secondary-400/50 p-4 border-b border-primary-50">
                     <h3 className="text-xs font-black uppercase tracking-widest text-primary-500">Key Specifications</h3>
                  </div>
                  <div className="divide-y divide-primary-50">
                    {product.specifications ? Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-2 sm:gap-4">
                         <div className="sm:col-span-4 text-[10px] font-black uppercase tracking-widest text-primary-300">{key}</div>
                         <div className="sm:col-span-8 text-xs font-bold text-primary-500">{value}</div>
                      </div>
                    )) : (
                      <div className="p-4 text-xs italic text-primary-300">No specifications provided.</div>
                    )}
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary-300">About this product</h3>
                  <p className="text-sm font-medium text-primary-500 leading-relaxed opacity-80">
                    {product.description}
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 px-4 sm:px-0">
             <div className="flex items-center justify-between mb-8 border-b border-primary-100 pb-4">
               <div>
                  <h2 className="text-2xl font-black text-primary-500 font-brand italic uppercase tracking-tight">Picks From {product.category}</h2>
                  <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest mt-1">Customers also viewed</p>
               </div>
               <Link to="/products" className="text-[10px] font-black uppercase tracking-widest text-primary-400 hover:text-primary-600 underline">View Full Collection</Link>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {relatedProducts.map(p => (
                   <Link key={p.id} to={`/product/${p.id}`} className="group bg-white border border-secondary-400/50 rounded-sm p-3 hover:border-primary-300 transition-all hover:shadow-md">
                      <div className="aspect-square bg-secondary-300/30 rounded-sm mb-3 overflow-hidden p-4">
                         <img src={p.images?.[0] || p.imageUrl} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                      </div>
                      <h4 className="text-xs font-black text-primary-500 truncate uppercase mb-1">{p.name}</h4>
                      <p className="text-sm font-black text-primary-500">{formatCurrency(p.price)}</p>
                   </Link>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* STICKY BOTTOM ACTIONS (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-primary-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] p-3">
         <div className="flex gap-3 max-w-lg mx-auto">
            <Button 
               variant="outline" 
               className="flex-1 py-4 font-black uppercase tracking-widest text-[11px] rounded-sm border-2"
               onClick={handleAddToCart}
               disabled={product.stock === 0}
            >
               <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
            </Button>
            <Button 
               className="flex-2 w-full py-4 font-black uppercase tracking-widest text-[11px] rounded-sm"
               onClick={handleBuyNow}
               disabled={product.stock === 0}
            >
               <Zap className="w-4 h-4 mr-2" /> Buy Now
            </Button>
         </div>
      </div>
    </div>
  );
};
