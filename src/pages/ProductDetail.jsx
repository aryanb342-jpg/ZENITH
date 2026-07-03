import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, toggleWishlist, addReview, selectCurrentCurrency, formatPrice } from '../store/slices/watchSlice';
import ProductCard from '../components/ProductCard';
import { Star, Shield, RefreshCw, Truck, Heart, ShoppingBag, Plus, Minus, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ProductDetail({ params, onPageChange }) {
  const dispatch = useDispatch();
  const products = useSelector(state => state.watch.products);
  const wishlist = useSelector(state => state.watch.wishlist);
  const currentUser = useSelector(state => state.watch.currentUser);
  const currentCurrency = useSelector(selectCurrentCurrency);

  const productId = params?.id;
  const product = products.find(p => p.id === productId);

  // States
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // specs | details
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  if (!product) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-400">Luxury timepiece not found.</p>
        <button
          onClick={() => onPageChange('shop')}
          className="px-6 py-2.5 bg-luxury-gold text-luxury-dark text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold-dark transition"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  // Calculate average rating
  const approvedReviews = product.reviews?.filter(r => r.status === 'approved') || [];
  const averageRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : null;

  const handleAddToCart = () => {
    const result = dispatch(addToCart(product.id, qty));
    if (result.success) {
      alert(`${qty} x ${product.name} added to cart!`);
    } else {
      alert(result.message);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in first to write a review.');
      onPageChange('login');
      return;
    }

    if (!commentInput.trim()) {
      alert('Please enter a review comment.');
      return;
    }

    const res = dispatch(addReview(product.id, ratingInput, commentInput));
    if (res.success) {
      setReviewMessage(res.message);
      setCommentInput('');
      setRatingInput(5);
      setTimeout(() => setReviewMessage(''), 6000);
    } else {
      alert(res.message);
    }
  };

  // Find related products (exclude current)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);
  
  // If not enough related products, fill with others
  if (relatedProducts.length < 3) {
    const fillProducts = products.filter(p => p.id !== product.id && !relatedProducts.some(rp => rp.id === p.id)).slice(0, 3 - relatedProducts.length);
    relatedProducts.push(...fillProducts);
  }

  return (
    <div className="space-y-16 pb-12">
      
      {/* Back Button */}
      <button
        onClick={() => onPageChange('shop')}
        className="flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-luxury-gold transition cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>BACK TO CATALOGUE</span>
      </button>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-luxury-gray border border-white/5 rounded-md aspect-square flex items-center justify-center p-0 overflow-hidden relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                <span className="text-luxury-red font-bold text-sm tracking-widest uppercase border border-luxury-red px-4 py-2">
                  Sold Out
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-luxury-gold-dark text-xs font-bold tracking-widest uppercase">{product.category} COLLECTION</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-luxury-text uppercase tracking-wider">{product.name}</h1>
            
            {/* Review Badge */}
            <div className="flex items-center space-x-2">
              <div className="flex text-luxury-gold-dark">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < Math.floor(Number(averageRating || 0)) ? "var(--color-luxury-gold-dark)" : "none"} 
                    className="stroke-1"
                  />
                ))}
              </div>
              <span className="text-xs text-luxury-muted">
                {averageRating ? `${averageRating} / 5.0 (${approvedReviews.length} reviews)` : 'No approved reviews yet'}
              </span>
            </div>
          </div>

          <p className="text-2xl font-bold text-luxury-text">{formatPrice(product.price, currentCurrency)}</p>
          
          <p className="text-luxury-muted text-xs sm:text-sm leading-relaxed font-light">{product.description}</p>

          <div className="border-t border-b border-luxury-text/10 py-6 space-y-4">
            {/* Quantity Selector & Stock Indicator */}
            {product.stock > 0 ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-luxury-muted font-bold uppercase tracking-widest">Select Quantity</span>
                  <div className="flex items-center border border-luxury-text/10 rounded bg-white">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-2 text-luxury-muted hover:text-luxury-text cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-6 text-sm font-semibold text-luxury-text">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="p-2 text-luxury-muted hover:text-luxury-text cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-emerald-600 font-medium flex items-center space-x-1.5 justify-end">
                    <CheckCircle2 size={12} />
                    <span>In Stock (Only {product.stock} left)</span>
                  </span>
                  <p className="text-[10px] text-luxury-muted/70 mt-0.5">Complementary Express Shipping & Returns</p>
                </div>
              </div>
            ) : (
              <span className="text-xs text-luxury-red font-semibold uppercase tracking-wider block">Currently Out of Stock</span>
            )}

            {/* Actions (Add to Cart / Wishlist) */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {product.stock > 0 && (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-luxury-red hover:bg-red-700 text-white text-xs font-bold tracking-widest uppercase transition duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-luxury-red/10"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Shopping Bag</span>
                </button>
              )}
              
              <button
                onClick={() => dispatch(toggleWishlist(product.id))}
                className={`py-4 px-6 border text-xs font-bold tracking-widest uppercase transition duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                  isWishlisted 
                    ? 'border-luxury-gold-dark bg-luxury-gold-dark text-white'
                    : 'border-luxury-text/10 hover:border-luxury-text text-luxury-text bg-white'
                }`}
              >
                <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 border border-luxury-text/5 rounded shadow-sm">
            <div className="flex flex-col items-center text-center p-2 space-y-1">
              <Truck size={18} className="text-luxury-gold-dark" />
              <span className="text-[9px] font-bold text-luxury-text tracking-widest uppercase">FREE SHIPPING</span>
              <p className="text-[9px] text-luxury-muted">2-4 Business Days Express</p>
            </div>
            <div className="flex flex-col items-center text-center p-2 space-y-1 border-t sm:border-t-0 sm:border-l sm:border-r border-luxury-text/10">
              <RefreshCw size={18} className="text-luxury-gold-dark" />
              <span className="text-[9px] font-bold text-luxury-text tracking-widest uppercase">EASY RETURNS</span>
              <p className="text-[9px] text-luxury-muted">14-day free return policy</p>
            </div>
            <div className="flex flex-col items-center text-center p-2 space-y-1">
              <Shield size={18} className="text-luxury-gold-dark" />
              <span className="text-[9px] font-bold text-luxury-text tracking-widest uppercase">WARRANTY</span>
              <p className="text-[9px] text-luxury-muted">3-Year Swiss warranty</p>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Menu: Specifications & Details */}
      <section className="space-y-6">
        <div className="flex border-b border-luxury-text/10">
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-6 text-xs font-bold tracking-widest uppercase border-b-2 cursor-pointer transition ${
              activeTab === 'specs' 
                ? 'border-luxury-gold-dark text-luxury-gold-dark' 
                : 'border-transparent text-luxury-muted hover:text-luxury-text'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-6 text-xs font-bold tracking-widest uppercase border-b-2 cursor-pointer transition ${
              activeTab === 'details' 
                ? 'border-luxury-gold-dark text-luxury-gold-dark' 
                : 'border-transparent text-luxury-muted hover:text-luxury-text'
            }`}
          >
            Craftsmanship
          </button>
        </div>

        {/* Tab Content: Specs */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-xs bg-white border border-luxury-text/10 rounded p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between py-2 border-b border-luxury-text/10">
              <span className="text-luxury-muted tracking-wider">MOVEMENT TYPE</span>
              <span className="text-luxury-text font-semibold uppercase">{product.specs.movement}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-luxury-text/10">
              <span className="text-luxury-muted tracking-wider">CASE DIMENSIONS</span>
              <span className="text-luxury-text font-semibold uppercase">{product.specs.case}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-luxury-text/10">
              <span className="text-luxury-muted tracking-wider">STRAP MATERIAL</span>
              <span className="text-luxury-text font-semibold uppercase">{product.specs.strap}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-luxury-text/10">
              <span className="text-luxury-muted tracking-wider">WATER RESISTANCE</span>
              <span className="text-luxury-text font-semibold uppercase">{product.specs.waterResistance}</span>
            </div>
            <div className="flex justify-between py-2 md:border-b-0 border-b border-luxury-text/10">
              <span className="text-luxury-muted tracking-wider">DIAL GLASS TYPE</span>
              <span className="text-luxury-text font-semibold uppercase">{product.specs.glass}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-luxury-muted tracking-wider">ORIGIN</span>
              <span className="text-luxury-text font-semibold uppercase">Swiss Made (Le Locle)</span>
            </div>
          </div>
        )}

        {/* Tab Content: Details */}
        {activeTab === 'details' && (
          <div className="space-y-4 text-xs sm:text-sm text-luxury-text font-light leading-relaxed max-w-4xl bg-white border border-luxury-text/10 rounded p-6 sm:p-8 shadow-sm">
            <h4 className="text-luxury-text font-bold tracking-wider uppercase text-xs">The Khroniq Spirit of Innovation</h4>
            <p className="text-luxury-muted">
              Each Khroniq watch is crafted with painstaking precision in our historic manufacture in Le Locle. By integrating dial production, case tooling, movement machining, and fine-tuning calibration under a single Swiss roof, Khroniq ensures every component complies with strict COSC chronometer specifications.
            </p>
            <p className="text-luxury-muted">
              The double anti-reflective sapphire dial glass ensures absolute clarity, shielding the watch indexes from solar glare and scratches. Fitted with premium gaskets, the case delivers advanced seals for water safety, maintaining structural integrity across varying atmospheres.
            </p>
          </div>
        )}
      </section>

      {/* Reviews Tab & Add Review form */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: View Reviews */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-lg font-bold font-serif uppercase tracking-widest text-luxury-text">Client Reviews</h3>
          
          {approvedReviews.length === 0 ? (
            <p className="text-luxury-muted text-xs italic">No reviews found for this timepiece yet.</p>
          ) : (
            <div className="space-y-4">
              {approvedReviews.map((rev) => (
                <div key={rev.id} className="bg-white border border-luxury-text/10 p-5 rounded shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-luxury-text text-xs font-semibold">{rev.userName}</p>
                      {/* Star icons */}
                      <div className="flex text-luxury-gold-dark">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            fill={i < rev.rating ? "var(--color-luxury-gold-dark)" : "none"} 
                            className="stroke-1"
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-luxury-muted font-medium">{rev.date}</span>
                  </div>
                  <p className="text-luxury-muted text-xs mt-3 leading-relaxed font-light">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Write Review Form */}
        <div className="lg:col-span-5 bg-white border border-luxury-text/10 p-6 rounded-md space-y-4 h-fit shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-luxury-text">Write a Review</h3>
          
          {reviewMessage && (
            <div className="p-3 bg-luxury-gold-dark/10 border border-luxury-gold-dark/30 rounded text-luxury-gold-dark text-xs font-medium">
              {reviewMessage}
            </div>
          )}

          {currentUser ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Rating selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-luxury-muted font-bold uppercase tracking-widest block">Rating Score</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      className="text-luxury-gold-dark focus:outline-none hover:scale-115 transition cursor-pointer"
                    >
                      <Star 
                        size={20} 
                        fill={star <= ratingInput ? "var(--color-luxury-gold-dark)" : "none"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-luxury-muted font-bold uppercase tracking-widest block">Review Details</label>
                <textarea
                  rows="4"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Share your experience wearing this luxury timepiece..."
                  className="w-full bg-luxury-bg border border-luxury-text/10 rounded text-luxury-text text-xs p-3 focus:outline-none focus:border-luxury-gold-dark"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-luxury-gold-dark text-white font-bold text-xs tracking-widest uppercase hover:bg-luxury-gold transition cursor-pointer shadow-sm"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <p className="text-luxury-muted text-xs">Please log in to submit a rating and review for this timepiece.</p>
              <button
                onClick={() => onPageChange('login', { redirect: `product-detail:${product.id}` })}
                className="px-4 py-2 bg-transparent border border-luxury-text/20 text-luxury-text font-semibold text-xs tracking-widest uppercase hover:border-luxury-text transition cursor-pointer"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h3 className="text-xl font-bold font-serif uppercase tracking-widest text-luxury-text">Suggested Timepieces</h3>
          <div className="w-10 h-[1.5px] bg-luxury-gold-dark mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedProducts.map((relProduct) => (
            <ProductCard 
              key={relProduct.id} 
              product={relProduct} 
              onPageChange={onPageChange} 
            />
          ))}
        </div>
      </section>

    </div>
  );
}
