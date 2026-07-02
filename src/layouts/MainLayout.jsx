import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

export default function MainLayout({ children, onPageChange, currentPage }) {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-luxury-bg flex flex-col font-sans select-none">
      {/* Navigation */}
      <Navbar 
        onCartOpen={() => setCartDrawerOpen(true)} 
        onPageChange={onPageChange}
        currentPage={currentPage}
      />

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={cartDrawerOpen} 
        onClose={() => setCartDrawerOpen(false)} 
        onPageChange={onPageChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <Footer onPageChange={onPageChange} />
    </div>
  );
}
