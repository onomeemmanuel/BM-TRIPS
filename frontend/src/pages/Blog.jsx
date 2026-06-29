import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import api from '../utils/api'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/posts').then(r => setPosts(r.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>
      <Navbar />
      <div className="pt-28 pb-16 px-5" style={{background:'linear-gradient(135deg,#0A5C84,#38B6E8)'}}>
        <div className="max-w-3xl mx-auto text-center">
          <div style={{fontSize:'0.68rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.6)',marginBottom:'0.8rem'}}>Travel Journal</div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(2.5rem,5vw,4rem)',fontWeight:700,color:'white',marginBottom:'0.8rem'}}>Stories From the Road</h1>
          <p style={{color:'rgba(255,255,255,0.65)',fontWeight:300}}>Practical guides, hidden gems, and honest advice from our team of seasoned travellers.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_,i) => <div key={i} className="h-80 rounded-2xl animate-pulse" style={{background:'#EBF7FD'}} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(p => (
              <div key={p.id} style={{background:'white',borderRadius:'20px',overflow:'hidden',boxShadow:'0 4px 20px rgba(10,92,132,0.08)',transition:'transform 0.3s,box-shadow 0.3s',cursor:'pointer'}}
                onMouseOver={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(10,92,132,0.14)' }}
                onMouseOut={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(10,92,132,0.08)' }}>
                <div style={{height:'200px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'4.5rem',background:p.bg_color}}>{p.emoji}</div>
                <div style={{padding:'1.5rem'}}>
                  <div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'#38B6E8',marginBottom:'0.5rem'}}>{p.category}</div>
                  <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.1rem',fontWeight:700,color:'#0D2136',lineHeight:1.3,marginBottom:'0.6rem'}}>{p.title}</h3>
                  <p style={{fontSize:'0.83rem',color:'#3A5369',lineHeight:1.6,fontWeight:300,marginBottom:'0.8rem'}}>{p.excerpt}</p>
                  <div style={{fontSize:'0.72rem',color:'#7A94A8'}}>{p.read_time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}