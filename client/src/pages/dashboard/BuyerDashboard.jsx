import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, leadAPI } from '../../services/api';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from '../../components/property/PropertyCard';
import Loader from '../../components/common/Loader';
import { HiHeart, HiSearch, HiChat, HiUser, HiCog, HiScale, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function BuyerDashboard() {
  const { user, setUser } = useAuth();
  const [savedProps, setSavedProps] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      userAPI.getSavedProperties().catch(() => ({ data: [] })),
      userAPI.getSavedSearches().catch(() => ({ data: [] })),
      leadAPI.getMy().catch(() => ({ data: [] })),
    ]).then(([sp, ss, l]) => {
      setSavedProps(sp.data);
      setSavedSearches(ss.data);
      setLeads(l.data);
      if (user) setProfileForm({ name: user.name || '', phone: user.phone || '' });
    }).finally(() => setLoading(false));
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(profileForm);
      setUser(res.data);
      toast.success('Profile updated');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handleUnsaveProperty = async (id) => {
    try {
      await userAPI.saveProperty(id);
      setSavedProps(prev => prev.filter(p => p._id !== id));
      toast.success('Removed from saved');
    } catch { toast.error('Failed to remove'); }
  };

  const deleteSavedSearch = async (id) => {
    try {
      await userAPI.deleteSavedSearch(id);
      setSavedSearches(prev => prev.filter(s => s._id !== id));
      toast.success('Search deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <Loader />;

  const tabs = [
    { key: 'profile', label: 'Profile', icon: HiUser },
    { key: 'saved', label: 'Saved Properties', icon: HiHeart },
    { key: 'compare', label: 'Compare & Report', icon: HiScale },
    { key: 'inquiries', label: 'My Inquiries', icon: HiChat },
    { key: 'settings', label: 'Settings', icon: HiCog },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
        <p className="text-gray-500 text-sm">Find and track your dream property</p>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="max-w-xl">
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <HiUser className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="badge bg-green-100 text-green-700 mt-1">Buyer</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-gray-900">{savedProps.length}</p>
                <p className="text-xs text-gray-500">Saved</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-gray-900">{leads.length}</p>
                <p className="text-xs text-gray-500">Inquiries</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-gray-900">{savedSearches.length}</p>
                <p className="text-xs text-gray-500">Searches</p>
              </div>
            </div>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <input type="text" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className="input-field" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                <input type="tel" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input type="email" value={user?.email || ''} disabled className="input-field bg-gray-50 text-gray-500" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : 'Save Changes'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Saved Properties Tab */}
      {tab === 'saved' && (
        savedProps.length === 0 ? (
          <div className="card p-12 text-center">
            <HiHeart className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No saved properties</h3>
            <p className="text-gray-500 text-sm mb-4">Browse properties and click the heart icon to save them here</p>
            <Link to="/search" className="btn-primary text-sm">Browse Properties</Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{savedProps.length} saved properties</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedProps.map(p => (
                <div key={p._id} className="relative">
                  <PropertyCard property={p} />
                  <button onClick={() => handleUnsaveProperty(p._id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors shadow-sm">
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )
      )}

      {/* Compare & Report Tab */}
      {tab === 'compare' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-2">Compare Properties</h3>
            <p className="text-sm text-gray-500 mb-4">Select properties from your saved list to compare them side-by-side</p>
            {savedProps.length < 2 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500 text-sm mb-3">Save at least 2 properties to start comparing</p>
                <Link to="/search" className="btn-primary text-sm">Find Properties</Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {savedProps.slice(0, 6).map(p => (
                    <div key={p._id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{p.title}</p>
                        <p className="text-xs text-gray-500">{p.address?.locality}, {p.address?.city}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to={`/compare?ids=${savedProps.slice(0, 4).map(p => p._id).join(',')}`} className="btn-primary text-sm">
                  Compare {Math.min(savedProps.length, 4)} Properties
                </Link>
              </>
            )}
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-2">Valuation Report</h3>
            <p className="text-sm text-gray-500 mb-4">Get a detailed valuation report for any property or locality</p>
            <div className="flex gap-3">
              <Link to="/valuation" className="btn-secondary text-sm">Property Valuation</Link>
              <Link to="/market" className="btn-secondary text-sm">Market Analysis</Link>
            </div>
          </div>
        </div>
      )}

      {/* My Inquiries Tab */}
      {tab === 'inquiries' && (
        leads.length === 0 ? (
          <div className="card p-12 text-center">
            <HiChat className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No inquiries yet</h3>
            <p className="text-gray-500 text-sm mb-4">When you send an inquiry on a property, it will appear here</p>
            <Link to="/search" className="btn-primary text-sm">Browse Properties</Link>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">{leads.length} inquiries sent</p>
            {leads.map(l => (
              <div key={l._id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <Link to={`/property/${l.property?._id}`} className="font-medium text-sm text-blue-600 hover:underline">
                      {l.property?.title || 'Property'}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {l.property?.address?.locality}, {l.property?.address?.city} &middot; {l.message || 'No message'}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className={`badge ${l.status === 'new' ? 'bg-blue-100 text-blue-700' : l.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' : l.status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {l.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{new Date(l.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Settings Tab */}
      {tab === 'settings' && (
        <div className="max-w-xl space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between bg-gray-50 rounded-lg p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Alerts for Saved Searches</p>
                  <p className="text-xs text-gray-500">Get notified when new properties match your searches</p>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-blue-600 rounded" />
              </label>
              <label className="flex items-center justify-between bg-gray-50 rounded-lg p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-gray-900">Price Drop Alerts</p>
                  <p className="text-xs text-gray-500">Get notified when saved property prices change</p>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-blue-600 rounded" />
              </label>
              <label className="flex items-center justify-between bg-gray-50 rounded-lg p-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-gray-900">Inquiry Status Updates</p>
                  <p className="text-xs text-gray-500">Get notified when sellers respond to your inquiries</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600 rounded" />
              </label>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Saved Searches</h3>
            {savedSearches.length === 0 ? (
              <p className="text-gray-500 text-sm">No saved searches. Use the property search page and save your filter combinations.</p>
            ) : (
              <div className="space-y-3">
                {savedSearches.map(s => (
                  <div key={s._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div>
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-gray-500">
                        {[s.filters?.city, s.filters?.propertyType, s.filters?.bedrooms && `${s.filters.bedrooms} BHK`].filter(Boolean).join(' | ') || 'All properties'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/search?${new URLSearchParams(Object.fromEntries(Object.entries(s.filters || {}).filter(([,v]) => v))).toString()}`}
                        className="btn-secondary text-xs py-1 px-3">Run</Link>
                      <button onClick={() => deleteSavedSearch(s._id)} className="text-red-500 hover:text-red-700"><HiTrash className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
