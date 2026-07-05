import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
  animate,
  useScroll,
} from 'framer-motion';
import { Star, Award, ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────────────────── */
function AnimatedCounter({ value, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const n = parseFloat(value.replace(/[^0-9.]/g, ''));
    const c = animate(0, n, {
      duration, ease: 'easeOut',
      onUpdate(v) { setDisplay(Number.isInteger(n) ? Math.round(v) : v.toFixed(1)); },
    });
    return c.stop;
  }, [inView, value, duration]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────────────────
   FLOATING PARTICLE
───────────────────────────────────────────────────────────────────── */
function FloatingParticle({ style }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{ y: [0, -26, 0], x: [0, 10, -7, 0], opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
      transition={{ duration: style.dur || 6, repeat: Infinity, ease: 'easeInOut', delay: style.del || 0 }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, dir = 'up', distance = 48, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const variants = {
    up:    { hidden: { opacity: 0, y: distance },  visible: { opacity: 1, y: 0 } },
    down:  { hidden: { opacity: 0, y: -distance }, visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: distance },  visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: -distance }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.80 },  visible: { opacity: 1, scale: 1 } },
    flip:  { hidden: { opacity: 0, rotateX: 55 },  visible: { opacity: 1, rotateX: 0 } },
  };
  return (
    <motion.div ref={ref} variants={variants[dir]} initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   CLIP-SLIDE TEXT REVEAL
───────────────────────────────────────────────────────────────────── */
function SlideReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ y: '105%' }}
        animate={inView ? { y: '0%' } : { y: '105%' }}
        transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────────────────────────────── */
function MagBtn({ children, className, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 20 });
  const sy = useSpring(y, { stiffness: 280, damping: 20 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.4);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  return (
    <motion.button ref={ref} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy }} whileTap={{ scale: 0.94 }}
      className={className} onClick={onClick}>{children}</motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   MARQUEE
───────────────────────────────────────────────────────────────────── */
function Marquee({ items, speed = 20, reverse = false }) {
  return (
    <div className="overflow-hidden py-4 border-y border-luxury-text/8 bg-white/70 backdrop-blur-sm select-none">
      <motion.div className="flex gap-14 whitespace-nowrap"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-[11px] font-bold tracking-[0.22em] uppercase text-luxury-muted flex items-center gap-3">
            <Star size={7} fill="currentColor" className="text-luxury-gold" />{item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   GENDER PANEL — full mouse-tracking parallax inside the card
───────────────────────────────────────────────────────────────────── */
function GenderPanel({ label, img, gender, delay, accent, onPageChange }) {
  const panelRef = useRef(null);

  /* Raw mouse position -1..1 relative to panel */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const [hovered, setHovered] = useState(false);

  /* Spring config — ultra‑smooth glide */
  const cfg = { stiffness: 30, damping: 30, mass: 1.2 };
  const smx = useSpring(mx, cfg);
  const smy = useSpring(my, cfg);

  /* Image moves in the DIRECTION of mouse (follow) */
  const imgX = useTransform(smx, [-1, 1], ['-22px', '22px']);
  const imgY = useTransform(smy, [-1, 1], ['-14px', '14px']);

  /* Text lifts opposite — creates depth */
  const txtY = useTransform(smy, [-1, 1], ['8px', '-8px']);

  /* Overlay brightness reacts to horizontal position */
  const overlayOp = useTransform(smx, [-1, 1], [0.65, 0.5]);

  const handleMove = useCallback((e) => {
    const r = panelRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }, [mx, my]);

  const handleLeave = useCallback(() => {
    mx.set(0); my.set(0); setHovered(false);
  }, [mx, my]);

  return (
    <motion.div
      ref={panelRef}
      onClick={() => onPageChange('shop', { gender })}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      className="dark-panel relative h-[600px] overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
    >
      {/* ── Image — follows mouse direction ── */}
      <motion.div
        className="absolute inset-[-5%] bg-cover bg-center"
        style={{
          backgroundImage: `url('${img}')`,
          x: imgX,
          y: imgY,
        }}
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── Dark gradient overlay ── */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)',
          opacity: overlayOp,
        }}
      />

      {/* ── Colour tint wash — fades in on hover ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${accent}18 0%, transparent 60%)` }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.65 }}
      />

      {/* ── Shimmer sweep — fires once on enter ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.13) 50%, transparent 60%)',
        }}
        animate={hovered ? { x: ['−100%', '200%'] } : { x: '-100%' }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
      />

      {/* ── Text block — parallax lift ── */}
      <motion.div
        className="absolute bottom-0 left-0 w-full p-8 sm:p-12 space-y-4 z-10"
        style={{ y: txtY }}
      >
        <motion.h3
          className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide uppercase drop-shadow-xl"
          animate={{ y: hovered ? -4 : 0, letterSpacing: hovered ? '0.08em' : '0.05em' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {label}
        </motion.h3>

        <motion.div
          className="flex items-center gap-2 text-white text-xs font-bold tracking-widest uppercase overflow-hidden"
          animate={{ opacity: hovered ? 1 : 0.7, x: hovered ? 0 : -6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            onClick={(e) => { e.stopPropagation(); onPageChange('shop', { gender }); }}
            className="flex items-center gap-2 border-b pb-0.5 w-fit"
            style={{ borderColor: accent }}
            whileHover={{ gap: 14 }}
            transition={{ duration: 0.35 }}
          >
            Discover <ArrowRight size={12} />
          </motion.button>
        </motion.div>
      </motion.div>


    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   COLLECTION CARD — mouse-tracking tilt per card
───────────────────────────────────────────────────────────────────── */
function CollectionCard({ col, idx, onPageChange }) {
  const cardRef = useRef(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 300, damping: 25 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-10, 10]), { stiffness: 300, damping: 25 });
  const imgX = useTransform(useSpring(mx, { stiffness: 200, damping: 25 }), [-1, 1], ['-12px', '12px']);
  const imgY = useTransform(useSpring(my, { stiffness: 200, damping: 25 }), [-1, 1], ['-8px', '8px']);
  const [hov, setHov] = useState(false);

  const onMove = (e) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => { mx.set(0); my.set(0); setHov(false); };

  /* Each card: different enter animation */
  const enterAnims = [
    { hidden: { opacity: 0, x: -70, rotate: -4 }, visible: { opacity: 1, x: 0, rotate: 0 } },
    { hidden: { opacity: 0, y: 80, scale: 0.88 }, visible: { opacity: 1, y: 0, scale: 1 } },
    { hidden: { opacity: 0, x: 70, rotate: 4 },  visible: { opacity: 1, x: 0, rotate: 0 } },
  ];

  return (
    <motion.div
      ref={cardRef}
      onClick={() => onPageChange('shop', col.filter)}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      className="relative h-[780px] border border-luxury-text/10 rounded-xl overflow-hidden cursor-pointer flex flex-col justify-end p-10 sm:p-12 bg-white"
      variants={enterAnims[idx]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.85, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX: rx, rotateY: ry,
        transformStyle: 'preserve-3d',
        boxShadow: hov ? `0 30px 70px ${col.accent}30` : '0 4px 20px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.25s ease',
      }}
    >
      {/* Image — parallax inside card */}
      <motion.div className="absolute inset-[-5%] z-0" style={{ x: imgX, y: imgY }}>
        <motion.img
          src={col.image} alt={col.name}
          className="w-full h-full object-cover"
          animate={{ scale: hov ? 1.1 : 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-[1]" />

      {/* Accent bar from center */}
      <motion.div
        className="absolute top-0 h-[3px] z-20"
        style={{ background: col.accent, left: '50%', translateX: '-50%' }}
        animate={{ width: hov ? '100%' : '0%' }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Glint diagonal sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{ background: 'linear-gradient(110deg, transparent 38%, rgba(255,255,255,0.18) 50%, transparent 62%)' }}
        animate={hov ? { x: ['−120%', '220%'] } : { x: '-120%' }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />

      {/* Text area */}
      <div className="relative z-10 space-y-3" style={{ transform: 'translateZ(30px)' }}>
        <motion.span
          className="block text-[11px] font-extrabold tracking-[0.2em] uppercase"
          style={{ color: '#000000' }}
          animate={{ letterSpacing: hov ? '0.28em' : '0.2em' }}
          transition={{ duration: 0.2 }}
        >
          {col.tagline}
        </motion.span>
        <motion.h3
          className="text-3xl sm:text-4xl font-serif font-black uppercase"
          animate={{ color: hov ? '#1e40af' : '#000000', y: hov ? -3 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {col.name}
        </motion.h3>
        <p className="text-black text-sm font-medium leading-relaxed line-clamp-2">
          {col.desc}
        </p>
        <motion.div
          className="flex items-center gap-2 text-sm font-bold pt-1"
          style={{ color: '#000000' }}
          animate={{ x: hov ? 5 : 0, gap: hov ? 14 : 8 }}
          transition={{ duration: 0.18 }}
        >
          <span>DISCOVER</span><ArrowRight size={13} />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════════════ */
export default function Home({ onPageChange }) {
  const products = useSelector(state => state.watch.products);

  /* ── Hero unified parallax ── */
  const heroRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spr = { stiffness: 55, damping: 16, mass: 0.8 };
  const spX = useSpring(rawX, spr);
  const spY = useSpring(rawY, spr);

  /* ALL content moves together in the cursor direction */
  const contentX = useTransform(spX, [-1, 1], ['-22px', '22px']);
  const contentY = useTransform(spY, [-1, 1], ['-13px', '13px']);

  /* Video drifts opposite (depth layer) */
  const vidX = useTransform(spX, [-1, 1], ['14px', '-14px']);
  const vidY = useTransform(spY, [-1, 1], ['9px', '-9px']);

  /* Orb moves more opposite (furthest layer) */
  const orbX = useTransform(spX, [-1, 1], ['55px', '-55px']);
  const orbY = useTransform(spY, [-1, 1], ['32px', '-32px']);

  const { scrollY } = useScroll();
  const scrollFade = useTransform(scrollY, [0, 180], [1, 0]);

  const onMouseMove = useCallback((e) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set(((e.clientX - r.left) / r.width) * 2 - 1);
    rawY.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }, [rawX, rawY]);
  const onMouseLeave = useCallback(() => { rawX.set(0); rawY.set(0); }, [rawX, rawY]);

  // --- CAROUSEL SLIDER STATE & LOGIC ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - visibleCards);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (products.length <= visibleCards) return;
    const timer = setInterval(nextSlide, 1600);
    return () => clearInterval(timer);
  }, [nextSlide, visibleCards, products.length, currentIndex]);

  const featured = products;

  const collections = [
    { name: 'Khronomaster', image: '/assets/media__1782899491297.jpg', tagline: 'High-Frequency Chronographs', desc: 'Powered by the legendary El Primero caliber, blending historical authenticity with modern design.', filter: { category: 'Khronomaster' }, accent: '#34d399' },
    { name: 'Defy', image: '/assets/media__1782899491366.jpg', tagline: 'Futuristic Watchmaking', desc: 'Unmatched durability and architectural design built for the boundary-breakers.', filter: { category: 'Defy' }, accent: '#60a5fa' },
    { name: 'Elite & Heritage', image: '/assets/media__1782899491225.jpg', tagline: 'Timeless Swiss Classics', desc: 'Elegant profiles, vintage inspirations, and dress chronometers suited for any formal setting.', filter: { category: 'Heritage' }, accent: '#c5a880' },
  ];

  const marqueeA = ['Swiss Made Since 1865', 'El Primero Caliber', 'COSC Certified', 'Sapphire Crystal', '36,000 vph', 'In-House Movement'];
  const marqueeB = ['Water Resistant 200m', 'Limited Edition', 'Manufacture Movements', 'Chronometry Prize', 'Le Locle Switzerland', 'Precision Engineered'];
  const stats = [
    { raw: '36', suffix: 'K', label: 'vibrations/hour' },
    { raw: '100', suffix: '%', label: 'Swiss Made' },
    { raw: '2300', suffix: '+', label: 'Prizes Won' },
  ];

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <>
      {/* ══════════ HERO ══════════ */}
      <section
        ref={heroRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-[#1c1a17]"
        style={{ perspective: '1200px' }}
      >
        {/* Video — deepest layer, drifts opposite */}
        <motion.div className="absolute inset-0 z-0" style={{ x: vidX, y: vidY, scale: 1.06 }}>
          <video autoPlay loop muted playsInline className="object-cover w-full h-full brightness-[0.87]">
            <source src="/assets/background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/28" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)]" />
        </motion.div>

        {/* Ambient orb — furthest opposite */}
        <motion.div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none z-[2]"
          style={{ x: orbX, y: orbY, background: 'radial-gradient(circle,rgba(52,211,153,0.48) 0%,transparent 70%)', filter: 'blur(48px)' }}
          animate={{ opacity: [0.07, 0.16, 0.07], scale: [1, 1.14, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />

        {/* Particles */}
        {[
          { width: 4, height: 4, top: '18%', left: '14%', background: '#c5a880', dur: 5,   del: 0   },
          { width: 6, height: 6, top: '63%', left: '8%',  background: '#34d399', dur: 7,   del: 1   },
          { width: 3, height: 3, top: '77%', left: '78%', background: '#c5a880', dur: 6,   del: 2   },
          { width: 5, height: 5, top: '32%', left: '88%', background: '#6ee7b7', dur: 8,   del: 0.5 },
          { width: 4, height: 4, top: '68%', left: '52%', background: '#fff',    dur: 5.5, del: 1.5 },
          { width: 3, height: 3, top: '12%', left: '63%', background: '#c5a880', dur: 9,   del: 3   },
          { width: 5, height: 5, top: '44%', left: '30%', background: '#34d399', dur: 7.5, del: 2.5 },
        ].map((p, i) => <FloatingParticle key={i} style={p} />)}

        {/* ── ALL content as one unified block — follows cursor ── */}
        <motion.div
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-12 gap-8 items-center"
          style={{ x: contentX, y: contentY }}
        >
          <div className="col-span-1 sm:col-span-8 space-y-6 text-center sm:text-left">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} className="flex justify-center sm:justify-start">
              <motion.span className="inline-flex items-center gap-2 border border-luxury-gold/45 text-luxury-gold px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/45 backdrop-blur-sm"
                whileHover={{ scale: 1.05, borderColor: 'rgba(197,168,128,0.85)' }} transition={{ duration: 0.15 }}>
                <Star size={10} fill="var(--color-luxury-gold)" className="animate-spin" style={{ animationDuration: '6s' }} />
                THE SWISS WATCH MANUFACTURE SINCE 1865
              </motion.span>
            </motion.div>

            {/* Heading — both lines same depth */}
            <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.16, ease: [0.22, 1, 0.36, 1] }} className="select-none cursor-default">
              <div className="font-serif font-normal text-4xl sm:text-5xl md:text-7xl tracking-wider text-white uppercase leading-tight">
                Time to Reach
              </div>
              <div className="font-serif font-normal text-4xl sm:text-5xl md:text-7xl tracking-wider uppercase leading-tight mt-1">
                <span style={{
                  background: 'linear-gradient(135deg,#34d399 0%,#10b981 35%,#059669 62%,#6ee7b7 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 22px rgba(52,211,153,0.55)) drop-shadow(0 0 52px rgba(16,185,129,0.28))',
                  display: 'inline-block',
                }}>Your Star</span>
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.85, delay: 0.32 }}
              className="text-gray-200 text-sm sm:text-base max-w-xl font-light tracking-wide leading-relaxed">
              KHRONIQ exists to inspire those who strive towards their dreams, offering unmatched horological mastery and mechanical innovation.
            </motion.p>

            {/* Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.46 }}
              className="pt-4 flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-4">
              <MagBtn onClick={() => onPageChange('shop')}
                className="px-8 py-4 bg-luxury-gold-dark text-white text-xs font-bold tracking-widest uppercase hover:bg-luxury-gold transition-colors duration-150 w-full sm:w-auto cursor-pointer border border-luxury-gold-dark">
                Explore Timepieces
              </MagBtn>
              <MagBtn onClick={() => onPageChange('shop', { category: 'Khronomaster' })}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white/22 text-xs font-bold tracking-widest uppercase transition-colors duration-150 w-full sm:w-auto cursor-pointer">
                Khronomaster DNA
              </MagBtn>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div style={{ opacity: scrollFade }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20 pointer-events-none">
          <span className="text-white/40 text-[9px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown size={16} className="text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════ MARQUEE A ══════════ */}
      <Marquee items={marqueeA} speed={20} />

      {/* ══════════ GENDER SPLIT ══════════
          Each panel: mouse-tracking image parallax + reactive overlay + badge pop */}
      <section className="w-full overflow-hidden">
        <div className="text-center py-14 bg-white">
          <Reveal dir="down">
            <p className="text-[10px] text-luxury-gold-dark font-bold tracking-widest uppercase mb-3">CURATED FOR YOU</p>
          </Reveal>
          <SlideReveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-luxury-text tracking-wide uppercase">Shop By Gender</h2>
          </SlideReveal>
          <motion.div className="w-12 h-[2px] bg-luxury-gold-dark mx-auto mt-5"
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.28, ease: [0.22, 1, 0.36, 1] }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <GenderPanel label="Men's Watches"   img="/assets/men_watches_beach.jpg"   gender="men"   delay={0}    accent="#c5a880" onPageChange={onPageChange} />
          <GenderPanel label="Women's Watches" img="/assets/women_watches_beach.jpg" gender="women" delay={0.1}  accent="#34d399" onPageChange={onPageChange} />
        </div>
      </section>

      {/* ══════════ MARQUEE B (reverse) ══════════ */}
      <Marquee items={marqueeB} speed={18} reverse />

      {/* ══════════ SPOTLIGHT SECTION ══════════
          Left: headline + desc + discover link
          Right: large hero image
          Below: 2-up product image mini-grid */}
      <section className="w-full bg-white overflow-hidden">
        {/* Top half — editorial split */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Left — text */}
          <div className="flex flex-col justify-center px-10 sm:px-16 py-16 space-y-6 bg-white">
            <Reveal dir="left" delay={0}>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-luxury-gold-dark">Featured Collection</p>
            </Reveal>
            <SlideReveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-luxury-text leading-tight">
                Dive Deeper with the<br />
                <span className="text-luxury-gold-dark">Khronomaster</span> Professional
              </h2>
            </SlideReveal>
            <Reveal dir="left" delay={0.2}>
              <p className="text-luxury-muted text-sm leading-relaxed max-w-md">
                Engineered for extreme conditions, the Khronomaster Professional pushes boundaries with water resistance up to 600m and the legendary El Primero caliber. Built to inspire confidence at every depth.
              </p>
            </Reveal>
            <Reveal dir="left" delay={0.3}>
              <motion.button
                onClick={() => onPageChange('shop', { category: 'Khronomaster' })}
                className="flex items-center gap-2 text-xs font-black tracking-[0.22em] uppercase text-luxury-text border-b border-luxury-text pb-1 w-fit cursor-pointer"
                whileHover={{ gap: 16, color: '#b8975a', borderColor: '#b8975a' }}
                transition={{ duration: 0.25 }}
              >
                Discover <ArrowRight size={12} />
              </motion.button>
            </Reveal>
          </div>

          {/* Right — large hero image */}
          <div className="relative overflow-hidden min-h-[420px] lg:min-h-0">
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/assets/media__1782899491297.jpg')" }}
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.04 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent" />
          </div>
        </motion.div>

        {/* Bottom half — 2-up product mini grid */}
        <div className="grid grid-cols-2 border-t border-luxury-text/8">
          {[
            { img: '/assets/media__1782899491320.jpg', label: 'Khronomaster El Primero', sub: 'High-Beat Chronograph' },
            { img: '/assets/media__1782899491366.jpg', label: 'Defy Extreme', sub: 'Futuristic Architecture' },
          ].map(({ img, label, sub }, i) => (
            <motion.div
              key={i}
              onClick={() => onPageChange('shop')}
              className={`relative overflow-hidden cursor-pointer group h-[300px] ${
                i === 0 ? 'border-r border-luxury-text/8' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${img}')` }}
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-7 space-y-1">
                <motion.p
                  className="text-white font-serif text-xl font-bold"
                  initial={{ y: 8, opacity: 0.8 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >{label}</motion.p>
                <p className="text-white/60 text-xs tracking-widest uppercase">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ COLLECTIONS ══════════
          Each card: different enter anim + full 3-D mouse-track tilt + image parallax */}
      <section className="w-full px-4 sm:px-8 lg:px-12 pt-32 pb-24 space-y-14">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Reveal dir="flip">
            <p className="text-xs text-luxury-gold-dark font-black tracking-[0.22em] uppercase">The Pillars of KHRONIQ</p>
          </Reveal>
          <motion.div 
            className="w-20 h-[3px] bg-luxury-gold-dark mx-auto"
            initial={{ scaleX: 0 }} 
            whileInView={{ scaleX: 1 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col, idx) => (
            <CollectionCard key={idx} col={col} idx={idx} onPageChange={onPageChange} />
          ))}
        </div>
      </section>

      {/* ══════════ FULL-WIDTH SCROLLING TEXT BANNER ══════════ */}
      <div className="w-full overflow-hidden bg-[#0e0d0b] select-none" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Strip 1 — forward */}
        <motion.div
          className="flex items-center whitespace-nowrap py-5"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
              <span style={{ color: '#ffffff', fontFamily: 'Georgia, serif', letterSpacing: '0.18em' }} className="text-2xl sm:text-3xl font-bold uppercase mx-10 whitespace-nowrap shrink-0">
                EVERY KHRONIQ WATCH HAS A SOUL AND A STORY TO BE WORN.
              </span>
              <img
                src="/assets/media__1782899491297.jpg"
                alt="watch"
                className="h-10 w-10 object-cover rounded-full mx-4 opacity-80 shrink-0"
                style={{ filter: 'brightness(1.1) contrast(1.05)' }}
              />
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* ══════════ FEATURED PRODUCTS ══════════
          Stagger reveal + hover pop lift + 3-D tilt inside ProductCard */}
      <div className="space-y-10 pb-12">
        <section className="w-full py-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 px-4">
            <Reveal dir="up">
              <p className="text-xs text-luxury-gold-dark font-black tracking-[0.22em] uppercase">Signature Catalog</p>
            </Reveal>
            <SlideReveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-black font-serif text-luxury-text tracking-wide uppercase">Featured Masterpieces</h2>
            </SlideReveal>
            <motion.div className="w-16 h-[3px] bg-luxury-gold-dark mx-auto"
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25 }} />
          </div>

          <div className="relative w-full px-4 sm:px-16 lg:px-20">
            {/* Carousel Viewport */}
            <div className="overflow-hidden py-4 px-1">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: `calc(-${currentIndex * 100 / visibleCards}% - ${currentIndex * 24 / visibleCards}px)`
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              >
                {featured.map((product) => (
                  <div
                    key={product.id}
                    className="h-full transition duration-300"
                    style={{
                      width: `calc(${100 / visibleCards}% - ${24 * (visibleCards - 1) / visibleCards}px)`,
                      flexShrink: 0
                    }}
                  >
                    <ProductCard product={product} onPageChange={onPageChange} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            {featured.length > visibleCards && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-dark hover:border-luxury-gold transition duration-300 cursor-pointer shadow-lg"
                  aria-label="Previous timepiece"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-dark hover:border-luxury-gold transition duration-300 cursor-pointer shadow-lg"
                  aria-label="Next timepiece"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </section>

        {/* ══════════ SPLIT VIDEO SHOWCASE SECTION ══════════ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.section
            className="flex flex-col lg:flex-row gap-8 bg-white border border-luxury-text/5 rounded-xl overflow-hidden shadow-md items-center justify-between p-6 sm:p-10"
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Left Column: Text (takes remaining space) */}
            <div className="flex-1 flex flex-col items-center lg:items-start justify-center text-center lg:text-left p-6 space-y-4">
              <motion.div 
                className="cursor-default group inline-block"
                initial="initial"
                whileHover="hover"
              >
                <Reveal dir="left">
                  <motion.h2 
                    className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-black tracking-[0.2em] uppercase leading-tight"
                    variants={{
                      initial: { scale: 1, x: 0, color: '#000000' },
                      hover: { scale: 1.04, x: 8, color: '#c5a880' }
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    KHRONIQ<br />UPDATES
                  </motion.h2>
                </Reveal>
                <motion.div 
                  className="h-[3px] bg-luxury-gold mt-4"
                  variants={{
                    initial: { width: '0%', originX: 0 },
                    hover: { width: '100%', originX: 0 }
                  }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </motion.div>
            </div>

            {/* Right Column: Two Normal Videos side-by-side (adjusted to exact 720x1280 aspect ratio) */}
            <div className="flex flex-col sm:flex-row gap-0 w-full lg:w-auto flex-shrink-0 shadow-lg rounded-lg overflow-hidden">
              <div className="w-full sm:w-auto h-[600px] aspect-[720/1280] relative bg-transparent flex-shrink-0">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                >
                  <source src="/assets/quote_board.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="w-full sm:w-auto h-[600px] aspect-[720/1280] relative bg-transparent flex-shrink-0">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                >
                  <source src="/assets/luxury_details.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
}
