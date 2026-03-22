import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../../../shared/services/product.service';
import { useAuth } from '../../../shared/context/AuthContext';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Package, ChevronLeft, ShieldCheck, ShieldAlert, Tag, Image as ImageIcon, Box, Coins } from 'lucide-react';

export const AddProduct: React.FC = () => {
  const { user, sellerProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: ''
  });

  if (!sellerProfile?.isVerified) {
    return (
      <div className="max-w-xl mx-auto p-6 sm:p-20 text-center">
        <div className="bg-red-50 p-10 rounded-sm border border-red-100 shadow-sm">
           <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
           <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter">Restriction Active</h2>
           <p className="text-red-400 font-medium text-sm mt-2 mb-8 lowercase italic">Merchant identity verification required for inventory induction.</p>
           <Button className="w-full py-6 rounded-sm uppercase font-black tracking-widest text-[10px] bg-red-600 hover:bg-red-700 h-auto" onClick={() => navigate('/seller')}>
             Return to Hub
           </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      ProductService.addProduct({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        imageUrl: formData.imageUrl,
        sellerId: user.id,
        sellerName: sellerProfile?.storeName || user.name
      });
      navigate('/seller/products');
    } catch (error) {
      console.error('Record induction failure:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 sm:px-0">
         <button onClick={() => navigate(-1)} className="p-2 hover:bg-secondary-400 rounded-sm text-primary-200">
            <ChevronLeft className="w-6 h-6" />
         </button>
         <div>
            <h1 className="text-2xl font-black text-primary-500 uppercase tracking-tighter italic">Induct New Asset</h1>
            <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest mt-0.5">Secure Inventory Induction System</p>
         </div>
      </div>

      <div className="bg-white rounded-sm border border-primary-50 shadow-sm overflow-hidden mx-4 sm:mx-0">
        <div className="px-6 py-5 bg-secondary-400/50 border-b border-primary-50 flex items-center gap-3">
           <ShieldCheck className="w-5 h-5 text-green-600" />
           <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Authorized Merchant: <span className="text-primary-300 italic">{sellerProfile?.storeName}</span></span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="relative">
                   <Tag className="absolute left-3 top-10 text-primary-200 w-4 h-4" />
                   <Input
                    label="Asset Label"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.G., TITANIUM_CHRONO_X"
                    required
                    className="pl-10 h-12 font-bold text-xs uppercase"
                  />
                </div>
                
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black text-primary-200 uppercase tracking-widest mb-1 ml-1">Vessel Category</label>
                  <div className="relative">
                     <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-200 w-4 h-4" />
                     <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="block w-full rounded-sm border border-primary-100 bg-secondary-50/50 px-10 py-3 text-xs font-bold text-primary-500 uppercase focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all appearance-none"
                      required
                    >
                      <option value="">Select Protocol</option>
                      <option value="Mobiles">Mobiles</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Beauty, Toys & More">Beauty, Toys & More</option>
                      <option value="Home & Furniture">Home & Furniture</option>
                    </select>
                  </div>
                </div>
            </div>

            <div className="space-y-1.5 flex flex-col">
               <label className="text-[10px] font-black text-primary-200 uppercase tracking-widest mb-1 ml-1">Asset Description</label>
               <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="DETAILED_SPECIFICATIONS_HERE..."
                className="w-full rounded-sm border border-primary-100 bg-secondary-50/50 px-4 py-3 text-xs font-bold text-primary-500 uppercase focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all resize-none placeholder:opacity-30"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
             <div className="relative">
                <Coins className="absolute left-3 top-10 text-primary-200 w-4 h-4" />
                <Input
                  label="Induction Value (INR)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="pl-10 h-12 font-bold text-xs tabular-nums"
                />
             </div>
             <div className="relative">
                <Package className="absolute left-3 top-10 text-primary-200 w-4 h-4" />
                <Input
                  label="Units Available"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  className="pl-10 h-12 font-bold text-xs tabular-nums"
                />
             </div>
             <div className="relative">
                <ImageIcon className="absolute left-3 top-10 text-primary-200 w-4 h-4" />
                <Input
                  label="Visual Asset Link"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="HTTPS://ASSETS.JESIFY.IO/..."
                  className="pl-10 h-12 font-bold text-[9px] uppercase"
                />
             </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-primary-50">
            <Button type="button" variant="outline" onClick={() => navigate('/seller')} className="py-6 px-10 rounded-sm uppercase font-black tracking-widest text-[10px] border-primary-100 h-auto">
              Abort Op
            </Button>
            <Button type="submit" className="py-6 px-12 rounded-sm uppercase font-black tracking-widest text-[10px] h-auto shadow-lg">
              Induct Asset
            </Button>
          </div>
        </form>
      </div>

      <div className="mx-4 sm:mx-0 p-6 bg-primary-50 border border-primary-100 rounded-sm flex items-start gap-4">
         <ShieldAlert className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
         <div className="space-y-1">
            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Protocol Reminder</p>
            <p className="text-[9px] font-bold text-primary-300 leading-relaxed uppercase">Ensure all induction parameters are accurate. False records may result in temporary merchant restriction.</p>
         </div>
      </div>
    </div>
  );
};
