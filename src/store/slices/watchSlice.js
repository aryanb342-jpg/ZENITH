import { createSlice } from '@reduxjs/toolkit';

// Helper to safe-parse localStorage items
const loadSaved = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  products: [],
  cart: loadSaved('zenith_cart', []),
  wishlist: loadSaved('zenith_wishlist', []),
  orders: [],
  coupons: [],
  currentUser: null
};

// Helper for standard API headers
const getHeaders = () => {
  const token = localStorage.getItem('zenith_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const watchSlice = createSlice({
  name: 'watch',
  initialState,
  reducers: {
    setCurrentUserAction: (state, action) => {
      state.currentUser = action.payload;
    },
    logoutUserAction: (state) => {
      state.currentUser = null;
      state.cart = [];
      state.orders = [];
    },
    addToCartAction: (state, action) => {
      const { productId, quantity, price } = action.payload;
      const existing = state.cart.find(item => item.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.cart.push({ productId, quantity, price });
      }
    },
    removeFromCartAction: (state, action) => {
      state.cart = state.cart.filter(item => item.productId !== action.payload);
    },
    updateCartQtyAction: (state, action) => {
      const { productId, qty } = action.payload;
      const existing = state.cart.find(item => item.productId === productId);
      if (existing) {
        existing.quantity = qty;
      }
    },
    clearCartAction: (state) => {
      state.cart = [];
    },
    toggleWishlistAction: (state, action) => {
      const productId = action.payload;
      if (state.wishlist.includes(productId)) {
        state.wishlist = state.wishlist.filter(id => id !== productId);
      } else {
        state.wishlist.push(productId);
      }
    },
    setProductsAction: (state, action) => {
      state.products = action.payload;
    },
    setOrdersAction: (state, action) => {
      state.orders = action.payload;
    },
    setCouponsAction: (state, action) => {
      state.coupons = action.payload;
    }
  }
});

export const {
  setCurrentUserAction,
  logoutUserAction,
  addToCartAction,
  removeFromCartAction,
  updateCartQtyAction,
  clearCartAction,
  toggleWishlistAction,
  setProductsAction,
  setOrdersAction,
  setCouponsAction
} = watchSlice.actions;

// Async Thunks using native fetch
export const fetchProducts = () => async (dispatch) => {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.success) {
      dispatch(setProductsAction(data.products));
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

export const fetchCoupons = () => async (dispatch) => {
  try {
    const res = await fetch('/api/coupons');
    const data = await res.json();
    if (data.success) {
      dispatch(setCouponsAction(data.coupons));
    }
  } catch (error) {
    console.error('Failed to fetch coupons:', error);
  }
};

export const fetchOrders = () => async (dispatch) => {
  try {
    const res = await fetch('/api/orders', {
      headers: getHeaders()
    });
    const data = await res.json();
    if (data.success) {
      dispatch(setOrdersAction(data.orders));
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
};

export const fetchUserProfile = () => async (dispatch) => {
  const token = localStorage.getItem('zenith_token');
  if (!token) return;
  try {
    const res = await fetch('/api/auth/profile', {
      headers: getHeaders()
    });
    const data = await res.json();
    if (data.success) {
      dispatch(setCurrentUserAction(data.user));
      dispatch(fetchOrders());
    } else {
      localStorage.removeItem('zenith_token');
    }
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    localStorage.removeItem('zenith_token');
  }
};

export const registerUser = (name, email, password) => async (dispatch) => {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('zenith_token', data.token);
      dispatch(setCurrentUserAction(data.user));
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Registration failed. Server error.' };
  }
};

export const loginUser = (email, password) => async (dispatch) => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('zenith_token', data.token);
      dispatch(setCurrentUserAction(data.user));
      dispatch(fetchOrders());
      return { success: true, role: data.user.role };
    } else {
      return { success: false, message: data.message, remainingSeconds: data.remainingSeconds };
    }
  } catch (error) {
    return { success: false, message: 'Login failed. Server error.' };
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('zenith_token');
  dispatch(logoutUserAction());
};

