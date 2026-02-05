import React from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { Button } from '../../../shared/components/Button';

export const AdminSellers: React.FC = () => {
  const { getAllSellers, updateSellerStatus } = useAuth();
  const sellers = getAllSellers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Seller Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Store Details</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sellers.map((seller) => (
              <tr key={seller.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{seller.storeName}</div>
                    <div className="text-sm text-gray-500">{seller.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{seller.phone}</div>
                  <div className="text-xs text-gray-500">Aadhaar: {seller.aadhaarNumber}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    seller.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    seller.status === 'BLOCKED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {seller.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  {seller.status === 'PENDING' && (
                    <Button size="sm" onClick={() => updateSellerStatus(seller.id, 'APPROVED')}>
                      Approve
                    </Button>
                  )}
                  {seller.status === 'APPROVED' && (
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateSellerStatus(seller.id, 'BLOCKED')}>
                      Block
                    </Button>
                  )}
                  {seller.status === 'BLOCKED' && (
                    <Button size="sm" variant="outline" onClick={() => updateSellerStatus(seller.id, 'APPROVED')}>
                      Unblock
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {sellers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No sellers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
