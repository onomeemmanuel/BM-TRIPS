import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import api from '../../utils/api'

const empty = { title:'', slug:'', category:'', excerpt:'', content:'', emoji:'📝', bg_color:'', read_time:'', is_published:false }

export default function AdminPosts() {
  const [posts, setPosts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)

  const fetch = () => api.get('/posts/admin/all').then(r => setPosts(r.data))
  useEffect(() => { fetch() }, [])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const openCreate = () => { setForm(empty); setEditing(null); setShowForm(true) }
  const openEdit = t => { setForm(t); setEditing(t.id); setShowForm(true) }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editing) await api.put(`/posts/${editing}`, form)
      else await api.post('/posts', form)
      toast.success(editing ? 'Post updated!' : 'Post created!')
      setShowForm(false)
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally { setLoading(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this post?')) return
    try { await api.delete(`/posts/${id}`); toast.success('Deleted'); fetch() }
    catch { toast.error('Failed') }
  }

  const togglePublish = async p => {
    try {
      await api.put(`/posts/${p.id}`, { is_published: !p.is_published })
      toast.success(p.is_published ? 'Unpublished' : 'Published!')
      fetch()
    } catch { toast.error('Failed') }
  }

  return (
    <div style={{padding:'2rem'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
        <div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.8rem',fontWeight:700,color:'#0D2136'}}>Blog Posts</h1>
          <p style={{color:'#7A94A8',fontSize:'0.88rem'}}>{posts.length} articles</p>
        </div>
        <button onClick={openCreate}
          style={{display:'flex',alignItems:'center',gap:'0.5rem',background:'#38B6E8',color:'white',border:'none',padding:'0.7rem 1.4rem',borderRadius:'100px',fontSize:'0.83rem',fontWeight:600,cursor:'pointer'}}>
          <FiPlus /> New Post
        </button>
      </div>

      <div style={{background:'white',borderRadius:'16px',boxShadow:'0 2px 12px rgba(10,92,132,0.06)',overflow:'hidden'}}>
        {posts.length === 0 ? (
          <p style={{textAlign:'center',padding:'3rem',color:'#7A94A8'}}>No posts yet. Create your first blog post!</p>
        ) : posts.map(p => (
          <div key={p.id} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 1.5rem',borderBottom:'1px solid #f0f7fb',flexWrap:'wrap'}}>
            <div style={{width:'48px',height:'48px',borderRadius:'12px',background:p.bg_color||'#EBF7FD',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',shrink:0}}>{p.emoji}</div>
            <div style={{flex:1,minWidth:'200px'}}>
              <div style={{fontWeight:600,color:'#0D2136',fontSize:'0.9rem',marginBottom:'0.2rem'}}>{p.title}</div>
              <div style={{fontSize:'0.75rem',color:'#7A94A8'}}>{p.category} · {p.read_time}</div>
            </div>
            <span style={{padding:'0.2rem 0.7rem',borderRadius:'100px',fontSize:'0.68rem',fontWeight:600,background:p.is_published?'#dcfce7':'#f1f5f9',color:p.is_published?'#15803d':'#64748b'}}>
              {p.is_published ? 'Published' : 'Draft'}
            </span>
            <div style={{display:'flex',gap:'0.5rem'}}>
              <button onClick={() => togglePublish(p)}
                style={{background:'#EBF7FD',border:'none',padding:'0.4rem 0.8rem',borderRadius:'8px',fontSize:'0.72rem',color:'#0A5C84',cursor:'pointer',fontWeight:600}}>
                {p.is_published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => openEdit(p)} style={{background:'#EBF7FD',border:'none',padding:'0.4rem 0.6rem',borderRadius:'8px',color:'#0A5C84',cursor:'pointer'}}>
                <FiEdit2 size={13}/>
              </button>
              <button onClick={() => handleDelete(p.id)} style={{background:'#fee2e2',border:'none',padding:'0.4rem 0.6rem',borderRadius:'8px',color:'#dc2626',cursor:'pointer'}}>
                <FiTrash2 size={13}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{position:'fixed',inset:0,background:'rgba(13,33,54,0.6)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',backdropFilter:'blur(4px)'}}
          onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div style={{background:'white',borderRadius:'20px',padding:'2rem',maxWidth:'560px',width:'100%',maxHeight:'90vh',overflowY:'auto'}}>
            <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem',fontWeight:700,color:'#0D2136',marginBottom:'1.5rem'}}>
              {editing ? 'Edit Post' : 'New Blog Post'}
            </h2>
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {[['title','Title','Post title'],['slug','Slug','post-url-slug'],['category','Category','e.g. Safari, Culture & Food'],['excerpt','Excerpt','Short summary (shown on cards)'],['emoji','Emoji','📝'],['read_time','Read Time','e.g. 6 min read']].map(([name,label,ph]) => (
                <div key={name}>
                  <label style={{display:'block',fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.4rem'}}>{label}</label>
                  <input name={name} value={form[name]||''} onChange={handleChange} placeholder={ph} required={['title','slug'].includes(name)}
                    style={{width:'100%',border:'1.5px solid #D6EDF7',borderRadius:'10px',padding:'0.65rem 0.9rem',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.88rem',color:'#0D2136',outline:'none'}}
                    onFocus={e=>e.target.style.borderColor='#38B6E8'} onBlur={e=>e.target.style.borderColor='#D6EDF7'} />
                </div>
              ))}
              <div>
                <label style={{display:'block',fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.4rem'}}>Content</label>
                <textarea name="content" value={form.content||''} onChange={handleChange} rows={5} placeholder="Full blog post content…"
                  style={{width:'100%',border:'1.5px solid #D6EDF7',borderRadius:'10px',padding:'0.65rem 0.9rem',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.88rem',color:'#0D2136',outline:'none',resize:'vertical'}}
                  onFocus={e=>e.target.style.borderColor='#38B6E8'} onBlur={e=>e.target.style.borderColor='#D6EDF7'} />
              </div>
              <label style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.85rem',color:'#3A5369',cursor:'pointer'}}>
                <input type="checkbox" name="is_published" checked={form.is_published||false} onChange={handleChange} />
                Publish immediately
              </label>
              <div style={{display:'flex',gap:'0.8rem',marginTop:'0.5rem'}}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{flex:1,background:'#EBF7FD',border:'none',padding:'0.85rem',borderRadius:'100px',fontSize:'0.85rem',fontWeight:600,color:'#3A5369',cursor:'pointer'}}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  style={{flex:2,background:'#38B6E8',border:'none',padding:'0.85rem',borderRadius:'100px',fontSize:'0.85rem',fontWeight:600,color:'white',cursor:'pointer',opacity:loading?0.7:1}}>
                  {loading ? 'Saving…' : editing ? 'Save Changes' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}