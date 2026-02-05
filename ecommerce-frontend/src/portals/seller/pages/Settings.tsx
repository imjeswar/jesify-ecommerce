import React, { useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { ShieldCheck, ShieldAlert, Store, User, Phone, FileText } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, sellerProfile } = useAuth();
  
  // In a real app, this would be an update function
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
     storeName: sellerProfile?.storeName || '',
     phone: sellerProfile?.phone || '',
     // Aadhaar is usually immutable after verification
  });

  if (!user || !sellerProfile) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'BLOCKED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSave = () => {
      // Logic to update profile would go here
      setIsEditing(false);
      alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Seller Settings</h1>

      {/* Verification Status Card */}
      <div className={`p-6 rounded-xl border ${getStatusColor(sellerProfile.isVerified ? 'APPROVED' : 'PENDING')} flex items-start gap-4`}>
         <div className={`p-3 rounded-full bg-white/50`}>
            {sellerProfile.isVerified ? (
                <ShieldCheck className="h-6 w-6" />
            ) : (
                <ShieldAlert className="h-6 w-6" />
            )}
         </div>
         <div>
            <h3 className="font-bold text-lg">
                Account Status: {sellerProfile.isVerified ? 'VERIFIED' : 'PENDING VERIFICATION'}
            </h3>
            <p className="mt-1 opacity-90">
                {sellerProfile.isVerified 
                    ? 'Your account is fully active. You can list products and receive orders.' 
                    : 'Your account is currently under review. Product listings will not be visible to customers until approved.'}
            </p>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Store className="h-5 w-5 text-gray-400" />
                Business Profile
            </h2>
            {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleSave}>Save Changes</Button>
                </div>
            )}
         </div>
         
         <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Store className="h-4 w-4" /> Business Name
                    </label>
                    {isEditing ? (
                        <Input 
                            value={formData.storeName} 
                            onChange={e => setFormData({...formData, storeName: e.target.value})}
                        />
                    ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                            {formData.storeName}
                        </div>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <User className="h-4 w-4" /> Owner Name
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed">
                        {user.name}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Cannot be changed</p>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Phone Number
                    </label>
                     {isEditing ? (
                        <Input 
                            value={formData.phone} 
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                            {formData.phone}
                        </div>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Aadhaar Number
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed font-mono">
                        {sellerProfile.aadhaarNumber ? `XXXX-XXXX-${sellerProfile.aadhaarNumber.slice(-4)}` : 'Not Provided'}
                    </div>
                     <p className="text-xs text-gray-400 mt-1">Read-only for security</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
