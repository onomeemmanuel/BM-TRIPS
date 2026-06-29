import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import TourCard from '../components/ui/TourCard'
import api from '../utils/api'
import logo from '../assets/logo.png'
import slide1 from '../assets/slide1.jpeg'
import slide2 from '../assets/slide2.jpeg'
import slide3 from '../assets/slide3.jpeg'
import slide4 from '../assets/slide4.jpeg'

const slides = [
  { img: slide1, title: 'UK COS', sub: 'Minister of Religion · 2 Years · Pathway to PR' },
  { img: slide2, title: 'Canada Permanent Residency', sub: 'Live, Work & Relocate Permanently With Your Family' },
  { img: slide3, title: 'Turkey Visa', sub: '99% Visa Approval Guarantee!' },
  { img: slide4, title: 'Study in Spain', sub: '2026/2027 Intake · HND Accepted · Dependents Allowed' },
]

const stats = [
  { n: '5K+', l: 'Visas Processed' },
  { n: '20+', l: 'Countries' },
  { n: '10 Yrs', l: 'Experience' },
  { n: '4.9★', l: 'Avg. Rating' },
]

const services = [
  { icon: '🛂', title: 'Visa Processing', text: 'We handle all visa applications with 99% approval rate. UK, Canada, Turkey, Spain and more.' },
  { icon: '🎓', title: 'Study Abroad', text: 'Get admission into top universities abroad with HND accepted, dependents allowed.' },
  { icon: '🏠', title: 'Permanent Residency', text: 'Relocate permanently with your family. Canada PR, UK settlement and more pathways.' },
  { icon: '✈️', title: 'Travel Packages', text: 'Complete travel packages including flights, accommodation and full trip planning.' },
]

