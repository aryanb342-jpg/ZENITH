import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, toggleWishlist } from '../store/slices/watchSlice';
import { ShoppingBag, Heart, Star } from 'lucide-react';

export default function ProductCard({ product, onPageChange }) {
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.watch.wishlist);
  const isWishlisted = wishlist.includes(product.id);

  // Calculate average rating
  const approvedReviews = product.reviews?.filter(r => r.status === 'approved') || [];
  const averageRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const result = dispatch(addToCart(product.id, 1));
    if (result.success) {
      alert(`${product.name} added to cart!`);
    } else {
      alert(result.message);
    }
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product.id));
  };

  const specItems = [];
  if (product.specs?.case) specItems.push(product.specs.case);
  if (product.specs?.movement) specItems.push(product.specs.movement);
  if (product.specs?.strap) specItems.push(product.specs.strap);
  const specLine = specItems.length > 0 ? specItems.join(' • ') : 'Swiss Quartz';

  return (
    <div 
      onClick={() => onPageChange('product-detail', { id: product.id })}
      className="group relative flex flex-col h-full cursor-pointer bg-transparent transition-all duration-300"
    >
      {/* Wishlist Button (Minimalist Wireframe Heart matching Tissot) */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-4 right-4 z-10 p-1 text-luxury-text hover:text-luxury-red transition duration-300 focus:outline-none"
      >
        <Heart 
          size={18} 
          className="transition duration-300 text-neutral-400 hover:text-[#e10600]" 
          fill={isWishlisted ? "#e10600" : "none"} 
          stroke={isWishlisted ? "#e10600" : "currentColor"} 
        />
      </button>

      {/* Image container (Centered with padding on solid light gray background) */}
      <div className="aspect-square bg-[#f6f6f6] rounded-sm flex items-center justify-center p-8 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-[85%] max-w-[85%] object-contain transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-[#f6f6f6]/80 flex items-center justify-center">
            <span className="text-luxury-red font-bold text-[10px] tracking-widest uppercase border border-luxury-red px-2.5 py-1">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Text Details (Clean, left-aligned, no border, matching the Tissot layout) */}
      <div className="pt-3 pb-2 bg-transparent space-y-1 flex flex-col justify-between flex-1">
        <div className="space-y-0.5">
          <h3 className="text-luxury-text text-sm font-semibold tracking-wide group-hover:text-luxury-gold-dark transition duration-200 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] text-luxury-muted font-normal tracking-wide">
            {specLine}
          </p>
        </div>
        <p className="text-luxury-text text-xs sm:text-sm font-semibold pt-1">
          ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
