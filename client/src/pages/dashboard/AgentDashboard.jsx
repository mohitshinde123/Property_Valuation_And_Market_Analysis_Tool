import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyAPI, leadAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import { formatPrice } from '../../utils/constants';
import { HiHome, HiChat, HiEye, HiCurrencyRupee, HiPlus } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    Promise.all([
      propertyAPI.getMy().catch(() => ({ data: [] })),
      leadAPI.getMy().catch(() => ({ data: [] })),
    ]).then(([p, l]) => {
      setProperties(p.data);
      setLeads(l.data);
    }).finally(() => setLoading(false));
  }, []);

  const updateLeadStatus = async (id, status) => {
    try {
      await leadAPI.update(id, { status });
      setLeads(prev => prev.map(l => l._id === id ? { ...l, status } : l));
      toast.success('Lead updated');
    } catch { toast.error('Failed to update lead'); }
  };

  if (loading) return <Loader />;

  const totalViews = properties.reduce((s, p) => s + (p.views || 0), 0);
  const totalInquiries = properties.reduce((s, p) => s + (p.inquiries || 0), 0);
  const activeProperties = properties.filter(p => p.status === 'active').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome, {user?.name}</p>
        </div>
        <Link to="/property/new" className="btn-primary text-sm flex items-center gap-1"><HiPlus className="w-4 h-4" /> Add Property</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'My Listings', value: properties.length, icon: HiHome, color: 'blue' },
          { label: 'Active', value: activeProperties, icon: HiHome, color: 'green' },
          { label: 'Total Views', value: totalViews, icon: HiEye, color: 'purple' },
          { label: 'Inquiries', value: totalInquiries, icon: HiChat, color: 'orange' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${s.color}-100 rounded-lg flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 text-${s.color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {['overview', 'properties', 'leads'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Recent Leads</h3>
            {leads.length === 0 ? <p className="text-gray-500 text-sm">No leads yet</p> : (
              <div className="space-y-3">
                {leads.slice(0, 5).map(l => (
                  <div key={l._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div>
                      <p className="text-sm font-medium">{l.buyer?.name || 'Buyer'}</p>
                      <p className="text-xs text-gray-500">{l.property?.title || 'Property'}</p>
                    </div>
                    <span className={`badge ${l.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{l.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Top Performing Listings</h3>
            {properties.length === 0 ? <p className="text-gray-500 text-sm">No listings yet</p> : (
              <div className="space-y-3">
                {[...properties].sort((a, b) => b.views - a.views).slice(0, 5).map(p => (
                  <Link key={p._id} to={`/property/${p._id}`} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100">
                    <div>
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-gray-500">{formatPrice(p.price)}</p>
                    </div>
                    <span className="text-xs text-gray-500">{p.views} views</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'properties' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Property', 'Price', 'Status', 'Views', 'Inquiries'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {properties.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link to={`/property/${p._id}`} className="text-sm font-medium text-blue-600 hover:underline">{p.title}</Link>
                      <p className="text-xs text-gray-500">{p.address?.locality}, {p.address?.city}</p>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{formatPrice(p.price)}</td>
                    <td className="py-3 px-4"><span className={`badge ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{p.status}</span></td>
                    <td className="py-3 px-4 text-sm text-gray-500">{p.views}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{p.inquiries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'leads' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Buyer', 'Property', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map(l => (
                  <tr key={l._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium">{l.buyer?.name}</p>
                      <p className="text-xs text-gray-500">{l.buyer?.phone || l.buyer?.email}</p>
                    </td>
                    <td className="py-3 px-4 text-sm">{l.property?.title || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <select value={l.status} onChange={e => updateLeadStatus(l._id, e.target.value)}
                        className="text-xs border rounded-lg px-2 py-1">
                        {['new', 'contacted', 'interested', 'negotiating', 'closed', 'lost'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{new Date(l.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{l.message || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
