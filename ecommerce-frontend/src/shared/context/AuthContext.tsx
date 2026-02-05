import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole, UserStatus } from '../types/user.types';
import type { SellerProfile, SellerStatus } from '../types/seller.types';

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
  login: (email: string, role: UserRole, name?: string, password?: string) => boolean;
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
    const storedAllSellers = localStorage.getItem('jesify_all_sellers');
    const storedAllUsers = localStorage.getItem('jesify_all_users');
    const storedLogs = localStorage.getItem('jesify_audit_logs');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedSeller) setSellerProfile(JSON.parse(storedSeller));
    if (storedAllSellers) setAllSellers(JSON.parse(storedAllSellers));
    if (storedAllUsers) setAllUsers(JSON.parse(storedAllUsers));
    if (storedLogs) setAuditLogs(JSON.parse(storedLogs));
  }, []);

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

  const login = useCallback((email: string, role: UserRole, name: string = 'User', password?: string) => {
    // 1. Admin Hardcoded Check
    if (role === 'admin') {
      if (email === 'imjeswar@gmail.com' && password === '0123456') {
        const adminUser: User = {
          id: 'admin-id',
          name: 'Admin',
          email: 'imjeswar@gmail.com',
          role: 'admin',
          status: 'ACTIVE'
        };
        setUser(adminUser);
        localStorage.setItem('jesify_user', JSON.stringify(adminUser));
        return true;
      }
      return false;
    }

    // 2. Check existing users
    const existingUser = allUsers.find(u => u.email === email);

    if (existingUser) {
      if (existingUser.status === 'BLOCKED') {
        alert("Your account has been BLOCKED by Admin.");
        return false;
      }
      // Login existing
      setUser(existingUser);
      localStorage.setItem('jesify_user', JSON.stringify(existingUser));

      // Load associated seller profile if exists
      if (existingUser.role === 'seller') {
        const associatedSeller = allSellers.find(s => s.userId === existingUser.id);
        if (associatedSeller) {
          setSellerProfile(associatedSeller);
          localStorage.setItem('jesify_seller', JSON.stringify(associatedSeller));
        }
      }
      return true;
    }

    // 3. Create New User
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      status: 'ACTIVE'
    };

    setUser(newUser);
    localStorage.setItem('jesify_user', JSON.stringify(newUser));

    // Add to global user list
    updateAllUsers([...allUsers, newUser]);

    return true;
  }, [allUsers, allSellers, updateAllUsers]);

  const logout = useCallback(() => {
    setUser(null);
    setSellerProfile(null);
    localStorage.removeItem('jesify_user');
    localStorage.removeItem('jesify_seller');
  }, []);

  const registerSeller = useCallback((profileData: Omit<SellerProfile, 'id' | 'userId' | 'isVerified' | 'status'>) => {
    if (!user) return;
    const newProfile: SellerProfile = {
      ...profileData,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      isVerified: false,
      status: 'PENDING',
    };
    setSellerProfile(newProfile);
    localStorage.setItem('jesify_seller', JSON.stringify(newProfile));

    // Add to all sellers list
    updateAllSellers([...allSellers, newProfile]);

    // Update user role to seller
    const updatedUser = { ...user, role: 'seller' as UserRole };
    setUser(updatedUser);
    localStorage.setItem('jesify_user', JSON.stringify(updatedUser));

    // Update global user list
    const updatedUsers = allUsers.map(u => u.id === user.id ? updatedUser : u);
    updateAllUsers(updatedUsers);
  }, [user, allSellers, allUsers, updateAllSellers, updateAllUsers]);

  const updateSellerStatus = useCallback((sellerId: string, status: SellerStatus) => {
    const seller = allSellers.find(s => s.id === sellerId);
    if (!seller) return;

    const updatedSellers = allSellers.map(s =>
      s.id === sellerId ? { ...s, status, isVerified: status === 'APPROVED' } : s
    );
    updateAllSellers(updatedSellers);

    // If it's the current user's seller profile
    if (sellerProfile && sellerProfile.id === sellerId) {
      const updatedProfile = { ...sellerProfile, status, isVerified: status === 'APPROVED' };
      setSellerProfile(updatedProfile);
      localStorage.setItem('jesify_seller', JSON.stringify(updatedProfile));
    }

    addAuditLog(
      status === 'APPROVED' ? 'APPROVE_SELLER' : status === 'BLOCKED' ? 'BLOCK_SELLER' : 'UPDATE_SELLER',
      `Seller ${seller.storeName} status changed to ${status}`
    );
  }, [allSellers, sellerProfile, updateAllSellers, addAuditLog]);

  const toggleUserBlock = useCallback((userId: string) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return;

    const newStatus: UserStatus = targetUser.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const updatedUsers = allUsers.map(u =>
      u.id === userId ? { ...u, status: newStatus } : u
    );
    updateAllUsers(updatedUsers);

    addAuditLog(
      newStatus === 'BLOCKED' ? 'BLOCK_USER' : 'UNBLOCK_USER',
      `User ${targetUser.name} (${targetUser.email}) was ${newStatus}`
    );
  }, [allUsers, updateAllUsers, addAuditLog]);

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
