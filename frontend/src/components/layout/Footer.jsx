import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-ink text-white/40 pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          <div className="md:col-span-2">
            <div className="font-playfair text-2xl font-bold text-white mb-3">
              BM TRIPS
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-white/40 mb-6">
              Curating exceptional journeys since 2009. Licensed, insured, and always personal.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <FiMapPin size={14} className="text-sky shrink-0" />
                1,Agala Estate,opposite UCH intern hostel Yemetu Ibadan,Oyo State
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <FiPhone size={14} className="text-sky shrink-0" />
                +234 08168799138,08022833798
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <FiMail size={14} className="text-sky shrink-0" />
                hello@bmtrips.com
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-5">Packages</h5>
            <ul className="flex flex-col gap-3">
              {['Beach & Islands','Safari & Wildlife','City & Culture','Honeymoon','Group Tours'].map(i => (
                <li key={i}><Link to="/tours" className="text-sm text-white/30 hover:text-sky transition-colors">{i}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-5">Company</h5>
            <ul className="flex flex-col gap-3">
              {[['Contact', '/contact'],['Travel Journal', '/blog'],['Book a Trip', '/contact']].map(([label, to]) => (
                <li key={label}><Link to={to} className="text-sm text-white/30 hover:text-sky transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/7 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/20">
          <span>© {new Date().getFullYear()} BM TRIPS. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
      </div>
    </footer>
  )
}