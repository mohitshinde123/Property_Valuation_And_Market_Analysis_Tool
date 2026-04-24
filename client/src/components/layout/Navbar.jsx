import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HiMenu, HiX, HiUser, HiLogout, HiHome, HiSearch, HiChartBar, HiCalculator, HiViewGrid } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    return `/dashboard/${user.role}`;
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: HiHome },
    { to: '/search', label: 'Properties', icon: HiSearch },
    { to: '/valuation', label: 'Valuation', icon: HiCalculator },
    { to: '/market', label: 'Market Analysis', icon: HiChartBar },
    { to: '/emi-calculator', label: 'EMI Calculator', icon: HiCalculator },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/30 border-b border-gray-100/50' : 'bg-white border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:shadow-lg group-hover:shadow-blue-600/30 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-sm">PV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PropVal<span className="gradient-text">India</span></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${isActive(link.to) ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'}`}>
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <span className={`badge ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : user.role === 'seller' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {user.role}
                  </span>
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 py-2 z-50 animate-slide-down">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link to={getDashboardLink()} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={() => setDropdownOpen(false)}>
                        <HiViewGrid className="w-4 h-4 mr-3" /> Dashboard
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <HiLogout className="w-4 h-4 mr-3" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-5">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </div>
            )}
          </div>

          <button className="md:hidden flex items-center p-2 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navLinks.map((link, i) => (
            <Link key={link.to} to={link.to}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive(link.to) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => setMobileOpen(false)}>
              <link.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          ))}
          <hr className="my-2 border-gray-100" />
          {user ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <Link to={getDashboardLink()} className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors" onClick={() => setMobileOpen(false)}>
                <HiViewGrid className="w-5 h-5" /> <span className="font-medium text-sm">Dashboard</span>
              </Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl w-full transition-colors">
                <HiLogout className="w-5 h-5" /> <span className="font-medium text-sm">Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex space-x-2 pt-2 px-2">
              <Link to="/login" className="btn-secondary flex-1 text-center text-sm" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn-primary flex-1 text-center text-sm" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
