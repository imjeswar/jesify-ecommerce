import React from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { Button } from '../../../shared/components/Button';
import { Users, Mail, Shield, ShieldAlert, ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

export const AdminUsers: React.FC = () => {
  const { getAllUsers, toggleUserBlock } = useAuth();
  const users = getAllUsers().filter(u => u.role === 'user');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4 sm:px-0">
        <div className="flex items-center gap-4">
           <div className="h-10 w-10 bg-primary-500 rounded-sm flex items-center justify-center text-secondary-500 shadow-lg">
              <Users className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-2xl font-black text-primary-500 uppercase tracking-tighter italic">User Registry</h1>
              <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest mt-0.5">Platform Population Audit</p>
           </div>
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden grid grid-cols-1 gap-4 px-4">
        {users.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-sm border border-primary-50">
             <AlertCircle className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
             <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest">No users currently registered</p>
          </div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="bg-white rounded-sm border border-primary-50 shadow-sm p-5 space-y-4 relative">
               <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-12 w-12 bg-secondary-400 rounded-sm flex items-center justify-center text-primary-300 font-black text-xl">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                       <h3 className="text-sm font-black text-primary-500 uppercase tracking-tight truncate">{u.name}</h3>
                       <div className="flex items-center gap-2 mt-0.5">
                          <Mail className="w-2.5 h-2.5 text-primary-200" />
                          <p className="text-[10px] font-bold text-primary-200 truncate">{u.email}</p>
                       </div>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border",
                    u.status === 'ACTIVE' ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                  )}>
                    {u.status}
                  </span>
               </div>
               
               <div className="flex items-center justify-between pt-4 border-t border-primary-50">
                  <div className="flex items-center gap-3">
                     <span className="text-[8px] font-black font-mono text-primary-200 uppercase tracking-widest bg-secondary-400 px-2 py-1 rounded-sm">ID: {u.id.slice(-8).toUpperCase()}</span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className={cn(
                      "rounded-sm uppercase tracking-widest font-black text-[9px] py-3 px-6 h-auto transition-all",
                      u.status === 'ACTIVE' ? "text-red-500 border-red-100 hover:bg-red-50" : "text-green-600 border-green-100 hover:bg-green-50"
                    )}
                    onClick={() => toggleUserBlock(u.id)}
                  >
                     {u.status === 'ACTIVE' ? <ShieldAlert className="w-3 h-3 mr-2" /> : <ShieldCheck className="w-3 h-3 mr-2" />}
                     {u.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
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
              <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">User Profile</th>
              <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Access Role</th>
              <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em]">Network Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-primary-300 uppercase tracking-[0.2em] text-right">Admin Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50">
            {users.map((u) => (
              <tr key={u.id} className="group hover:bg-secondary-50/50 transition-colors">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-secondary-400 rounded-sm flex items-center justify-center text-primary-300 font-black text-lg group-hover:bg-primary-500 group-hover:text-secondary-500 transition-all">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-black text-primary-500 uppercase tracking-tight">{u.name}</div>
                        <div className="text-[9px] font-bold text-primary-200 mt-0.5 lowercase tracking-wider">{u.email}</div>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                       <Shield className="w-3.5 h-3.5 text-primary-200" />
                       <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest">{u.role}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={cn(
                    "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5",
                    u.status === 'ACTIVE' ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                  )}>
                     <div className={cn("w-1.5 h-1.5 rounded-full", u.status === 'ACTIVE' ? "bg-green-500" : "bg-red-500")} />
                     {u.status}
                   </span>
                </td>
                <td className="px-6 py-5 text-right">
                   <Button 
                    size="sm" 
                    variant="outline" 
                    className={cn(
                        "rounded-sm uppercase tracking-widest font-black text-[9px] h-8 transition-all px-4 shadow-sm",
                        u.status === 'ACTIVE' ? "text-red-500 border-red-100 hover:bg-red-500 hover:text-white" : "text-green-600 border-green-100 hover:bg-green-500 hover:text-white"
                      )}
                    onClick={() => toggleUserBlock(u.id)}
                  >
                    {u.status === 'ACTIVE' ? 'Suspend User' : 'Grant Access'}
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
