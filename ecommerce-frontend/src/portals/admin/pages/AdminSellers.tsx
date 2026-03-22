import React from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { Button } from '../../../shared/components/Button';
import { Store, ShieldCheck, Phone, MoreHorizontal, UserCheck, UserX, AlertCircle } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

export const AdminSellers: React.FC = () => {
  const { getAllSellers, updateSellerStatus } = useAuth();
  const sellers = getAllSellers();

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4 sm:px-0">
        <div className="flex items-center gap-4">
           <div className="h-10 w-10 bg-primary-500 rounded-sm flex items-center justify-center text-secondary-500 shadow-lg">
              <Store className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-2xl font-black text-primary-500 uppercase tracking-tighter italic">Merchant Directory</h1>
              <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest mt-0.5">Verified Seller Network</p>
           </div>
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden grid grid-cols-1 gap-4 px-4">
        {sellers.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-sm border border-primary-50">
             <AlertCircle className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
             <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest">No merchants registered</p>
          </div>
        ) : (
          sellers.map((seller) => (
            <div key={seller.id} className="bg-white rounded-sm border border-primary-50 shadow-sm p-5 space-y-4 relative overflow-hidden group">
               <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-secondary-400 rounded-sm flex items-center justify-center text-primary-300 font-black text-xl">
                      {seller.storeName.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                       <h3 className="text-sm font-black text-primary-500 uppercase tracking-tight truncate">{seller.storeName}</h3>
                       <p className="text-[9px] font-black text-primary-200 uppercase tracking-widest">{seller.id.slice(-8)}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border",
                    seller.status === 'APPROVED' ? "bg-green-50 text-green-600 border-green-100" :
                    seller.status === 'BLOCKED' ? "bg-red-50 text-red-600 border-red-100" :
                    "bg-orange-50 text-orange-600 border-orange-100"
                  )}>
                    {seller.status}
                  </span>
               </div>
               
               <div className="grid grid-cols-2 gap-4 py-4 border-y border-primary-50">
                  <div>
                    <p className="text-[8px] font-black text-primary-200 uppercase tracking-widest mb-1">Contact Phone</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary-500">
                       <Phone className="w-3 h-3 text-primary-300" /> {seller.phone}
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-primary-200 uppercase tracking-widest mb-1">National ID</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary-500">
                       <ShieldCheck className="w-3 h-3 text-primary-300" /> {seller.aadhaarNumber.replace(/(\d{4})/g, '$1 ')}
                    </div>
                  </div>
               </div>

               <div className="flex items-center gap-2 pt-2">
                 {seller.status === 'PENDING' && (
                    <Button 
                       className="flex-1 rounded-sm uppercase tracking-widest font-black text-[10px] py-4 bg-green-600 hover:bg-green-700"
                       onClick={() => updateSellerStatus(seller.id, 'APPROVED')}
                    >
                       Approve Access
                    </Button>
                 )}
                 {seller.status === 'APPROVED' && (
                    <Button 
                       variant="outline"
                       className="flex-1 rounded-sm uppercase tracking-widest font-black text-[10px] py-4 text-red-500 border-red-100 hover:bg-red-50"
                       onClick={() => updateSellerStatus(seller.id, 'BLOCKED')}
                    >
                       Suspend Account
                    </Button>
                 )}
                 {seller.status === 'BLOCKED' && (
                    <Button 
                       variant="outline"
                       className="flex-1 rounded-sm uppercase tracking-widest font-black text-[10px] py-4 border-primary-100 text-primary-400 hover:bg-secondary-50"
                       onClick={() => updateSellerStatus(seller.id, 'APPROVED')}
                    >
                       Reactivate
                    </Button>
                 )}
               </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white rounded-sm border border-primary-50 shadow-sm overflow-hidden mx-4 sm:mx-0">
        <table className="w-full text-left">
          <thead className="bg-secondary-400/50 border-b border-primary-50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Merchant Profile</th>
              <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Contact Records</th>
              <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Operational Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em] text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50">
            {sellers.map((seller) => (
              <tr key={seller.id} className="group hover:bg-secondary-50/50 transition-colors">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-secondary-400 rounded-sm flex items-center justify-center text-primary-300 font-black text-lg group-hover:bg-primary-500 group-hover:text-secondary-500 transition-all">
                        {seller.storeName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-black text-primary-500 uppercase tracking-tight">{seller.storeName}</div>
                        <div className="text-[9px] font-bold text-primary-200 mt-0.5 max-w-[200px] truncate">{seller.description}</div>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="space-y-1">
                      <div className="text-xs font-bold text-primary-500">T: {seller.phone}</div>
                      <div className="text-[9px] font-black text-primary-300 uppercase tracking-widest">ID: {seller.aadhaarNumber}</div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={cn(
                    "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5",
                    seller.status === 'APPROVED' ? "bg-green-50 text-green-600 border border-green-100" :
                    seller.status === 'BLOCKED' ? "bg-red-50 text-red-600 border border-red-100" :
                    "bg-orange-50 text-orange-600 border border-orange-100"
                  )}>
                     <div className={cn("w-1.5 h-1.5 rounded-full", seller.status === 'APPROVED' ? "bg-green-500" : seller.status === 'BLOCKED' ? "bg-red-500" : "bg-orange-500")} />
                     {seller.status}
                   </span>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-2">
                     {seller.status === 'PENDING' && (
                        <button 
                           onClick={() => updateSellerStatus(seller.id, 'APPROVED')}
                           className="p-2 bg-green-50 rounded-sm text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-sm border border-green-100"
                           title="Approve Merchant"
                        >
                           <UserCheck className="w-4 h-4" />
                        </button>
                     )}
                     {seller.status === 'APPROVED' && (
                        <button 
                           onClick={() => updateSellerStatus(seller.id, 'BLOCKED')}
                           className="p-2 bg-red-50 rounded-sm text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
                           title="Suspend Merchant"
                        >
                           <UserX className="w-4 h-4" />
                        </button>
                     )}
                     {(seller.status === 'BLOCKED' || seller.status === 'PENDING') && (
                        <button 
                           className="p-2 bg-secondary-400 rounded-sm text-primary-300 hover:text-primary-500 transition-all border border-primary-50"
                           onClick={() => updateSellerStatus(seller.id, 'APPROVED')}
                           title="Review Details"
                        >
                           <MoreHorizontal className="w-4 h-4" />
                        </button>
                     )}
                   </div>
                </td>
              </tr>
            ))}
            {sellers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                   <div className="flex flex-col items-center">
                       <AlertCircle className="w-12 h-12 text-secondary-400 mb-4" />
                       <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest">Digital Merchant Registry is empty</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
