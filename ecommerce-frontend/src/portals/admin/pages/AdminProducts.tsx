import React, { useState, useEffect } from 'react';
import { ProductService } from '../../../shared/services/product.service';
import { formatCurrency } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';
import type { Product } from '../../../shared/types/product.types';
import { Package, Store, Tag, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(ProductService.getAllProducts());
  }, []);

  const handleToggleStatus = (id: string) => {
    ProductService.toggleProductStatus(id);
    setProducts(ProductService.getAllProducts());
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4 sm:px-0">
        <div className="flex items-center gap-4">
           <div className="h-10 w-10 bg-primary-500 rounded-sm flex items-center justify-center text-secondary-500 shadow-lg">
              <Package className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-2xl font-black text-primary-500 uppercase tracking-tighter italic">Asset Control</h1>
              <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest mt-0.5">Global Inventory Audit</p>
           </div>
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden grid grid-cols-1 gap-4 px-4">
        {products.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-sm border border-primary-50">
             <AlertTriangle className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
             <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest">No assets found in registry</p>
          </div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="bg-white rounded-sm border border-primary-50 shadow-sm p-5 space-y-4 relative">
               <div className="flex items-start gap-4">
                  <div className="h-16 w-16 bg-secondary-50 rounded-sm overflow-hidden border border-secondary-400/50 p-2 flex-shrink-0">
                     <img src={p.imageUrl} alt="" className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-[8px] font-black text-primary-200 uppercase tracking-widest mb-1">{p.category}</p>
                     <h3 className="text-sm font-black text-primary-500 uppercase tracking-tight truncate leading-tight">{p.name}</h3>
                     <p className="text-lg font-black text-primary-500 mt-1">{formatCurrency(p.price)}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 py-4 border-y border-primary-50">
                  <div>
                    <p className="text-[8px] font-black text-primary-200 uppercase tracking-widest mb-1">Source Merchant</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary-500 truncate">
                       <Store className="w-3 h-3 text-primary-300" /> {p.sellerName}
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-primary-200 uppercase tracking-widest mb-1">Inventory ID</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary-500">
                       <Tag className="w-3 h-3 text-primary-300" /> #{p.id.slice(-6).toUpperCase()}
                    </div>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-2">
                  <span className={cn(
                    "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 border",
                    p.status === 'ACTIVE' || !p.status ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                  )}>
                     <div className={cn("w-1.5 h-1.5 rounded-full", (p.status === 'ACTIVE' || !p.status) ? "bg-green-500" : "bg-red-500")} />
                     {p.status || 'ACTIVE'}
                  </span>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className={cn(
                      "rounded-sm uppercase tracking-widest font-black text-[9px] py-3 px-6 h-auto transition-all",
                      (p.status === 'ACTIVE' || !p.status) ? "text-red-500 border-red-100 hover:bg-red-50" : "text-green-600 border-green-100 hover:bg-green-50"
                    )}
                    onClick={() => handleToggleStatus(p.id)}
                  >
                     {(p.status === 'ACTIVE' || !p.status) ? <ShieldAlert className="w-3 h-3 mr-2" /> : <ShieldCheck className="w-3 h-3 mr-2" />}
                     {(p.status === 'ACTIVE' || !p.status) ? 'Restrict' : 'Authorize'}
                  </Button>
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
              <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Asset Details</th>
              <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Market Value</th>
              <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Merchant Source</th>
              <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Operational Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em] text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50">
            {products.map((p) => (
              <tr key={p.id} className="group hover:bg-secondary-50/50 transition-colors">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-sm border border-secondary-400 p-1 flex-shrink-0 group-hover:scale-110 transition-transform">
                         <img src={p.imageUrl} alt="" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-primary-500 uppercase tracking-tight">{p.name}</div>
                        <div className="text-[9px] font-bold text-primary-200 mt-0.5 lowercase tracking-wider">{p.category} • #{p.id.slice(-6)}</div>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="text-sm font-black text-primary-500 tabular-nums font-brand">{formatCurrency(p.price)}</div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                       <Store className="w-3.5 h-3.5 text-primary-200" />
                       <span className="text-xs font-bold text-primary-400">{p.sellerName}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={cn(
                    "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5",
                    p.status === 'ACTIVE' || !p.status ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                  )}>
                     <div className={cn("w-1.5 h-1.5 rounded-full", (p.status === 'ACTIVE' || !p.status) ? "bg-green-500" : "bg-red-500")} />
                     {p.status || 'ACTIVE'}
                   </span>
                </td>
                <td className="px-6 py-5 text-right">
                   <Button 
                    size="sm" 
                    variant="outline" 
                    className={cn(
                        "rounded-sm uppercase tracking-widest font-black text-[9px] h-8 transition-all px-4 shadow-sm",
                        (p.status === 'ACTIVE' || !p.status) ? "text-red-500 border-red-100 hover:bg-red-500 hover:text-white" : "text-green-600 border-green-100 hover:bg-green-500 hover:text-white"
                      )}
                    onClick={() => handleToggleStatus(p.id)}
                  >
                    {(p.status === 'ACTIVE' || !p.status) ? 'Restrict Access' : 'Authorize Asset'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
