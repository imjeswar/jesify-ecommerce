export type SellerStatus = 'PENDING' | 'APPROVED' | 'BLOCKED';

export interface SellerProfile {
  id: string; // Linked to User ID
  userId: string;
  storeName: string;
  description: string;
  aadhaarNumber: string;
  panNumber?: string;
  isVerified: boolean; // Deprecated, use status
  status: SellerStatus;
  phone: string;
  address: string;
}
