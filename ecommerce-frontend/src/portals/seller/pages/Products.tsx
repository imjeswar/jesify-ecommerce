import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, X, Check, Package, MoreVertical, LayoutGrid, List } from 'lucide-react';
import { ProductService } from '../../../shared/services/product.service';
import { useAuth } from '../../../shared/context/AuthContext';
import type { Product } from '../../../shared/types/product.types';
import { formatCurrency } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { cn } from '../../../shared/utils/cn';

export const Products: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const loadProducts = useCallback(() => {
    if (user?.id) {
      const prods = ProductService.getProductsBySeller(user.id);
      setProducts(prods);
    }
  }, [user]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this product? this cannot be undone.')) {
      ProductService.deleteProduct(id);
      loadProducts();
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      ProductService.updateProduct(editingId, editForm);
      setEditingId(null);
      setEditForm({});
      loadProducts();
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4 sm:px-0">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-8 bg-primary-500 rounded-sm"></div>
              <p className="text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Inventory Manager</p>
           </div>
           <h1 className="text-3xl font-black text-primary-500 uppercase tracking-tighter italic">Product Vault</h1>
        </div>
        <Link to="/seller/products/add">
          <Button className="w-full sm:w-auto gap-2 py-6 rounded-sm font-black uppercase tracking-widest text-xs shadow-md">
            <Plus className="h-4 w-4" /> Ship New Batch
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-sm border border-primary-50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mx-4 sm:mx-0">
         <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-300" />
            <Input
              placeholder="Filter by name or category..."
              className="pl-10 h-11 rounded-sm bg-secondary-400/20 border-secondary-400/50 focus:bg-white text-xs font-bold"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
         </div>
         
         <div className="hidden md:flex items-center bg-secondary-400/30 p-1 rounded-sm border border-primary-50">
            <button 
              onClick={() => setViewMode('table')}
              className={cn("p-2 rounded-sm transition-all", viewMode === 'table' ? "bg-white shadow-sm text-primary-500" : "text-primary-200 hover:text-primary-400")}
            >
              <List className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('cards')}
              className={cn("p-2 rounded-sm transition-all", viewMode === 'cards' ? "bg-white shadow-sm text-primary-500" : "text-primary-200 hover:text-primary-400")}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* MOBILE CARD VIEW (Hidden on Desktop, shown on small screens) */}
      <div className="md:hidden grid grid-cols-1 gap-4 px-4">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-sm border border-primary-50">
             <Package className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
             <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest">No matching products found</p>
          </div>
        ) : (
          filteredProducts.map(p => (
            <div key={p.id} className="bg-white rounded-sm border border-primary-50 shadow-sm p-4 flex flex-col gap-4 relative">
               <div className="flex items-start gap-4">
                  <div className="h-20 w-20 flex-shrink-0 bg-secondary-50/50 rounded-sm overflow-hidden border border-secondary-400/50 p-2">
                     <img src={p.imageUrl} alt="" className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-[10px] font-black text-primary-200 uppercase tracking-[0.2em] mb-1">{p.category}</p>
                     <h3 className="text-sm font-black text-primary-500 uppercase tracking-tight truncate leading-tight">{p.name}</h3>
                     <p className="text-lg font-black text-primary-500 mt-2">{formatCurrency(p.price)}</p>
                  </div>
               </div>
               
               <div className="flex items-center justify-between border-t border-primary-50 pt-4">
                  <div className="flex items-center gap-3">
                     <div className="text-[10px] font-black text-primary-300 uppercase tracking-widest">Stock: </div>
                     <span className={cn("text-xs font-black px-2 py-0.5 rounded-sm border", p.stock < 10 ? "border-red-100 bg-red-50 text-red-500" : "border-primary-50 bg-secondary-400 text-primary-500")}>
                        {p.stock}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <button onClick={() => startEdit(p)} className="p-2 bg-secondary-400 rounded-sm text-primary-300 hover:text-primary-500">
                        <Pencil className="w-4 h-4" />
                     </button>
                     <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-50 rounded-sm text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               </div>
               
               <span className={cn(
                 "absolute top-4 right-4 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest",
                 p.status === 'ACTIVE' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
               )}>
                 {p.status}
               </span>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Modern Jesify Style) */}
      <div className="hidden md:block bg-white rounded-sm border border-primary-50 shadow-sm overflow-hidden mx-4 sm:mx-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary-400/50 border-b border-primary-50">
                <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Security ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Product Asset</th>
                <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Market Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Inventory Count</th>
                <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em] text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                       <Package className="w-12 h-12 text-secondary-400 mb-4" />
                       <p className="text-[10px] font-black text-primary-200 uppercase tracking-[0.2em]">Vault record is empty</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="group hover:bg-secondary-50/50 transition-colors">
                    <td className="px-6 py-4">
                       <span className="text-[9px] font-mono text-primary-200 uppercase">#{p.id.slice(-6)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === p.id ? (
                        <div className="space-y-2 max-w-xs">
                          <Input
                            value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            className="h-9 font-bold text-xs rounded-sm"
                            placeholder="Product Name"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-sm bg-white border border-secondary-400 p-1 flex-shrink-0 group-hover:scale-110 transition-transform">
                             <img src={p.imageUrl} alt="" className="h-full w-full object-contain" />
                          </div>
                          <div className="min-w-0">
                             <p className="font-black text-xs text-primary-500 uppercase truncate tracking-tight">{p.name}</p>
                             <p className="text-[9px] font-bold text-primary-200 uppercase tracking-widest">{p.category}</p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === p.id ? (
                        <Input
                          type="number"
                          value={editForm.price}
                          onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
                          className="w-24 h-9 font-bold text-xs"
                        />
                      ) : (
                        <span className="text-xs font-black text-primary-500 tabular-nums">{formatCurrency(p.price)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === p.id ? (
                        <Input
                          type="number"
                          value={editForm.stock}
                          onChange={e => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                          className="w-20 h-9 font-bold text-xs"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                           <div className={cn("h-1.5 w-1.5 rounded-full", p.stock < 10 ? "bg-red-500 animate-pulse" : "bg-green-500")}></div>
                           <span className={cn("text-xs font-black tabular-nums", p.stock < 10 ? "text-red-500" : "text-primary-500")}>{p.stock}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                       <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                        p.status === 'ACTIVE' ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                      )}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === p.id ? (
                          <>
                            <button onClick={saveEdit} className="p-2 bg-green-500 text-white rounded-sm hover:bg-green-600 shadow-sm">
                               <Check className="w-4 h-4" />
                            </button>
                            <button onClick={cancelEdit} className="p-2 bg-secondary-400 text-primary-500 rounded-sm hover:bg-secondary-500">
                               <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(p)}
                              className="p-2 text-primary-200 hover:text-primary-500 hover:bg-secondary-400 rounded-sm transition-all"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-2 text-primary-200 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
