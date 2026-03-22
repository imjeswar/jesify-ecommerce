import type { Product } from '../types/product.types';
import type { SellerProfile } from '../types/seller.types';
import type { User } from '../types/user.types';

export const seedData = () => {
  console.log('Seeding initial data...');

  // Detect logged-in seller to assign products to them
  const loggedInUserStr = localStorage.getItem('jesify_user');
  const loggedInUser = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;
  
  const targetSellerId = loggedInUser?.role === 'seller' ? loggedInUser.id : 'jeswar-seller-user-1';
  const targetSellerName = loggedInUser?.role === 'seller' ? loggedInUser.name : (loggedInUser?.name || 'Jeswar Maniarasu');

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

  // 3. Define Products (70 items)
  const products: Product[] = [
    // --- 1. MOBILES (10) ---
    { id: 'mob-1', name: 'iPhone 15 Pro Max', description: 'Experience the power of titanium. A-17 Pro chip, Ceramic Shield.', price: 159900, stock: 12, category: 'Mobiles', imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800' },
    { id: 'mob-2', name: 'Samsung Galaxy S24 Ultra', description: 'The power of AI in your hand. Snapdragon 8 Gen 3, Titanium Gray.', price: 129999, stock: 8, category: 'Mobiles', imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800' },
    { id: 'mob-3', name: 'Google Pixel 8 Pro', description: 'The most advanced Pixel yet. Tensor G3 for powerful performance.', price: 106999, stock: 15, category: 'Mobiles', imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800' },
    { id: 'mob-4', name: 'OnePlus 12', description: 'Smooth Beyond Belief. Snapdragon 8 Gen 3, 50MP Camera.', price: 64999, stock: 20, category: 'Mobiles', imageUrl: 'https://images.unsplash.com/photo-1678911820864-e2c567cf6550?auto=format&fit=crop&q=80&w=800' },
    { id: 'mob-5', name: 'Xiaomi 13 Pro', description: 'Co-engineered with Leica. Professional-grade imaging.', price: 79999, stock: 10, category: 'Mobiles', imageUrl: 'https://images.unsplash.com/photo-1678911820864-e2c567cf6550?auto=format&fit=crop&q=80&w=800' },
    { id: 'mob-6', name: 'Motorola Razr 40 Ultra', description: 'The iconic flip returns. Large external display.', price: 89999, stock: 5, category: 'Mobiles', imageUrl: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&q=80&w=800' },
    { id: 'mob-7', name: 'Nothing Phone (2)', description: 'Iconic Glyph interface. Unique design, powerful software.', price: 44999, stock: 25, category: 'Mobiles', imageUrl: 'https://images.unsplash.com/photo-1691136137682-93889025e796?auto=format&fit=crop&q=80&w=800' },
    { id: 'mob-8', name: 'Vivio X100 Pro', description: 'Zeiss optics everywhere. Master the camera.', price: 89999, stock: 7, category: 'Mobiles', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800' },
    { id: 'mob-9', name: 'Realme GT 5', description: 'Fast charging champion. 240W blazing power.', price: 35999, stock: 30, category: 'Mobiles', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800' },
    { id: 'mob-10', name: 'iQOO 12', description: 'Fast as logic. The gaming powerhouse.', price: 52999, stock: 12, category: 'Mobiles', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800' },

    // --- 2. ELECTRONICS (10) ---
    { id: 'elec-1', name: 'Sony WH-1000XM5', description: 'Premium Noise Cancelling Headphones. The best-in-class.', price: 29990, stock: 20, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800' },
    { id: 'elec-2', name: 'Apple iPad Pro M2', description: 'The ultimate iPad experience. Liquid Retina XDR.', price: 81900, stock: 15, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800' },
    { id: 'elec-3', name: 'Nikon Z8 Mirrorless', description: 'Professional full-frame mirrorless camera. High resolution.', price: 349995, stock: 5, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800' },
    { id: 'elec-4', name: 'ASUS ROG Zephyrus G14', description: 'The worlds most powerful 14" gaming laptop.', price: 149990, stock: 10, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785bc67c7b?auto=format&fit=crop&q=80&w=800' },
    { id: 'elec-5', name: 'Bose QuietComfort Earbuds II', description: 'World\'s best noise cancellation. Custom tuned to you.', price: 25990, stock: 40, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800' },
    { id: 'elec-6', name: 'Samsung Galaxy Watch 6', description: 'Advanced Health Monitoring. Sleek and smart.', price: 29999, stock: 25, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
    { id: 'elec-7', name: 'DJI Mini 3 Pro', description: 'Fly Mini, Create Big. 4K HDR Video.', price: 74990, stock: 12, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800' },
    { id: 'elec-8', name: 'Logitech G Pro X Superlight', description: 'The world\'s lightest wireless gaming mouse.', price: 13999, stock: 50, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800' },
    { id: 'elec-9', name: 'Western Digital 2TB SSD', description: 'High-speed storage. Fast and reliable portable SSD.', price: 14999, stock: 100, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65dffc0e3b?auto=format&fit=crop&q=80&w=800' },
    { id: 'elec-10', name: 'GoPro HERO12 Black', description: 'Professional action camera. HyperSmooth 6.0.', price: 39990, stock: 30, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=800' },

    // --- 3. TVs & APPLIANCES (10) ---
    { id: 'tv-1', name: 'LG 55" OLED C3 4K TV', description: 'Infinite contrast, perfect pixels. A cinema at home.', price: 144990, stock: 10, category: 'TVs & Appliances', imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800' },
    { id: 'tv-2', name: 'Samsung 85" QN900C 8K', description: 'The pinnacle of Neo QLED. Extraordinary detail.', price: 699990, stock: 3, category: 'TVs & Appliances', imageUrl: 'https://images.unsplash.com/photo-1558882224-cca16273e197?auto=format&fit=crop&q=80&w=800' },
    { id: 'tv-3', name: 'Sony BRAVIA XR 65"', description: 'World\'s first cognitive intelligence TV.', price: 219990, stock: 8, category: 'TVs & Appliances', imageUrl: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?auto=format&fit=crop&q=80&w=800' },
    { id: 'tv-4', name: 'Dyson V15 Detect', description: 'The most powerful laser vacuum. Slim design.', price: 65900, stock: 15, category: 'TVs & Appliances', imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800' },
    { id: 'tv-5', name: 'LG ThinQ Refrigerator', description: 'Side-by-side with Craft Ice Maker.', price: 124990, stock: 5, category: 'TVs & Appliances', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' },
    { id: 'tv-6', name: 'Samsung Front Load AI', description: 'Smart washing machine with Ecobubble technology.', price: 44990, stock: 20, category: 'TVs & Appliances', imageUrl: 'https://images.unsplash.com/photo-1626806819282-2c1dc61a0e0c?auto=format&fit=crop&q=80&w=800' },
    { id: 'tv-7', name: 'Panasonic Microwave 27L', description: 'Inverter technology for even cooking.', price: 15990, stock: 35, category: 'TVs & Appliances', imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800' },
    { id: 'tv-8', name: 'Philips Air Fryer XL', description: 'Healthy fried food with Rapid Air technology.', price: 11995, stock: 50, category: 'TVs & Appliances', imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800' },
    { id: 'tv-9', name: 'Blue Star 1.5 Ton AC', description: 'Inverter split AC with high cooling performance.', price: 38990, stock: 15, category: 'TVs & Appliances', imageUrl: 'https://images.unsplash.com/photo-1563206767-5b18f218e7de?auto=format&fit=crop&q=80&w=800' },
    { id: 'tv-10', name: 'Havells Instanio 3L', description: 'Instant water heater for your kitchen.', price: 3499, stock: 100, category: 'TVs & Appliances', imageUrl: 'https://images.unsplash.com/photo-1585909694668-0a6e03b89d21?auto=format&fit=crop&q=80&w=800' },

    // --- 4. FASHION (10) ---
    { id: 'fas-1', name: 'Levis 501 Original', description: 'The iconic straight fit jean since 1873.', price: 4499, stock: 100, category: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800' },
    { id: 'fas-2', name: 'Nike Air Force 1', description: 'The legend lives on in a sleek, clean look.', price: 7495, stock: 80, category: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800' },
    { id: 'fas-3', name: 'Ray-Ban Wayfarer Classic', description: 'Original design with crystal green lenses.', price: 9290, stock: 40, category: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1511499767390-903390e62bc0?auto=format&fit=crop&q=80&w=800' },
    { id: 'fas-4', name: 'Adidas Originals Hoodie', description: 'Classic Trefoil logo hoodie in black.', price: 3999, stock: 150, category: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800' },
    { id: 'fas-5', name: 'Zara Oversized Shirt', description: 'Linen blend shirt for a relaxed summer feel.', price: 2990, stock: 60, category: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800' },
    { id: 'fas-6', name: 'Puma Velocity Nitro 2', description: 'Running shoes with maximum cushioning.', price: 10999, stock: 30, category: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800' },
    { id: 'fas-7', name: 'Tissot Gentleman Watch', description: 'Swiss-made elegance with sapphire crystal.', price: 35000, stock: 10, category: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1524592091214-8c97af7c4a17?auto=format&fit=crop&q=80&w=800' },
    { id: 'fas-8', name: 'H&M Knit Cardigan', description: 'Soft knit cardigan for evening comfort.', price: 1999, stock: 100, category: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800' },
    { id: 'fas-9', name: 'Jack & Jones Chinos', description: 'Slim fit chinos in olive green.', price: 2499, stock: 85, category: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa804b86862b?auto=format&fit=crop&q=80&w=800' },
    { id: 'fas-10', name: 'Vans Old Skool', description: 'Original skate shoe with the stripe.', price: 4995, stock: 120, category: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800' },

    // --- 5. BEAUTY, TOYS & MORE (10) ---
    { id: 'bt-1', name: 'LEGO Star Wars Millennium Falcon', description: 'The ultimate collector series edition.', price: 69999, stock: 5, category: 'Beauty, Toys & More', imageUrl: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=800' },
    { id: 'bt-2', name: 'Estee Lauder Night Repair', description: 'The number one serum for face.', price: 9200, stock: 50, category: 'Beauty, Toys & More', imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800' },
    { id: 'bt-3', name: 'Barbie Dreamhouse', description: 'Full of furniture and fun features.', price: 19999, stock: 15, category: 'Beauty, Toys & More', imageUrl: 'https://images.unsplash.com/photo-1558229986-7a7f4571de43?auto=format&fit=crop&q=80&w=800' },
    { id: 'bt-4', name: 'Hot Wheels Track Set', description: 'Extreme racing and stunts.', price: 3499, stock: 40, category: 'Beauty, Toys & More', imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=800' },
    { id: 'bt-5', name: 'MAC Prep + Prime', description: 'Lightweight water mist that finishes makeup.', price: 2150, stock: 100, category: 'Beauty, Toys & More', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800' },
    { id: 'bt-6', name: 'Hasbro Jenga Classic', description: 'The original wood block game.', price: 999, stock: 200, category: 'Beauty, Toys & More', imageUrl: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=800' },
    { id: 'bt-7', name: 'Dior Sauvage EDP', description: 'Powerful and noble fragrance.', price: 11500, stock: 30, category: 'Beauty, Toys & More', imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800' },
    { id: 'bt-8', name: 'Monopoly India Eidtion', description: 'Fast-dealing property trading game.', price: 1299, stock: 75, category: 'Beauty, Toys & More', imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=800' },
    { id: 'bt-9', name: 'The Body Shop Tea Tree Oil', description: 'Target skin imperfections directly.', price: 895, stock: 120, category: 'Beauty, Toys & More', imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800' },
    { id: 'bt-10', name: 'Nerf Elite 2.0 Commander', description: 'Customizable blaster with 12 darts.', price: 1499, stock: 60, category: 'Beauty, Toys & More', imageUrl: 'https://images.unsplash.com/photo-1598251261353-8386345ec465?auto=format&fit=crop&q=80&w=800' },

    // --- 6. HOME & FURNITURE (10) ---
    { id: 'home-1', name: 'IKEA Poang Armchair', description: 'Classic design with bentwood frame.', price: 6990, stock: 25, category: 'Home & Furniture', imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800' },
    { id: 'home-2', name: 'Sleepwell King Size Bed', description: 'Engineered wood with storage space.', price: 24900, stock: 10, category: 'Home & Furniture', imageUrl: 'https://images.unsplash.com/photo-1505691722718-46843475962b?auto=format&fit=crop&q=80&w=800' },
    { id: 'home-3', name: 'Tupperware Heritage Set', description: 'Airtight containers for the kitchen.', price: 1499, stock: 200, category: 'Home & Furniture', imageUrl: 'https://images.unsplash.com/photo-1582281227203-7ea7c83d42bc?auto=format&fit=crop&q=80&w=800' },
    { id: 'home-4', name: 'Philips Hue Starter Kit', description: 'Smart lighting for your home.', price: 12999, stock: 45, category: 'Home & Furniture', imageUrl: 'https://images.unsplash.com/photo-1550985543-f47f38aee65e?auto=format&fit=crop&q=80&w=800' },
    { id: 'home-5', name: 'Wakefit Orthopedic Mattress', description: 'Memory foam for great spinal support.', price: 8999, stock: 30, category: 'Home & Furniture', imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800' },
    { id: 'home-6', name: 'Prestige Cookware Set', description: 'Non-stick induction base cookware.', price: 3499, stock: 100, category: 'Home & Furniture', imageUrl: 'https://images.unsplash.com/photo-1584990344321-27682ad0f144?auto=format&fit=crop&q=80&w=800' },
    { id: 'home-7', name: 'Elica Filterless Chimney', description: 'Smart chimney with motion sensor.', price: 15490, stock: 12, category: 'Home & Furniture', imageUrl: 'https://images.unsplash.com/photo-1585144880900-21f0097dfbd3?auto=format&fit=crop&q=80&w=800' },
    { id: 'home-8', name: 'Solimo Geometric Curtains', description: 'Set of 2 room darkening curtains.', price: 999, stock: 300, category: 'Home & Furniture', imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800' },
    { id: 'home-9', name: 'Amazon Brand - Solimo Bed', description: 'Solid Sheesham wood queen size bed.', price: 21999, stock: 15, category: 'Home & Furniture', imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800' },
    { id: 'home-10', name: 'Wonderchef Nutri-blend', description: 'Powerful mixer-grinder-blender.', price: 2999, stock: 150, category: 'Home & Furniture', imageUrl: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&q=80&w=800' },

    // --- 7. GROCERY (10) ---
    { id: 'groc-1', name: 'Fortune Soyabean Oil 5L', description: 'Healthier oil for everyday cooking.', price: 675, stock: 500, category: 'Grocery', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800' },
    { id: 'groc-2', name: 'Daawat Rozana Basmati', description: 'Long-grained rice for perfect biryani.', price: 399, stock: 300, category: 'Grocery', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800' },
    { id: 'groc-3', name: 'Nescafe Classic 200g', description: 'Awaken your senses with every sip.', price: 620, stock: 200, category: 'Grocery', imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800' },
    { id: 'groc-4', name: 'Tata Tea Gold 1kg', description: 'The rich aroma and taste of Assam.', price: 549, stock: 150, category: 'Grocery', imageUrl: 'https://images.unsplash.com/photo-1515696955266-4f67e13219e8?auto=format&fit=crop&q=80&w=800' },
    { id: 'groc-5', name: 'Kelloggs Corn Flakes', description: 'The original breakfast cereal.', price: 199, stock: 250, category: 'Grocery', imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=800' },
    { id: 'groc-6', name: 'Maggi 2-Minute Noodles', description: 'The snack that brings families together.', price: 168, stock: 1000, category: 'Grocery', imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800' },
    { id: 'groc-7', name: 'Aashirvaad Shudh Chaki', description: 'Hand-picked wheat for soft rotis.', price: 215, stock: 400, category: 'Grocery', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
    { id: 'groc-8', name: 'Cadbury Celebrations Box', description: 'The perfect gift for any occasion.', price: 149, stock: 100, category: 'Grocery', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=800' },
    { id: 'groc-9', name: 'Surf Excel Matic Liquid', description: 'Designed for automatic washing machines.', price: 449, stock: 120, category: 'Grocery', imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=800' },
    { id: 'groc-10', name: 'Colgate Strong Teeth', description: 'Protects against cavities and decay.', price: 129, stock: 300, category: 'Grocery', imageUrl: 'https://images.unsplash.com/photo-1559591931-988ad9845554?auto=format&fit=crop&q=80&w=800' },
  ].map(p => ({
    ...p,
    sellerId: targetSellerId,
    sellerName: targetSellerName,
    createdAt: new Date().toISOString(),
    status: 'ACTIVE' as const,
    images: [p.imageUrl],
    rating: 4 + Math.random(),
    reviewCount: Math.floor(Math.random() * 500)
  }));

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
  }

  // Update Local Storage
  // 1. Products
  if (products.length > 0) {
    localStorage.setItem('jesify_products', JSON.stringify(products));
  }

  // 2. Add Seller to Users list if not exists
  const existingUsersStr = localStorage.getItem('jesify_all_users');
  const existingUsers: User[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
  const prunedUsers = existingUsers.filter(u => u.email !== 'seller@techworld.in');
  if (!prunedUsers.some(u => u.id === seedSellerUser.id)) {
    prunedUsers.push(seedSellerUser);
    localStorage.setItem('jesify_all_users', JSON.stringify(prunedUsers));
  }

  // 3. Add Seller to Sellers list if not exists
  const existingSellersStr = localStorage.getItem('jesify_all_sellers');
  const existingSellers: SellerProfile[] = existingSellersStr ? JSON.parse(existingSellersStr) : [];
  if (!existingSellers.some(s => s.id === seedSellerProfile.id)) {
    existingSellers.push(seedSellerProfile);
    localStorage.setItem('jesify_all_sellers', JSON.stringify(existingSellers));
  }

  console.log('Seeding complete!');
};
