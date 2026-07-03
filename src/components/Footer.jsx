import React, { useState } from 'react';
import { Star, Mail, ShieldCheck } from 'lucide-react';

export default function Footer({ onPageChange }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#1c1a17] border-t border-white/10 pt-16 pb-12 mt-auto text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter / Brand Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-12 border-b border-white/10">
          {/* Logo & Manifesto */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Star className="text-white" size={24} fill="#ffffff" />
              <span className="font-serif text-2xl font-bold tracking-widest">KHRONIQ</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Since 1865, KHRONIQ has been inspiring individuals to pursue their dreams and make them come true against all odds. "Time to reach your star" is our guiding motto.
            </p>
          </div>

          {/* Guarantee Badges */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-300">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="text-luxury-gold" size={24} />
              <div>
                <h4 className="text-xs font-bold tracking-wider">SWISS GUARANTEE</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">3-Year International Warranty</p>
              </div>
            </div>
          </div>

          {/* Newsletter Input */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">Subscribe to the KHRONIQ Star Newsletter</h4>
            <p className="text-gray-400 text-[11px]">Receive updates on special collections, new arrivals, and events.</p>
            
            {subscribed ? (
              <p className="text-luxury-gold text-xs font-semibold animate-pulse">Thank you for subscribing to KHRONIQ notifications.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#292622] text-white text-xs px-4 py-3 w-full border border-white/10 border-r-0 focus:outline-none focus:border-luxury-gold"
                  required
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-luxury-gold text-black px-5 py-3 font-semibold text-xs tracking-widest uppercase transition-colors cursor-pointer"
                >
                  <Mail size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Col 1: Collections */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">Collections</h4>
            <ul className="space-y-2 text-[11px] text-gray-400">
              <li><button onClick={() => onPageChange('shop', { category: 'Khronomaster' })} className="hover:text-luxury-gold transition cursor-pointer">Khronomaster</button></li>
              <li><button onClick={() => onPageChange('shop', { category: 'Defy' })} className="hover:text-luxury-gold transition cursor-pointer">Defy</button></li>
              <li><button onClick={() => onPageChange('shop', { category: 'Heritage' })} className="hover:text-luxury-gold transition cursor-pointer">Heritage</button></li>
              <li><button onClick={() => onPageChange('shop', { category: 'Elite' })} className="hover:text-luxury-gold transition cursor-pointer">Elite</button></li>
            </ul>
          </div>

          {/* Col 2: Customer Service */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">Customer Care</h4>
            <ul className="space-y-2 text-[11px] text-gray-400 flex flex-col items-start">
              <li><button onClick={() => onPageChange('static', { view: 'contact' })} className="hover:text-luxury-gold transition cursor-pointer">Book an Appointment</button></li>
              <li><button onClick={() => onPageChange('profile', { tab: 'settings' })} className="hover:text-luxury-gold transition cursor-pointer">Register My Watch</button></li>
              <li><button onClick={() => onPageChange('static', { view: 'faq' })} className="hover:text-luxury-gold transition cursor-pointer">Shipping & Returns</button></li>
              <li><button onClick={() => onPageChange('static', { view: 'faq' })} className="hover:text-luxury-gold transition cursor-pointer">FAQ</button></li>
            </ul>
          </div>

          {/* Col 3: Brand */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">The Brand</h4>
            <ul className="space-y-2 text-[11px] text-gray-400 flex flex-col items-start">
              <li><button onClick={() => onPageChange('static', { view: 'about' })} className="hover:text-luxury-gold transition cursor-pointer">Our History</button></li>
              <li><button onClick={() => onPageChange('static', { view: 'about' })} className="hover:text-luxury-gold transition cursor-pointer">The Manufacture</button></li>
              <li><button onClick={() => onPageChange('static', { view: 'about' })} className="hover:text-luxury-gold transition cursor-pointer">Sustainability</button></li>
              <li><button onClick={() => onPageChange('static', { view: 'about' })} className="hover:text-luxury-gold transition cursor-pointer">News & Events</button></li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">Connect With Us</h4>
            <p className="text-[11px] text-gray-400">Contact: concierge@khroniq-watches.com</p>
            <div className="flex space-x-4 text-gray-400 pt-2">
              <a href="#" className="hover:text-luxury-gold transition" aria-label="Facebook">
                <svg className="w-[18px] h-[18px] hover:text-luxury-gold transition" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-luxury-gold transition" aria-label="Instagram">
                <svg className="w-[18px] h-[18px] hover:text-luxury-gold transition" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1 .046 1.637.208 2.07.377a4.78 4.78 0 0 1 1.7 1.1 4.78 4.78 0 0 1 1.1 1.7c.17.43.33.1.376 2.07.045.926.054 1.28.054 3.71s-.01 2.784-.054 3.71c-.046 1-.208 1.637-.377 2.07a4.78 4.78 0 0 1-1.1 1.7 4.78 4.78 0 0 1-1.7 1.1c-.43.17-1 .33-2.07.376-.926.045-1.28.054-3.71.054s-2.784-.01-3.71-.054c-1-.046-1.637-.208-2.07-.377a4.78 4.78 0 0 1-1.7-1.1 4.78 4.78 0 0 1-1.1-1.7c-.17-.43-.33-1-.376-2.07C2.01 14.784 2 14.43 2 12s.01-2.784.054-3.71c.046-1 .208-1.637.377-2.07a4.78 4.78 0 0 1 1.1-1.7 4.78 4.78 0 0 1 1.7-1.1c.43-.17 1-.33 2.07-.376.926-.045 1.28-.054 3.71-.054zm0 2.25c-2.4 0-2.71.01-3.66.053-.94.043-1.45.2-1.8.34a2.53 2.53 0 0 0-1.5 1.5c-.14.35-.3.86-.34 1.8-.043.95-.053 1.26-.053 3.66s.01 2.71.053 3.66c.043.94.2 1.45.34 1.8a2.53 2.53 0 0 0 1.5 1.5c.35.14.86.3 1.8.34.95.043 1.26.053 3.66.053s2.71-.01 3.66-.053c.94-.043 1.45-.2 1.8-.34a2.53 2.53 0 0 0 1.5-1.5c.14-.35.3-.86.34-1.8.043-.95.053-1.26.053-3.66s-.01-2.71-.053-3.66c-.043-.94-.2-1.45-.34-1.8a2.53 2.53 0 0 0-1.5-1.5c-.35-.14-.86-.3-1.8-.34-.95-.043-1.26-.053-3.66-.053zm0 3.75a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2.25a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zm5.75-2.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-luxury-gold transition" aria-label="Twitter / X">
                <svg className="w-[18px] h-[18px] hover:text-luxury-gold transition" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 space-y-4 md:space-y-0">
          <p>© 2026 KHRONIQ Watches. All Rights Reserved. Inspired by Swiss Precision.</p>
          <div className="flex space-x-6">
            <button onClick={() => onPageChange('static', { view: 'policies' })} className="hover:text-white transition cursor-pointer">Terms of Use</button>
            <button onClick={() => onPageChange('static', { view: 'policies' })} className="hover:text-white transition cursor-pointer">Privacy Policy</button>
            <button onClick={() => onPageChange('static', { view: 'policies' })} className="hover:text-white transition cursor-pointer">Cookie Preferences</button>
            <a href="#" className="hover:text-white transition">Accessibility</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
