import type { Product } from '../types/product.types';
import type { SellerProfile } from '../types/seller.types';
import type { User } from '../types/user.types';

export const seedData = () => {
  // Curated product images (Pexels CDN direct links)
  // 3. Create 12 Mock Products (Defined first to be used in migration)
  const products: Product[] = []; // Cleared per user request to start fresh


  // Check if data already exists
  const existingProductsStr = localStorage.getItem('jesify_products');
  let existingProducts = existingProductsStr ? JSON.parse(existingProductsStr) : [];

  // CLEANUP: Remove old mock products (prod-1 to prod-12) if they exist
  const mockIds = ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8', 'prod-9', 'prod-10', 'prod-11', 'prod-12'];

  if (existingProducts.length > 0) {
    const originalCount = existingProducts.length;
    existingProducts = existingProducts.filter((p: Product) => !mockIds.includes(p.id));

    if (existingProducts.length !== originalCount) {
      localStorage.setItem('jesify_products', JSON.stringify(existingProducts));
      console.log('Removed mock products per user request. Remaining custom products:', existingProducts.length);
    }

    // Continue execution to seed seller data if needed, but since products array is empty, no new products will be added in step 1 below.
  }

  console.log('Seeding initial data...');

  // 1. Create a Mock Approved Seller User
  const seedSellerUser: User = {
    id: 'jeswar-seller-user-1',
    name: 'Jeswar Maniarasu',
    email: 'jeswarmaniarasu@gmail.com',
    role: 'seller',
    status: 'ACTIVE'
  };

  // 2. Create Mock Seller Profile
  const seedSellerProfile: SellerProfile = {
    id: 'jeswar-seller-1',
    userId: 'jeswar-seller-user-1',
    storeName: 'Jeswar Maniarasu',
    description: 'Official Jesify vendor account selling curated products.',
    aadhaarNumber: '1234-5678-9012',
    status: 'APPROVED',
    isVerified: true,
    phone: '9876543210',
    address: 'Chennai, Tamil Nadu, India'
  };

  // Update Local Storage
  // 1. Products
  if (products.length > 0) {
    localStorage.setItem('jesify_products', JSON.stringify(products));
  } else if (!localStorage.getItem('jesify_products')) {
    localStorage.setItem('jesify_products', JSON.stringify([]));
  }

  // 2. Add Seller to Users list if not exists
  const existingUsersStr = localStorage.getItem('jesify_all_users');
  const existingUsers: User[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
  // Remove old TechWorld seed user if present
  const prunedUsers = existingUsers.filter(u => u.email !== 'seller@techworld.in');
  if (!prunedUsers.some(u => u.id === seedSellerUser.id)) {
    prunedUsers.push(seedSellerUser);
    localStorage.setItem('jesify_all_users', JSON.stringify(prunedUsers));
  } else {
    localStorage.setItem('jesify_all_users', JSON.stringify(prunedUsers));
  }

  // 3. Add Seller to Sellers list if not exists
  const existingSellersStr = localStorage.getItem('jesify_all_sellers');
  const existingSellers: SellerProfile[] = existingSellersStr ? JSON.parse(existingSellersStr) : [];
  const prunedSellers = existingSellers.filter(s => s.storeName !== 'TechWorld India');
  if (!prunedSellers.some(s => s.id === seedSellerProfile.id)) {
    prunedSellers.push(seedSellerProfile);
    localStorage.setItem('jesify_all_sellers', JSON.stringify(prunedSellers));
  } else {
    localStorage.setItem('jesify_all_sellers', JSON.stringify(prunedSellers));
  }

  console.log('Seeding complete!');
};
