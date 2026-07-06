import React, { useState, useEffect, useRef } from 'react';
import { Star, Mail, ShieldCheck, ArrowRight, Clock, Award, Gem } from 'lucide-react';

/* ─── tiny hook: fires once when element enters viewport ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const NAV_COLS = [
  {
    title: 'Collections',
    links: [
      { label: 'Khronomaster', page: 'shop', args: { category: 'Khronomaster' } },
      { label: 'Defy',         page: 'shop', args: { category: 'Defy' } },
      { label: 'Heritage',     page: 'shop', args: { category: 'Heritage' } },
      { label: 'Elite',        page: 'shop', args: { category: 'Elite' } },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Book an Appointment', page: 'static',  args: { view: 'contact' } },
      { label: 'Register My Watch',   page: 'profile', args: { tab: 'settings' } },
      { label: 'Shipping & Returns',  page: 'static',  args: { view: 'faq' } },
      { label: 'FAQ',                 page: 'static',  args: { view: 'faq' } },
    ],
  },
  {
    title: 'The Brand',
    links: [
      { label: 'Our History',    page: 'static', args: { view: 'about' } },
      { label: 'The Manufacture',page: 'static', args: { view: 'about' } },
      { label: 'Sustainability', page: 'static', args: { view: 'about' } },
      { label: 'News & Events',  page: 'static', args: { view: 'about' } },
    ],
  },
];

const BADGES = [
  { icon: ShieldCheck, label: 'Swiss Guarantee',   sub: '3-Year International Warranty' },
  { icon: Award,       label: 'Master Craftsmanship', sub: 'Hand-finished movements' },
  { icon: Gem,         label: 'Certified Authentic', sub: 'Original Swiss components' },
];

const SOCIALS = [
  {
    label: 'Facebook',
    href: '#',
    path: 'M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z',
    rule: 'evenodd',
  },
  {
    label: 'Instagram',
    href: '#',
    path: 'M12.315 2c2.43 0 2.784.01 3.71.054 1 .046 1.637.208 2.07.377a4.78 4.78 0 0 1 1.7 1.1 4.78 4.78 0 0 1 1.1 1.7c.17.43.33 1 .376 2.07.045.926.054 1.28.054 3.71s-.01 2.784-.054 3.71c-.046 1-.208 1.637-.377 2.07a4.78 4.78 0 0 1-1.1 1.7 4.78 4.78 0 0 1-1.7 1.1c-.43.17-1 .33-2.07.376-.926.045-1.28.054-3.71.054s-2.784-.01-3.71-.054c-1-.046-1.637-.208-2.07-.377a4.78 4.78 0 0 1-1.7-1.1 4.78 4.78 0 0 1-1.1-1.7c-.17-.43-.33-1-.376-2.07C2.01 14.784 2 14.43 2 12s.01-2.784.054-3.71c.046-1 .208-1.637.377-2.07a4.78 4.78 0 0 1 1.1-1.7 4.78 4.78 0 0 1 1.7-1.1c.43-.17 1-.33 2.07-.376.926-.045 1.28-.054 3.71-.054zm0 2.25c-2.4 0-2.71.01-3.66.053-.94.043-1.45.2-1.8.34a2.53 2.53 0 0 0-1.5 1.5c-.14.35-.3.86-.34 1.8-.043.95-.053 1.26-.053 3.66s.01 2.71.053 3.66c.043.94.2 1.45.34 1.8a2.53 2.53 0 0 0 1.5 1.5c.35.14.86.3 1.8.34.95.043 1.26.053 3.66.053s2.71-.01 3.66-.053c.94-.043 1.45-.2 1.8-.34a2.53 2.53 0 0 0 1.5-1.5c.14-.35.3-.86.34-1.8.043-.95.053-1.26.053-3.66s-.01-2.71-.053-3.66c-.043-.94-.2-1.45-.34-1.8a2.53 2.53 0 0 0-1.5-1.5c-.35-.14-.86-.3-1.8-.34-.95-.043-1.26-.053-3.66-.053zm0 3.75a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2.25a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zm5.75-2.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z',
    rule: 'evenodd',
  },
  {
    label: 'X / Twitter',
    href: '#',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    rule: null,
  },
];

/* ─────────────────────────────────────────────────────────── */
export default function Footer({ onPageChange }) {
  const [email, setEmail]           = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [heroRef, heroVisible]      = useInView(0.1);
  const [bodyRef, bodyVisible]      = useInView(0.05);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer style={{ background: 'linear-gradient(170deg, #0f0e0c 0%, #171410 55%, #1c1916 100%)' }}
            className="relative mt-auto overflow-hidden text-gray-300">

      {/* ── Ambient glow orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{
          position:'absolute', top:'-120px', left:'10%',
          width:'500px', height:'500px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(197,168,128,0.07) 0%, transparent 70%)',
        }} />
        <div style={{
          position:'absolute', bottom:'-80px', right:'5%',
          width:'420px', height:'420px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(197,168,128,0.05) 0%, transparent 70%)',
        }} />
      </div>

      {/* ══════════════════════════════════════════════════════
          MANIFESTO BAND
      ══════════════════════════════════════════════════════ */}
      <div ref={heroRef}
           style={{ borderBottom: '1px solid rgba(197,168,128,0.15)' }}
           className="relative">

        {/* thin gold top-border accent */}
        <div style={{
          height:'2px',
          background:'linear-gradient(90deg, transparent 0%, #c5a880 30%, #e8d5a3 50%, #c5a880 70%, transparent 100%)',
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left – Brand statement */}
            <div style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.9s ease, transform 0.9s ease',
            }}>
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-8">
                <div style={{
                  width:'38px', height:'38px', borderRadius:'50%',
                  border:'1.5px solid #c5a880',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <Star size={18} style={{ color:'#c5a880' }} fill="#c5a880" />
                </div>
                <span style={{
                  fontFamily:"'Playfair Display', Georgia, serif",
                  fontSize:'1.6rem', fontWeight:700,
                  letterSpacing:'0.22em', color:'#ffffff',
                }}>KHRONIQ</span>
              </div>

              {/* Divider */}
              <div style={{ width:'48px', height:'1.5px', background:'#c5a880', marginBottom:'1.5rem' }} />

              {/* Manifesto headline */}
              <h2 style={{
                fontFamily:"'Playfair Display', Georgia, serif",
                fontSize:'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight:600, lineHeight:1.25, color:'#ffffff',
                marginBottom:'1.25rem',
              }}>
                Time is the only<br />
                <span style={{
                  background:'linear-gradient(90deg, #c5a880, #e8d5a3, #c5a880)',
                  backgroundSize:'200% auto',
                  WebkitBackgroundClip:'text',
                  WebkitTextFillColor:'transparent',
                  backgroundClip:'text',
                  animation:'shimmer 3s linear infinite',
                }}>luxury that matters.</span>
              </h2>

              <p style={{ fontSize:'0.82rem', lineHeight:1.85, color:'rgba(200,190,175,0.65)', maxWidth:'420px' }}>
                Since 1865, KHRONIQ has been crafting exceptional timepieces for those who dare to dream.
                Every second counts — make it extraordinary.
              </p>

              {/* Badges row */}
              <div className="flex flex-wrap gap-6 mt-10">
                {BADGES.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center space-x-3 group" style={{ cursor:'default' }}>
                    <div style={{
                      width:'36px', height:'36px', borderRadius:'50%',
                      border:'1px solid rgba(197,168,128,0.3)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'border-color 0.3s, background 0.3s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='#c5a880'; e.currentTarget.style.background='rgba(197,168,128,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(197,168,128,0.3)'; e.currentTarget.style.background='transparent'; }}>
                      <Icon size={15} style={{ color:'#c5a880' }} />
                    </div>
                    <div>
                      <p style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', color:'#ffffff', textTransform:'uppercase' }}>{label}</p>
                      <p style={{ fontSize:'0.6rem', color:'rgba(197,168,128,0.55)', marginTop:'1px' }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right – Newsletter CTA */}
            <div style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
            }}>
              <div style={{
                background:'rgba(255,255,255,0.025)',
                border:'1px solid rgba(197,168,128,0.2)',
                borderRadius:'2px',
                padding:'2.5rem',
                backdropFilter:'blur(8px)',
                position:'relative',
                overflow:'hidden',
              }}>
                {/* corner accents */}
                {[
                  { top:0, left:0, borderTop:'1.5px solid #c5a880', borderLeft:'1.5px solid #c5a880' },
                  { top:0, right:0, borderTop:'1.5px solid #c5a880', borderRight:'1.5px solid #c5a880' },
                  { bottom:0, left:0, borderBottom:'1.5px solid #c5a880', borderLeft:'1.5px solid #c5a880' },
                  { bottom:0, right:0, borderBottom:'1.5px solid #c5a880', borderRight:'1.5px solid #c5a880' },
                ].map((s, i) => (
                  <div key={i} style={{ position:'absolute', width:'18px', height:'18px', ...s }} />
                ))}

                <p style={{
                  fontSize:'0.6rem', letterSpacing:'0.25em', textTransform:'uppercase',
                  color:'#c5a880', fontWeight:700, marginBottom:'0.6rem',
                }}>Exclusive Access</p>

                <h3 style={{
                  fontFamily:"'Playfair Display', Georgia, serif",
                  fontSize:'1.55rem', fontWeight:600, color:'#ffffff',
                  lineHeight:1.3, marginBottom:'0.8rem',
                }}>
                  Join the KHRONIQ<br />Inner Circle
                </h3>

                <p style={{ fontSize:'0.75rem', color:'rgba(200,190,175,0.6)', lineHeight:1.75, marginBottom:'1.75rem' }}>
                  Be the first to discover new collections, private events,
                  and exclusive offers reserved for true connoisseurs of fine watchmaking.
                </p>

                {subscribed ? (
                  <div style={{
                    padding:'1rem 1.5rem',
                    background:'rgba(197,168,128,0.1)',
                    border:'1px solid rgba(197,168,128,0.35)',
                    borderRadius:'2px',
                    textAlign:'center',
                  }}>
                    <Star size={18} style={{ color:'#c5a880', margin:'0 auto 0.5rem' }} fill="#c5a880" />
                    <p style={{ fontSize:'0.75rem', color:'#c5a880', fontWeight:600, letterSpacing:'0.05em' }}>
                      Welcome to the Inner Circle.
                    </p>
                    <p style={{ fontSize:'0.65rem', color:'rgba(197,168,128,0.6)', marginTop:'0.3rem' }}>
                      Expect something extraordinary soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe}>
                    <div style={{ position:'relative', marginBottom:'0.75rem' }}>
                      <Mail size={14} style={{
                        position:'absolute', left:'14px', top:'50%',
                        transform:'translateY(-50%)', color:'rgba(197,168,128,0.5)',
                        pointerEvents:'none',
                      }} />
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{
                          width:'100%', boxSizing:'border-box',
                          background:'rgba(255,255,255,0.04)',
                          border:'1px solid rgba(197,168,128,0.2)',
                          borderRadius:'2px',
                          padding:'0.85rem 1rem 0.85rem 2.5rem',
                          fontSize:'0.75rem',
                          color:'#ffffff',
                          outline:'none',
                          transition:'border-color 0.3s',
                        }}
                        onFocus={e => { e.target.style.borderColor='#c5a880'; e.target.style.background='rgba(197,168,128,0.05)'; }}
                        onBlur={e => { e.target.style.borderColor='rgba(197,168,128,0.2)'; e.target.style.background='rgba(255,255,255,0.04)'; }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="group"
                      style={{
                        width:'100%',
                        background:'linear-gradient(135deg, #c5a880 0%, #a68a60 100%)',
                        border:'none',
                        borderRadius:'2px',
                        padding:'0.9rem',
                        color:'#0f0e0c',
                        fontSize:'0.7rem',
                        fontWeight:700,
                        letterSpacing:'0.2em',
                        textTransform:'uppercase',
                        cursor:'pointer',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        gap:'8px',
                        transition:'opacity 0.3s, transform 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.opacity='0.88'; e.currentTarget.style.transform='translateY(-1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='translateY(0)'; }}
                    >
                      Subscribe Now <ArrowRight size={13} />
                    </button>
                    <p style={{ fontSize:'0.6rem', color:'rgba(197,168,128,0.4)', textAlign:'center', marginTop:'0.65rem' }}>
                      No spam, ever. Unsubscribe at any time.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          NAVIGATION COLUMNS
      ══════════════════════════════════════════════════════ */}
      <div ref={bodyRef}
           className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
           style={{ borderBottom: '1px solid rgba(197,168,128,0.1)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14">

          {NAV_COLS.map(({ title, links }, ci) => (
            <div key={title} style={{
              opacity: bodyVisible ? 1 : 0,
              transform: bodyVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.7s ease ${ci * 0.12}s, transform 0.7s ease ${ci * 0.12}s`,
            }}>
              {/* Column heading with gold underline */}
              <div style={{ marginBottom:'1.25rem' }}>
                <h4 style={{
                  fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.22em',
                  textTransform:'uppercase', color:'#ffffff', marginBottom:'0.5rem',
                }}>{title}</h4>
                <div style={{ width:'20px', height:'1.5px', background:'#c5a880' }} />
              </div>
              <ul style={{ listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                {links.map(({ label, page, args }) => (
                  <li key={label}>
                    <button
                      onClick={() => onPageChange(page, args)}
                      style={{
                        background:'none', border:'none', padding:0,
                        fontSize:'0.72rem', color:'rgba(200,190,175,0.55)',
                        cursor:'pointer', transition:'color 0.25s',
                        display:'flex', alignItems:'center', gap:'6px',
                        fontFamily:'inherit',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color='#c5a880'; }}
                      onMouseLeave={e => { e.currentTarget.style.color='rgba(200,190,175,0.55)'; }}
                    >
                      <span style={{
                        display:'inline-block', width:'14px', height:'1px',
                        background:'currentColor', flexShrink:0,
                        transition:'width 0.3s',
                      }} className="link-dash" />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 4 – Contact & Social */}
          <div style={{
            opacity: bodyVisible ? 1 : 0,
            transform: bodyVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease 0.36s, transform 0.7s ease 0.36s',
          }}>
            <div style={{ marginBottom:'1.25rem' }}>
              <h4 style={{
                fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.22em',
                textTransform:'uppercase', color:'#ffffff', marginBottom:'0.5rem',
              }}>Connect</h4>
              <div style={{ width:'20px', height:'1.5px', background:'#c5a880' }} />
            </div>

            <p style={{ fontSize:'0.68rem', color:'rgba(200,190,175,0.5)', lineHeight:1.7, marginBottom:'1.25rem' }}>
              concierge@<br />khroniq-watches.com
            </p>

            {/* Clock-hours decoration */}
            <p style={{ fontSize:'0.6rem', color:'rgba(197,168,128,0.4)', letterSpacing:'0.1em', marginBottom:'1rem' }}>
              <Clock size={10} style={{ display:'inline', marginRight:'5px', verticalAlign:'middle' }} />
              MON–SAT · 9AM–7PM CET
            </p>

            {/* Social icons */}
            <div style={{ display:'flex', gap:'10px' }}>
              {SOCIALS.map(({ label, href, path, rule }) => (
                <a key={label} href={href} aria-label={label}
                   style={{
                     width:'34px', height:'34px', borderRadius:'50%',
                     border:'1px solid rgba(197,168,128,0.25)',
                     display:'flex', alignItems:'center', justifyContent:'center',
                     color:'rgba(200,190,175,0.5)',
                     transition:'color 0.3s, border-color 0.3s, background 0.3s, box-shadow 0.3s',
                   }}
                   onMouseEnter={e => {
                     e.currentTarget.style.color='#c5a880';
                     e.currentTarget.style.borderColor='#c5a880';
                     e.currentTarget.style.background='rgba(197,168,128,0.1)';
                     e.currentTarget.style.boxShadow='0 0 12px rgba(197,168,128,0.2)';
                   }}
                   onMouseLeave={e => {
                     e.currentTarget.style.color='rgba(200,190,175,0.5)';
                     e.currentTarget.style.borderColor='rgba(197,168,128,0.25)';
                     e.currentTarget.style.background='transparent';
                     e.currentTarget.style.boxShadow='none';
                   }}>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {rule
                      ? <path fillRule={rule} d={path} clipRule={rule} />
                      : <path d={path} />
                    }
                  </svg>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BOTTOM BAR
      ══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Left – copyright */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <Star size={10} style={{ color:'#c5a880' }} fill="#c5a880" />
            <p style={{ fontSize:'0.62rem', color:'rgba(200,190,175,0.38)', letterSpacing:'0.08em' }}>
              © 2026 KHRONIQ Watches. All Rights Reserved. Inspired by Swiss Precision.
            </p>
          </div>

          {/* Right – legal links */}
          <div style={{ display:'flex', gap:'1.5rem' }}>
            {[
              { label:'Terms of Use',      page:'static', args:{ view:'policies' } },
              { label:'Privacy Policy',    page:'static', args:{ view:'policies' } },
              { label:'Cookie Preferences',page:'static', args:{ view:'policies' } },
            ].map(({ label, page, args }) => (
              <button
                key={label}
                onClick={() => onPageChange(page, args)}
                style={{
                  background:'none', border:'none', padding:0,
                  fontSize:'0.6rem', color:'rgba(200,190,175,0.35)',
                  cursor:'pointer', letterSpacing:'0.06em',
                  transition:'color 0.25s', fontFamily:'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.color='#c5a880'; }}
                onMouseLeave={e => { e.currentTarget.style.color='rgba(200,190,175,0.35)'; }}
              >{label}</button>
            ))}
          </div>

        </div>
      </div>

      {/* thin gold bottom line */}
      <div style={{
        height:'1.5px',
        background:'linear-gradient(90deg, transparent 0%, #c5a880 30%, #e8d5a3 50%, #c5a880 70%, transparent 100%)',
      }} />

    </footer>
  );
}
