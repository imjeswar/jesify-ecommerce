import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';

export const Register: React.FC = () => {
  const { user, registerSeller, getAllSellers } = useAuth();
  const navigate = useNavigate();
  const allSellers = getAllSellers();

  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    aadhaarNumber: '',
    phone: '',
    address: ''
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-4 text-primary-500">Please Login First</h2>
        <p className="text-primary-400 mb-6">You need to have a user account before becoming a seller.</p>
        <Button onClick={() => navigate('/login')}>Login Now</Button>
      </div>
    );
  }

  // If already registered, prevent duplicate registration
  const existingForUser = allSellers.find(s => s.userId === user.id);
  if (existingForUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-2 text-primary-500">Seller Registration Exists</h2>
        <p className="text-primary-400 mb-4">
          Status: {existingForUser.status}. {existingForUser.status !== 'APPROVED' ? 'Please wait for admin approval.' : 'You are approved.'}
        </p>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
          {existingForUser.status === 'APPROVED' && (
            <Button onClick={() => navigate('/seller')}>Enter Seller Portal</Button>
          )}
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Unique phone/aadhaar validation
    const phoneExists = allSellers.some(s => s.phone === formData.phone);
    const aadhaarExists = allSellers.some(s => s.aadhaarNumber === formData.aadhaarNumber);
    if (phoneExists) {
      alert('Phone number already registered to a seller.');
      return;
    }
    if (aadhaarExists) {
      alert('Aadhaar number already registered to a seller.');
      return;
    }
    registerSeller(formData);
    navigate('/seller');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex bg-secondary-500">
      {/* Left Side - Brand Display */}
      <div className="hidden lg:flex w-1/2 bg-primary-500 text-secondary-500 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600/20 backdrop-blur-3xl z-0"></div>
        <div className="relative z-10 mt-8">
          <h2 className="text-4xl font-brand font-bold mb-6 text-secondary-500 tracking-tight">Jesify</h2>
          <p className="text-3xl font-heading opacity-90 leading-tight max-w-md">
            Join thousands of premium sellers delivering excellence.
          </p>
        </div>
        <div className="relative z-10 mb-8">
          <div className="w-24 h-1 bg-secondary-500 mb-8 rounded-full opacity-80"></div>
          <p className="text-primary-200 text-lg">
            Elevate your storefront with our cutting-edge e-commerce tools, global reach, and unparalleled design aesthetic.
          </p>
        </div>
        
        {/* Subtle decorative elements for premium feel */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 transform -translate-x-1/4 translate-y-1/4"></div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-lg space-y-8 relative z-10">
          <div>
            <h1 className="text-3xl font-bold text-primary-500 mb-2">Become a Seller</h1>
            <p className="text-primary-400">Fill in your details to start selling on Jesify.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Store Name"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="My Awesome Store"
              required
            />

            <div>
              <label className="block text-sm font-medium text-primary-500 mb-1">Store Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-sm border border-primary-200 bg-secondary-50 text-primary-500 placeholder-primary-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Aadhaar Number"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                placeholder="XXXX-XXXX-XXXX"
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXXXXXXX"
                required
              />
            </div>

            <Input
              label="Business Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street, City, State, Zip"
              required
            />

            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full">
                Submit & Start Selling
              </Button>
              <p className="mt-4 text-xs text-center text-primary-300">
                By registering, you agree to our Seller Terms & Conditions.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
