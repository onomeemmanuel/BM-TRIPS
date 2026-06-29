import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    const result = await login(form.email, form.password)
    if (result.success) { toast.success('Welcome back!'); navigate('/admin') }
    else toast.error(result.message)
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#0A5C84,#38B6E8)',fontFamily:'Plus Jakarta Sans,sans-serif',padding:'1rem'}}>
      <div style={{background:'white',borderRadius:'24px',padding:'3rem',maxWidth:'400px',width:'100%',boxShadow:'0 40px 100px rgba(10,33,54,0.25)'}}>
        <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
          <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.8rem',fontWeight:700,color:'#0D2136',marginBottom:'0.3rem'}}>
            BM TRIPS
          </div>
          <div style={{fontSize:'0.8rem',color:'#7A94A8',letterSpacing:'0.06em'}}>Admin Portal</div>
        </div>

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
          {[['email','Email Address','admin@bmtrips.com','email'],['password','Password','••••••••••','password']].map(([name,label,ph,type]) => (
            <div key={name}>
              <label style={{display:'block',fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.5rem'}}>{label}</label>
              <input name={name} type={type} value={form[name]} placeholder={ph} required
                onChange={e => setForm(f => ({...f, [name]: e.target.value}))}
                style={{width:'100%',border:'1.5px solid #D6EDF7',borderRadius:'10px',padding:'0.8rem 1rem',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.9rem',color:'#0D2136',outline:'none',transition:'border-color 0.2s'}}
                onFocus={e=>e.target.style.borderColor='#38B6E8'}
                onBlur={e=>e.target.style.borderColor='#D6EDF7'} />
            </div>
          ))}
          <button type="submit" disabled={loading}
            style={{background:'#38B6E8',color:'white',border:'none',padding:'1rem',borderRadius:'100px',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.9rem',fontWeight:600,cursor:'pointer',marginTop:'0.5rem',transition:'background 0.3s',opacity:loading?0.7:1}}
            onMouseOver={e=>e.target.style.background='#0A7EB8'}
            onMouseOut={e=>e.target.style.background='#38B6E8'}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}