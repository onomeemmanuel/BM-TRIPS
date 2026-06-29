import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiGrid, FiMap, FiCalendar, FiMail, FiBook, FiLogOut } from 'react-icons/fi'

const links = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/admin/tours', label: 'Tours', icon: <FiMap /> },
  { to: '/admin/bookings', label: 'Bookings', icon: <FiCalendar /> },
  { to: '/admin/contacts', label: 'Enquiries', icon: <FiMail /> },
  { to: '/admin/posts', label: 'Blog Posts', icon: <FiBook /> },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/admin/login') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <aside style={{ width: '240px', background: '#0D2136', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100 }}>
        <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>
            BM TRIPS
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.2rem' }}>Admin Dashboard</div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/admin'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.85rem', borderRadius: '10px',
                fontSize: '0.83rem', fontWeight: 500, textDecoration: 'none',
                transition: 'all 0.2s',
                background: isActive ? 'rgba(56,182,232,0.15)' : 'transparent',
                color: isActive ? '#38B6E8' : 'rgba(255,255,255,0.5)',
              })}>
              {l.icon}{l.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem', padding: '0 0.85rem' }}>
            {user?.email}
          </div>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: '10px', width: '100%', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', cursor: 'pointer' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,100,100,0.1)'; e.currentTarget.style.color = '#ff6b6b' }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}>
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: '240px', flex: 1, background: '#f8fafc', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  )
}