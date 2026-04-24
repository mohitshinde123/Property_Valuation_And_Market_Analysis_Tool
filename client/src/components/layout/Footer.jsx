import { Link } from 'react-router-dom';
import { HiLocationMarker, HiMail, HiPhone } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold">PV</span>
              </div>
              <span className="text-xl font-bold text-white">PropVal<span className="text-blue-400">India</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              India's trusted property valuation and market analysis platform. Make informed real estate decisions with AI-powered insights.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <span className="flex items-center gap-2 text-gray-400"><HiMail className="w-4 h-4" /> support@propvalindia.com</span>
              <span className="flex items-center gap-2 text-gray-400"><HiPhone className="w-4 h-4" /> +91 98765 43210</span>
              <span className="flex items-center gap-2 text-gray-400"><HiLocationMarker className="w-4 h-4" /> Mumbai, India</span>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <div className="space-y-2.5">
              {[
                { to: '/search', label: 'Buy Property' },
                { to: '/search?listingType=rent', label: 'Rent Property' },
                { to: '/valuation', label: 'Property Valuation' },
                { to: '/market', label: 'Market Analysis' },
              ].map(link => (
                <Link key={link.to} to={link.to} className="block text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200">{link.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Tools</h3>
            <div className="space-y-2.5">
              {[
                { to: '/emi-calculator', label: 'EMI Calculator' },
                { to: '/compare', label: 'Compare Properties' },
                { to: '/market', label: 'Price Trends' },
                { to: '/register', label: 'Create Account' },
              ].map(link => (
                <Link key={link.label} to={link.to} className="block text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200">{link.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Top Cities</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'].map(city => (
                <Link key={city} to={`/search?city=${city}`} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">{city}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} PropVal India. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Contact Us</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
