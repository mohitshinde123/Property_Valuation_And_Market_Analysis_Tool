import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiShieldCheck, HiTrendingUp, HiCurrencyRupee, HiLockClosed, HiMail } from 'react-icons/hi';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(`/dashboard/${data.user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-white/10 rounded-xl rotate-12 animate-float" />
          <div className="absolute bottom-1/3 left-1/4 w-12 h-12 border-2 border-white/10 rounded-full animate-float-slow" />
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
              Your trusted partner in<br />property decisions
            </h2>
            <p className="text-blue-200/70 text-lg mb-10">
              Data-driven insights for smarter real estate investments
            </p>
          </div>
          <div className="space-y-5 animate-fade-in-up delay-200">
            {[
              { icon: HiShieldCheck, text: 'Verified property listings across 8+ cities', color: 'text-green-400' },
              { icon: HiTrendingUp, text: 'AI-powered market analysis and price trends', color: 'text-blue-300' },
              { icon: HiCurrencyRupee, text: 'Instant property valuation with accuracy', color: 'text-amber-400' },
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
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 bg-gray-50">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-6">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <span className="text-white font-bold text-sm">PV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PropVal<span className="gradient-text">India</span></span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-1 text-sm">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-5">
            <div className="animate-fade-in-up delay-100">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com" className="input-field pl-10" required />
              </div>
            </div>
            <div className="animate-fade-in-up delay-200">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input type="password" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password" className="input-field pl-10" required />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 animate-fade-in-up delay-300">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>

            <p className="text-center text-sm text-gray-500 animate-fade-in-up delay-400">
              Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create one</Link>
            </p>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-400 text-center mb-3 font-medium uppercase tracking-wider">Quick Demo Access</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'Admin', email: 'admin@propval.com', color: 'purple' },
                  { role: 'Buyer', email: 'buyer1@propval.com', color: 'green' },
                  { role: 'Seller', email: 'seller1@propval.com', color: 'orange' },
                ].map(demo => (
                  <button key={demo.role} type="button"
                    onClick={() => setForm({ email: demo.email, password: demo.role.toLowerCase() + '123' })}
                    className={`bg-${demo.color}-50 hover:bg-${demo.color}-100 border border-${demo.color}-100 rounded-xl p-2.5 text-left transition-all duration-200 hover:scale-[1.02]`}>
                    <p className={`font-semibold text-${demo.color}-700 text-xs`}>{demo.role}</p>
                    <p className="text-gray-400 text-[10px] truncate mt-0.5">{demo.email}</p>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
