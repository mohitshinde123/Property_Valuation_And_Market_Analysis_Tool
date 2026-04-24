import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyAPI, marketAPI } from '../services/api';
import PropertyCard from '../components/property/PropertyCard';
import Loader from '../components/common/Loader';
import { CITIES, PROPERTY_TYPES, formatPrice } from '../utils/constants';
import { HiSearch, HiTrendingUp, HiShieldCheck, HiCurrencyRupee, HiChartBar, HiCalculator, HiLocationMarker, HiArrowRight, HiStar, HiUsers, HiHome } from 'react-icons/hi';

const CITY_GRADIENTS = {
  'Mumbai': 'from-blue-500 to-indigo-600',
  'Delhi NCR': 'from-orange-500 to-red-500',
  'Bangalore': 'from-green-500 to-teal-600',
  'Hyderabad': 'from-pink-500 to-rose-600',
  'Chennai': 'from-cyan-500 to-blue-600',
  'Pune': 'from-purple-500 to-indigo-600',
  'Kolkata': 'from-amber-500 to-orange-600',
  'Ahmedabad': 'from-emerald-500 to-green-600',
};

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');
  const [listingType, setListingType] = useState('sale');

  useEffect(() => {
    Promise.all([
      propertyAPI.getFeatured().catch(() => ({ data: [] })),
      marketAPI.getOverview().catch(() => ({ data: null })),
    ]).then(([featRes, ovRes]) => {
      setFeatured(featRes.data);
      setOverview(ovRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (searchType) params.set('propertyType', searchType);
    params.set('listingType', listingType);
    navigate(`/search?${params.toString()}`);
  };

  if (loading) return <Loader text="Loading PropVal India..." />;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white overflow-hidden min-h-[600px] flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-16 left-8 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-16 right-16 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse-soft" />
          {/* Decorative geometric shapes */}
          <div className="absolute top-24 right-1/4 w-16 h-16 border-2 border-white/10 rounded-xl rotate-12 animate-float" />
          <div className="absolute bottom-32 left-1/4 w-12 h-12 border-2 border-white/10 rounded-full animate-float-slow" />
          <div className="absolute top-1/3 right-12 w-20 h-20 border border-white/5 rounded-2xl rotate-45 animate-float" style={{ animationDelay: '1s' }} />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10 w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/10">
                <HiStar className="w-4 h-4 text-amber-400" />
                Trusted by 10,000+ property buyers
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight animate-fade-in-up delay-100">
              Find Your Perfect{' '}
              <span className="relative">
                <span className="text-orange-400">Property</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none"><path d="M1 5.5Q50 1 100 5t99-1" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" /></svg>
              </span>
              {' '}in India
            </h1>
            <p className="text-lg text-blue-100/80 mb-8 animate-fade-in-up delay-200 max-w-xl mx-auto">
              AI-powered valuation, real-time market insights, and {overview?.totalProperties?.toLocaleString() || '1000'}+ verified properties across {overview?.totalCities || 8} major cities
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto animate-fade-in-up delay-300">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-3 shadow-2xl shadow-black/20 border border-white/30">
              <div className="flex mb-3 bg-gray-100 rounded-xl p-1 w-fit">
                {['sale', 'rent', 'lease'].map(type => (
                  <button key={type} type="button"
                    onClick={() => setListingType(type)}
                    className={`px-5 py-2 text-sm font-medium rounded-lg capitalize transition-all duration-300 ${listingType === type ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-gray-600 hover:bg-gray-200'}`}
                  >{type === 'sale' ? 'Buy' : type === 'rent' ? 'Rent' : 'Lease'}</button>
                ))}
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <select value={searchCity} onChange={e => setSearchCity(e.target.value)}
                  className="input-field flex-1 text-gray-700">
                  <option value="">All Cities</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={searchType} onChange={e => setSearchType(e.target.value)}
                  className="input-field flex-1 text-gray-700">
                  <option value="">All Property Types</option>
                  {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <button type="submit" className="btn-accent flex items-center justify-center gap-2 px-8 shadow-lg shadow-orange-500/20">
                  <HiSearch className="w-5 h-5" /> Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Stats Bar */}
      {overview && (
        <section className="bg-white border-b border-gray-100 relative -mt-6 z-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Properties', value: overview.totalProperties?.toLocaleString(), icon: HiHome, color: 'blue', bg: 'bg-blue-50' },
                { label: 'Cities Covered', value: overview.totalCities, icon: HiLocationMarker, color: 'green', bg: 'bg-green-50' },
                { label: 'Localities', value: overview.totalLocalities, icon: HiTrendingUp, color: 'purple', bg: 'bg-purple-50' },
                { label: 'Avg. Rate', value: `${formatPrice(overview.avgPricePerSqFt)}/sqft`, icon: HiCurrencyRupee, color: 'orange', bg: 'bg-orange-50' },
              ].map((stat, i) => (
                <div key={stat.label} className={`flex items-center gap-4 animate-fade-in-up`} style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`${stat.bg} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10">
          <div className="animate-fade-in-up">
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Curated for you</span>
            <h2 className="section-title mt-1">Featured Properties</h2>
            <p className="text-gray-500 mt-2">Handpicked properties from top localities</p>
          </div>
          <Link to="/search" className="btn-secondary text-sm flex items-center gap-2 animate-fade-in-up delay-200">
            View All <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 8).map((prop, i) => (
              <div key={prop._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 75}ms` }}>
                <PropertyCard property={prop} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <HiHome className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No featured properties available yet.</p>
          </div>
        )}
      </section>

      {/* Tools Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Smart Tools</span>
            <h2 className="section-title mt-1">Powerful Tools at Your Fingertips</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">Everything you need to make smart real estate decisions, powered by AI and real market data</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Property Valuation', desc: 'Get instant AI-powered property value estimates with detailed price breakdown and comparable analysis.', icon: HiCurrencyRupee, link: '/valuation', gradient: 'from-blue-500 to-indigo-600', lightBg: 'bg-blue-50' },
              { title: 'Market Analysis', desc: 'Explore price trends, locality insights, and demand-supply dynamics across major Indian cities.', icon: HiChartBar, link: '/market', gradient: 'from-emerald-500 to-teal-600', lightBg: 'bg-emerald-50' },
              { title: 'EMI Calculator', desc: 'Calculate your monthly EMI, total interest, and get a complete amortization schedule.', icon: HiCalculator, link: '/emi-calculator', gradient: 'from-purple-500 to-indigo-600', lightBg: 'bg-purple-50' },
            ].map((tool, i) => (
              <Link key={tool.title} to={tool.link}
                className="card-hover-lift p-8 group animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{tool.desc}</p>
                <span className="text-blue-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Try Now <HiArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Locations</span>
          <h2 className="section-title mt-1">Explore by City</h2>
          <p className="text-gray-500 mt-2">Find properties across India's top metro cities</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CITIES.map((city, i) => (
            <Link key={city} to={`/search?city=${city}`}
              className="card-hover-lift p-6 text-center group animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`w-14 h-14 bg-gradient-to-br ${CITY_GRADIENTS[city] || 'from-blue-500 to-indigo-600'} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <HiLocationMarker className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{city}</h3>
              <p className="text-xs text-gray-400 mt-1">Explore properties</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: HiShieldCheck, title: 'Verified Listings', desc: 'All properties are verified by our team to ensure authenticity and accuracy', color: 'from-green-500 to-emerald-600' },
              { icon: HiTrendingUp, title: 'AI-Powered Insights', desc: 'Get accurate property valuations and market trends powered by machine learning', color: 'from-blue-500 to-indigo-600' },
              { icon: HiUsers, title: 'Trusted Network', desc: 'Join thousands of buyers and sellers making informed property decisions', color: 'from-purple-500 to-pink-600' },
            ].map((item, i) => (
              <div key={item.title} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse-soft" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in-up">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HiShieldCheck className="w-8 h-8 text-blue-200" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
            <p className="text-blue-100/80 mb-8 max-w-lg mx-auto">Join thousands of buyers and sellers who trust PropVal India for data-driven real estate decisions</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="bg-white text-blue-600 font-semibold py-3.5 px-8 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl flex items-center justify-center gap-2">
                Get Started Free <HiArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/valuation" className="border-2 border-white/30 text-white font-semibold py-3.5 px-8 rounded-xl hover:bg-white/10 backdrop-blur-md transition-all duration-300">
                Try Valuation Tool
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
