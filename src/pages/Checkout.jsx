import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { placeOrder } from '../store/slices/watchSlice';
import confetti from 'canvas-confetti';
import { CheckCircle2, CreditCard, Landmark, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Checkout({ params, onPageChange }) {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.watch.cart);
  const products = useSelector(state => state.watch.products);
  const currentUser = useSelector(state => state.watch.currentUser);
  
  const appliedCoupon = params?.appliedCoupon || null;

  // Form states
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [shippingForm, setShippingForm] = useState({
    fullName: currentUser?.name || '',
    streetAddress: currentUser?.shippingAddress?.streetAddress || '',
    city: currentUser?.shippingAddress?.city || '',
    zipCode: currentUser?.shippingAddress?.postalCode || '',
    country: currentUser?.shippingAddress?.country || 'United States'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card'); // card | upi
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: currentUser?.name || ''
  });

  const [orderReceipt, setOrderReceipt] = useState(null);

  // Sync shipping details once current user profile is fetched/loaded
  useEffect(() => {
    if (currentUser) {
      setShippingForm(prev => ({
        ...prev,
        fullName: prev.fullName || currentUser.name || '',
        streetAddress: prev.streetAddress || currentUser.shippingAddress?.streetAddress || '',
        city: prev.city || currentUser.shippingAddress?.city || '',
        zipCode: prev.zipCode || currentUser.shippingAddress?.postalCode || '',
        country: (prev.country === 'United States' || !prev.country) && currentUser.shippingAddress?.country 
          ? currentUser.shippingAddress.country 
          : prev.country
      }));
      setCardForm(prev => ({
        ...prev,
        cardName: prev.cardName || currentUser.name || ''
      }));
    }
  }, [currentUser]);

  // Compute prices
  const cartItemsWithDetails = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product !== undefined);

  const subtotal = cartItemsWithDetails.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discountPercent / 100)) : 0;
  const total = subtotal - discount;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingForm.fullName || !shippingForm.streetAddress || !shippingForm.city || !shippingForm.zipCode) {
      alert('Please fill out all shipping details.');
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      if (!cardForm.cardNumber || !cardForm.expiry || !cardForm.cvv || !cardForm.cardName) {
        alert('Please complete credit card details.');
        return;
      }
    }

    // Call Redux dispatcher to place the order
    const result = dispatch(placeOrder(
      shippingForm,
      { method: paymentMethod, cardNumber: cardForm.cardNumber || 'UPI' },
      appliedCoupon
    ));

    if (result.success) {
      setOrderReceipt(result.order);
      setStep(3);
      
      // Fire confetti celebration!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#c5a880', '#e10600', '#ffffff', '#1e293b']
      });
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Checkout Progress Stepper */}
      <div className="flex items-center justify-center space-x-4 border-b border-white/5 pb-6">
        <div className="flex items-center space-x-2">
          <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 1 ? 'bg-luxury-gold text-luxury-dark' : 'bg-luxury-gray text-gray-500'
          }`}>1</span>
          <span className={`text-xs font-bold tracking-wider uppercase ${step >= 1 ? 'text-white' : 'text-gray-500'}`}>Shipping</span>
        </div>
        <div className="w-12 h-[1px] bg-white/10" />
        <div className="flex items-center space-x-2">
          <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 2 ? 'bg-luxury-gold text-luxury-dark' : 'bg-luxury-gray text-gray-500'
          }`}>2</span>
          <span className={`text-xs font-bold tracking-wider uppercase ${step >= 2 ? 'text-white' : 'text-gray-500'}`}>Payment</span>
        </div>
        <div className="w-12 h-[1px] bg-white/10" />
        <div className="flex items-center space-x-2">
          <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
            step === 3 ? 'bg-luxury-gold text-luxury-dark' : 'bg-luxury-gray text-gray-500'
          }`}>3</span>
          <span className={`text-xs font-bold tracking-wider uppercase ${step === 3 ? 'text-white' : 'text-gray-500'}`}>Receipt</span>
        </div>
      </div>

      {/* Step 1: Shipping Address Form */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-7 bg-luxury-gray border border-white/5 p-6 sm:p-8 rounded-md space-y-6">
            <h2 className="text-sm font-bold tracking-widest text-white uppercase border-b border-white/5 pb-3">Delivery Information</h2>
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={shippingForm.fullName}
                  onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-3 focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingForm.streetAddress}
                  onChange={(e) => setShippingForm({ ...shippingForm, streetAddress: e.target.value })}
                  placeholder="120 Luxury Avenue, Suite 4B"
                  className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-3 focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">City</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    placeholder="New York"
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-3 focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.zipCode}
                    onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                    placeholder="10001"
                    className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-3 focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Country</label>
                <select
                  value={shippingForm.country}
                  onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                  className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-3 focus:outline-none focus:border-luxury-gold"
                >
                  <option value="United States">United States</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="India">India</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-white text-luxury-dark font-bold text-xs tracking-widest uppercase hover:bg-luxury-gold hover:text-luxury-dark transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Continue to Payment</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-5 space-y-6">
            <CheckoutSummary cartItems={cartItemsWithDetails} subtotal={subtotal} discount={discount} total={total} />
          </div>
        </div>
      )}

      {/* Step 2: Payment Method Form */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Payment Details */}
          <div className="lg:col-span-7 bg-luxury-gray border border-white/5 p-6 sm:p-8 rounded-md space-y-6">
            <h2 className="text-sm font-bold tracking-widest text-white uppercase border-b border-white/5 pb-3">Payment Portal</h2>
            
            {/* Toggle Payment Method */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3.5 rounded border text-xs font-bold uppercase flex flex-col items-center justify-center space-y-2 cursor-pointer transition ${
                  paymentMethod === 'card' 
                    ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold' 
                    : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <CreditCard size={18} />
                <span>Credit Card</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-3.5 rounded border text-xs font-bold uppercase flex flex-col items-center justify-center space-y-2 cursor-pointer transition ${
                  paymentMethod === 'upi' 
                    ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold' 
                    : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <Landmark size={18} />
                <span>UPI / QR Scan</span>
              </button>
            </div>

            {/* Methods forms */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardForm.cardName}
                      onChange={(e) => setCardForm({ ...cardForm, cardName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-3 focus:outline-none focus:border-luxury-gold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength="16"
                      value={cardForm.cardNumber}
                      onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                      placeholder="4111222233334444"
                      className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-3 focus:outline-none focus:border-luxury-gold font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Expiry Date</label>
                      <input
                        type="text"
                        required
                        maxLength="5"
                        value={cardForm.expiry}
                        onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                        placeholder="MM/YY"
                        className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-3 focus:outline-none focus:border-luxury-gold font-mono"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength="3"
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                        placeholder="***"
                        className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-3 focus:outline-none focus:border-luxury-gold font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-white/5 rounded-md p-6 bg-luxury-dark text-center space-y-4">
                  <span className="bg-white/5 border border-white/10 text-[9px] font-bold text-gray-300 px-3 py-1.5 tracking-widest uppercase rounded">
                    UPI Instant Transfer
                  </span>
                  <p className="text-gray-400 text-xs max-w-sm mx-auto font-light leading-relaxed">
                    Upon clicking place order, scan the generated gateway QR code on your mobile device to complete payment.
                  </p>
                  
                  {/* Mock QR Code */}
                  <div className="h-40 w-40 bg-white border border-luxury-gold/50 mx-auto rounded p-2 flex items-center justify-center shadow-lg relative">
                    <div className="h-36 w-36 bg-contain bg-center opacity-90" style={{ backgroundImage: "url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=zenithwatches@bank')" }} />
                  </div>
                  <span className="text-[9px] font-mono text-gray-500 uppercase">PAYEE: ZENITHWATCHES@BANK</span>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-4 px-6 border border-white/10 text-white font-bold text-xs tracking-widest uppercase hover:border-white transition w-1/3 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-luxury-red hover:bg-red-700 text-white font-bold text-xs tracking-widest uppercase transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  <span>Authorize Order</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-5 space-y-6">
            <CheckoutSummary cartItems={cartItemsWithDetails} subtotal={subtotal} discount={discount} total={total} />
          </div>
        </div>
      )}

      {/* Step 3: Success Screen */}
      {step === 3 && orderReceipt && (
        <div className="bg-luxury-gray border border-white/5 rounded-md p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-8">
          
          <div className="h-20 w-20 rounded-full bg-emerald-400/10 border border-emerald-400/35 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 size={40} />
          </div>

          <div className="space-y-3">
            <span className="text-luxury-gold text-xs font-bold tracking-widest uppercase">CONGRATULATIONS</span>
            <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-wider">Timepiece Secured</h1>
            <p className="text-gray-300 text-xs sm:text-sm max-w-md mx-auto font-light leading-relaxed">
              Your transaction has authorized. A secure courier tracking link and digital certificate of authenticity have been sent to your email.
            </p>
          </div>

          {/* Receipt details */}
          <div className="bg-luxury-dark/40 border border-white/5 p-6 rounded text-left text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-gray-400 uppercase tracking-widest font-bold text-[10px]">Order Reference</span>
              <span className="text-white font-bold text-sm tracking-wide font-mono">{orderReceipt.id}</span>
            </div>
            
            <div className="space-y-2">
              {orderReceipt.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-gray-300">
                  <span className="line-clamp-1">{item.name} (x{item.quantity})</span>
                  <span className="font-semibold text-white">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-3 flex justify-between items-center font-bold text-white">
              <span className="uppercase tracking-widest text-[10px] text-gray-400">Total Charged</span>
              <span className="text-sm font-extrabold text-luxury-gold">${orderReceipt.total.toLocaleString()}</span>
            </div>

            <div className="border-t border-white/5 pt-3 space-y-1 font-light text-gray-400">
              <p><span className="font-semibold text-white">Deliver to:</span> {orderReceipt.shippingDetails.fullName}</p>
              <p><span className="font-semibold text-white">Address:</span> {orderReceipt.shippingDetails.streetAddress}, {orderReceipt.shippingDetails.city}, {orderReceipt.shippingDetails.zipCode}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => onPageChange('profile', { tab: 'orders' })}
              className="py-3.5 bg-luxury-gold text-luxury-dark font-bold text-xs tracking-widest uppercase hover:bg-luxury-gold-dark transition cursor-pointer"
            >
              Track My Order
            </button>
            <button
              onClick={() => onPageChange('home')}
              className="py-3.5 bg-transparent border border-white/10 text-white font-semibold text-xs tracking-widest uppercase hover:border-white transition cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Sub-component for Order Summary
function CheckoutSummary({ cartItems, subtotal, discount, total }) {
  return (
    <div className="bg-luxury-gray border border-white/5 rounded-md p-6 space-y-4">
      <h3 className="text-xs font-bold tracking-widest text-white uppercase border-b border-white/5 pb-3">Bag Review</h3>
      
      {/* Items list */}
      <div className="space-y-4 max-h-60 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.productId} className="flex items-center space-x-3 pb-3 border-b border-white/5 last:border-b-0 last:pb-0">
            <div className="h-12 w-12 bg-luxury-dark rounded border border-white/5 flex-shrink-0 flex items-center justify-center p-1">
              <img src={item.product.image} alt={item.product.name} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-xs font-semibold truncate uppercase tracking-wide">{item.product.name}</h4>
              <p className="text-[10px] text-gray-500">Qty: {item.quantity} × ${item.product.price.toLocaleString()}</p>
            </div>
            <span className="text-white text-xs font-bold">${(item.product.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-white/5 pt-4 space-y-2 text-xs">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-400">
            <span>Coupon Discount</span>
            <span>-${discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-300">
          <span>Courier Delivery</span>
          <span className="text-emerald-400 uppercase tracking-widest text-[9px] font-bold">Free</span>
        </div>
        <div className="flex justify-between items-center text-sm font-bold text-white border-t border-white/5 pt-3">
          <span className="uppercase tracking-widest text-[10px]">Grand Total</span>
          <span className="text-base text-luxury-gold font-extrabold">${total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
