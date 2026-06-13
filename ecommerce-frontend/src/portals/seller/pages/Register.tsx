import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Store, ShieldCheck, TrendingUp, Globe, Sparkles } from 'lucide-react';

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

  const [isHovered, setIsHovered] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full border border-primary-50">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-3xl font-black mb-3 text-primary-500 tracking-tight">Login Required</h2>
          <p className="text-primary-400 mb-8 font-medium">Please sign in to your user account before applying to become a seller.</p>
          <Button onClick={() => navigate('/login')} className="w-full py-4 text-lg rounded-xl shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-0.5">
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  // If already registered, prevent duplicate registration
  const existingForUser = allSellers.find(s => s.userId === user.id);
  if (existingForUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full border border-primary-50">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${existingForUser.status === 'APPROVED' ? 'bg-green-50 text-green-500' : 'bg-yellow-50 text-yellow-500'}`}>
            {existingForUser.status === 'APPROVED' ? <ShieldCheck className="w-8 h-8" /> : <Store className="w-8 h-8" />}
          </div>
          <h2 className="text-3xl font-black mb-3 text-primary-500 tracking-tight">Application Status</h2>
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary-50 text-primary-500 font-bold text-sm tracking-widest uppercase mb-4 border border-secondary-100">
            {existingForUser.status}
          </div>
          <p className="text-primary-400 mb-8 font-medium leading-relaxed">
            {existingForUser.status !== 'APPROVED' 
              ? 'Your application is currently under review by our team. We will notify you once it is approved.' 
              : 'Congratulations! Your seller account is approved and active.'}
          </p>
          <div className="flex flex-col gap-3">
            {existingForUser.status === 'APPROVED' && (
              <Button onClick={() => navigate('/seller')} className="w-full py-4 rounded-xl shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-0.5">
                Enter Seller Dashboard
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/')} className="w-full py-4 rounded-xl transition-all">
              Return to Home
            </Button>
          </div>
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
    <div className="relative min-h-[85vh] w-full flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl group my-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 transition-transform duration-1000 group-hover:scale-105"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden m-4 sm:m-8">
        
        {/* Left Side: Value Proposition */}
        <div className="lg:w-5/12 flex flex-col justify-center text-white p-8 sm:p-12 lg:pr-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest mb-8 w-max shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-secondary-300" />
            <span className="text-white">Premium Seller Program</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight font-brand tracking-tighter">
            Elevate Your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-500">Business</span>
          </h1>
          
          <p className="text-primary-100 text-lg mb-10 leading-relaxed font-medium">
            Join Jesify's exclusive network of premium sellers. Access world-class tools, global audiences, and unmatched support to scale your brand.
          </p>

          <div className="space-y-6">
            {[
              { icon: Globe, title: 'Global Reach', desc: 'Connect with millions of active buyers worldwide.' },
              { icon: TrendingUp, title: 'Growth Tools', desc: 'Advanced analytics and marketing features.' },
              { icon: ShieldCheck, title: 'Secure Platform', desc: 'End-to-end protection for your transactions.' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/10 transition-colors duration-300 border border-transparent hover:border-white/10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <feature.icon className="w-6 h-6 text-secondary-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{feature.title}</h3>
                  <p className="text-primary-200 text-sm font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:w-7/12 bg-white p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary-50 rounded-bl-full -z-10 opacity-70"></div>
          
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-primary-500 tracking-tight mb-3">Register Now</h2>
            <p className="text-primary-400 font-medium text-lg">Start your journey to success in minutes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="group">
               <Input
                 label="Store Name"
                 name="storeName"
                 value={formData.storeName}
                 onChange={handleChange}
                 placeholder="e.g. Acme Corporation"
                 required
                 className="bg-secondary-50 border-primary-100 focus:border-primary-500 focus:ring-primary-500 transition-all duration-300 py-3"
               />
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-primary-400 mb-2 tracking-widest uppercase">Store Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Tell us about your products and vision..."
                className="w-full rounded-xl border border-primary-100 bg-secondary-50 text-primary-500 placeholder-primary-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 resize-none shadow-sm text-sm font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="group">
                 <Input
                   label="Aadhaar Number"
                   name="aadhaarNumber"
                   value={formData.aadhaarNumber}
                   onChange={handleChange}
                   placeholder="XXXX-XXXX-XXXX"
                   required
                   className="bg-secondary-50 border-primary-100 focus:border-primary-500 focus:ring-primary-500 transition-all duration-300 py-3"
                 />
               </div>
               <div className="group">
                 <Input
                   label="Phone Number"
                   name="phone"
                   value={formData.phone}
                   onChange={handleChange}
                   placeholder="+91 XXXXXXXXXX"
                   required
                   className="bg-secondary-50 border-primary-100 focus:border-primary-500 focus:ring-primary-500 transition-all duration-300 py-3"
                 />
               </div>
            </div>

            <div className="group">
               <Input
                 label="Business Address"
                 name="address"
                 value={formData.address}
                 onChange={handleChange}
                 placeholder="Full street address, City, State, ZIP"
                 required
                 className="bg-secondary-50 border-primary-100 focus:border-primary-500 focus:ring-primary-500 transition-all duration-300 py-3"
               />
            </div>

            <div className="pt-8">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full relative overflow-hidden group bg-primary-500 hover:bg-primary-600 text-white rounded-xl py-5 shadow-xl transition-all duration-300 hover:shadow-primary-500/30 hover:-translate-y-1"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="relative z-10 flex items-center justify-center gap-3 font-black text-lg tracking-wide uppercase">
                  Submit Application
                  <Store className={`w-6 h-6 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100"></div>
              </Button>
              <p className="mt-6 text-xs text-center text-primary-300 font-medium">
                By registering, you agree to our <span className="text-primary-500 underline cursor-pointer hover:text-primary-600 transition-colors">Seller Terms & Conditions</span>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
