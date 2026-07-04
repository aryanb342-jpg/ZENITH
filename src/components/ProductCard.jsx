import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, toggleWishlist, selectCurrentCurrency, formatPrice } from '../store/slices/watchSlice';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function ProductCard({ product, onPageChange, showRemove = false }) {
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.watch.wishlist);
  const currentCurrency = useSelector(selectCurrentCurrency);
  const isWishlisted = wishlist.includes(product.id);

  const approvedReviews = product.reviews?.filter(r => r.status === 'approved') || [];
  const averageRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : null;

  /* ── 3-D tilt on hover ── */
  const cardRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [8, -8]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-8, 8]), { stiffness: 180, damping: 18 });

  const handleMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };
  const handleLeave = () => { rawX.set(0); rawY.set(0); };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const result = dispatch(addToCart(product.id, 1));
    if (result.success) alert(`${product.name} added to cart!`);
    else alert(result.message);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(toggleWishlist(product.id));
  };

  const specItems = [];
  if (product.specs?.case) specItems.push(product.specs.case);
  if (product.specs?.movement) specItems.push(product.specs.movement);
  if (product.specs?.strap) specItems.push(product.specs.strap);
  const specLine = specItems.length > 0 ? specItems.join(' • ') : 'Swiss Quartz';

  return (
    <motion.div
      ref={cardRef}
      onClick={(e) => {
        if (e.target.closest('.wishlist-btn')) {
          return;
        }
        onPageChange('product-detail', { id: product.id });
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      className="group relative flex flex-col h-full cursor-pointer bg-transparent"
      whileHover={{ z: 20 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Wishlist */}
      <motion.button
        onClick={handleWishlistToggle}
        className="wishlist-btn absolute top-3 right-3 z-10 p-2.5 focus:outline-none"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.85 }}
      >
        <motion.div
          animate={isWishlisted ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.35 }}
        >
          <Heart
            size={18}
            className="transition duration-300"
            fill={isWishlisted ? '#e10600' : 'none'}
            stroke={isWishlisted ? '#e10600' : 'currentColor'}
            style={{ color: isWishlisted ? '#e10600' : '#a3a3a3' }}
          />
        </motion.div>
      </motion.button>

      {/* Image */}
      <div className="aspect-square bg-[#f6f6f6] rounded-sm overflow-hidden relative flex items-center justify-center">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.09 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Hover shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"
          initial={{ x: '-120%' }}
          whileHover={{ x: '120%' }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
        />

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-[#f6f6f6]/80 flex items-center justify-center">
            <span className="text-luxury-red font-bold text-[10px] tracking-widest uppercase border border-luxury-red px-2.5 py-1">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <motion.div
        className="pt-3 pb-2 bg-transparent space-y-1 flex flex-col justify-between flex-1"
        initial={{ opacity: 0.85 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="space-y-0.5">
          <motion.h3
            className="text-luxury-text text-sm font-semibold tracking-wide line-clamp-1"
            whileHover={{ color: '#93744d', x: 2 }}
            transition={{ duration: 0.2 }}
          >
            {product.name}
          </motion.h3>
          <p className="text-[11px] text-luxury-muted font-normal tracking-wide">{specLine}</p>
        </div>
        <motion.p
          className="text-luxury-text text-xs sm:text-sm font-semibold pt-1"
          whileHover={{ scale: 1.04 }}
          style={{ originX: 0 }}
        >
          {formatPrice(product.price, currentCurrency)}
        </motion.p>
        {showRemove && (
          <button
            onClick={handleWishlistToggle}
            className="wishlist-btn mt-2.5 w-full py-2 bg-transparent border border-red-500/25 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-bold tracking-widest uppercase transition duration-300 cursor-pointer rounded-sm"
          >
            Remove
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
