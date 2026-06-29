import { useState, useEffect } from 'react'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'
import { toast } from 'react-hot-toast'

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/contacts').then(r => setContacts(r.data)).finally(() => setLoading(false))
  }, [])

  const markRead = async (id) => {
    try {
      await api.put(`/contacts/${id}/status`, { status: 'read' })
      setContacts(c => c.map(x => x.id === id ? { ...x, status: 'read' } : x))
      if (selected?.id === id) setSelected(s => ({ ...s, status: 'read' }))
    } catch { toast.error('Failed to update') }
  }

  return (
    <div style={{padding:'2rem'}}>
      <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.8rem',fontWeight:700,color:'#0D2136',marginBottom:'0.3rem'}}>Enquiries</h1>
      <p style={{color:'#7A94A8',fontSize:'0.88rem',marginBottom:'2rem'}}>
        {contacts.filter(c=>c.status==='new').length} new · {contacts.length} total
      </p>

      <div style={{display:'grid',gridTemplateColumns:selected?'1fr 1fr':'1fr',gap:'1.5rem'}}>
        {/* List */}
        <div style={{background:'white',borderRadius:'16px',boxShadow:'0 2px 12px rgba(10,92,132,0.06)',overflow:'hidden'}}>
          {loading ? <div style={{padding:'3rem',textAlign:'center',color:'#7A94A8'}}>Loading…</div> :
           contacts.length === 0 ? <div style={{padding:'3rem',textAlign:'center',color:'#7A94A8'}}>No enquiries yet.</div> :
           contacts.map(c => (
            <div key={c.id} onClick={() => { setSelected(c); if(c.status==='new') markRead(c.id) }}
              style={{padding:'1.2rem 1.5rem',borderBottom:'1px solid #f0f7fb',cursor:'pointer',transition:'background 0.2s',background:selected?.id===c.id?'#EBF7FD':'white'}}
              onMouseOver={e=>{ if(selected?.id!==c.id) e.currentTarget.style.background='#f8fafc' }}
              onMouseOut={e=>{ if(selected?.id!==c.id) e.currentTarget.style.background='white' }}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.3rem'}}>
                <div style={{fontWeight:600,color:'#0D2136',fontSize:'0.88rem'}}>{c.first_name} {c.last_name}</div>
                <span style={{fontSize:'0.65rem',padding:'0.2rem 0.6rem',borderRadius:'100px',fontWeight:600,background:c.status==='new'?'#dbeafe':'#f1f5f9',color:c.status==='new'?'#1d4ed8':'#64748b'}}>
                  {c.status}
                </span>
              </div>
              <div style={{fontSize:'0.78rem',color:'#7A94A8',marginBottom:'0.2rem'}}>{c.email}</div>
              <div style={{fontSize:'0.75rem',color:'#3A5369'}}>{c.destination || 'No destination'} · {formatDate(c.created_at)}</div>
            </div>
          ))}
        </div>

        {/* Detail */}
        {selected && (
          <div style={{background:'white',borderRadius:'16px',padding:'1.5rem',boxShadow:'0 2px 12px rgba(10,92,132,0.06)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1.5rem'}}>
              <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',fontWeight:700,color:'#0D2136'}}>{selected.first_name} {selected.last_name}</h2>
              <button onClick={() => setSelected(null)} style={{background:'#EBF7FD',border:'none',borderRadius:'8px',padding:'0.4rem 0.8rem',fontSize:'0.75rem',color:'#7A94A8',cursor:'pointer'}}>✕ Close</button>
            </div>
            {[
              ['Email', selected.email],
              ['Phone', selected.phone || 'N/A'],
              ['Destination', selected.destination || 'N/A'],
              ['Travel Date', formatDate(selected.travel_date)],
              ['Received', formatDate(selected.created_at)],
            ].map(([label, val]) => (
              <div key={label} style={{display:'flex',gap:'1rem',padding:'0.7rem 0',borderBottom:'1px solid #f0f7fb'}}>
                <span style={{fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#7A94A8',minWidth:'100px'}}>{label}</span>
                <span style={{fontSize:'0.85rem',color:'#3A5369'}}>{val}</span>
              </div>
            ))}
            {selected.message && (
              <div style={{marginTop:'1.2rem',padding:'1rem',background:'#EBF7FD',borderRadius:'12px'}}>
                <div style={{fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.5rem'}}>Message</div>
                <p style={{fontSize:'0.88rem',color:'#3A5369',lineHeight:1.7}}>{selected.message}</p>
              </div>
            )}
            <a href={`mailto:${selected.email}?subject=Re: Your Travel Enquiry to ${selected.destination}`}
              style={{display:'block',marginTop:'1.5rem',background:'#38B6E8',color:'white',textAlign:'center',padding:'0.85rem',borderRadius:'100px',fontSize:'0.85rem',fontWeight:600,textDecoration:'none',transition:'background 0.3s'}}
              onMouseOver={e=>e.target.style.background='#0A7EB8'}
              onMouseOut={e=>e.target.style.background='#38B6E8'}>
              Reply via Email
            </a>
          </div>
        )}
      </div>
    </div>
  )
}