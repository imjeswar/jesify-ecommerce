import type { Product, Review } from '../types/product.types';

const PRODUCTS_KEY = 'jesify_products';
const REVIEWS_KEY = 'jesify_reviews';

export const ProductService = {
  getAllProducts: (): Product[] => {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getActiveProducts: (): Product[] => {
    const all = ProductService.getAllProducts();
    return all.filter(p => p.status !== 'BLOCKED');
  },

  getProductsBySeller: (sellerId: string): Product[] => {
    const all = ProductService.getAllProducts();
    return all.filter(p => p.sellerId === sellerId);
  },

  getProductById: (id: string): Product | undefined => {
    const all = ProductService.getAllProducts();
    const product = all.find(p => p.id === id);
    if (product) {
      // Ensure images array is populated from imageUrl if missing
      if ((!product.images || product.images.length === 0) && product.imageUrl) {
        product.images = [product.imageUrl];
      } else if (!product.images) {
        product.images = [];
      }
      // Mock specifications if missing
      if (!product.specifications) {
        product.specifications = {
          'Brand': 'Jesify Basics',
          'Model Number': `JSFY-${product.id.substring(0, 6).toUpperCase()}`,
          'Color': 'Multicolor',
          'Material': 'Premium Quality',
          'Warranty': '1 Year Manufacturer Warranty',
          'Origin': 'India'
        };
      }
      // Mock ratings if missing
      if (!product.rating) {
        product.rating = 0;
        product.reviewCount = 0;
      }
    }
    return product;
  },

  getProductReviews: (productId: string): Review[] => {
    const stored = localStorage.getItem(REVIEWS_KEY);
    const all: Review[] = stored ? JSON.parse(stored) : [];
    return all.filter(r => r.productId === productId);
  },

  addReview: (productId: string, userId: string, userName: string, rating: number, comment: string): Review => {
    const stored = localStorage.getItem(REVIEWS_KEY);
    const all: Review[] = stored ? JSON.parse(stored) : [];
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      userId,
      userName,
      rating,
      comment,
      date: new Date().toISOString()
    };
    const updatedReviews = [newReview, ...all];
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));
    const allProducts = ProductService.getAllProducts();
    const reviewsForProduct = updatedReviews.filter(r => r.productId === productId);
    const avg = reviewsForProduct.length > 0 ? Math.round((reviewsForProduct.reduce((sum, r) => sum + r.rating, 0) / reviewsForProduct.length) * 10) / 10 : 0;
    const updatedProducts = allProducts.map(p =>
      p.id === productId ? { ...p, rating: avg, reviewCount: reviewsForProduct.length } : p
    );
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
    return newReview;
  },

  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'status'>): Product => {
    const all = ProductService.getAllProducts();
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      images: product.imageUrl ? [product.imageUrl] : [],
      specifications: {
        'Brand': 'Jesify Basics',
        'Model Number': `JSFY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        'Type': product.category,
        'Origin': 'India'
      },
      rating: 0,
      reviewCount: 0
    };

    // Debug Log
    console.log('Adding product:', newProduct);

    all.unshift(newProduct);
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(all));
      console.log('Product saved to localStorage. Total products:', all.length);
    } catch (e) {
      console.error('Failed to save product to localStorage:', e);
    }
    return newProduct;
  },

  toggleProductStatus: (productId: string) => {
    const all = ProductService.getAllProducts();
    const updated = all.map(p =>
      p.id === productId ? { ...p, status: (p.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE') as 'ACTIVE' | 'BLOCKED' } : p
    );
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  },

  deleteProduct: (productId: string) => {
    const all = ProductService.getAllProducts();
    const updated = all.filter(p => p.id !== productId);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  },

  updateProduct: (productId: string, updates: Partial<Product>) => {
    const all = ProductService.getAllProducts();
    const updated = all.map(p =>
      p.id === productId ? { ...p, ...updates } : p
    );
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  }
};