export const addToCart = (productId, quantity = 1) => (dispatch, getState) => {
  const { products, cart } = getState().watch;
  const product = products.find(p => p.id === productId);
  if (!product) return { success: false, message: 'Product not found' };

  const cartItem = cart.find(item => item.productId === productId);
  const currentQty = cartItem ? cartItem.quantity : 0;

  if (currentQty + quantity > product.stock) {
    return { success: false, message: `Only ${product.stock} items in stock.` };
  }

  dispatch(addToCartAction({ productId, quantity, price: product.price }));
  return { success: true, message: 'Added to Cart' };
};

export const updateCartQty = (productId, qty) => (dispatch, getState) => {
  const { products } = getState().watch;
  const product = products.find(p => p.id === productId);
  if (!product) return;

  if (qty <= 0) {
    dispatch(removeFromCartAction(productId));
    return;
  }

  if (qty > product.stock) {
    alert(`Only ${product.stock} items are in stock.`);
    qty = product.stock;
  }

  dispatch(updateCartQtyAction({ productId, qty }));
};

export const removeFromCart = (productId) => (dispatch) => {
  dispatch(removeFromCartAction(productId));
};

export const toggleWishlist = (productId) => (dispatch) => {
  dispatch(toggleWishlistAction(productId));
};

export const placeOrder = (shippingDetails, paymentDetails, appliedCoupon) => async (dispatch, getState) => {
  const { products, cart, currentUser } = getState().watch;
  if (!currentUser) return { success: false, message: 'Please log in to checkout.' };
  if (cart.length === 0) return { success: false, message: 'Cart is empty' };

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

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        items,
        subtotal,
        discount,
        total,
        shippingDetails,
        paymentDetails
      })
    });
    const data = await res.json();
    if (data.success) {
      dispatch(clearCartAction());
      dispatch(fetchProducts()); // Refresh stocks
      dispatch(fetchOrders());   // Refresh orders list
      return { success: true, order: data.order };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Checkout failed. Server error.' };
  }
};

export const cancelOrder = (orderId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: getHeaders()
    });
    const data = await res.json();
    if (data.success) {
      dispatch(fetchOrders());
      dispatch(fetchProducts());
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Cancellation failed. Server error.' };
  }
};

export const updateOrderStatus = (orderId, newStatus) => async (dispatch) => {
  try {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (data.success) {
      dispatch(fetchOrders());
      return { success: true };
    }
  } catch (error) {
    console.error('Failed to update order status:', error);
  }
};

export const addProduct = (productData) => async (dispatch) => {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (data.success) {
      dispatch(fetchProducts());
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Failed to create product.' };
  }
};

export const editProduct = (productId, updatedData) => async (dispatch) => {
  try {
    const res = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatedData)
    });
    const data = await res.json();
    if (data.success) {
      dispatch(fetchProducts());
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Failed to update product.' };
  }
};

export const deleteProduct = (productId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (data.success) {
      dispatch(fetchProducts());
      dispatch(removeFromCartAction(productId));
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Failed to delete product.' };
  }
};

export const addCoupon = (code, discountPercent, description) => async (dispatch) => {
  try {
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code, discountPercent, description })
    });
    const data = await res.json();
    if (data.success) {
      dispatch(fetchCoupons());
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Failed to add coupon.' };
  }
};

export const deleteCoupon = (code) => async (dispatch) => {
  try {
    const res = await fetch(`/api/coupons/${code}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (data.success) {
      dispatch(fetchCoupons());
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Failed to delete coupon.' };
  }
};

export const addReview = (productId, rating, comment) => async (dispatch) => {
  try {
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ rating, comment })
    });
    const data = await res.json();
    if (data.success) {
      dispatch(fetchProducts());
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Failed to post review.' };
  }
};

export const moderateReview = (productId, reviewId, status) => async (dispatch) => {
  try {
    const res = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.success) {
      dispatch(fetchProducts());
      return { success: true };
    }
  } catch (error) {
    console.error('Failed to moderate review:', error);
  }
};

export default watchSlice.reducer;
