import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiLockClosed, HiPhone, HiHome, HiSearch, HiOfficeBuilding, HiShieldCheck, HiTrendingUp, HiCurrencyRupee } from 'react-icons/hi';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'buyer' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await register(form);
      toast.success(`Welcome, ${data.user.name}!`);
      navigate(`/dashboard/${data.user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      value: 'buyer',
      label: 'Buyer',
      icon: HiSearch,
      desc: 'Search, compare, and find your dream property',
      gradient: 'from-green-500 to-emerald-600',
      activeBg: 'bg-green-50 border-green-300 ring-2 ring-green-500/20',
      inactiveBg: 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50',
    },
    {
      value: 'seller',
      label: 'Seller',
      icon: HiOfficeBuilding,
      desc: 'List properties and manage your real estate portfolio',
      gradient: 'from-orange-500 to-red-500',
      activeBg: 'bg-orange-50 border-orange-300 ring-2 ring-orange-500/20',
      inactiveBg: 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/4 left-1/3 w-20 h-20 border-2 border-white/10 rounded-2xl rotate-45 animate-float" />
          <div className="absolute bottom-1/4 right-1/3 w-14 h-14 border-2 border-white/10 rounded-full animate-float-slow" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <span className="text-white font-bold">PV</span>
              </div>
              <span className="text-2xl font-bold text-white">PropVal<span className="text-blue-300">India</span></span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
              Join India's fastest<br />growing property platform
            </h2>
            <p className="text-blue-200/70 text-lg mb-10">
              Whether buying or selling, we've got you covered
            </p>
          </div>
          <div className="space-y-5 animate-fade-in-up delay-200">
            {[
              { icon: HiShieldCheck, text: 'Secure and verified platform', color: 'text-green-400' },
              { icon: HiTrendingUp, text: 'Real-time market data and analytics', color: 'text-blue-300' },
              { icon: HiCurrencyRupee, text: 'Free property valuation tool', color: 'text-amber-400' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <p className="text-white/80 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 bg-gray-50">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-6">
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-6">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <span className="text-white font-bold text-sm">PV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PropVal<span className="gradient-text">India</span></span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 mt-1 text-sm">Start your property journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-4">
            {/* Role Selection */}
            <div className="animate-fade-in-up">
              <label className="text-sm font-medium text-gray-700 mb-2 block">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => setForm(prev => ({ ...prev, role: r.value }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${form.role === r.value ? r.activeBg : r.inactiveBg}`}>
                    <div className={`w-10 h-10 bg-gradient-to-br ${r.gradient} rounded-xl flex items-center justify-center mb-2 shadow-sm`}>
                      <r.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{r.label}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="animate-fade-in-up delay-100">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe" className="input-field pl-10" required />
              </div>
            </div>

            <div className="animate-fade-in-up delay-150">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com" className="input-field pl-10" required />
              </div>
            </div>

            <div className="animate-fade-in-up delay-200">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
              <div className="relative">
                <HiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="9876543210" className="input-field pl-10" />
              </div>
            </div>

            <div className="animate-fade-in-up delay-300">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Min 6 characters" className="input-field pl-10" required minLength={6} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 animate-fade-in-up delay-400">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : `Create ${form.role === 'buyer' ? 'Buyer' : 'Seller'} Account`}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
