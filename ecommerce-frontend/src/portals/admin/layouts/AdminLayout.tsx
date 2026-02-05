import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/sellers', label: 'Sellers' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/products', label: 'Products' },
    { path: '/admin/audit', label: 'Audit Logs' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold tracking-tight font-brand">Jesify Admin</h1>
              <span className="text-xs bg-red-600 px-2 py-0.5 rounded text-white font-semibold">MASTER</span>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-200 text-center py-4 text-xs text-gray-500 font-brand">
        Jesify Admin Portal • Authorized Access Only
      </footer>
    </div>
  );
};
