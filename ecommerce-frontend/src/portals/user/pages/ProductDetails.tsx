import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck, ShieldCheck, Star, Zap, ThumbsUp } from 'lucide-react';
import { ProductService } from '../../../shared/services/product.service';
import type { Product, Review } from '../../../shared/types/product.types';
import { formatCurrency, placeholderDataUrl } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/Button';
import { useCart } from '../../../shared/context/CartContext';
import { useAuth } from '../../../shared/context/AuthContext';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  useEffect(() => {
    if (id) {
      const found = ProductService.getProductById(id);
      // Guard: block access to blocked products in user portal
      if (found && found.status === 'BLOCKED') {
        setProduct(undefined);
        setLoading(false);
        return;
      }
      setProduct(found);
      if (found) {
        setActiveImage(found.images?.[0] || found.imageUrl);
        setReviews(ProductService.getProductReviews(found.id));

        // Find related products (same category, exclude current)
        const allProducts = ProductService.getActiveProducts();
        const related = allProducts
          .filter(p => p.category === found.category && p.id !== found.id)
          .slice(0, 4); // Limit to 4
        setRelatedProducts(related);
      }
      setLoading(false);
      window.scrollTo(0, 0); // Scroll to top on id change
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.status === 'BLOCKED') return;
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (product.status === 'BLOCKED') return;
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
    navigate('/checkout');
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (reviewRating < 1 || reviewRating > 5) return;
    ProductService.addReview(product.id, user.id, user.name, reviewRating, reviewComment.trim());
    setReviews(ProductService.getProductReviews(product.id));
    const refreshed = ProductService.getProductById(product.id);
    if (refreshed) setProduct(refreshed);
    setReviewComment('');
    setReviewRating(5);
    setShowReviewForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Available</h2>
          <Link to="/" className="text-primary-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-white shadow-sm rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">

          {/* LEFT SECTION: Images & Action Buttons (Flipkart Style: Sticky on Desktop) */}
          <div className="lg:col-span-5 p-4 border-r border-gray-100 flex flex-col">
            <div className="relative flex-1 flex flex-col items-center justify-center p-4 min-h-[400px]">
              <div className="w-full h-96 flex items-center justify-center relative group">
                <img
                  src={activeImage || product.imageUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
                  onError={(e) => { e.currentTarget.src = placeholderDataUrl(600, 400, product.name); }}
                />
                {product.stock < 5 && product.stock > 0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Only {product.stock} left
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                    <span className="bg-gray-800 text-white px-4 py-2 rounded font-bold text-lg">OUT OF STOCK</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6 overflow-x-auto py-2 w-full justify-center">
                {(product.images || [product.imageUrl]).map((img) => (
                  <div
                    key={img}
                    className={`w-16 h-16 border rounded p-1 cursor-pointer ${activeImage === img ? 'border-primary-500' : 'border-gray-200 hover:border-primary-500'}`}
                    onMouseEnter={() => setActiveImage(img)}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain opacity-90 hover:opacity-100" onError={(e) => { e.currentTarget.src = placeholderDataUrl(200, 200, product.name); }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || product.status === 'BLOCKED'}
                className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-4 font-bold text-lg uppercase shadow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5 fill-current" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0 || product.status === 'BLOCKED'}
                className="flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white py-4 font-bold text-lg uppercase shadow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5 fill-current" />
                Buy Now
              </button>
            </div>
          </div>

          {/* RIGHT SECTION: Details */}
          <div className="lg:col-span-7 p-6 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar">
            {/* Breadcrumb & Title */}
            <div className="mb-4">
              <div className="text-gray-400 text-xs mb-2">Home &gt; {product.category} &gt; {product.name}</div>
              <h1 className="text-xl sm:text-2xl font-medium text-gray-900 mb-1">{product.name}</h1>

              {/* Rating Badge */}
              <div className="flex items-center gap-2 mb-2">
                {rating > 0 ? (
                  <span className="bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    {rating} <Star className="w-3 h-3 fill-current" />
                  </span>
                ) : (
                  <span className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded">No Ratings Yet</span>
                )}
                {reviewCount > 0 && (
                  <span className="text-gray-500 text-sm font-medium">{reviewCount} Ratings & {Math.floor(reviewCount / 5)} Reviews</span>
                )}
              </div>
            </div>

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-medium text-gray-900">{formatCurrency(product.price)}</span>
                <span className="text-base text-gray-500 line-through">{formatCurrency(product.price * 1.25)}</span>
                <span className="text-green-600 font-bold text-sm">25% off</span>
              </div>
            </div>

            {/* Delivery & Warranty */}
            <div className="flex gap-16 mb-6">
              <div className="w-24 text-gray-500 font-medium text-sm">Delivery</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="w-4 h-4 text-primary-600" />
                  <span className="text-gray-900 font-medium text-sm">Delivery in 3-5 days</span>
                  <span className="text-gray-400 text-xs">|</span>
                  <span className="text-green-600 text-sm font-bold">Free</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">Order within 2 hrs 30 mins</p>
                <div className="bg-gray-50 border border-gray-200 p-2 rounded inline-block">
                  <span className="text-xs font-medium text-gray-600">Cash on Delivery Available</span>
                </div>
              </div>
            </div>

            <div className="flex gap-16 mb-6">
              <div className="w-24 text-gray-500 font-medium text-sm">Warranty</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 text-sm">1 Year Manufacturer Warranty</span>
                </div>
              </div>
            </div>

            <div className="flex gap-16 mb-8">
              <div className="w-24 text-gray-500 font-medium text-sm">Seller</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary-600 font-medium text-sm">{product.sellerName}</span>
                  <span className="bg-primary-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">4.8 ★</span>
                </div>
                <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                  <li>7 Days Replacement Policy</li>
                  <li>GST invoice available</li>
                </ul>
              </div>
            </div>

            {/* Specifications Table */}
            <div className="border rounded-sm border-gray-200 mb-8">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Specifications</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">General</h3>
                  <div className="grid grid-cols-1 gap-y-2">
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-12">
                        <div className="col-span-4 text-gray-500 text-sm">{key}</div>
                        <div className="col-span-8 text-gray-900 text-sm">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border rounded-sm border-gray-200 mb-8">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Product Description</h2>
              </div>
              <div className="p-4 text-gray-700 text-sm leading-relaxed">
                <p className="mb-4">{product.description}</p>
                <p>This product is made from high-quality materials designed to last. Perfect for your daily needs and crafted with precision. Whether you are using it for work or leisure, it delivers exceptional performance.</p>
              </div>
            </div>

            {/* Ratings & Reviews */}
            <div className="border rounded-sm border-gray-200 mb-8">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Ratings & Reviews</h2>
                <Button variant="outline" size="sm" onClick={() => setShowReviewForm(s => !s)}>
                  {showReviewForm ? 'Cancel' : 'Rate Product'}
                </Button>
              </div>
              <div className="p-6">
                {showReviewForm && (
                  <form onSubmit={submitReview} className="mb-6 bg-gray-50 border border-gray-200 rounded p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          rows={3}
                          placeholder="Share your experience"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button type="submit">Submit Review</Button>
                    </div>
                  </form>
                )}
                <div className="flex items-center gap-8 mb-6">
                  <div className="text-center">
                    {rating > 0 ? (
                      <>
                        <div className="text-3xl font-medium text-gray-900 mb-1 flex items-center justify-center gap-1">
                          {rating} <Star className="w-6 h-6 fill-green-600 text-green-600" />
                        </div>
                        <p className="text-xs text-gray-500">{reviewCount} Ratings &</p>
                        <p className="text-xs text-gray-500">{Math.floor(reviewCount / 5)} Reviews</p>
                      </>
                    ) : (
                      <div className="text-gray-500 text-sm">No ratings yet</div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    {reviews.length > 0 && [5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const width = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-3 font-medium">{star} ★</span>
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${width}%` }}
                            ></div>
                          </div>
                          <span className="w-8 text-gray-400">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="py-4 border-t border-gray-100">
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${review.rating >= 4 ? 'bg-green-600' : review.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                              {review.rating} <Star className="w-3 h-3 fill-current" />
                            </span>
                            <span className="font-medium text-sm text-gray-900">{review.userName}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{review.date}</span>
                            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-600">
                              <ThumbsUp className="w-3 h-3" />
                              <span>Helpful</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic text-center">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white shadow-sm rounded-sm p-4 mt-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.map((relProduct) => (
                <Link key={relProduct.id} to={`/product/${relProduct.id}`} className="group block border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-3">
                    <img
                      src={relProduct.images?.[0] || relProduct.imageUrl}
                      alt={relProduct.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      onError={(e) => { e.currentTarget.src = placeholderDataUrl(400, 400, relProduct.name); }}
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-600">{relProduct.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(relProduct.price)}</span>
                    <span className="text-xs text-gray-500 line-through">{formatCurrency(relProduct.price * 1.2)}</span>
                    <span className="text-xs text-green-600 font-bold">20% off</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
