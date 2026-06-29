import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'

export default function Navbar({ logo }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const isHome = pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { to: '/tours', label: 'Packages' },
    { to: '/blog', label: 'Journal' },
    { to: '/contact', label: 'Contact' },
  ]

  const solid = scrolled || !isHome

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${solid ? 'bg-white/97 shadow-sm backdrop-blur-md py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className={`flex items-center gap-3 transition-colors ${solid ? 'text-ink' : 'text-white'}`}>
          {logo
            ? <img src={logo} alt="Logo" style={{ height: 40, objectFit: 'contain' }} />
            : <span className="font-playfair text-2xl font-bold">BM TRIPS</span>
          }
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-8 list-none">
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={`text-sm font-medium tracking-wide transition-colors hover:text-sky ${solid ? 'text-slate' : 'text-white/80'}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <span className={`text-sm transition-colors ${solid ? 'text-muted' : 'text-white/60'}`}>+234 08168799138</span>
          <Link to="/contact" className="bg-sky text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-sky-dark transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky/30">
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open
            ? <FiX size={22} color={solid ? '#0D2136' : 'white'} />
            : <FiMenu size={22} color={solid ? '#0D2136' : 'white'} />
          }
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-4"
          >
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-slate font-medium text-sm py-1">
                {l.label}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="bg-sky text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center">
              Book Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}