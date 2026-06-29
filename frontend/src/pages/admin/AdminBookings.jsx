import { useState, useEffect } from 'react'
import api from '../../utils/api'
import { formatPrice, formatDate, statusColor } from '../../utils/helpers'
import { toast } from 'react-hot-toast'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/bookings').then(r => setBookings(r.data)).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status })
      setBookings(b => b.map(x => x.id === id ? { ...x, status } : x))
      toast.success('Status updated')
    } catch { toast.error('Failed to update') }
  }

  return (
    <div style={{padding:'2rem'}}>
      <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.8rem',fontWeight:700,color:'#0D2136',marginBottom:'0.3rem'}}>Bookings</h1>
      <p style={{color:'#7A94A8',fontSize:'0.88rem',marginBottom:'2rem'}}>{bookings.length} total bookings</p>

      <div style={{background:'white',borderRadius:'16px',boxShadow:'0 2px 12px rgba(10,92,132,0.06)',overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.83rem'}}>
            <thead>
              <tr style={{borderBottom:'1px solid #D6EDF7',background:'#f8fafc'}}>
                {['Reference','Customer','Tour','Travellers','Date','Amount','Payment','Status','Action'].map(h => (
                  <th key={h} style={{textAlign:'left',padding:'0.9rem 1rem',fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(5)].map((_,i) => (
                <tr key={i}><td colSpan={9} style={{padding:'1.5rem'}}><div style={{height:'20px',background:'#EBF7FD',borderRadius:'4px',animation:'pulse 1.5s infinite'}} /></td></tr>
              )) : bookings.map(b => (
                <tr key={b.id} style={{borderBottom:'1px solid #f0f7fb'}}>
                  <td style={{padding:'0.9rem 1rem',color:'#38B6E8',fontWeight:600,fontSize:'0.75rem',whiteSpace:'nowrap'}}>{b.reference}</td>
                  <td style={{padding:'0.9rem 1rem'}}>
                    <div style={{fontWeight:600,color:'#0D2136'}}>{b.full_name}</div>
                    <div style={{fontSize:'0.72rem',color:'#7A94A8'}}>{b.email}</div>
                  </td>
                  <td style={{padding:'0.9rem 1rem',color:'#3A5369',maxWidth:'160px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.tour_title}</td>
                  <td style={{padding:'0.9rem 1rem',color:'#3A5369',textAlign:'center'}}>{b.num_travellers}</td>
                  <td style={{padding:'0.9rem 1rem',color:'#7A94A8',whiteSpace:'nowrap'}}>{formatDate(b.travel_date)}</td>
                  <td style={{padding:'0.9rem 1rem',fontWeight:700,color:'#0D2136',whiteSpace:'nowrap'}}>{formatPrice(b.total_amount)}</td>
                  <td style={{padding:'0.9rem 1rem'}}>
                    <span style={{padding:'0.2rem 0.6rem',borderRadius:'100px',fontSize:'0.68rem',fontWeight:600,background:b.payment_status==='paid'?'#dcfce7':'#fef9c3',color:b.payment_status==='paid'?'#15803d':'#a16207'}}>
                      {b.payment_status}
                    </span>
                  </td>
                  <td style={{padding:'0.9rem 1rem'}}>
                    <span style={{padding:'0.2rem 0.6rem',borderRadius:'100px',fontSize:'0.68rem',fontWeight:600,background:b.status==='confirmed'?'#dcfce7':b.status==='cancelled'?'#fee2e2':'#fef9c3',color:b.status==='confirmed'?'#15803d':b.status==='cancelled'?'#dc2626':'#a16207'}}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{padding:'0.9rem 1rem'}}>
                    <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)}
                      style={{border:'1px solid #D6EDF7',borderRadius:'8px',padding:'0.3rem 0.5rem',fontSize:'0.75rem',color:'#0D2136',background:'white',cursor:'pointer',outline:'none'}}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && bookings.length === 0 && (
          <p style={{textAlign:'center',padding:'3rem',color:'#7A94A8'}}>No bookings yet.</p>
        )}
      </div>
    </div>
  )
}