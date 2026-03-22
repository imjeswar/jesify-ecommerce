import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Store, Menu, X } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { cn } from '../../../shared/utils/cn';

export const SellerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/seller' },
    { icon: Package, label: 'Products', path: '/seller/products' },
    { icon: ShoppingBag, label: 'Orders', path: '/seller/orders' },
    { icon: Settings, label: 'Settings', path: '/seller/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-secondary-500 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-primary-500 flex items-center justify-between px-4 sticky top-0 z-50 border-b border-primary-600">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 text-secondary-500 hover:bg-primary-600 rounded-sm"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2 text-secondary-500">
            <Store className="h-6 w-6" />
            <span className="font-black text-lg tracking-tighter uppercase font-brand italic">Seller Zone</span>
          </Link>
        </div>
        <div className="h-8 w-8 rounded-sm bg-secondary-500 flex items-center justify-center text-primary-500 font-black border border-secondary-600">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* Sidebar / Drawer */}
      <div className={cn(
        "fixed inset-0 z-50 md:relative md:flex transition-all duration-300",
        isSidebarOpen ? "visible" : "invisible md:visible"
      )}>
        {/* Backdrop (Mobile) */}
        <div 
          className={cn(
            "absolute inset-0 bg-primary-900/60 backdrop-blur-sm md:hidden transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar Content */}
        <aside className={cn(
          "relative h-full w-72 bg-secondary-400 border-r border-primary-100 flex flex-col shadow-2xl transition-transform duration-300 transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="h-16 flex items-center justify-between px-6 border-b border-primary-100 bg-white md:bg-transparent">
            <Link to="/" className="flex items-center gap-2 text-primary-500">
              <Store className="h-6 w-6" />
              <span className="font-black text-xl tracking-tighter uppercase font-brand italic">Seller Zone</span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 text-primary-400 hover:bg-secondary-300 rounded-sm"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="px-4 text-[10px] font-black text-primary-200 uppercase tracking-[0.2em] mb-4">Main Navigation</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3.5 rounded-sm text-sm font-black uppercase tracking-widest transition-all',
                    isActive
                      ? 'bg-primary-500 text-secondary-500 shadow-md transform scale-[1.02]'
                      : 'text-primary-400 hover:bg-secondary-300 hover:text-primary-500'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-primary-100 bg-secondary-300/30">
            <div className="flex items-center gap-4 px-4 py-3 mb-4 bg-white/50 rounded-sm border border-primary-50">
              <div className="h-10 w-10 rounded-sm bg-primary-500 flex items-center justify-center text-secondary-500 font-black text-lg border border-primary-600">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-primary-500 truncate uppercase tracking-tight">{user?.name}</p>
                <p className="text-[10px] text-primary-400 truncate tracking-wide">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-red-500 hover:bg-red-50 rounded-sm transition-all uppercase tracking-widest border border-red-100"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-secondary-500">
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
