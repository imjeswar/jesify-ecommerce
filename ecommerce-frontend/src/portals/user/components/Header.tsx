import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Store, Menu, X, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { useCart } from '../../../shared/context/CartContext';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { ProductService } from '../../../shared/services/product.service';
import type { Product } from '../../../shared/types/product.types';

export const Header: React.FC = () => {
  const { user, logout, sellerProfile } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const searchContainerRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setShowSuggestions(false);
      setMobileSearchOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  React.useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const activeProducts = ProductService.getActiveProducts();
      const q = searchTerm.toLowerCase();
      const matches = activeProducts.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      ).slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Close menus on click outside
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuOpen && menuRef.current && !menuRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) {
        setMenuOpen(false);
      }
      if (showSuggestions && searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen, showSuggestions]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-100 bg-secondary-500/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <button 
              className="p-2 md:hidden text-primary-500 hover:bg-secondary-100 rounded-sm"
              onClick={() => setMenuOpen(!menuOpen)}
              ref={buttonRef}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/jesifylogo1.jpeg" alt="Jesify logo" className="h-7 w-7 sm:h-8 sm:w-8" />
              <span className="text-xl sm:text-2xl font-black text-primary-500 font-brand tracking-tighter">Jesify</span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl lg:max-w-2xl mx-4">
            <div className="relative group" ref={searchContainerRef}>
              <Input
                placeholder="Search for products, categories..."
                className="pl-10 rounded-sm bg-secondary-400/30 border-secondary-400 focus:bg-white focus:ring-1 focus:ring-primary-500 text-primary-500 transition-all shadow-none h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => { if (searchTerm.trim().length > 0) setShowSuggestions(true); }}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-primary-300 group-hover:text-primary-500 transition-colors" />

              {/* Suggestions Portal (Desktop) */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary-100 rounded-sm shadow-xl max-h-[70vh] overflow-y-auto z-[60]">
                  {suggestions.map((product) => (
                    <div 
                      key={product.id}
                      onClick={() => {
                        setSearchTerm('');
                        setShowSuggestions(false);
                        navigate(`/product/${product.id}`);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-secondary-100 cursor-pointer border-b border-primary-50 last:border-0"
                    >
                      <div className="h-10 w-10 flex-shrink-0 bg-secondary-200 rounded-sm overflow-hidden border border-secondary-100">
                        <img 
                          src={product.images?.[0] || product.imageUrl} 
                          alt={product.name} 
                          className="h-full w-full object-contain p-1" 
                          onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-primary-500 truncate uppercase tracking-tight">{product.name}</span>
                        <span className="text-[10px] text-primary-300 uppercase font-black tracking-widest">{product.category}</span>
                      </div>
                      <div className="ml-auto text-sm font-black text-primary-500">₹{product.price}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Mobile Search Toggle */}
            <button 
              className="p-2 md:hidden text-primary-500 hover:bg-secondary-100 rounded-sm"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Become a Seller (Desktop Only) */}
            <Link to="/seller/register" className="hidden lg:block">
              <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary-400 hover:text-primary-600 flex items-center gap-2">
                <Store className="h-4 w-4" />
                Sell on Jesify
              </Button>
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-primary-500 hover:text-primary-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-sm bg-primary-500 text-[10px] font-black text-secondary-500 border border-secondary-500 shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile (Desktop Only) */}
            <div className="hidden md:block relative" ref={menuRef}>
              <button
                className="flex items-center gap-2 p-2 text-primary-500 hover:text-primary-600 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div className="w-8 h-8 rounded-sm bg-primary-500 flex items-center justify-center text-secondary-500 font-black text-sm border border-primary-600">
                  {user ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                </div>
                {user && <span className="font-bold text-sm tracking-tight">{user.name.split(' ')[0]}</span>}
              </button>

              {/* User Dropdown */}
              {user && menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-primary-100 rounded-sm shadow-xl py-2 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-primary-50 mb-1">
                    <p className="text-sm font-black text-primary-500 truncate uppercase">{user.name}</p>
                    <p className="text-[10px] font-bold text-primary-300 truncate tracking-wide">{user.email}</p>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-primary-400 hover:bg-secondary-50 hover:text-primary-600 transition-colors uppercase tracking-widest">
                    My Account
                  </Link>
                  <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-primary-400 hover:bg-secondary-50 hover:text-primary-600 transition-colors uppercase tracking-widest">
                    Orders & Tracking
                  </Link>
                  {user.role === 'seller' && (
                    <Link to="/seller" className="flex items-center gap-3 px-4 py-2.5 text-xs font-black text-primary-600 hover:bg-primary-50 transition-colors uppercase tracking-widest border-t border-primary-50 mt-1">
                      Seller Dashboard
                    </Link>
                  )}
                   {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-xs font-black text-red-600 hover:bg-red-50 transition-colors uppercase tracking-widest border-t border-primary-50 mt-1">
                      Admin Portal
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); navigate('/'); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors tracking-widest uppercase mt-1 border-t border-primary-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
              
              {!user && menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-primary-100 rounded-sm shadow-xl p-4 z-50">
                  <p className="text-sm font-bold text-primary-400 mb-4 uppercase tracking-widest text-center">Welcome to Jesify</p>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full rounded-sm font-black uppercase text-[10px] tracking-widest">Login / Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-4 pt-1 px-1">
            <div className="relative">
              <Input
                autoFocus
                placeholder="Search..."
                className="pl-10 rounded-sm bg-secondary-400/30 border-secondary-400 focus:bg-white text-primary-500 h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-primary-300" />
              <button 
                className="absolute right-3 top-3"
                onClick={() => { setSearchTerm(''); setMobileSearchOpen(false); }}
              >
                <X className="h-5 w-5 text-primary-300" />
              </button>
            </div>
            
            {/* Mobile Suggestions Overlay */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 bg-white border-t border-primary-100 shadow-2xl max-h-[80vh] overflow-y-auto z-50">
                {suggestions.map((product) => (
                  <div 
                    key={product.id}
                    onClick={() => {
                      setSearchTerm('');
                      setShowSuggestions(false);
                      setMobileSearchOpen(false);
                      navigate(`/product/${product.id}`);
                    }}
                    className="flex items-center gap-4 p-4 border-b border-primary-50"
                  >
                    <div className="h-12 w-12 rounded-sm bg-secondary-200 p-1">
                      <img src={product.images?.[0]} alt="" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-primary-500 uppercase">{product.name}</p>
                      <p className="text-xs font-black text-primary-500">₹{product.price}</p>
                    </div>
                    <ChevronRight className="ml-auto w-5 h-5 text-primary-200" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide-out Mobile Menu (Drawer style) */}
      <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${menuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-primary-900/40 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        
        {/* Content */}
        <div className={`absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-primary-50 flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  <span className="text-2xl font-black text-primary-500 font-brand italic underline decoration-secondary-500 underline-offset-4 decoration-4">Jesify</span>
                </Link>
                <button onClick={() => setMenuOpen(false)} className="p-1 rounded-sm hover:bg-secondary-100">
                  <X className="h-6 w-6 text-primary-400" />
                </button>
             </div>
             
             {user ? (
               <div className="flex items-center gap-3 mt-4">
                 <div className="w-12 h-12 rounded-sm bg-primary-500 flex items-center justify-center text-secondary-500 font-black text-lg">
                   {user.name.charAt(0).toUpperCase()}
                 </div>
                 <div className="overflow-hidden">
                   <p className="text-sm font-black text-primary-500 truncate uppercase tracking-tight">{user.name}</p>
                   <p className="text-[10px] font-bold text-primary-300 truncate lowercase">{user.email}</p>
                 </div>
               </div>
             ) : (
               <Link to="/login" onClick={() => setMenuOpen(false)} className="mt-4">
                 <Button className="w-full rounded-sm uppercase tracking-widest font-black text-xs py-4">Sign In / Join Us</Button>
               </Link>
             )}
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-6 py-2">
              <p className="text-[10px] font-black text-primary-200 uppercase tracking-[0.2em] mb-4">Shop Collections</p>
              <div className="space-y-4">
                <Link to="/products" className="flex items-center justify-between text-sm font-black text-primary-400 uppercase tracking-widest hover:text-primary-600" onClick={() => setMenuOpen(false)}>
                   All Products <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/products?category=Mobiles" className="flex items-center justify-between text-sm font-black text-primary-400 uppercase tracking-widest hover:text-primary-600" onClick={() => setMenuOpen(false)}>
                   Mobiles <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/products?category=Fashion" className="flex items-center justify-between text-sm font-black text-primary-400 uppercase tracking-widest hover:text-primary-600" onClick={() => setMenuOpen(false)}>
                   Fashion <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="px-6 py-8 border-t border-primary-50 mt-8">
              <p className="text-[10px] font-black text-primary-200 uppercase tracking-[0.2em] mb-4">Account & Tools</p>
              <div className="space-y-6">
                <Link to="/orders" className="flex items-center gap-3 text-sm font-black text-primary-400 uppercase tracking-widest" onClick={() => setMenuOpen(false)}>
                   <Package className="w-4 h-4" /> My Orders
                </Link>
                {!sellerProfile && (
                  <Link to="/seller/register" className="flex items-center gap-3 text-sm font-black text-primary-500 uppercase tracking-widest" onClick={() => setMenuOpen(false)}>
                    <Store className="w-4 h-4" /> Start Selling
                  </Link>
                )}
                {user?.role === 'seller' && (
                   <Link to="/seller" className="flex items-center gap-3 text-sm font-black text-primary-600 uppercase tracking-widest" onClick={() => setMenuOpen(false)}>
                    <LayoutDashboard className="w-4 h-4" /> Seller Dashboard
                  </Link>
                )}
                 {user?.role === 'admin' && (
                   <Link to="/admin" className="flex items-center gap-3 text-sm font-black text-red-600 uppercase tracking-widest" onClick={() => setMenuOpen(false)}>
                    <ShieldCheck className="w-4 h-4" /> Admin Portal
                  </Link>
                )}
              </div>
            </div>
          </nav>

          {user && (
            <div className="p-6 border-t border-primary-50 bg-secondary-50/50">
              <button 
                onClick={() => { logout(); navigate('/'); setMenuOpen(false); }}
                className="flex items-center gap-3 text-sm font-black text-red-500 uppercase tracking-widest"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Simple icon mappings for the nav
const Package = ({ className }: { className?: string }) => <ShoppingBag className={className} />;
const ShoppingBag = ({ className }: { className?: string }) => <Store className={className} />;
const LayoutDashboard = ({ className }: { className?: string }) => <div className={className}><Search className="h-4 w-4" /></div>;
const ShieldCheck = ({ className }: { className?: string }) => <Store className={className} />;
