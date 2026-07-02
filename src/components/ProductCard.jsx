import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingBag, Heart, Star } from 'lucide-react';

export default function ProductCard({ product, onPageChange }) {
  const { addToCart, toggleWishlist, wishlist } = useContext(AppContext);
  const isWishlisted = wishlist.includes(product.id);

  // Calculate average rating
  const approvedReviews = product.reviews?.filter(r => r.status === 'approved') || [];
  const averageRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const result = addToCart(product.id, 1);
    if (result.success) {
      alert(`${product.name} added to cart!`);
    } else {
      alert(result.message);
    }
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      onClick={() => onPageChange('product-detail', { id: product.id })}
      className="group relative bg-white border border-luxury-text/10 hover:border-luxury-gold/50 transition-all duration-300 rounded-md overflow-hidden cursor-pointer hover-gold-glow flex flex-col h-full shadow-sm"
    >
      {/* Category Tag */}
      <span className="absolute top-3 left-3 bg-white/70 backdrop-blur-md border border-luxury-text/5 text-[9px] font-bold tracking-widest text-luxury-text px-2 py-1 uppercase rounded-sm z-10">
        {product.category}
      </span>
      
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 p-1.5 rounded-full z-10 transition duration-300 border border-luxury-text/5 ${
          isWishlisted 
            ? 'bg-luxury-red text-white' 
            : 'bg-white/70 hover:bg-white text-luxury-text'
        }`}
      >
        <Heart size={16} fill={isWishlisted ? "white" : "none"} />
      </button>

      {/* Image container */}
      <div className="aspect-square bg-luxury-gray/40 flex items-center justify-center p-6 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-luxury-red font-bold text-xs tracking-widest uppercase border border-luxury-red px-3 py-1.5">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Text Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] text-luxury-muted font-bold uppercase tracking-wider">ZENITH SWISS</p>
          <h3 className="text-luxury-text text-sm font-semibold tracking-wide group-hover:text-luxury-gold-dark transition duration-200 line-clamp-1">
            {product.name}
          </h3>
          
          {/* Ratings display */}
          <div className="flex items-center space-x-1.5 pt-1 h-4">
            {averageRating ? (
              <>
                <div className="flex text-luxury-gold-dark">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={10} 
                      fill={i < Math.floor(Number(averageRating)) ? "var(--color-luxury-gold-dark)" : "none"} 
                      className="stroke-1"
                    />
                  ))}
                </div>
                <span className="text-[10px] text-luxury-muted">({approvedReviews.length})</span>
              </>
            ) : (
              <span className="text-[9px] text-luxury-muted/70 tracking-wider">NO REVIEWS YET</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {/* Price */}
          <span className="text-luxury-text font-bold text-sm">
            ${product.price.toLocaleString()}
          </span>

          {/* Quick Shop Button */}
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="p-2 bg-luxury-bg border border-luxury-text/10 hover:border-luxury-gold-dark hover:bg-luxury-gold-dark hover:text-white text-luxury-text rounded-md transition duration-300 cursor-pointer"
              title="Add to Cart"
            >
              <ShoppingBag size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
