import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import api from '../../utils/api'
import { formatPrice } from '../../utils/helpers'

const empty = { title:'',slug:'',region:'',destination:'',description:'',short_desc:'',price:'',duration_nights:'',tour_type:'',badge:'',emoji:'✈️',is_featured:false }

export default function AdminTours() {
  const [tours, setTours] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)

  const fetch = () => api.get('/tours/admin/all').then(r => setTours(r.data))
  useEffect(() => { fetch() }, [])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const openCreate = () => { setForm(empty); setEditing(null); setShowForm(true) }
  const openEdit = (t) => { setForm(t); setEditing(t.id); setShowForm(true) }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editing) await api.put(`/tours/${editing}`, form)
      else await api.post('/tours', form)
      toast.success(editing ? 'Tour updated!' : 'Tour created!')
      setShowForm(false)
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this tour?')) return
    try {
      await api.delete(`/tours/${id}`)
      toast.success('Tour removed')
      fetch()
    } catch { toast.error('Failed') }
  }

  return (
    <div style={{padding:'2rem'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
        <div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.8rem',fontWeight:700,color:'#0D2136'}}>Tours</h1>
          <p style={{color:'#7A94A8',fontSize:'0.88rem'}}>{tours.length} packages</p>
        </div>
        <button onClick={openCreate}
          style={{display:'flex',alignItems:'center',gap:'0.5rem',background:'#38B6E8',color:'white',border:'none',padding:'0.7rem 1.4rem',borderRadius:'100px',fontSize:'0.83rem',fontWeight:600,cursor:'pointer'}}>
          <FiPlus /> Add Tour
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.2rem'}}>
        {tours.map(t => (
          <div key={t.id} style={{background:'white',borderRadius:'16px',overflow:'hidden',boxShadow:'0 2px 12px rgba(10,92,132,0.06)'}}>
            <div style={{height:'140px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'4rem',background:t.bg_gradient||'#EBF7FD'}}>
              {t.emoji}
            </div>
            <div style={{padding:'1.2rem'}}>
              <div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#38B6E8',marginBottom:'0.3rem'}}>{t.region}</div>
              <div style={{fontFamily:'Playfair Display,serif',fontSize:'1rem',fontWeight:700,color:'#0D2136',marginBottom:'0.5rem'}}>{t.title}</div>
              <div style={{fontSize:'0.88rem',fontWeight:700,color:'#0A5C84',marginBottom:'1rem'}}>{formatPrice(t.price)}</div>
              <div style={{display:'flex',gap:'0.6rem'}}>
                <button onClick={() => openEdit(t)}
                  style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'0.4rem',background:'#EBF7FD',border:'none',padding:'0.5rem',borderRadius:'8px',fontSize:'0.78rem',color:'#0A5C84',cursor:'pointer',fontWeight:600}}>
                  <FiEdit2 size={12}/> Edit
                </button>
                <button onClick={() => handleDelete(t.id)}
                  style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.4rem',background:'#fee2e2',border:'none',padding:'0.5rem 0.8rem',borderRadius:'8px',fontSize:'0.78rem',color:'#dc2626',cursor:'pointer'}}>
                  <FiTrash2 size={12}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{position:'fixed',inset:0,background:'rgba(13,33,54,0.6)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',backdropFilter:'blur(4px)'}}
          onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div style={{background:'white',borderRadius:'20px',padding:'2rem',maxWidth:'560px',width:'100%',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 40px 100px rgba(10,33,54,0.25)'}}>
            <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem',fontWeight:700,color:'#0D2136',marginBottom:'1.5rem'}}>
              {editing ? 'Edit Tour' : 'Add New Tour'}
            </h2>
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {[['title','Tour Title','e.g. Maldives Overwater Escape'],['slug','Slug (URL)','e.g. maldives-overwater-escape'],['region','Region','e.g. Indian Ocean'],['destination','Destination','e.g. Maldives'],['short_desc','Short Description','Brief summary'],['badge','Badge','e.g. Bestseller, New, Limited'],['emoji','Emoji','🏝️']].map(([name,label,ph]) => (
                <div key={name}>
                  <label style={{display:'block',fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.4rem'}}>{label}</label>
                  <input name={name} value={form[name]||''} onChange={handleChange} placeholder={ph} required={['title','slug','destination','region'].includes(name)}
                    style={{width:'100%',border:'1.5px solid #D6EDF7',borderRadius:'10px',padding:'0.65rem 0.9rem',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.88rem',color:'#0D2136',outline:'none'}}
                    onFocus={e=>e.target.style.borderColor='#38B6E8'} onBlur={e=>e.target.style.borderColor='#D6EDF7'} />
                </div>
              ))}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div>
                  <label style={{display:'block',fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.4rem'}}>Price (₦)</label>
                  <input name="price" type="number" value={form.price||''} onChange={handleChange} required placeholder="850000"
                    style={{width:'100%',border:'1.5px solid #D6EDF7',borderRadius:'10px',padding:'0.65rem 0.9rem',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.88rem',color:'#0D2136',outline:'none'}}
                    onFocus={e=>e.target.style.borderColor='#38B6E8'} onBlur={e=>e.target.style.borderColor='#D6EDF7'} />
                </div>
                <div>
                  <label style={{display:'block',fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.4rem'}}>Nights</label>
                  <input name="duration_nights" type="number" value={form.duration_nights||''} onChange={handleChange} required placeholder="7"
                    style={{width:'100%',border:'1.5px solid #D6EDF7',borderRadius:'10px',padding:'0.65rem 0.9rem',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.88rem',color:'#0D2136',outline:'none'}}
                    onFocus={e=>e.target.style.borderColor='#38B6E8'} onBlur={e=>e.target.style.borderColor='#D6EDF7'} />
                </div>
              </div>
              <div>
                <label style={{display:'block',fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.4rem'}}>Tour Type</label>
                <select name="tour_type" value={form.tour_type||''} onChange={handleChange}
                  style={{width:'100%',border:'1.5px solid #D6EDF7',borderRadius:'10px',padding:'0.65rem 0.9rem',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.88rem',color:'#0D2136',outline:'none',background:'white'}}>
                  <option value="">Select type</option>
                  {['Beach & Island','Safari & Wildlife','Culture & Nature','Adventure & Culture','Honeymoon','Culture & Leisure'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{display:'block',fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.4rem'}}>Full Description</label>
                <textarea name="description" value={form.description||''} onChange={handleChange} rows={3} required
                  style={{width:'100%',border:'1.5px solid #D6EDF7',borderRadius:'10px',padding:'0.65rem 0.9rem',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.88rem',color:'#0D2136',outline:'none',resize:'vertical'}}
                  onFocus={e=>e.target.style.borderColor='#38B6E8'} onBlur={e=>e.target.style.borderColor='#D6EDF7'} />
              </div>
              <label style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.85rem',color:'#3A5369',cursor:'pointer'}}>
                <input type="checkbox" name="is_featured" checked={form.is_featured||false} onChange={handleChange} />
                Feature this tour on homepage
              </label>
              <div style={{display:'flex',gap:'0.8rem',marginTop:'0.5rem'}}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{flex:1,background:'#EBF7FD',border:'none',padding:'0.85rem',borderRadius:'100px',fontSize:'0.85rem',fontWeight:600,color:'#3A5369',cursor:'pointer'}}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  style={{flex:2,background:'#38B6E8',border:'none',padding:'0.85rem',borderRadius:'100px',fontSize:'0.85rem',fontWeight:600,color:'white',cursor:'pointer',opacity:loading?0.7:1}}>
                  {loading ? 'Saving…' : editing ? 'Save Changes' : 'Create Tour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}