import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import api from '../../utils/api'
import { formatPrice } from '../../utils/helpers'

export default function BookingModal({ tour, onClose }) {
  const [form, setForm] = useState({ full_name:'', email:'', phone:'', num_travellers:1, travel_date:'', special_requests:'' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const total = tour.price * form.num_travellers

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/bookings', { ...form, tour_id: tour.id })

      // Paystack popup
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: data.paystack_amount,
        currency: 'NGN',
        ref: data.booking.reference,
        metadata: { name: form.full_name, tour: tour.title },
        callback: async (response) => {
          await api.post(`/bookings/verify/${response.reference}`, {
            booking_reference: data.booking.reference,
          })
          setDone(true)
          toast.success('Booking confirmed! Check your email.')
        },
        onClose: () => toast('Payment window closed'),
      })
      handler.openIframe()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-sky-tint flex items-center justify-center text-slate hover:bg-sky-mid transition-colors">
            <FiX size={16} />
          </button>

          {done ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-playfair text-2xl font-bold text-ink mb-2">Booking Confirmed!</h3>
              <p className="text-slate text-sm">Check your email for confirmation details. Our team will be in touch within 2 hours.</p>
              <button onClick={onClose} className="mt-6 bg-sky text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-sky-dark transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="text-xs font-semibold tracking-wider uppercase text-sky mb-1">{tour.region}</div>
              <h3 className="font-playfair text-2xl font-bold text-ink mb-6">{tour.title}</h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-muted mb-1.5">Full Name</label>
                    <input name="full_name" value={form.full_name} onChange={handleChange} required placeholder="Your name"
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-ink outline-none focus:border-sky transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-muted mb-1.5">Travellers</label>
                    <select name="num_travellers" value={form.num_travellers} onChange={handleChange}
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-ink outline-none focus:border-sky transition-colors">
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-muted mb-1.5">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com"
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-ink outline-none focus:border-sky transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-muted mb-1.5">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000"
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-ink outline-none focus:border-sky transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-muted mb-1.5">Travel Date</label>
                  <input name="travel_date" type="date" value={form.travel_date} onChange={handleChange}
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-ink outline-none focus:border-sky transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-muted mb-1.5">Special Requests</label>
                  <textarea name="special_requests" value={form.special_requests} onChange={handleChange} rows={3}
                    placeholder="Any dietary needs, accessibility requirements, special occasions..."
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-ink outline-none focus:border-sky transition-colors resize-none" />
                </div>

                <div className="bg-sky-tint rounded-xl p-4 flex justify-between items-center">
                  <span className="text-sm text-slate font-medium">Total Amount</span>
                  <span className="font-playfair text-xl font-bold text-sky-deep">{formatPrice(total)}</span>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-sky text-white py-3 rounded-full font-semibold text-sm hover:bg-sky-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? 'Processing...' : `Pay ${formatPrice(total)} via Paystack`}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}