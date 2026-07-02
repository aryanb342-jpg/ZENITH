import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Star, ShieldAlert, Key } from 'lucide-react';

export default function Login({ params, onPageChange }) {
  const { loginUser, registerUser, currentUser } = useContext(AppContext);
  const redirectPage = params?.redirect || 'profile';
  const appliedCoupon = params?.appliedCoupon || null;

  // States
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password || (isRegister && !name)) {
      setErrorMsg('Please complete all form inputs.');
      return;
    }

    if (isRegister) {
      registerUser(name, email, password);
      // Redirect
      if (redirectPage === 'checkout') {
        onPageChange('checkout', { appliedCoupon });
      } else {
        onPageChange('profile');
      }
    } else {
      const res = loginUser(email, password);
      if (res.success) {
        if (res.role === 'admin') {
          onPageChange('admin');
        } else if (redirectPage === 'checkout') {
          onPageChange('checkout', { appliedCoupon });
        } else if (redirectPage.startsWith('product-detail:')) {
          const pid = redirectPage.split(':')[1];
          onPageChange('product-detail', { id: pid });
        } else {
          onPageChange('profile');
        }
      } else {
        setErrorMsg('Invalid login combination.');
      }
    }
  };

  const handleAdminAutofill = () => {
    setEmail('admin@zenith.com');
    setPassword('admin123');
    setIsRegister(false);
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-8">
      
      {/* Brand Icon */}
      <div className="text-center space-y-2">
        <Star className="mx-auto text-luxury-gold animate-pulse" size={32} fill="var(--color-luxury-gold)" />
        <h1 className="font-serif text-2xl font-bold uppercase tracking-widest text-white">Security Gateway</h1>
        <p className="text-xs text-gray-400">Secure entry to the Zenith Horological Portal.</p>
      </div>

      {/* Login Box */}
      <div className="bg-luxury-gray border border-white/5 rounded-md p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Selector Tabs */}
        <div className="flex border-b border-white/5">
          <button
            onClick={() => { setIsRegister(false); setErrorMsg(''); }}
            className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition ${
              !isRegister ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Sign In
          </button>
          
          <button
            onClick={() => { setIsRegister(true); setErrorMsg(''); }}
            className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition ${
              isRegister ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-luxury-red/10 border border-luxury-red/30 rounded text-luxury-red text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name (Registration Only) */}
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Georges Favre-Jacot"
                className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-3 focus:outline-none focus:border-luxury-gold"
              />
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@domain.com"
              className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-3 focus:outline-none focus:border-luxury-gold"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-3 focus:outline-none focus:border-luxury-gold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-white text-luxury-dark font-bold text-xs tracking-widest uppercase hover:bg-luxury-gold hover:text-luxury-dark transition cursor-pointer"
          >
            {isRegister ? 'Create Account' : 'Authenticate Credentials'}
          </button>
        </form>

        {/* Admin Quick Autofill Option */}
        <div className="border-t border-white/5 pt-4 space-y-2">
          <div className="flex items-center space-x-1.5 text-luxury-gold">
            <ShieldAlert size={14} />
            <span className="text-[9px] font-bold tracking-widest uppercase">Admin quick access</span>
          </div>
          <p className="text-[10px] text-gray-500 font-light">
            Skip filling forms. Use the preset administrator account to test stock controls and invoice status togglers.
          </p>
          <button
            onClick={handleAdminAutofill}
            className="w-full py-2 bg-luxury-gray hover:bg-white/5 border border-white/10 text-white font-semibold text-[10px] tracking-wider uppercase transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Key size={10} />
            <span>Load Admin Credentials</span>
          </button>
        </div>

      </div>
    </div>
  );
}
