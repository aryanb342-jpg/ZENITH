import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Star, Award, Compass, ArrowRight } from 'lucide-react';

export default function Home({ onPageChange }) {
  const products = useSelector(state => state.watch.products);

  // Show first 5 products in the featured collection to match the 5-column layout
  const featuredProducts = products.slice(0, 5);

  const collections = [
    {
      name: 'Chronomaster',
      image: '/assets/media__1782899491297.jpg',
      tagline: 'High-Frequency Chronographs',
      desc: 'Powered by the legendary El Primero caliber, blending historical authenticity with modern design.',
      filter: { category: 'Chronomaster' }
    },
    {
      name: 'Defy',
      image: '/assets/media__1782899491366.jpg',
      tagline: 'Futuristic Watchmaking',
      desc: 'Unmatched durability and architectural design built for the boundary-breakers.',
      filter: { category: 'Defy' }
    },
    {
      name: 'Elite & Heritage',
      image: '/assets/media__1782899491225.jpg',
      tagline: 'Timeless Swiss Classics',
      desc: 'Elegant profiles, vintage inspirations, and dress chronometers suited for any formal setting.',
      filter: { category: 'Heritage' }
    }
  ];

  return (
    <div className="pb-12">

      {/* Hero Section - Excluded from light theme CSS overrides by using bg-[#1c1a17] */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#1c1a17] border-b border-white/5">
        {/* Fullscreen Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full filter brightness-95 contrast-100"
          >
            <source src="/assets/background.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
          {/* Subtle shading overlays */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 text-center sm:text-left px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
          <div className="col-span-1 sm:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center sm:justify-start"
            >
              <span className="flex items-center space-x-2 border border-luxury-gold/45 text-luxury-gold px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/40 backdrop-blur-sm">
                <Star size={10} fill="var(--color-luxury-gold)" className="animate-spin" style={{ animationDuration: '6s' }} />
                <span>THE SWISS WATCH MANUFACTURE SINCE 1865</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-sans font-black text-4xl sm:text-5xl md:text-7xl font-bold tracking-wider text-white leading-tight uppercase"
            >
              Time to Reach <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-yellow-400 to-luxury-gold">
                Your Star
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-200 text-sm sm:text-base max-w-xl font-light tracking-wide leading-relaxed"
            >
              Zenith exists to inspire those who strive towards their dreams, offering unmatched horological mastery and mechanical innovation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-4 flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-4"
            >
              <button
                onClick={() => onPageChange('shop')}
                className="px-8 py-4 bg-luxury-gold-dark text-white text-xs font-bold tracking-widest uppercase hover:bg-luxury-gold transition duration-300 w-full sm:w-auto cursor-pointer shadow-md shadow-luxury-gold-dark/20 border border-luxury-gold-dark"
              >
                Explore Timepieces
              </button>
              <button
                onClick={() => onPageChange('shop', { category: 'Chronomaster' })}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white hover:text-luxury-dark text-xs font-bold tracking-widest uppercase transition duration-300 w-full sm:w-auto cursor-pointer"
              >
                Chronomaster DNA
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Men & Women Category Split Banner (Full width edge-to-edge, half-half split, no spacing/borders) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full overflow-hidden border-b border-white/5 mt-8">
        {/* Women's Column */}
        <div 
          onClick={() => onPageChange('shop', { gender: 'women' })}
          className="group relative h-[700px] flex flex-col justify-end p-8 sm:p-12 overflow-hidden cursor-pointer bg-luxury-gray"
        >
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-[position:center_12%] group-hover:scale-105 transition-transform duration-[2000ms]" 
              style={{ backgroundImage: "url('/assets/women_watches.jpg')" }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/10 to-transparent" />
          </div>
          
          <div className="relative z-10 space-y-2 text-left">
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-text tracking-wide uppercase">Women's watches</h3>
            <button 
              onClick={(e) => { e.stopPropagation(); onPageChange('shop', { gender: 'women' }); }}
              className="text-luxury-text text-xs font-bold tracking-widest uppercase border-b-2 border-luxury-text pb-1 hover:text-luxury-gold hover:border-luxury-gold transition duration-300 w-fit inline-block"
            >
              Discover
            </button>
          </div>
        </div>

        {/* Men's Column */}
        <div 
          onClick={() => onPageChange('shop', { gender: 'men' })}
          className="group relative h-[700px] flex flex-col justify-end p-8 sm:p-12 overflow-hidden cursor-pointer bg-luxury-gray"
        >
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-[position:center_12%] group-hover:scale-105 transition-transform duration-[2000ms]" 
              style={{ backgroundImage: "url('/assets/men_watches.jpg')" }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/10 to-transparent" />
          </div>
          
          <div className="relative z-10 space-y-2 text-left">
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-text tracking-wide uppercase">Men's watches</h3>
            <button 
              onClick={(e) => { e.stopPropagation(); onPageChange('shop', { gender: 'men' }); }}
              className="text-luxury-text text-xs font-bold tracking-widest uppercase border-b-2 border-luxury-text pb-1 hover:text-luxury-gold hover:border-luxury-gold transition duration-300 w-fit inline-block"
            >
              Discover
            </button>
          </div>
        </div>
      </section>

      {/* Collections Highlight Banner (Full width edge-to-edge layout, matching Featured) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 pt-36 pb-24 bg-transparent space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-[10px] text-luxury-gold-dark font-bold tracking-widest uppercase">The Pillars of Zenith</p>
          <h2 className="text-3xl font-bold font-serif text-luxury-text tracking-wide uppercase">Explore Collections</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {collections.map((col, idx) => (
            <div
              key={idx}
              onClick={() => onPageChange('shop', col.filter)}
              className="group relative h-[550px] border border-luxury-text/10 rounded-md overflow-hidden cursor-pointer flex flex-col justify-end p-10 sm:p-12 bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Product Background Image */}
              <div className="absolute inset-0 z-0 opacity-100 transition duration-500 flex items-center justify-center p-0 bg-luxury-bg/30">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
              </div>

              {/* Text Area */}
              <div className="relative z-10 space-y-4">
                <span className="text-xs sm:text-sm text-black font-extrabold tracking-widest uppercase">{col.tagline}</span>
                <h3 className="text-3xl sm:text-4xl font-serif font-black text-black uppercase group-hover:text-luxury-gold-dark transition duration-200">{col.name}</h3>
                <p className="text-black text-sm sm:text-base font-semibold leading-relaxed line-clamp-2">{col.desc}</p>
                <div className="flex items-center space-x-2 text-black hover:text-luxury-gold-dark text-sm font-bold pt-2">
                  <span>DISCOVER</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collection Grid (Full width edge-to-edge layout, touching margins) */}
      <section className="w-full py-24 bg-transparent space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-[10px] text-luxury-gold-dark font-bold tracking-widest uppercase">Signature Catalog</p>
          <h2 className="text-3xl font-bold font-serif text-luxury-text tracking-wide uppercase">Featured Masterpieces</h2>
          <div className="w-12 h-[2px] bg-luxury-gold-dark mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full px-4 sm:px-8 lg:px-12">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPageChange={onPageChange}
            />
          ))}
        </div>
      </section>

      {/* Wrapping the rest of the home sections to align them beautifully */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 mt-24">

      {/* Brand Story & Manufacturing Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white border border-luxury-text/5 p-8 sm:p-16 rounded-md items-center shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center space-x-1.5 text-luxury-gold-dark">
            <Award size={18} />
            <span className="text-[10px] font-bold tracking-widest uppercase">GENUINE CRAFTSMANSHIP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-luxury-text leading-tight uppercase">
            A Manufacture of Precise Dreams
          </h2>
          <p className="text-luxury-muted text-xs sm:text-sm leading-relaxed font-light">
            Founded by Georges Favre-Jacot in Le Locle, Switzerland, Zenith consolidated all watchmaking trades under one roof—creating the first integrated Manufacture. Every chronograph wheel, balance spring, and casing reflects our unrelenting drive for precision.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-4 text-center">
            <div className="border-r border-luxury-text/10 space-y-1">
              <span className="text-2xl font-bold text-luxury-gold-dark">36K</span>
              <p className="text-[9px] text-luxury-muted uppercase tracking-widest">vibrations/hour</p>
            </div>
            <div className="border-r border-luxury-text/10 space-y-1">
              <span className="text-2xl font-bold text-luxury-gold-dark">100%</span>
              <p className="text-[9px] text-luxury-muted uppercase tracking-widest">Swiss Made</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-bold text-luxury-gold-dark">2,300+</span>
              <p className="text-[9px] text-luxury-muted uppercase tracking-widest">chronometry prizes</p>
            </div>
          </div>
        </div>

        <div className="h-96 bg-luxury-bg/50 border border-luxury-text/5 rounded-md overflow-hidden relative p-0">
          <Compass className="absolute text-luxury-gold-dark/5 w-80 h-80 -right-20 -bottom-20 rotate-12" />
          <img
            src="/assets/media__1782899491320.jpg"
            alt="Zenith Manufacturing"
            className="w-full h-full object-cover relative z-10"
          />
        </div>
      </section>

      </div> {/* Closing standard alignment container */}

    </div>
  );
}
