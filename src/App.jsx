import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Admin from './pages/Admin';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState(null);

  const handlePageChange = (page, params = null) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onPageChange={handlePageChange} />;
      case 'shop':
        return <Shop onPageChange={handlePageChange} filterParams={pageParams} />;
      case 'product-detail':
        return <ProductDetail params={pageParams} onPageChange={handlePageChange} />;
      case 'cart':
        return <CartPage onPageChange={handlePageChange} />;
      case 'checkout':
        return <Checkout params={pageParams} onPageChange={handlePageChange} />;
      case 'profile':
        return <Profile params={pageParams} onPageChange={handlePageChange} />;
      case 'login':
        return <Login params={pageParams} onPageChange={handlePageChange} />;
      case 'admin':
        return <Admin onPageChange={handlePageChange} />;
      default:
        return <Home onPageChange={handlePageChange} />;
    }
  };

  return (
    <MainLayout onPageChange={handlePageChange} currentPage={currentPage}>
      {renderPage()}
    </MainLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
