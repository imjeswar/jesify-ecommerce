import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './shared/context/AuthContext';
import { seedData } from './shared/utils/seedData';
import { CartProvider } from './shared/context/CartContext';
import { UserLayout } from './portals/user/layout/UserLayout';
import { Home } from './portals/user/pages/Home';
import { Login } from './portals/user/pages/Login';
import { Cart } from './portals/user/pages/Cart';
import { Checkout } from './portals/user/pages/Checkout';
import { Orders } from './portals/user/pages/Orders';
import { ProductDetails } from './portals/user/pages/ProductDetails';
import { Products } from './portals/user/pages/Products';
import { Register as SellerRegister } from './portals/seller/pages/Register';
import { SellerLayout } from './portals/seller/layout/SellerLayout';
import { Dashboard as SellerDashboard } from './portals/seller/pages/Dashboard';
import { AddProduct } from './portals/seller/pages/AddProduct';
import { Products as SellerProducts } from './portals/seller/pages/Products';
import { Settings as SellerSettings } from './portals/seller/pages/Settings';
import { AdminLayout } from './portals/admin/layouts/AdminLayout';
import { Dashboard as AdminDashboard } from './portals/admin/pages/Dashboard';
import { AdminLogin } from './portals/admin/pages/AdminLogin';
import { AdminSellers } from './portals/admin/pages/AdminSellers';
import { AdminUsers } from './portals/admin/pages/AdminUsers';
import { AdminProducts } from './portals/admin/pages/AdminProducts';
import { AdminAudit } from './portals/admin/pages/AdminAudit';
import { SellerOrders } from './portals/seller/pages/Orders';
import { ContactUs, AboutUs, Careers } from './portals/user/pages/info/AboutPages';
import { Payments, Shipping, CancellationReturns, FAQ } from './portals/user/pages/info/HelpPages';
import { TermsOfUse, Security, Privacy } from './portals/user/pages/info/PolicyPages';
import type { SellerProfile } from './shared/types/seller.types';

// Protected Admin Route Component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

// Protected Seller Route Component (only APPROVED sellers)
const ProtectedSellerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, sellerProfile } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'seller') {
    return <Navigate to="/seller/register" replace />;
  }
  const approved = sellerProfile && (sellerProfile as SellerProfile).status === 'APPROVED';
  if (!approved) {
    return <Navigate to="/seller/register" replace />;
  }
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    seedData();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* User Portal Routes */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<Orders />} />
              <Route path="products" element={<Products />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="seller/register" element={<SellerRegister />} />
              
              {/* Info Pages */}
              <Route path="contact-us" element={<ContactUs />} />
              <Route path="about-us" element={<AboutUs />} />
              <Route path="careers" element={<Careers />} />
              <Route path="payments" element={<Payments />} />
              <Route path="shipping" element={<Shipping />} />
              <Route path="cancellation-returns" element={<CancellationReturns />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="terms-of-use" element={<TermsOfUse />} />
              <Route path="security" element={<Security />} />
              <Route path="privacy" element={<Privacy />} />
            </Route>

            {/* Seller Portal Routes */}
            <Route path="/seller" element={
              <ProtectedSellerRoute>
                <SellerLayout />
              </ProtectedSellerRoute>
            }>
              <Route index element={<SellerDashboard />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products" element={<SellerProducts />} />
              <Route path="orders" element={<SellerOrders />} />
              <Route path="settings" element={<SellerSettings />} />
            </Route>

            {/* Admin Portal Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="sellers" element={<AdminSellers />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="audit" element={<AdminAudit />} />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
