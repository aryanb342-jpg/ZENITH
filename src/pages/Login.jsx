import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../store/slices/watchSlice';
import { Star, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Login({ params, onPageChange }) {
  const dispatch = useDispatch();
  
  const redirectPage = params?.redirect || 'profile';
  const appliedCoupon = params?.appliedCoupon || null;

  // Mode state: 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState('login');
  
  // Forms states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Status states
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setForgotSuccess(false);

    if (authMode === 'forgot') {
      if (!email) {
        setErrorMsg('Please specify your registered email.');
        return;
      }
      // Mock sending reset link
      setForgotSuccess(true);
      setEmail('');
      return;
    }

    if (!email || !password || (authMode === 'register' && !name)) {
      setErrorMsg('Please complete all form inputs.');
      return;
    }

    if (authMode === 'register') {
      // Password complexity check
      const isStrong = password.length >= 8 &&
                       /[A-Z]/.test(password) &&
                       /[a-z]/.test(password) &&
                       /[!@#$%^&*(),.?":{}|<>\-_]/.test(password);

      if (!isStrong) {
        setShowPasswordPopup(true);
        return;
      }

      const res = await dispatch(registerUser(name, email, password));
      if (res.success) {
        // Auto-signed in on success, redirect
        if (redirectPage === 'checkout') {
          onPageChange('checkout', { appliedCoupon });
        } else {
          onPageChange('profile');
        }
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } else {
      const res = await dispatch(loginUser(email, password));
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
        setErrorMsg(res.message || 'Invalid login combination.');
      }
    }
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
        {authMode !== 'forgot' ? (
          <div className="flex border-b border-white/5">
            <button
              onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
              className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition ${
                authMode === 'login' ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Sign In
            </button>
            
            <button
              onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
              className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition ${
                authMode === 'register' ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Register
            </button>
          </div>
        ) : (
          <div className="border-b border-white/5 pb-3">
            <h2 className="text-xs font-bold text-luxury-gold uppercase tracking-wider text-center">Reset Credentials Key</h2>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-luxury-red/10 border border-luxury-red/30 rounded text-luxury-red text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {forgotSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs font-medium flex items-center space-x-1.5">
            <CheckCircle2 size={14} />
            <span>A secure credential reset key has been dispatched to your email inbox.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name (Registration Only) */}
          {authMode === 'register' && (
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

          {/* Email (Always Needed) */}
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

          {/* Password (Login & Register Only) */}
          {authMode !== 'forgot' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Password</label>
                <button
                  type="button"
                  onClick={() => { setAuthMode('forgot'); setErrorMsg(''); }}
                  className="text-[9px] text-luxury-gold hover:text-white transition uppercase font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-luxury-dark border border-white/10 rounded text-white text-xs p-3 focus:outline-none focus:border-luxury-gold"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-white text-luxury-dark font-bold text-xs tracking-widest uppercase hover:bg-luxury-gold hover:text-luxury-dark transition cursor-pointer"
          >
            {authMode === 'register' 
              ? 'Create Account' 
              : authMode === 'forgot'
              ? 'Request Reset Link'
              : 'Authenticate Credentials'
            }
          </button>

          {authMode === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                className="text-[10px] text-gray-400 hover:text-white transition uppercase font-semibold cursor-pointer"
              >
                Return to Sign In
              </button>
            </div>
          )}
        </form>


      </div>

      {/* Password Requirements Popup Modal */}
      {showPasswordPopup && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-luxury-gray border border-white/10 rounded-md p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center space-x-2 text-luxury-gold">
              <ShieldCheck size={20} />
              <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white">Password Requirements</h3>
            </div>
            
            <p className="text-[10px] text-gray-400 font-light">
              Your security is paramount. Please ensure your password meets all Zenith guidelines:
            </p>

            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center space-x-2">
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  password.length >= 8 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {password.length >= 8 ? '✓' : '✗'}
                </span>
                <span className={password.length >= 8 ? 'text-gray-200' : 'text-gray-500'}>
                  Minimum 8 characters
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  /[A-Z]/.test(password) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {/[A-Z]/.test(password) ? '✓' : '✗'}
                </span>
                <span className={/[A-Z]/.test(password) ? 'text-gray-200' : 'text-gray-500'}>
                  At least one uppercase letter (A-Z)
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  /[a-z]/.test(password) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {/[a-z]/.test(password) ? '✓' : '✗'}
                </span>
                <span className={/[a-z]/.test(password) ? 'text-gray-200' : 'text-gray-500'}>
                  At least one lowercase letter (a-z)
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  /[!@#$%^&*(),.?":{}|<>\-_]/.test(password) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {/[!@#$%^&*(),.?":{}|<>\-_]/.test(password) ? '✓' : '✗'}
                </span>
                <span className={/[!@#$%^&*(),.?":{}|<>\-_]/.test(password) ? 'text-gray-200' : 'text-gray-500'}>
                  At least one special character
                </span>
              </li>
            </ul>

            <button
              onClick={() => setShowPasswordPopup(false)}
              className="w-full mt-2 py-2.5 bg-white hover:bg-luxury-gold text-luxury-dark font-bold text-xs tracking-wider uppercase transition cursor-pointer"
            >
              Understand & Adjust
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
