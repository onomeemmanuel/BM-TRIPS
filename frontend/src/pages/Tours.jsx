import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import TourCard from '../components/ui/TourCard'
import api from '../utils/api'

const types = ['All', 'Beach & Island', 'Safari & Wildlife', 'Culture & Nature', 'Adventure & Culture', 'Honeymoon', 'Culture & Leisure']

export default function Tours() {
  const [tours, setTours] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeType, setActiveType] = useState('All')
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const searchQ = searchParams.get('search') || ''

  useEffect(() => {
    api.get('/tours').then(r => { setTours(r.data); setFiltered(r.data) }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let list = tours
    if (activeType !== 'All') list = list.filter(t => t.tour_type === activeType)
    if (searchQ) list = list.filter(t =>
      t.title.toLowerCase().includes(searchQ.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQ.toLowerCase())
    )
    setFiltered(list)
  }, [activeType, searchQ, tours])

  return (
    <div>
      <Navbar />
      <div className="pt-28 pb-6 px-5" style={{ background: 'linear-gradient(135deg,#0A5C84,#38B6E8)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-2">Handpicked Packages</div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-3">All Journeys</h1>
          <p className="text-white/60 text-sm">{filtered.length} packages available</p>
        </div>
      </div>

      <div className="bg-white sticky top-16 z-30 border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {types.map(t => (
            <button key={t} onClick={() => setActiveType(t)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeType === t ? 'bg-sky text-white' : 'bg-sky-tint text-slate hover:bg-sky-mid'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-sky-tint rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate">No packages found. Try a different filter.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t, i) => <TourCard key={t.id} tour={t} index={i} />)}
          </div>
        )}
      </div>

      <Footer />
      <style>{`
        .font-playfair{font-family:'Playfair Display',serif}
        .text-sky{color:#38B6E8}.bg-sky{background:#38B6E8}.text-sky-deep{color:#0A5C84}
        .bg-sky-tint{background:#EBF7FD}.bg-sky-mid{background:#C5E9F7}
        .text-slate{color:#3A5369}.border-border{border-color:#D6EDF7}
        .scrollbar-hide::-webkit-scrollbar{display:none}
      `}</style>
    </div>
  )
}