import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiClock, FiTag } from 'react-icons/fi'
import { formatPrice } from '../../utils/helpers'

export default function TourCard({ tour, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
    >
      <div className="relative overflow-hidden h-52">
        {tour.image_url
          ? <img src={tour.image_url} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-8xl" style={{ background: tour.bg_gradient }}>
              {tour.emoji}
            </div>
        }
        {tour.badge && (
          <span className="absolute top-3 left-3 bg-white text-sky-deep text-xs font-bold px-3 py-1 rounded-full shadow">
            {tour.badge}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="text-xs font-semibold tracking-wider uppercase text-sky mb-1">{tour.region}</div>
        <h3 className="font-playfair text-lg font-bold text-ink mb-2 leading-tight">{tour.title}</h3>
        <p className="text-sm text-slate leading-relaxed mb-4 line-clamp-2">{tour.short_desc}</p>

        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1 text-xs text-muted">
            <FiClock size={12} /> {tour.duration_nights} nights
          </span>
          <span className="flex items-center gap-1 text-xs text-muted">
            <FiTag size={12} /> {tour.tour_type}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="font-playfair text-lg font-bold text-sky-deep">{formatPrice(tour.price)}</span>
            <span className="text-xs text-muted ml-1">/ person</span>
          </div>
          <Link to={`/tours/${tour.slug}`} className="bg-sky text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-sky-dark transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  )
}