import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiClock, FiUsers, FiCheck, FiX, FiArrowLeft } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import BookingModal from '../components/ui/BookingModal'
import api from '../utils/api'
import { formatPrice } from '../utils/helpers'

export default function TourDetail() {
  const { slug } = useParams()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    api.get(`/tours/${slug}`).then(r => setTour(r.data)).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>Loading...</div>
  if (!tour) return <div className="min-h-screen flex items-center justify-center">Tour not found</div>

  return (
    <div style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>
      <Navbar />

      {/* Hero */}
      <div className="relative h-[60vh] min-h-96 flex items-end overflow-hidden">
        {tour.image_url
          ? <img src={tour.image_url} alt={tour.title} className="absolute inset-0 w-full h-full object-cover" />
          : <div className="absolute inset-0 flex items-center justify-center text-9xl" style={{ background: tour.bg_gradient }}>{tour.emoji}</div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="relative z-10 p-8 max-w-7xl mx-auto w-full">
          <Link to="/tours" className="inline-flex items-center gap-2 text-white/70 text-sm mb-4 hover:text-white transition-colors">
            <FiArrowLeft size={14} /> Back to packages
          </Link>
          <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{color:'#7DD3F0'}}>{tour.region}</div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:700,color:'white',lineHeight:1.1}}>{tour.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left */}
        <div className="lg:col-span-2">
          <div className="flex gap-6 mb-8 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-slate"><FiClock size={14} style={{color:'#38B6E8'}} />{tour.duration_nights} nights</div>
            <div className="flex items-center gap-2 text-sm text-slate"><FiUsers size={14} style={{color:'#38B6E8'}} />Max {tour.max_group_size} people</div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{background:'#EBF7FD',color:'#0A5C84'}}>{tour.tour_type}</span>
          </div>

          <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.5rem',fontWeight:700,color:'#0D2136',marginBottom:'1rem'}}>About This Journey</h2>
          <p style={{color:'#3A5369',lineHeight:1.8,marginBottom:'2rem',fontWeight:300}}>{tour.description}</p>

          {tour.highlights?.length > 0 && (
            <div className="mb-8">
              <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',fontWeight:700,color:'#0D2136',marginBottom:'1rem'}}>Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tour.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{background:'#EBF7FD'}}>
                      <FiCheck size={11} style={{color:'#38B6E8'}} />
                    </div>
                    <span style={{fontSize:'0.88rem',color:'#3A5369'}}>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tour.included?.length > 0 && (
              <div>
                <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.1rem',fontWeight:700,color:'#0D2136',marginBottom:'0.8rem'}}>✅ Included</h3>
                <ul style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                  {tour.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2" style={{fontSize:'0.85rem',color:'#3A5369'}}>
                      <FiCheck size={12} style={{color:'#38B6E8',shrink:0}} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tour.excluded?.length > 0 && (
              <div>
                <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.1rem',fontWeight:700,color:'#0D2136',marginBottom:'0.8rem'}}>❌ Not Included</h3>
                <ul style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                  {tour.excluded.map((item, i) => (
                    <li key={i} className="flex items-center gap-2" style={{fontSize:'0.85rem',color:'#3A5369'}}>
                      <FiX size={12} style={{color:'#7A94A8',shrink:0}} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Booking Card */}
        <div>
          <div className="sticky top-24 bg-white rounded-2xl shadow-xl border p-6" style={{borderColor:'#D6EDF7'}}>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',fontWeight:700,color:'#0A5C84',marginBottom:'0.2rem'}}>
              {formatPrice(tour.price)}
            </div>
            <div style={{fontSize:'0.8rem',color:'#7A94A8',marginBottom:'1.5rem'}}>per person</div>

            <div style={{display:'flex',flexDirection:'column',gap:'0.8rem',marginBottom:'1.5rem',padding:'1rem',borderRadius:'12px',background:'#EBF7FD'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.85rem'}}>
                <span style={{color:'#7A94A8'}}>Duration</span>
                <span style={{fontWeight:600,color:'#0D2136'}}>{tour.duration_nights} nights</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.85rem'}}>
                <span style={{color:'#7A94A8'}}>Destination</span>
                <span style={{fontWeight:600,color:'#0D2136'}}>{tour.destination}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.85rem'}}>
                <span style={{color:'#7A94A8'}}>Type</span>
                <span style={{fontWeight:600,color:'#0D2136'}}>{tour.tour_type}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.85rem'}}>
                <span style={{color:'#7A94A8'}}>Max Group</span>
                <span style={{fontWeight:600,color:'#0D2136'}}>{tour.max_group_size} people</span>
              </div>
            </div>

            <button onClick={() => setShowModal(true)}
              style={{width:'100%',background:'#38B6E8',color:'white',border:'none',padding:'1rem',borderRadius:'100px',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.9rem',fontWeight:600,cursor:'pointer',marginBottom:'0.8rem',transition:'background 0.3s'}}
              onMouseOver={e => e.target.style.background='#0A7EB8'}
              onMouseOut={e => e.target.style.background='#38B6E8'}>
              Book This Journey
            </button>
            <Link to="/contact"
              style={{display:'block',width:'100%',border:'1.5px solid #D6EDF7',color:'#3A5369',padding:'0.85rem',borderRadius:'100px',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.85rem',fontWeight:500,textAlign:'center',textDecoration:'none',transition:'border-color 0.3s'}}>
              Make an Enquiry
            </Link>

            <p style={{fontSize:'0.72rem',color:'#7A94A8',textAlign:'center',marginTop:'1rem'}}>
              🔒 Secure payment via Paystack. Our team responds within 2 hours.
            </p>
          </div>
        </div>
      </div>

      <Footer />
      {showModal && <BookingModal tour={tour} onClose={() => setShowModal(false)} />}
    </div>
  )
}