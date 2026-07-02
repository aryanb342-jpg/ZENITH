import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialProducts = [
  {
    id: '1',
    name: 'Zenith Heritage Rose Gold',
    image: '/assets/media__1782899491225.jpg',
    brand: 'ZENITH',
    price: 1250,
    stock: 8,
    category: 'Heritage',
    gender: 'women',
    description: 'A luxurious timeless classic watch featuring a stunning rose gold casing and index numerals, matching its premium metallic link bracelet. A tribute to Zenith\'s heritage.',
    specs: {
      movement: 'Automatic Chronometer',
      case: 'Rose Gold PVD Steel (40mm)',
      strap: 'Rose Gold Stainless Steel Bracelet',
      waterResistance: '50m (5 ATM)',
      glass: 'Scratch-resistant Sapphire Crystal'
    },
    reviews: [
      { id: 'r1', userName: 'John Doe', rating: 5, comment: 'Exquisite design, feels very premium and heavy. Highly recommend!', date: '2026-06-15', status: 'approved' },
      { id: 'r2', userName: 'Alice Smith', rating: 4, comment: 'Elegant dial, but the bracelet needed adjustment. Overall beautiful watch.', date: '2026-06-20', status: 'approved' }
    ]
  },
  {
    id: '2',
    name: 'Zenith Chronomaster Black Edition',
    image: '/assets/media__1782899491297.jpg',
    brand: 'ZENITH',
    price: 4800,
    stock: 5,
    category: 'Chronomaster',
    gender: 'men',
    description: 'High-precision luxury chronograph watch in matte black design with silver sub-dials and detailed tachymeter scale. Equipped with the legendary El Primero movement DNA.',
    specs: {
      movement: 'El Primero Chronograph (36,000 vph)',
      case: 'Matte Black Ceramic (42mm)',
      strap: 'Black Rubberized Steel Link',
      waterResistance: '100m (10 ATM)',
      glass: 'Double Anti-reflective Sapphire'
    },
    reviews: [
      { id: 'r3', userName: 'Marc V.', rating: 5, comment: 'The El Primero movement is flawless. The black ceramic case is scratchproof!', date: '2026-05-10', status: 'approved' }
    ]
  },
  {
    id: '3',
    name: 'Zenith Elite Classic Brown',
    image: '/assets/media__1782899491320.jpg',
    brand: 'ZENITH',
    price: 2100,
    stock: 12,
    category: 'Elite',
    gender: 'unisex',
    description: 'An ultra-minimalist timepiece featuring an elegant cream white dial, gold baton markers, and a premium textured brown leather strap. Perfect for formal dress occasions.',
    specs: {
      movement: 'Elite Ultra-Thin Automatic',
      case: '18K Yellow Gold (39mm)',
      strap: 'Brown Alligator Leather',
      waterResistance: '30m (3 ATM)',
      glass: 'Dome Sapphire Crystal'
    },
    reviews: [
      { id: 'r4', userName: 'David K.', rating: 4, comment: 'Classic dress watch. Super thin and fits under any cuff.', date: '2026-06-01', status: 'approved' }
    ]
  },
  {
    id: '4',
    name: 'Zenith Defy Automatic Steel',
    image: '/assets/media__1782899491366.jpg',
    brand: 'ZENITH',
    price: 3450,
    stock: 4,
    category: 'Defy',
    gender: 'men',
    description: 'A robust, sporty luxury watch with a brushed stainless steel case, textured black dial, day-date automatic calendar, and deep brown premium leather strap overlay.',
    specs: {
      movement: 'Automatic Calendar Caliber',
      case: 'Brushed Stainless Steel (41mm)',
      strap: 'Brown Leather with Rubber Backing',
      waterResistance: '100m (10 ATM)',
      glass: 'Scratch-resistant Sapphire'
    },
    reviews: [
      { id: 'r5', userName: 'Sarah L.', rating: 5, comment: 'Sturdy yet elegant. Ideal everyday luxury watch.', date: '2026-06-25', status: 'approved' }
    ]
  }
];

