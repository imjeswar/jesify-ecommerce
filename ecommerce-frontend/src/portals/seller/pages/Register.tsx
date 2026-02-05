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
        <h2 className="text-2xl font-bold mb-4">Please Login First</h2>
        <p className="text-gray-600 mb-6">You need to have a user account before becoming a seller.</p>
        <Button onClick={() => navigate('/login')}>Login Now</Button>
      </div>
    );
  }

  // If already registered, prevent duplicate registration
  const existingForUser = allSellers.find(s => s.userId === user.id);
  if (existingForUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-2">Seller Registration Exists</h2>
        <p className="text-gray-600 mb-4">
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
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">Become a Seller</h1>
          <p className="text-gray-500">Fill in your details to start selling on Jesify.</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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
            <p className="mt-4 text-xs text-center text-gray-400">
              By registering, you agree to our Seller Terms & Conditions.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
