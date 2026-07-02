import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingBag, Heart, Search, User, ShieldAlert, Menu, X, Star } from 'lucide-react';

export default function Navbar({ onCartOpen, onPageChange, currentPage }) {
  const { cart, wishlist, currentUser, logoutUser } = useContext(AppContext);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onPageChange('shop', { search: searchQuery });
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'HOME', page: 'home' },
    { label: 'MEN', page: 'shop', filter: { gender: 'men' } },
    { label: 'WOMEN', page: 'shop', filter: { gender: 'women' } },
    { label: 'SHOP ALL', page: 'shop' },
    { label: 'CHRONOMASTER', page: 'shop', filter: { category: 'Chronomaster' } },
  ];

  const handleNavLinkClick = (link) => {
    if (link.filter) {
      onPageChange('shop', link.filter);
    } else {
      onPageChange(link.page);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-luxury-text/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-luxury-muted hover:text-luxury-text focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Left Navigation: Brand Links (Desktop) */}
          <nav className="hidden md:flex space-x-8 text-xs font-semibold tracking-widest">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleNavLinkClick(link)}
                className={`text-luxury-text hover:text-luxury-gold-dark transition duration-200 cursor-pointer ${
                  currentPage === link.page ? 'text-luxury-gold-dark' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Center Logo */}
          <div className="flex-1 md:flex-none flex justify-center items-center">
            <button 
              onClick={() => onPageChange('home')} 
              className="flex items-center space-x-2 text-luxury-text hover:text-luxury-gold-dark transition duration-300 cursor-pointer"
            >
              <Star className="text-luxury-gold-dark animate-pulse" size={22} fill="var(--color-luxury-gold-dark)" />
              <span className="font-serif text-2xl font-bold tracking-widest">ZENITH</span>
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-5 text-luxury-text">
            {/* Search Icon / Bar */}
            <div className="relative flex items-center">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search watches..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 sm:w-48 bg-luxury-bg text-luxury-text text-xs px-3 py-1.5 rounded-l-md border border-luxury-text/10 focus:outline-none focus:border-luxury-gold-dark"
                    autoFocus
                  />
                  <button type="submit" className="bg-luxury-gold-dark text-white px-2.5 py-1.5 rounded-r-md border border-luxury-gold-dark hover:bg-luxury-gold transition cursor-pointer">
                    <Search size={14} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSearchOpen(false)}
                    className="ml-2 text-luxury-muted hover:text-luxury-text"
                  >
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setSearchOpen(true)}
                  className="hover:text-luxury-gold-dark transition cursor-pointer"
                  title="Search"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Profile / Admin Icon */}
            <div className="flex items-center">
              {currentUser ? (
                <button
                  onClick={() => onPageChange(currentUser.role === 'admin' ? 'admin' : 'profile')}
                  className="flex items-center space-x-1.5 hover:text-luxury-gold-dark transition cursor-pointer"
                  title={currentUser.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
                >
                  {currentUser.role === 'admin' ? (
                    <ShieldAlert size={20} className="text-luxury-red" />
                  ) : (
                    <User size={20} />
                  )}
                  <span className="hidden lg:inline text-xs max-w-20 truncate font-medium">
                    {currentUser.name}
                  </span>
                </button>
              ) : (
                <button 
                  onClick={() => onPageChange('login')}
                  className="hover:text-luxury-gold-dark transition cursor-pointer"
                  title="Login"
                >
                  <User size={20} />
                </button>
              )}
            </div>

            {/* Wishlist Icon */}
            <button 
              onClick={() => onPageChange(currentUser ? 'profile' : 'login', currentUser ? { tab: 'wishlist' } : null)}
              className="relative hover:text-luxury-gold-dark transition cursor-pointer"
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-luxury-gold-dark text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button 
              onClick={onCartOpen}
              className="relative hover:text-luxury-gold-dark transition cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-luxury-red text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-luxury-text/10 py-4 px-6 space-y-4 flex flex-col">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => handleNavLinkClick(link)}
              className="text-left text-sm text-luxury-text hover:text-luxury-gold-dark transition py-2 font-medium tracking-widest cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          {currentUser && (
            <button
              onClick={() => { logoutUser(); setMobileMenuOpen(false); onPageChange('home'); }}
              className="text-left text-sm text-luxury-red hover:text-red-400 transition py-2 font-medium tracking-widest cursor-pointer"
            >
              LOGOUT
            </button>
          )}
        </div>
      )}
    </header>
  );
}
