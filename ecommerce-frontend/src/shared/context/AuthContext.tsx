import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole, UserStatus } from '../types/user.types';
import type { SellerProfile, SellerStatus } from '../types/seller.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  adminId: string;
}

interface AuthContextType {
  user: User | null;
  sellerProfile: SellerProfile | null;
  login: (email: string, role: UserRole, name?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  registerSeller: (profile: Omit<SellerProfile, 'id' | 'userId' | 'isVerified' | 'status'>) => void;
  isAuthenticated: boolean;

  // Admin & Data Access
  getAllSellers: () => SellerProfile[];
  getAllUsers: () => User[];
  getAuditLogs: () => AuditLog[];

  // Actions
  updateSellerStatus: (sellerId: string, status: SellerStatus) => void;
  toggleUserBlock: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);

  // Mock Data Store
  const [allSellers, setAllSellers] = useState<SellerProfile[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('jesify_user');
    const storedSeller = localStorage.getItem('jesify_seller');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedSeller) setSellerProfile(JSON.parse(storedSeller));
    
    // Initial fetch for admin
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const usersRes = await fetch(`${API_URL}/api/auth/users`);
      const sellersRes = await fetch(`${API_URL}/api/auth/sellers`);
      
      if (usersRes.ok) setAllUsers(await usersRes.json());
      if (sellersRes.ok) setAllSellers(await sellersRes.json());
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  // Sync user status with global list
  useEffect(() => {
    if (user && allUsers.length > 0) {
      const freshUser = allUsers.find(u => u.id === user.id);
      if (freshUser && freshUser.status !== user.status) {
        const updatedUser = { ...user, status: freshUser.status };
        setUser(updatedUser);
        localStorage.setItem('jesify_user', JSON.stringify(updatedUser));

        if (freshUser.status === 'BLOCKED') {
          // If current user is blocked, force logout or handle UI
          // For now, we update the state so UI can react (e.g. disable checkout)
        }
      }
    }
  }, [allUsers, user]);

  // Persistence Helpers
  const updateAllSellers = useCallback((sellers: SellerProfile[]) => {
    setAllSellers(sellers);
    localStorage.setItem('jesify_all_sellers', JSON.stringify(sellers));
  }, []);

  const updateAllUsers = useCallback((users: User[]) => {
    setAllUsers(users);
    localStorage.setItem('jesify_all_users', JSON.stringify(users));
  }, []);

  const addAuditLog = useCallback((action: string, details: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      details,
      timestamp: new Date().toISOString(),
      adminId: 'admin-id'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    localStorage.setItem('jesify_audit_logs', JSON.stringify(updatedLogs));
  }, [auditLogs]);

  const login = useCallback(async (email: string, role: UserRole, name: string = 'User', password?: string) => {
    // 1. Admin Hardcoded Check (Override for dev/demo)
    if (role === 'admin' && email === 'imjeswar@gmail.com' && password === '0123456') {
      const adminUser: User = {
        id: 'admin-id',
        name: 'Admin',
        email: 'imjeswar@gmail.com',
        role: 'admin',
        status: 'ACTIVE'
      };
      setUser(adminUser);
      localStorage.setItem('jesify_user', JSON.stringify(adminUser));
      fetchAdminData();
      return true;
    }

    // 2. Real Backend Login / Register flow
    try {
      // Try Login First
      let response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'nopassword' })
      });

      // If login fails (user not found), try Register
      if (!response.ok) {
         response = await fetch(`${API_URL}/api/auth/register`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ name, email, password: password || 'nopassword', role })
         });
      }

      if (response.ok) {
        const data = await response.json();
        const userData: User = {
          id: data._id || data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          status: 'ACTIVE'
        };
        setUser(userData);
        localStorage.setItem('jesify_user', JSON.stringify(userData));
        
        if (data.sellerProfile) {
          setSellerProfile(data.sellerProfile);
          localStorage.setItem('jesify_seller', JSON.stringify(data.sellerProfile));
        }
        
        if (userData.role === 'admin') fetchAdminData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Auth error:', err);
      return false;
    }
  }, [allSellers, fetchAdminData]);

  const logout = useCallback(() => {
    setUser(null);
    setSellerProfile(null);
    localStorage.removeItem('jesify_user');
    localStorage.removeItem('jesify_seller');
  }, []);

  const registerSeller = useCallback(async (profileData: Omit<SellerProfile, 'id' | 'userId' | 'isVerified' | 'status'>) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/api/auth/seller-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...profileData
        })
      });

      if (response.ok) {
        const newProfile = await response.json();
        setSellerProfile(newProfile);
        localStorage.setItem('jesify_seller', JSON.stringify(newProfile));

        // Update local user role
        const updatedUser = { ...user, role: 'seller' as UserRole };
        setUser(updatedUser);
        localStorage.setItem('jesify_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Seller registration error:', err);
    }
  }, [user]);

  const updateSellerStatus = useCallback(async (sellerId: string, status: SellerStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/sellers/${sellerId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        const updatedSeller = await response.json();
        setAllSellers(allSellers.map(s => s.id === sellerId ? updatedSeller : s));
        
        if (sellerProfile && sellerProfile.id === sellerId) {
          setSellerProfile(updatedSeller);
          localStorage.setItem('jesify_seller', JSON.stringify(updatedSeller));
        }

        addAuditLog(
          status === 'APPROVED' ? 'APPROVE_SELLER' : status === 'BLOCKED' ? 'BLOCK_SELLER' : 'UPDATE_SELLER',
          `Seller status changed to ${status}`
        );
      }
    } catch (err) {
      console.error('Failed to update seller status:', err);
    }
  }, [allSellers, sellerProfile, addAuditLog]);

  const toggleUserBlock = useCallback((userId: string) => {
    // This would also be an API call in a full system
    // For now keeping local toggle but sync could be added
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return;

    const newStatus: UserStatus = targetUser.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const updatedUsers = allUsers.map(u =>
      u.id === userId ? { ...u, status: newStatus } : u
    );
    setAllUsers(updatedUsers);

    addAuditLog(
      newStatus === 'BLOCKED' ? 'BLOCK_USER' : 'UNBLOCK_USER',
      `User ${targetUser.name} was ${newStatus}`
    );
  }, [allUsers, addAuditLog]);

  const getAllSellers = useCallback(() => allSellers, [allSellers]);
  const getAllUsers = useCallback(() => allUsers, [allUsers]);
  const getAuditLogs = useCallback(() => auditLogs, [auditLogs]);

  const value = React.useMemo(() => ({
    user,
    sellerProfile,
    login,
    logout,
    registerSeller,
    isAuthenticated: !!user,
    getAllSellers,
    getAllUsers,
    getAuditLogs,
    updateSellerStatus,
    toggleUserBlock
  }), [
    user,
    sellerProfile,
    login,
    logout,
    registerSeller,
    getAllSellers,
    getAllUsers,
    getAuditLogs,
    updateSellerStatus,
    toggleUserBlock
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
