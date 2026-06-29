import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiPhone, FiMail, FiCheck } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import api from '../utils/api'

export default function Contact() {
  const [form, setForm] = useState({ first_name:'',last_name:'',email:'',phone:'',destination:'',travel_date:'',message:'' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contacts', form)
      setSent(true)
      toast.success('Enquiry sent! We\'ll be in touch within 2 hours.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const css = `
    .font-playfair{font-family:'Playfair Display',serif}
    .text-sky{color:#38B6E8}.bg-sky{background:#38B6E8}.hover-sky:hover{background:#0A7EB8}
    .text-sky-deep{color:#0A5C84}.bg-sky-tint{background:#EBF7FD}
    .text-ink{color:#0D2136}.text-slate{color:#3A5369}.text-muted{color:#7A94A8}
    .border-border{border-color:#D6EDF7}.focus-sky:focus{border-color:#38B6E8;outline:none}
  `

  return (
    <div style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>
      <Navbar />
      <style>{css}</style>

      {/* Header */}
      <div className="pt-28 pb-16 px-5" style={{ background: 'linear-gradient(135deg,#0A5C84,#38B6E8)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{color:'rgba(255,255,255,0.6)'}}>Let's Connect</div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-3">Plan Your Journey</h1>
          <p style={{color:'rgba(255,255,255,0.65)',fontSize:'1rem',fontWeight:300}}>Tell us where you want to go. Our specialists respond within 2 hours on business days.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Info */}
          <div className="lg:col-span-2">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-3">Get In Touch</h2>
            <p style={{color:'#3A5369',lineHeight:1.8,fontSize:'0.92rem',fontWeight:300,marginBottom:'2rem'}}>
              Whether you know exactly where you want to go or just have a feeling — we'll take it from there. No pressure, just great travel planning.
            </p>

            {[
              { icon: <FiMapPin />, label: 'Office', val: '1, Agala Estate, opposite UCH intern hostel Yemetu Ibadan, Oyo State' },
              { icon: <FiPhone />, label: 'Phone', val: '+234 08168799138, 08022833798' },
              { icon: <FiMail />, label: 'Email', val: 'hello@bmtrips.com' },
            ].map((c, i) => {
              const isPhone = c.label === 'Phone'
              const isEmail = c.label === 'Email'
              const value = c.val
              const href = isPhone ? `tel:${value.split(',')[0].trim()}` : isEmail ? `mailto:${value}` : undefined

              return (
                <div key={i} style={{display:'flex',gap:'1rem',alignItems:'flex-start',background:'#EBF7FD',borderRadius:'16px',padding:'1.2rem',marginBottom:'1rem'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'#38B6E8',display:'flex',alignItems:'center',justifyContent:'center',color:'white',shrink:0,fontSize:'0.9rem'}}>
                    {c.icon}
                  </div>
                  <div>
                    <div style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.2rem'}}>{c.label}</div>
                    {href ? (
                      <a href={href} style={{fontSize:'0.88rem',color:'#0A5C84',textDecoration:'none'}}>{value}</a>
                    ) : (
                      <div style={{fontSize:'0.88rem',color:'#3A5369'}}>{value}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{background:'#EBF7FD',borderRadius:'24px',padding:'4rem',textAlign:'center'}}>
                <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'#38B6E8',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.5rem'}}>
                  <FiCheck size={28} color="white" />
                </div>
                <h3 className="font-playfair" style={{fontSize:'1.8rem',fontWeight:700,color:'#0D2136',marginBottom:'0.8rem'}}>Enquiry Received!</h3>
                <p style={{color:'#3A5369',lineHeight:1.7,fontSize:'0.95rem'}}>
                  Thank you! Our travel specialists will be in touch within 2 hours to start planning your perfect trip.
                </p>
                <button onClick={() => setSent(false)} style={{marginTop:'2rem',background:'#38B6E8',color:'white',border:'none',padding:'0.85rem 2rem',borderRadius:'100px',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.85rem',fontWeight:600,cursor:'pointer'}}>
                  Send Another Enquiry
                </button>
              </motion.div>
            ) : (
              <div style={{background:'white',borderRadius:'24px',padding:'2.5rem',boxShadow:'0 4px 30px rgba(10,92,132,0.08)',border:'1px solid #D6EDF7'}}>
                <h3 className="font-playfair" style={{fontSize:'1.4rem',fontWeight:700,color:'#0D2136',marginBottom:'2rem'}}>Send Us a Message</h3>
                <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                    {[['first_name','First Name','Chidi'],['last_name','Last Name','Okafor']].map(([name,label,ph]) => (
                      <div key={name}>
                        <label style={{display:'block',fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.5rem'}}>{label}</label>
                        <input name={name} value={form[name]} onChange={handleChange} required placeholder={ph}
                          style={{width:'100%',border:'1.5px solid #D6EDF7',borderRadius:'10px',padding:'0.7rem 1rem',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.88rem',color:'#0D2136',outline:'none'}}
                          onFocus={e=>e.target.style.borderColor='#38B6E8'} onBlur={e=>e.target.style.borderColor='#D6EDF7'} />
                      </div>
                    ))}
                  </div>
                  {[['email','Email Address','chidi@email.com','email'],['phone','Phone Number','+234 800 000 0000','tel']].map(([name,label,ph,type]) => (
                    <div key={name}>
                      <label style={{display:'block',fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.5rem'}}>{label}</label>
                      <input name={name} type={type} value={form[name]} onChange={handleChange} required={name==='email'} placeholder={ph}
                        style={{width:'100%',border:'1.5px solid #D6EDF7',borderRadius:'10px',padding:'0.7rem 1rem',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.88rem',color:'#0D2136',outline:'none'}}
                        onFocus={e=>e.target.style.borderColor='#38B6E8'} onBlur={e=>e.target.style.borderColor='#D6EDF7'} />
                    </div>
                  ))}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                    <div>
                      <label style={{display:'block',fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.5rem'}}>Destination</label>
                      <select name="destination" value={form.destination} onChange={handleChange}
                        style={{width:'100%',border:'1.5px solid #D6EDF7',borderRadius:'10px',padding:'0.7rem 1rem',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.88rem',color:'#0D2136',outline:'none',background:'white'}}>
                        <option value="">Anywhere…</option>
                        {['Maldives','Tanzania Safari','Japan','France','Italy','Greece','Morocco','Surprise me!'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{display:'block',fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.5rem'}}>Travel Date</label>
                      <input name="travel_date" type="date" value={form.travel_date} onChange={handleChange}
                        style={{width:'100%',border:'1.5px solid #D6EDF7',borderRadius:'10px',padding:'0.7rem 1rem',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.88rem',color:'#0D2136',outline:'none'}} />
                    </div>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#7A94A8',marginBottom:'0.5rem'}}>Your Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                      placeholder="Group size, budget, special occasion, vibe — the more you share the better we build…"
                      style={{width:'100%',border:'1.5px solid #D6EDF7',borderRadius:'10px',padding:'0.7rem 1rem',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.88rem',color:'#0D2136',outline:'none',resize:'none'}}
                      onFocus={e=>e.target.style.borderColor='#38B6E8'} onBlur={e=>e.target.style.borderColor='#D6EDF7'} />
                  </div>
                  <button type="submit" disabled={loading}
                    style={{width:'100%',background:'#38B6E8',color:'white',border:'none',padding:'1rem',borderRadius:'100px',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.88rem',fontWeight:600,cursor:'pointer',transition:'background 0.3s',opacity:loading?0.7:1}}>
                    {loading ? 'Sending…' : 'Send My Enquiry ✈️'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}