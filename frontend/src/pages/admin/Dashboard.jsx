import { useState, useEffect } from 'react'
import { FiMap, FiCalendar, FiMail, FiDollarSign } from 'react-icons/fi'
import api from '../../utils/api'
import { formatPrice, formatDate, statusColor } from '../../utils/helpers'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/bookings/dashboard').then(r => setStats(r.data)).catch(() => {})
  }, [])

  const cards = stats ? [
    { icon: <FiMap size={20} />, label: 'Active Tours', value: stats.totalTours, color: '#38B6E8' },
    { icon: <FiCalendar size={20} />, label: 'Total Bookings', value: stats.totalBookings, color: '#0A7EB8' },
    { icon: <FiMail size={20} />, label: 'New Enquiries', value: stats.newEnquiries, color: '#f59e0b' },
    { icon: <FiDollarSign size={20} />, label: 'Total Revenue', value: formatPrice(stats.totalRevenue), color: '#10b981' },
  ] : []

  return (
    <div style={{padding:'2rem'}}>
      <div style={{marginBottom:'2rem'}}>
        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.8rem',fontWeight:700,color:'#0D2136'}}>Dashboard</h1>
        <p style={{color:'#7A94A8',fontSize:'0.88rem',marginTop:'0.3rem'}}>Welcome back! Here's what's happening.</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1.2rem',marginBottom:'2.5rem'}}>
        {stats ? cards.map((c,i) => (
          <div key={i} style={{background:'white',borderRadius:'16px',padding:'1.5rem',boxShadow:'0 2px 12px rgba(10,92,132,0.06)'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'10px',background:c.color+'20',display:'flex',alignItems:'center',justifyContent:'center',color:c.color,marginBottom:'1rem'}}>
              {c.icon}
            </div>
            <div style={{fontSize:'1.6rem',fontWeight:700,color:'#0D2136',marginBottom:'0.2rem'}}>{c.value}</div>
            <div style={{fontSize:'0.78rem',color:'#7A94A8',fontWeight:500}}>{c.label}</div>
          </div>
        )) : [...Array(4)].map((_,i) => (
          <div key={i} style={{height:'120px',background:'#EBF7FD',borderRadius:'16px',animation:'pulse 1.5s infinite'}} />
        ))}
      </div>

      {/* Recent Bookings */}
      <div style={{background:'white',borderRadius:'16px',padding:'1.5rem',boxShadow:'0 2px 12px rgba(10,92,132,0.06)'}}>
        <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',fontWeight:700,color:'#0D2136',marginBottom:'1.5rem'}}>Recent Bookings</h2>
        {stats?.recentBookings?.length > 0 ? (
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.83rem'}}>
              <thead>
                <tr style={{borderBottom:'1px solid #D6EDF7'}}>
                  {['Reference','Name','Tour','Date','Amount','Status'].map(h => (
                    <th key={h} style={{textAlign:'left',padding:'0.7rem 0.8rem',fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map(b => (
                  <tr key={b.id} style={{borderBottom:'1px solid #f0f7fb'}}>
                    <td style={{padding:'0.8rem',color:'#38B6E8',fontWeight:600,fontSize:'0.78rem'}}>{b.reference}</td>
                    <td style={{padding:'0.8rem',color:'#0D2136'}}>{b.full_name}</td>
                    <td style={{padding:'0.8rem',color:'#3A5369'}}>{b.tour_title}</td>
                    <td style={{padding:'0.8rem',color:'#7A94A8'}}>{formatDate(b.travel_date)}</td>
                    <td style={{padding:'0.8rem',fontWeight:600,color:'#0D2136'}}>{formatPrice(b.total_amount)}</td>
                    <td style={{padding:'0.8rem'}}>
                      <span style={{padding:'0.25rem 0.75rem',borderRadius:'100px',fontSize:'0.7rem',fontWeight:600}} className={statusColor(b.status)}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{color:'#7A94A8',fontSize:'0.88rem',textAlign:'center',padding:'2rem'}}>No bookings yet.</p>
        )}
      </div>
      <style>{`.${statusColor('pending').split(' ')[0]}{background:#fef9c3}.${statusColor('confirmed').split(' ')[0]}{background:#dcfce7}`}</style>
    </div>
  )
}