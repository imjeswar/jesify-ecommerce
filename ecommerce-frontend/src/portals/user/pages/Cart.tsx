import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../shared/context/CartContext';
import { formatCurrency } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="mb-6 flex justify-center">
           <div className="p-6 bg-secondary-400 rounded-sm text-primary-300">
             <ShoppingBag className="w-16 h-16" />
           </div>
        </div>
        <h2 className="text-2xl font-black text-primary-500 mb-2 uppercase tracking-tight">Your Cart is Empty</h2>
        <p className="text-primary-300 mb-8 font-medium">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/">
          <Button className="px-10 rounded-sm font-black uppercase tracking-widest text-xs py-4">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  const subtotal = total;
  const shipping = 0;
  const totalAmount = subtotal + shipping;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0 pb-10">
      <div className="flex items-center gap-3 mb-8">
         <div className="h-2 w-10 bg-primary-500 rounded-sm"></div>
         <h1 className="text-2xl sm:text-3xl font-black text-primary-500 uppercase tracking-tighter italic">Shopping Cart</h1>
         <span className="text-xs font-black text-primary-300 bg-secondary-400 px-2 py-1 rounded-sm uppercase tracking-widest ml-auto">{items.length} Items</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 sm:p-5 rounded-sm shadow-sm border border-secondary-400/50 flex flex-col sm:flex-row gap-4 sm:gap-6 relative group transition-all hover:border-primary-200">
              {/* Product Image */}
              <div className="h-32 w-full sm:w-32 flex-shrink-0 bg-secondary-300/30 rounded-sm overflow-hidden border border-primary-100 p-2">
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
              </div>
              
              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <Link to={`/product/${item.id}`} className="block">
                      <h3 className="font-black text-primary-500 uppercase tracking-tight truncate hover:text-primary-700 transition-colors">{item.name}</h3>
                    </Link>
                    <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest mt-1 mb-2">Sold by: <span className="text-primary-400">{item.sellerName}</span></p>
                    
                    <div className="flex items-center gap-4 text-xs font-black text-primary-500 mt-2 sm:mt-0">
                      <span className="bg-secondary-400 px-2 py-1 rounded-sm">Size: One Size</span>
                      <span className="bg-secondary-400 px-2 py-1 rounded-sm">In Stock</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-primary-500">{formatCurrency(item.price)}</p>
                    <p className="text-[10px] text-primary-200 line-through font-bold">{formatCurrency(item.price * 1.25)}</p>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-between mt-6 sm:mt-0">
                  <div className="flex items-center bg-secondary-400/50 rounded-sm p-1 border border-primary-50">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="h-8 w-8 rounded-sm text-primary-500 flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-black text-sm text-primary-500 font-brand">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 rounded-sm text-primary-500 flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors py-2 px-3 hover:bg-red-50 rounded-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Remove Item</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Cart Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-secondary-300/20 p-4 rounded-sm border border-primary-50 text-center">
               <p className="text-[9px] font-black text-primary-300 uppercase tracking-widest mb-1">Easy Returns</p>
               <p className="text-[10px] font-bold text-primary-500">7 Days Refund Policy</p>
            </div>
            <div className="bg-secondary-300/20 p-4 rounded-sm border border-primary-50 text-center">
               <p className="text-[9px] font-black text-primary-300 uppercase tracking-widest mb-1">Safe Payments</p>
               <p className="text-[10px] font-bold text-primary-500">100% Buyer Protection</p>
            </div>
            <div className="bg-secondary-300/20 p-4 rounded-sm border border-primary-50 text-center">
               <p className="text-[9px] font-black text-primary-300 uppercase tracking-widest mb-1">Fast Shipping</p>
               <p className="text-[10px] font-bold text-primary-500">Free Home Delivery</p>
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-primary-100 sticky top-24">
            <h2 className="text-lg font-black text-primary-500 mb-6 uppercase tracking-tighter italic border-b border-primary-50 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm font-bold text-primary-400">
                <span className="uppercase tracking-widest text-[10px]">Price ({items.length} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-primary-400">
                <span className="uppercase tracking-widest text-[10px]">Discount</span>
                <span className="text-green-600">-₹0</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-primary-400">
                <span className="uppercase tracking-widest text-[10px]">Delivery Charges</span>
                <span className="text-green-600 uppercase tracking-widest text-[10px] font-black italic">Free</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-primary-400">
                <span className="uppercase tracking-widest text-[10px]">Secured Pack Fee</span>
                <span>₹99</span>
              </div>
              
              <div className="border-t border-primary-100 pt-6 flex justify-between">
                <span className="text-lg font-black text-primary-500 uppercase tracking-tighter">Total Payable</span>
                <span className="text-xl font-black text-primary-500">{formatCurrency(totalAmount + 99)}</span>
              </div>
              <p className="text-green-600 text-[10px] font-black uppercase tracking-widest mt-2">You will save ₹1,200 on this order</p>
            </div>

            <Button 
              className="w-full gap-2 py-4 rounded-sm font-black uppercase tracking-widest text-xs shadow-lg" 
              size="lg"
              onClick={() => navigate('/checkout')}
            >
              Checkout Now
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <p className="text-center text-[9px] font-bold text-primary-200 uppercase tracking-widest mt-6">
              Safe and Secure Payments. Easy returns. 100% Authentic products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