const initialCoupons = [
  { code: 'ZENITHSTAR', discountPercent: 20, description: '20% off Zenith Signature Collection' },
  { code: 'WELCOME10', discountPercent: 10, description: '10% off for first-time buyers' }
];

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('zenith_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('zenith_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('zenith_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('zenith_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('zenith_coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('zenith_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('zenith_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('zenith_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zenith_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('zenith_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('zenith_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('zenith_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('zenith_user');
    }
  }, [currentUser]);

  // Auth Operations
  const registerUser = (name, email, password, role = 'customer') => {
    const user = { name, email, role };
    setCurrentUser(user);
    return { success: true };
  };

  const loginUser = (email, password) => {
    // Admin Credential Mock
    if (email === 'admin@zenith.com' && password === 'admin123') {
      const adminUser = { name: 'Admin Administrator', email: 'admin@zenith.com', role: 'admin' };
      setCurrentUser(adminUser);
      return { success: true, role: 'admin' };
    }
    // Normal User Mock
    const userName = email.split('@')[0];
    const customerUser = { name: userName.charAt(0).toUpperCase() + userName.slice(1), email, role: 'customer' };
    setCurrentUser(customerUser);
    return { success: true, role: 'customer' };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCart([]); // Clear cart on logout
  };

  // Cart Operations
  const addToCart = (productId, quantity = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, message: 'Product not found' };
    
    // Check stock
    const cartItem = cart.find(item => item.productId === productId);
    const currentQty = cartItem ? cartItem.quantity : 0;
    
    if (currentQty + quantity > product.stock) {
      return { success: false, message: `Only ${product.stock} items in stock.` };
    }

    if (cartItem) {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { productId, quantity, price: product.price }]);
    }
    return { success: true, message: 'Added to Cart' };
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateCartQty = (productId, qty) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (qty > product.stock) {
      alert(`Only ${product.stock} items are in stock.`);
      qty = product.stock;
    }

    setCart(cart.map(item => 
      item.productId === productId 
        ? { ...item, quantity: qty }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Operations
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  // Checkout and Order Placement
  const placeOrder = (shippingDetails, paymentDetails, appliedCoupon) => {
    if (!currentUser) return { success: false, message: 'Please log in to checkout.' };
    if (cart.length === 0) return { success: false, message: 'Cart is empty' };

    // Calculate subtotal, discount, total
    let subtotal = 0;
    const items = cart.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      subtotal += p.price * item.quantity;
      return {
        productId: item.productId,
        name: p.name,
        price: p.price,
        quantity: item.quantity,
        image: p.image
      };
    });

    let discount = 0;
    if (appliedCoupon) {
      discount = Math.round(subtotal * (appliedCoupon.discountPercent / 100));
    }
    const total = subtotal - discount;

    // Build order object
    const newOrder = {
      id: 'Z-' + Math.floor(100000 + Math.random() * 900000),
      userEmail: currentUser.email,
      userName: currentUser.name,
      items,
      subtotal,
      discount,
      total,
      shippingDetails,
      paymentDetails: {
        method: paymentDetails.method,
        last4: paymentDetails.cardNumber ? paymentDetails.cardNumber.slice(-4) : 'UPI'
      },
      status: 'Paid', // Starts at Paid directly since checkout processes the payment
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update product stock
    const updatedProducts = products.map(p => {
      const orderItem = cart.find(item => item.productId === p.id);
      if (orderItem) {
        return { ...p, stock: Math.max(0, p.stock - orderItem.quantity) };
      }
      return p;
    });

    setProducts(updatedProducts);
    setOrders([newOrder, ...orders]);
    clearCart();
    return { success: true, order: newOrder };
  };

  const cancelOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    if (order.status !== 'Pending' && order.status !== 'Paid' && order.status !== 'Processing') {
      return { success: false, message: 'Orders cannot be cancelled after shipping.' };
    }

    // Restore stock
    const restoredProducts = products.map(p => {
      const orderItem = order.items.find(item => item.productId === p.id);
      if (orderItem) {
        return { ...p, stock: p.stock + orderItem.quantity };
      }
      return p;
    });

    setProducts(restoredProducts);
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'Cancelled' } : o
    ));
    return { success: true };
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
  };

  // Product CRUD (Admin Dashboard)
  const addProduct = (productData) => {
    const newId = String(products.length > 0 ? Math.max(...products.map(p => Number(p.id))) + 1 : 1);
    const newProduct = {
      id: newId,
      name: productData.name,
      image: productData.image || '/placeholder.jpg',
      brand: 'ZENITH',
      price: Number(productData.price),
      stock: Number(productData.stock),
      category: productData.category || 'Lifestyle',
      gender: productData.gender || 'unisex',
      description: productData.description || '',
      specs: {
        movement: productData.specs?.movement || 'Quartz',
        case: productData.specs?.case || 'Stainless Steel',
        strap: productData.specs?.strap || 'Leather Strap',
        waterResistance: productData.specs?.waterResistance || '50m',
        glass: productData.specs?.glass || 'Sapphire Crystal'
      },
      reviews: []
    };
    setProducts([...products, newProduct]);
    return { success: true };
  };

  const editProduct = (productId, updatedData) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? {
            ...p,
            name: updatedData.name,
            price: Number(updatedData.price),
            stock: Number(updatedData.stock),
            category: updatedData.category,
            gender: updatedData.gender || p.gender || 'unisex',
            description: updatedData.description,
            image: updatedData.image || p.image,
            specs: { ...p.specs, ...updatedData.specs }
          }
        : p
    ));
    return { success: true };
  };

  const deleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    // Clear product from cart if it was deleted
    setCart(cart.filter(item => item.productId !== productId));
    // Clear from wishlist
    setWishlist(wishlist.filter(id => id !== productId));
    return { success: true };
  };

  // Coupons CRUD (Admin)
  const addCoupon = (code, discountPercent, description) => {
    if (coupons.some(c => c.code.toUpperCase() === code.toUpperCase())) {
      return { success: false, message: 'Coupon code already exists.' };
    }
    setCoupons([...coupons, { code: code.toUpperCase(), discountPercent: Number(discountPercent), description }]);
    return { success: true };
  };

  const deleteCoupon = (code) => {
    setCoupons(coupons.filter(c => c.code !== code));
    return { success: true };
  };

  // Reviews operations
  const addReview = (productId, rating, comment) => {
    if (!currentUser) return { success: false, message: 'Please log in to leave a review.' };
    
    // Check if user has purchased this watch
    const hasPurchased = orders.some(o => 
      o.userEmail === currentUser.email && 
      o.items.some(item => item.productId === productId)
    );

    // Business rule: Ratings allowed only after successful delivery. Let's make it warnings or a flag in UI.
    // If not purchased, show warning but we can let them post as "pending" for admin approval, or strictly enforce it.
    // Let's enforce that review goes to "pending" for moderation by default!
    const newReview = {
      id: 'rev-' + Math.floor(100000 + Math.random() * 900000),
      userName: currentUser.name,
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0],
      status: hasPurchased ? 'approved' : 'pending' // Auto-approve if purchased, else needs moderation!
    };

    setProducts(products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          reviews: [newReview, ...p.reviews]
        };
      }
      return p;
    }));

    return { 
      success: true, 
      message: hasPurchased 
        ? 'Review added successfully!' 
        : 'Review submitted! It will appear after admin moderation.' 
    };
  };

  const moderateReview = (productId, reviewId, status) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          reviews: p.reviews.map(r => 
            r.id === reviewId ? { ...r, status } : r
          )
        };
      }
      return p;
    }));
  };

  return (
    <AppContext.Provider value={{
      products,
      cart,
      wishlist,
      orders,
      coupons,
      currentUser,
      registerUser,
      loginUser,
      logoutUser,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      toggleWishlist,
      placeOrder,
      cancelOrder,
      updateOrderStatus,
      addProduct,
      editProduct,
      deleteProduct,
      addCoupon,
      deleteCoupon,
      addReview,
      moderateReview
    }}>
      {children}
    </AppContext.Provider>
  );
};
