import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Store } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { useCart } from '../../../shared/context/CartContext';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuOpen) {
        if (menuRef.current && !menuRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) {
          setMenuOpen(false);
        }
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/jesifylogo1.jpeg" alt="Jesify logo" className="h-8 w-8" />
            <span className="text-2xl font-bold text-primary-600 font-heading">Jesify</span>
          </Link>

          <div className="hidden md:block w-[600px]">
            <div className="relative">
              <Input
                placeholder="Search for products..."
                className="pl-10 rounded-full bg-gray-50 border-gray-200 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/seller/register">
            <Button variant="ghost" className="hidden sm:flex items-center gap-2">
              <Store className="h-5 w-5" />
              Become a Seller
            </Button>
          </Link>

          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                ref={buttonRef}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary-600"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(o => !o)}
              >
                <User className="h-6 w-6" />
                <span className="hidden sm:block font-medium">{user.name}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50">My Orders</Link>
                  {user.role === 'seller' && (
                    <Link to="/seller" className="block px-4 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50">Seller Dashboard</Link>
                  )}
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
