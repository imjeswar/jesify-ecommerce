import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { Menu, X, LogOut, ShieldCheck, PieChart, Users, Package, Store, History } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

export const AdminLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: PieChart },
    { path: '/admin/sellers', label: 'Sellers', icon: Store },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/audit', label: 'Audit Logs', icon: History },
  ];

  return (
    <div className="min-h-screen bg-secondary-500 flex flex-col">
      {/* Admin Header */}
      <header className="bg-primary-500 text-secondary-500 shadow-md sticky top-0 z-50 border-b border-primary-600">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 md:hidden text-secondary-500 hover:bg-primary-600 rounded-sm"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/" className="flex items-center gap-2">
                 <ShieldCheck className="h-6 w-6 text-secondary-500" />
                 <h1 className="text-xl font-black tracking-tighter uppercase font-brand italic">Jesify Admin</h1>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all",
                    location.pathname === item.path
                      ? "bg-secondary-500 text-primary-500 shadow-sm"
                      : "text-primary-100 hover:bg-primary-600"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end mr-2">
               <span className="text-[10px] font-black uppercase tracking-tight leading-none">{user?.name}</span>
               <span className="text-[8px] font-bold text-primary-200 tracking-widest uppercase">Master Admin</span>
             </div>
             <button 
                onClick={handleLogout}
                className="p-2 text-primary-100 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 bg-primary-600 border-t border-primary-700",
          isMenuOpen ? "max-h-[400px] border-b border-primary-800" : "max-h-0"
        )}>
           <nav className="p-4 grid grid-cols-1 gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-black uppercase tracking-widest transition-all",
                      location.pathname === item.path
                        ? "bg-secondary-500 text-primary-500"
                        : "text-primary-100 hover:bg-primary-700"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
           </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
           <h2 className="text-sm font-black text-primary-300 uppercase tracking-[0.2em] mb-1">
             {navItems.find(n => n.path === location.pathname)?.label || 'System Management'}
           </h2>
           <div className="h-1 w-12 bg-primary-500 rounded-sm"></div>
        </div>
        <Outlet />
      </main>

      <footer className="bg-secondary-400 border-t border-secondary-500/50 py-6 text-center">
        <p className="text-[10px] font-black text-primary-300 uppercase tracking-[0.3em] font-brand">
          Authorized Admin Personnel Only
        </p>
        <p className="text-[8px] font-bold text-primary-200 mt-1 uppercase tracking-widest">
          Jesify Secure Framework v2.0
        </p>
      </footer>
    </div>
  );
};