export default function Home() {
  const [slide, setSlide] = useState(0)
  const [tours, setTours] = useState([])
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const timerRef = useRef()

  const startTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    api.get('/tours').then(r => setTours(r.data.slice(0, 6))).catch(() => {})
    api.get('/posts').then(r => setPosts(r.data.slice(0, 3))).catch(() => {})
  }, [])

  const goSlide = (n) => { setSlide(n); startTimer() }
  const prev = () => goSlide((slide - 1 + slides.length) % slides.length)
  const next = () => goSlide((slide + 1) % slides.length)

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar logo={logo} />

      {/* ── IMAGE SLIDER HERO ── */}
      <section className="hero-section" style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>

        {/* Slides */}
        {slides.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            opacity: i === slide ? 1 : 0,
            transition: 'opacity 1s ease',
            zIndex: i === slide ? 1 : 0,
          }}>
            <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.75) 100%)' }} />
          </div>
        ))}

        {/* Content */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 5%' }}>

            {/* Inject responsive CSS for small fixes */}
            <style>{`
              @media (max-width: 640px) {
                  .hero-section { min-height: 520px !important; height: auto !important; }
                  .hero-stats { flex-direction: column !important; gap: 0.6rem !important; }
                  .hero-stats > div { border-right: none !important; padding: 0.7rem 1rem !important; }
                  .hero-title { font-size: clamp(1.8rem, 8.5vw, 3rem) !important; }
                  .hero-sub { font-size: 0.95rem !important; max-width: 90% !important; }
                  .hero-dots button { height: 8px !important; }
                }
              /* smoother transition for dot width change */
              .hero-dots button { transition: width 0.35s cubic-bezier(.2,.9,.2,1), background 0.25s; }
            `}</style>

          {/* Logo + Bold Brand Title */}
          <motion.img
            src={logo}
            alt="BM Trips"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ height: '64px', marginBottom: '0.6rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
          />

          <motion.hgroup initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", color: 'white', marginBottom: '0.4rem' }}>
              <div style={{ fontSize: 'clamp(1.6rem, 4.8vw, 2.4rem)', fontWeight: 900, letterSpacing: '0.06em', textShadow: '0 2px 16px rgba(0,0,0,0.45)' }}>BM TRIPS</div>
            </div>
          </motion.hgroup>

          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.55 }}
            >
              <h1 className="hero-title" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5.5vw, 4.2rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.02,
                marginBottom: '0.6rem',
                textShadow: '0 2px 22px rgba(0,0,0,0.55)',
                letterSpacing: '0.01em',
              }}>
                {slides[slide].title}
              </h1>
              <p style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '2.5rem',
                fontWeight: 400,
                textShadow: '0 1px 8px rgba(0,0,0,0.5)',
                maxWidth: '640px',
                margin: '0 auto 2.5rem',
              }}>
                {slides[slide].sub}
              </p>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{
              background: '#38B6E8', color: 'white',
              padding: '0.9rem 2.2rem', borderRadius: '100px',
              fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(56,182,232,0.4)',
              transition: 'all 0.3s',
            }}>
              Get Started Today
            </Link>
            <Link to="/tours" style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255,255,255,0.5)',
              color: 'white',
              padding: '0.9rem 2.2rem', borderRadius: '100px',
              fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
              transition: 'all 0.3s',
            }}>
              Our Services
            </Link>
          </div>

          {/* Stats bar */}
          <div className="hero-stats" style={{
            display: 'flex', marginTop: '3.5rem',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '16px', overflow: 'hidden',
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                padding: '1rem 1.8rem', textAlign: 'center',
                borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
              }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.3rem', fontWeight: 500, letterSpacing: '0.06em' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button onClick={prev} style={{
          position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)',
          zIndex: 20, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.3)', color: 'white',
          width: '44px', height: '44px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.3s',
        }}>
          <FiChevronLeft size={20} />
        </button>
        <button onClick={next} style={{
          position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)',
          zIndex: 20, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.3)', color: 'white',
          width: '44px', height: '44px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.3s',
        }}>
          <FiChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="hero-dots" style={{
          position: 'absolute', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)', zIndex: 20,
          display: 'flex', gap: '0.5rem',
        }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => goSlide(i)} style={{
              width: i === slide ? '32px' : '8px',
              height: '8px', borderRadius: '100px',
              background: i === slide ? '#38B6E8' : 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer',
              transition: 'width 0.35s cubic-bezier(.2,.9,.2,1), background 0.2s', padding: 0,
            }} />
          ))}
        </div>

        {/* Wave */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 15 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', display: 'block' }}>
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <div style={{ background: 'white', padding: '0 5% 3rem' }}>
        <div style={{
          maxWidth: '860px', margin: '0 auto',
          background: 'white', borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(10,92,132,0.12)',
          padding: '1.8rem 2rem', marginTop: '-1rem',
          border: '1px solid #D6EDF7',
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#38B6E8', marginBottom: '1rem' }}>
            🔍 Search Our Services
          </div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="UK Visa, Canada PR, Study Abroad, Turkey..."
              style={{
                flex: 1, border: '1.5px solid #D6EDF7', borderRadius: '12px',
                padding: '0.8rem 1.2rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.92rem', color: '#0D2136', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#38B6E8'}
              onBlur={e => e.target.style.borderColor = '#D6EDF7'}
            />
            <Link to={`/tours?search=${search}`} style={{
              background: '#38B6E8', color: 'white',
              padding: '0.8rem 1.8rem', borderRadius: '12px',
              fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              whiteSpace: 'nowrap',
            }}>
              Search →
            </Link>
          </div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section style={{ padding: '5rem 5%', background: '#EBF7FD' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#38B6E8', marginBottom: '0.8rem' }}>What We Offer</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#0D2136' }}>
              Your Gateway to <span style={{ color: '#38B6E8' }}>Global Opportunities</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {services.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{
                  background: 'white', borderRadius: '20px',
                  padding: '2rem 1.8rem', textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(10,92,132,0.07)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'default',
                }}
                whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(10,92,132,0.14)' }}
              >
                <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: '#EBF7FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.2rem' }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#0D2136', marginBottom: '0.6rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#3A5369', lineHeight: 1.7, fontWeight: 300 }}>{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOURS/PACKAGES ── */}
      {tours.length > 0 && (
        <section style={{ padding: '5rem 5%', background: 'white' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#38B6E8', marginBottom: '0.6rem' }}>Our Packages</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#0D2136' }}>
                  Featured <span style={{ color: '#38B6E8' }}>Opportunities</span>
                </h2>
              </div>
              <Link to="/tours" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38B6E8', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                View all <FiArrowRight />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {tours.map((t, i) => <TourCard key={t.id} tour={t} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY BM TRIPS ── */}
      <section style={{ padding: '5rem 5%', background: '#0D2136' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          {/* Logo on dark bg */}
          <img src={logo} alt="BM Trips" style={{ height: '60px', marginBottom: '1.5rem', filter: 'brightness(0) invert(1)' }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
            Why Choose <span style={{ color: '#38B6E8' }}>BM Trips?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 3.5rem', lineHeight: 1.8, fontWeight: 300 }}>
            We have helped thousands of Nigerians relocate, study, and travel abroad successfully.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '🎯', title: '99% Success Rate', text: 'We only take cases we can win. Your visa approval is our priority.' },
              { icon: '⚡', title: 'Fast Processing', text: 'We process your application faster than going through it alone.' },
              { icon: '🔒', title: 'Safe & Secure', text: 'Your documents and personal data are handled with strict confidentiality.' },
              { icon: '👨‍👩‍👧', title: 'Family Packages', text: 'We handle the whole family — dependents included in most of our packages.' },
            ].map((w, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px', padding: '2rem 1.5rem',
                  transition: 'border-color 0.3s',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{w.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', color: 'white', fontWeight: 700, marginBottom: '0.6rem' }}>{w.title}</h3>
                <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontWeight: 300 }}>{w.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '5rem 5%', background: '#EBF7FD' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#38B6E8', marginBottom: '0.8rem' }}>Success Stories</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#0D2136' }}>
              What Our <span style={{ color: '#38B6E8' }}>Clients Say</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { quote: 'BM Trips processed my UK COS in record time. I am now settled in the UK with my family. Highly recommend!', name: 'Pastor Adebayo K.', dest: 'UK Minister of Religion Visa', avatar: '👨🏿' },
              { quote: 'I got my Canada PR approved in 8 months. BM Trips handled everything from start to finish. God bless them!', name: 'Mrs. Chioma E.', dest: 'Canada Permanent Residency', avatar: '👩🏾' },
              { quote: 'Got admission in Spain for my Masters degree. HND accepted — something I thought was impossible. Thank you BM Trips!', name: 'Emeka O.', dest: 'Study in Spain', avatar: '👨🏾' },
            ].map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(10,92,132,0.07)' }}
              >
                <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, j) => <FiStar key={j} size={14} fill="#38B6E8" color="#38B6E8" />)}
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontStyle: 'italic', color: '#0D2136', lineHeight: 1.7, marginBottom: '1.5rem' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EBF7FD', border: '2px solid #C5E9F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0D2136' }}>{t.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#38B6E8', fontWeight: 600 }}>{t.dest}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      {posts.length > 0 && (
        <section style={{ padding: '5rem 5%', background: 'white' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#38B6E8', marginBottom: '0.6rem' }}>Travel Journal</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#0D2136' }}>
                  Tips & <span style={{ color: '#38B6E8' }}>Updates</span>
                </h2>
              </div>
              <Link to="/blog" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38B6E8', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                All articles <FiArrowRight />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {posts.map(p => (
                <div key={p.id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(10,92,132,0.07)', border: '1px solid #D6EDF7' }}>
                  <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', background: p.bg_color }}>{p.emoji}</div>
                  <div style={{ padding: '1.4rem' }}>
                    <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#38B6E8', marginBottom: '0.5rem' }}>{p.category}</div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: '#0D2136', lineHeight: 1.3, marginBottom: '0.5rem' }}>{p.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: '#3A5369', lineHeight: 1.6, fontWeight: 300 }}>{p.excerpt}</p>
                    <div style={{ fontSize: '0.7rem', color: '#7A94A8', marginTop: '0.8rem' }}>{p.read_time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 5%', background: 'linear-gradient(135deg, #0A5C84, #38B6E8)', textAlign: 'center' }}>
        <img src={logo} alt="BM Trips" style={{ height: '55px', marginBottom: '1.5rem', filter: 'brightness(0) invert(1)' }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
          Ready to Start Your Journey?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', marginBottom: '2.5rem', fontWeight: 300, maxWidth: '480px', margin: '0 auto 2.5rem' }}>
          Talk to our specialists today. Call us on 08168799138 or 08022833798
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" style={{ background: 'white', color: '#0A5C84', padding: '1rem 2.5rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            Contact Us Now
          </Link>
          <a href="https://wa.me/2348168799138" target="_blank" rel="noreferrer" style={{ background: '#25D366', color: 'white', padding: '1rem 2.5rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
            💬 WhatsApp Us
          </a>
        </div>
      </section>

      <Footer logo={logo} />
    </div>
  )
}