import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateOrderStatus, 
  addProduct, 
  editProduct, 
  deleteProduct, 
  addCoupon, 
  deleteCoupon, 
  moderateReview,
  selectCurrentCurrency,
  formatPrice
} from '../store/slices/watchSlice';
import { 
  BarChart3, Plus, Edit, Trash2, Check, X, Tag, Star, 
  Package, AlertTriangle, ShieldAlert, ArrowLeft, ArrowUpRight,
  CheckCircle2
} from 'lucide-react';

export default function Admin({ onPageChange }) {
  const dispatch = useDispatch();
  const products = useSelector(state => state.watch.products);
  const orders = useSelector(state => state.watch.orders);
  const coupons = useSelector(state => state.watch.coupons);
  const currentUser = useSelector(state => state.watch.currentUser);
  const currentCurrency = useSelector(selectCurrentCurrency);

  // Active Admin Sub-Tab
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | products | orders | coupons | reviews

  // Add Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Khronomaster',
    gender: 'unisex',
    description: '',
    image: '/assets/media__1782899491225.jpg', // default copy
    specs: {
      movement: 'Automatic Chronometer',
      case: 'Stainless Steel (40mm)',
      strap: 'Leather strap',
      waterResistance: '50m',
      glass: 'Sapphire Crystal'
    }
  });

  // Edit Product Form State
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // Add Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Validation checking for security
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-luxury-gray border border-white/5 rounded p-8 space-y-6">
        <ShieldAlert className="mx-auto text-luxury-red animate-bounce" size={48} />
        <div className="space-y-2">
          <h1 className="text-lg font-bold text-white uppercase tracking-widest">Unauthorized Access</h1>
          <p className="text-xs text-gray-400">Your account credentials do not grant administrator permissions to modify system states.</p>
        </div>
        <button
          onClick={() => onPageChange('login')}
          className="px-6 py-2.5 bg-luxury-gold text-luxury-dark text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold-dark transition"
        >
          Authenticate Admin Account
        </button>
      </div>
    );
  }

  // --- ANALYTICS CALCULATIONS ---
  const totalSales = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalSubscribersMock = 148;

  // Compile all pending reviews for moderation
  const pendingReviews = [];
  products.forEach(p => {
    p.reviews?.forEach(r => {
      if (r.status === 'pending') {
        pendingReviews.push({
          productId: p.id,
          productName: p.name,
          review: r
        });
      }
    });
  });

  // --- ACTIONS HANDLERS ---
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert('Please fill out Name, Price and Stock.');
      return;
    }
    const res = dispatch(addProduct(newProduct));
    if (res.success) {
      alert('Product created successfully!');
      setShowAddForm(false);
      setNewProduct({
        name: '', price: '', stock: '', category: 'Khronomaster', description: '',
        image: '/assets/media__1782899491225.jpg',
        specs: { movement: 'Automatic', case: '40mm', strap: 'Leather', waterResistance: '50m', glass: 'Sapphire' }
      });
    }
  };

  const handleEditProductInit = (product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const res = dispatch(editProduct(editingId, editForm));
    if (res.success) {
      alert('Product edited successfully!');
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleDeleteProductClick = (id) => {
    if (window.confirm('Delete this timepiece from store inventory?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponDiscount) return;
    const res = dispatch(addCoupon(newCouponCode, newCouponDiscount, newCouponDesc));
    if (res.success) {
      alert('Coupon code activated!');
      setNewCouponCode('');
      setNewCouponDiscount('');
      setNewCouponDesc('');
    } else {
      alert(res.message);
    }
  };

  const handleReviewStatus = (productId, reviewId, status) => {
    dispatch(moderateReview(productId, reviewId, status));
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Dashboard Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold uppercase text-white tracking-widest">Admin Control Center</h1>
          <p className="text-gray-400 text-xs mt-1">Configure Khroniq store parameters, monitor sales trends, and verify stock thresholds.</p>
        </div>
        
        <button
          onClick={() => onPageChange('home')}
          className="px-4 py-2 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition cursor-pointer"
        >
          <ArrowLeft size={12} />
          <span>Exit Dashboard</span>
        </button>
      </div>

      {/* Admin Tab Selectors */}
      <div className="flex flex-wrap gap-2 text-xs border-b border-white/5 pb-4">
        {[
          { key: 'analytics', label: 'Store Analytics', icon: BarChart3 },
          { key: 'products', label: 'Inventory Manager', icon: Package },
          { key: 'orders', label: 'Order Dispatcher', icon: CheckCircle2 },
          { key: 'coupons', label: 'Coupon Builder', icon: Tag },
          { key: 'reviews', label: 'Reviews Moderator', icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2.5 px-4 font-bold uppercase tracking-wider cursor-pointer transition flex items-center space-x-1.5 rounded-sm ${
                activeTab === tab.key 
                  ? 'bg-luxury-gold text-luxury-dark font-extrabold' 
                  : 'bg-luxury-gray text-gray-400 hover:text-white hover:bg-luxury-gray/70'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.key === 'reviews' && pendingReviews.length > 0 && (
                <span className="bg-luxury-red text-white text-[9px] px-1.5 py-0.5 rounded-full font-sans font-black ml-1">
                  {pendingReviews.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* --- TAB CONTENT: ANALYTICS --- */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Gross Sales Revenue</span>
              <p className="text-2xl font-extrabold text-luxury-gold">{formatPrice(totalSales, currentCurrency)}</p>
              <span className="text-[9px] text-emerald-400 flex items-center space-x-1 font-medium">
                <ArrowUpRight size={10} />
                <span>+12.4% vs last week</span>
              </span>
            </div>
            
            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Orders</span>
              <p className="text-2xl font-extrabold text-white">{totalOrdersCount}</p>
              <span className="text-[9px] text-gray-500 font-light">All status types included</span>
            </div>

            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Out of Stock Watches</span>
              <p className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <span>{outOfStockCount}</span>
                {outOfStockCount > 0 && <AlertTriangle size={18} className="text-luxury-red animate-pulse" />}
              </p>
              <span className="text-[9px] text-gray-500">Requires production triggers</span>
            </div>

            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Star Newsletter Subscriptions</span>
              <p className="text-2xl font-extrabold text-white">{totalSubscribersMock}</p>
              <span className="text-[9px] text-emerald-400 font-medium">Mock marketing reach</span>
            </div>
          </div>

          {/* SVG Chart Panel */}
          <div className="bg-luxury-gray border border-white/5 p-6 sm:p-8 rounded-md space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Sales Performance Curve</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Calculated relative gross trends by collection category</p>
              </div>
              <span className="bg-white/5 border border-white/10 text-[9px] font-bold text-gray-300 px-2.5 py-1 tracking-widest uppercase rounded">
                Live Data
              </span>
            </div>

            {/* Custom Interactive SVG Graph */}
            <div className="relative pt-4 flex flex-col items-center">
              <svg className="w-full h-64 overflow-visible" viewBox="0 0 600 240">
                {/* Horizontal Guide Lines */}
                <line x1="50" y1="40" x2="550" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="50" y1="90" x2="550" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="50" y1="140" x2="550" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="50" y1="190" x2="550" y2="190" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                
                {/* Axes */}
                <line x1="50" y1="190" x2="550" y2="190" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="50" y1="40" x2="50" y2="190" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                {/* Bars - Mocking Category Sales: Khronomaster, Defy, Heritage, Elite */}
                {/* Khronomaster: 190 to 60 */}
                <rect x="90" y="60" width="40" height="130" fill="var(--color-luxury-gold)" opacity="0.8" rx="2" className="hover:opacity-100 transition" />
                {/* Defy: 190 to 90 */}
                <rect x="210" y="90" width="40" height="100" fill="var(--color-luxury-red)" opacity="0.8" rx="2" className="hover:opacity-100 transition" />
                {/* Heritage: 190 to 120 */}
                <rect x="330" y="120" width="40" height="70" fill="#ffffff" opacity="0.7" rx="2" className="hover:opacity-100 transition" />
                {/* Elite: 190 to 150 */}
                <rect x="450" y="150" width="40" height="40" fill="var(--color-luxury-gold-dark)" opacity="0.8" rx="2" className="hover:opacity-100 transition" />

                {/* Y-axis Labels */}
                <text x="40" y="45" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end">$10K</text>
                <text x="40" y="95" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end">$5K</text>
                <text x="40" y="145" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end">$2.5K</text>
                <text x="40" y="195" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end">$0</text>

                {/* X-axis Labels */}
                <text x="110" y="210" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle">KHRONOMASTER</text>
                <text x="230" y="210" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle">DEFY</text>
                <text x="350" y="210" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle">HERITAGE</text>
                <text x="470" y="210" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle">ELITE</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: INVENTORY MANAGER (CRUD) --- */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          {/* Header & Add Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Watch Database</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-white hover:bg-luxury-gold text-luxury-dark text-xs font-bold uppercase tracking-widest transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Timepiece</span>
            </button>
          </div>

          {/* Add Form Drawer */}
          {showAddForm && (
            <div className="bg-luxury-gray border border-white/5 p-6 rounded-md space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pb-2">New Timepiece Profile</h4>
              
              <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Watch Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                    placeholder="Khroniq Khronomaster Sport"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Price ($)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                      placeholder="4500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Stock Count</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                      placeholder="8"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Collection / Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                  >
                    <option value="Khronomaster">Khronomaster</option>
                    <option value="Defy">Defy</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Target Gender</label>
                  <select
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                  >
                    <option value="men">Men's watches</option>
                    <option value="women">Women's watches</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Image Path</label>
                  <select
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                  >
                    <option value="/assets/media__1782899491225.jpg">Rose Gold Watch (Asset 1)</option>
                    <option value="/assets/media__1782899491297.jpg">Black Chronograph (Asset 2)</option>
                    <option value="/assets/media__1782899491320.jpg">Minimalist Leather (Asset 3)</option>
                    <option value="/assets/media__1782899491366.jpg">Defy Steel (Asset 4)</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Product Description</label>
                  <textarea
                    rows="3"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-2.5 focus:outline-none"
                    placeholder="Enter full descriptive paragraphs..."
                  />
                </div>

                <button
                  type="submit"
                  className="md:col-span-2 py-3 bg-luxury-gold text-luxury-dark font-bold text-xs tracking-widest uppercase hover:bg-luxury-gold-dark transition"
                >
                  Save Timepiece to Stock
                </button>
              </form>
            </div>
          )}

          {/* Edit Form Modal (Visible only when editingId !== null) */}
          {editingId && editForm && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-luxury-gray border border-white/5 p-6 sm:p-8 rounded-md w-full max-w-xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white">Modify Watch Details</h4>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Watch Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Price ($)</label>
                      <input
                        type="number"
                        required
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                        className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Stock</label>
                      <input
                        type="number"
                        required
                        value={editForm.stock}
                        onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                        className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Collection</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                    >
                      <option value="Khronomaster">Khronomaster</option>
                      <option value="Defy">Defy</option>
                      <option value="Heritage">Heritage</option>
                      <option value="Elite">Elite</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Target Gender</label>
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                    >
                      <option value="men">Men's watches</option>
                      <option value="women">Women's watches</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Description</label>
                    <textarea
                      rows="3"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="py-2.5 border border-white/10 text-white font-semibold uppercase hover:bg-white/5 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 bg-luxury-gold text-luxury-dark font-bold uppercase hover:bg-luxury-gold-dark transition"
                    >
                      Save Modifications
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-luxury-gray border border-white/5 rounded-md overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-luxury-dark border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px] font-bold">
                <tr>
                  <th className="p-4">Watch Profile</th>
                  <th className="p-4">Collection</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="h-10 w-10 bg-luxury-dark border border-white/5 p-1 rounded flex items-center justify-center">
                        <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="font-semibold text-white truncate max-w-xs">{p.name}</span>
                    </td>
                    <td className="p-4 uppercase tracking-wider text-[10px] text-gray-400">{p.category}</td>
                    <td className="p-4 font-bold text-white">{formatPrice(p.price, currentCurrency)}</td>
                    <td className="p-4">
                      <span className={`font-semibold ${p.stock === 0 ? 'text-luxury-red font-bold' : 'text-gray-300'}`}>
                        {p.stock === 0 ? 'SOLD OUT' : `${p.stock} units`}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditProductInit(p)}
                        className="p-1.5 bg-white/5 border border-white/10 hover:border-luxury-gold hover:text-luxury-gold text-gray-400 rounded transition cursor-pointer"
                        title="Edit watch"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteProductClick(p.id)}
                        className="p-1.5 bg-white/5 border border-white/10 hover:border-luxury-red hover:text-luxury-red text-gray-400 rounded transition cursor-pointer"
                        title="Delete watch"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: ORDER DISPATCHER (MANAGE STATUSES) --- */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white">Client Invoice Dispatcher</h3>
          
          {orders.length === 0 ? (
            <p className="text-gray-400 text-xs italic p-4 text-center border border-dashed border-white/10 rounded">No order records found in simulated database.</p>
          ) : (
            <div className="bg-luxury-gray border border-white/5 rounded-md overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-luxury-dark border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px] font-bold">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Charged</th>
                    <th className="p-4">Status Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-mono font-bold text-white tracking-wider uppercase">{o.id}</td>
                      <td className="p-4">
                        <p className="text-white font-semibold">{o.userName}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{o.userEmail}</p>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="truncate text-gray-300 font-light" title={o.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}>
                          {o.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                        </p>
                      </td>
                      <td className="p-4 font-bold text-luxury-gold">{formatPrice(o.total, currentCurrency)}</td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => dispatch(updateOrderStatus(o.id, e.target.value))}
                          className={`bg-luxury-dark text-xs border rounded px-2.5 py-1 font-semibold focus:outline-none ${
                            o.status === 'Delivered' 
                              ? 'border-emerald-500 text-emerald-400'
                              : o.status === 'Cancelled'
                              ? 'border-red-500 text-red-400'
                              : o.status === 'Shipped'
                              ? 'border-sky-500 text-sky-400'
                              : 'border-yellow-500 text-yellow-450'
                          }`}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- TAB CONTENT: COUPON BUILDER --- */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Create Form */}
          <div className="lg:col-span-5 bg-luxury-gray border border-white/5 p-6 rounded-md space-y-4 h-fit">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/5 pb-2">Assemble Promo Codes</h4>
            
            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Coupon Name/Code</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="GOLDENHOUR"
                  className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5 uppercase font-mono tracking-wider"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Discount Amount (%)</label>
                <input
                  type="number"
                  required
                  min="5"
                  max="90"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  placeholder="30"
                  className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Description Tag</label>
                <input
                  type="text"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  placeholder="30% discount on summer collections"
                  className="w-full bg-luxury-dark border border-white/10 rounded text-white p-2.5"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white text-luxury-dark font-bold text-xs tracking-widest uppercase hover:bg-luxury-gold hover:text-luxury-dark transition cursor-pointer"
              >
                Activate Coupon
              </button>
            </form>
          </div>

          {/* Right: List active coupons */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Active Promo Database</h4>
            
            <div className="bg-luxury-gray border border-white/5 rounded-md divide-y divide-white/5">
              {coupons.map((c) => (
                <div key={c.code} className="flex justify-between items-center p-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-white text-sm font-bold tracking-wider">{c.code}</span>
                      <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                        {c.discountPercent}% OFF
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">{c.description || 'No description tag provided'}</p>
                  </div>
                  
                  <button
                    onClick={() => dispatch(deleteCoupon(c.code))}
                    className="p-1.5 text-gray-500 hover:text-luxury-red transition hover:bg-white/5 rounded"
                    title="Revoke code"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: REVIEW MODERATOR --- */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white">Client Review Moderation</h3>
          
          {pendingReviews.length === 0 ? (
            <p className="text-gray-400 text-xs italic p-4 text-center border border-dashed border-white/10 rounded">All submitted reviews have been moderated. No pending queue.</p>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map((item) => (
                <div key={item.review.id} className="bg-luxury-gray border border-white/5 p-5 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-xs font-semibold">{item.review.userName}</span>
                      <span className="text-[10px] text-gray-500">on {item.productName}</span>
                    </div>
                    
                    <div className="flex text-luxury-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={10} 
                          fill={i < item.review.rating ? "var(--color-luxury-gold)" : "none"} 
                          className="stroke-1"
                        />
                      ))}
                    </div>

                    <p className="text-gray-300 text-xs font-light leading-relaxed max-w-xl">"{item.review.comment}"</p>
                  </div>

                  <div className="flex space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleReviewStatus(item.productId, item.review.id, 'approved')}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <Check size={12} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReviewStatus(item.productId, item.review.id, 'hidden')}
                      className="px-3 py-1.5 bg-transparent border border-white/10 hover:border-luxury-red hover:text-luxury-red text-[10px] font-bold uppercase tracking-wider rounded flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <X size={12} />
                      <span>Hide</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
