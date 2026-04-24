import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyAPI, leadAPI } from '../../services/api';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import { formatPrice, CITIES, PROPERTY_TYPES, LISTING_TYPES, FURNISHING_OPTIONS, AGE_OPTIONS, AMENITIES_LIST } from '../../utils/constants';
import { HiHome, HiChat, HiEye, HiCurrencyRupee, HiPlus, HiPencil, HiTrash, HiUser, HiChartBar, HiUpload } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import toast from 'react-hot-toast';

export default function SellerDashboard() {
  const { user, setUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  const emptyProperty = {
    title: '', description: '', propertyType: 'apartment', listingType: 'sale',
    price: '', area: '', bedrooms: '2', bathrooms: '2', balconies: '1',
    floor: '0', totalFloors: '1', furnishing: 'semi-furnished', parking: '1',
    facing: 'east', age: 'new', amenities: [],
    city: '', locality: '', state: '', street: '', pincode: '',
  };
  const [propForm, setPropForm] = useState(emptyProperty);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([
      propertyAPI.getMy().catch(() => ({ data: [] })),
      leadAPI.getMy().catch(() => ({ data: [] })),
    ]).then(([p, l]) => {
      setProperties(p.data);
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

  const handleUploadProperty = async (e) => {
    e.preventDefault();
    if (!propForm.title || !propForm.price || !propForm.area || !propForm.city) {
      toast.error('Please fill in all required fields'); return;
    }
    setUploading(true);
    try {
      const payload = {
        title: propForm.title,
        description: propForm.description,
        propertyType: propForm.propertyType,
        listingType: propForm.listingType,
        price: Number(propForm.price),
        area: Number(propForm.area),
        bedrooms: Number(propForm.bedrooms),
        bathrooms: Number(propForm.bathrooms),
        balconies: Number(propForm.balconies),
        floor: Number(propForm.floor),
        totalFloors: Number(propForm.totalFloors),
        furnishing: propForm.furnishing,
        parking: Number(propForm.parking),
        facing: propForm.facing,
        age: propForm.age,
        amenities: propForm.amenities,
        address: {
          street: propForm.street,
          locality: propForm.locality,
          city: propForm.city,
          state: propForm.state,
          pincode: propForm.pincode,
        },
      };
      const res = await propertyAPI.create(payload);
      setProperties(prev => [res.data, ...prev]);
      setPropForm(emptyProperty);
      toast.success('Property listed successfully!');
      setTab('listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list property');
    } finally { setUploading(false); }
  };

  const handleDeleteProperty = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await propertyAPI.delete(id);
      setProperties(prev => prev.filter(p => p._id !== id));
      toast.success('Property deleted');
    } catch { toast.error('Failed to delete property'); }
  };

  const toggleAmenity = (a) => {
    setPropForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a],
    }));
  };

  if (loading) return <Loader />;

  const activeProps = properties.filter(p => p.status === 'active');
  const soldProps = properties.filter(p => p.status === 'sold');
  const totalViews = properties.reduce((s, p) => s + (p.views || 0), 0);
  const totalInquiries = properties.reduce((s, p) => s + (p.inquiries || 0), 0);
  const totalValue = activeProps.reduce((s, p) => s + p.price, 0);

  const viewsData = properties.slice(0, 8).map(p => ({
    name: p.title?.substring(0, 12) + '...',
    views: p.views || 0,
    inquiries: p.inquiries || 0,
  }));

  const tabs = [
    { key: 'profile', label: 'Profile', icon: HiUser },
    { key: 'listings', label: 'My Listings', icon: HiHome },
    { key: 'upload', label: 'Upload Property', icon: HiUpload },
    { key: 'analytics', label: 'Analytics', icon: HiChartBar },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage your properties and track performance</p>
        </div>
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <HiUser className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="badge bg-orange-100 text-orange-700 mt-1">Seller</span>
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

      {/* My Listings Tab */}
      {tab === 'listings' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">{properties.length} total listings</p>
            <button onClick={() => setTab('upload')} className="btn-primary text-sm flex items-center gap-1"><HiPlus className="w-4 h-4" /> New Listing</button>
          </div>
          {properties.length === 0 ? (
            <div className="card p-12 text-center">
              <HiHome className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">You haven't listed any properties yet</p>
              <button onClick={() => setTab('upload')} className="btn-primary text-sm">List Your First Property</button>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Property', 'Price', 'Type', 'Status', 'Views', 'Inquiries', 'Actions'].map(h => (
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
                        <td className="py-3 px-4 text-sm capitalize">{p.listingType}</td>
                        <td className="py-3 px-4">
                          <span className={`badge ${p.status === 'active' ? 'bg-green-100 text-green-700' : p.status === 'sold' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{p.status}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">{p.views}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{p.inquiries}</td>
                        <td className="py-3 px-4">
                          <button onClick={() => handleDeleteProperty(p._id)} className="text-red-500 hover:text-red-700"><HiTrash className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Upload Property Tab */}
      {tab === 'upload' && (
        <div className="max-w-3xl">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><HiUpload className="w-5 h-5 text-blue-600" /> List New Property</h2>
            <form onSubmit={handleUploadProperty} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Property Title *</label>
                <input type="text" value={propForm.title} onChange={e => setPropForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g., 3 BHK Apartment in Bandra West" className="input-field" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <textarea value={propForm.description} onChange={e => setPropForm(p => ({ ...p, description: e.target.value }))}
                  rows={3} placeholder="Describe your property..." className="input-field" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Property Type *</label>
                  <select value={propForm.propertyType} onChange={e => setPropForm(p => ({ ...p, propertyType: e.target.value }))} className="input-field">
                    {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Listing Type *</label>
                  <select value={propForm.listingType} onChange={e => setPropForm(p => ({ ...p, listingType: e.target.value }))} className="input-field">
                    {LISTING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Price (INR) *</label>
                  <input type="number" value={propForm.price} onChange={e => setPropForm(p => ({ ...p, price: e.target.value }))} placeholder="5000000" className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Area (sq.ft) *</label>
                  <input type="number" value={propForm.area} onChange={e => setPropForm(p => ({ ...p, area: e.target.value }))} placeholder="1200" className="input-field" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Bedrooms</label>
                  <select value={propForm.bedrooms} onChange={e => setPropForm(p => ({ ...p, bedrooms: e.target.value }))} className="input-field">
                    {[0,1,2,3,4,5].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Bathrooms</label>
                  <select value={propForm.bathrooms} onChange={e => setPropForm(p => ({ ...p, bathrooms: e.target.value }))} className="input-field">
                    {[1,2,3,4,5].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Balconies</label>
                  <select value={propForm.balconies} onChange={e => setPropForm(p => ({ ...p, balconies: e.target.value }))} className="input-field">
                    {[0,1,2,3].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Floor</label>
                  <input type="number" value={propForm.floor} onChange={e => setPropForm(p => ({ ...p, floor: e.target.value }))} className="input-field" min="0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Total Floors</label>
                  <input type="number" value={propForm.totalFloors} onChange={e => setPropForm(p => ({ ...p, totalFloors: e.target.value }))} className="input-field" min="1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Furnishing</label>
                  <select value={propForm.furnishing} onChange={e => setPropForm(p => ({ ...p, furnishing: e.target.value }))} className="input-field">
                    {FURNISHING_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Parking</label>
                  <select value={propForm.parking} onChange={e => setPropForm(p => ({ ...p, parking: e.target.value }))} className="input-field">
                    {[0,1,2,3].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Facing</label>
                  <select value={propForm.facing} onChange={e => setPropForm(p => ({ ...p, facing: e.target.value }))} className="input-field">
                    {['north','south','east','west','north-east','north-west','south-east','south-west'].map(f => <option key={f} value={f} className="capitalize">{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Property Age</label>
                  <select value={propForm.age} onChange={e => setPropForm(p => ({ ...p, age: e.target.value }))} className="input-field">
                    {AGE_OPTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Amenities</label>
                <div className="flex flex-wrap gap-1.5">
                  {AMENITIES_LIST.map(a => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={`badge py-1.5 px-2.5 cursor-pointer capitalize transition-colors ${propForm.amenities.includes(a) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {a.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <hr />
              <h3 className="font-semibold text-gray-900">Location</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">City *</label>
                  <select value={propForm.city} onChange={e => setPropForm(p => ({ ...p, city: e.target.value }))} className="input-field" required>
                    <option value="">Select City</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Locality *</label>
                  <input type="text" value={propForm.locality} onChange={e => setPropForm(p => ({ ...p, locality: e.target.value }))}
                    placeholder="e.g., Bandra West" className="input-field" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">State</label>
                  <input type="text" value={propForm.state} onChange={e => setPropForm(p => ({ ...p, state: e.target.value }))}
                    placeholder="e.g., Maharashtra" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Street</label>
                  <input type="text" value={propForm.street} onChange={e => setPropForm(p => ({ ...p, street: e.target.value }))} placeholder="Street address" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Pincode</label>
                  <input type="text" value={propForm.pincode} onChange={e => setPropForm(p => ({ ...p, pincode: e.target.value }))} placeholder="400050" className="input-field" />
                </div>
              </div>

              <button type="submit" disabled={uploading} className="btn-primary w-full text-sm">
                {uploading ? 'Publishing...' : 'Publish Listing'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {tab === 'analytics' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {[
              { label: 'Total Listings', value: properties.length, color: 'blue' },
              { label: 'Active', value: activeProps.length, color: 'green' },
              { label: 'Sold', value: soldProps.length, color: 'purple' },
              { label: 'Total Views', value: totalViews, color: 'cyan' },
              { label: 'Inquiries', value: totalInquiries, color: 'orange' },
              { label: 'Portfolio', value: formatPrice(totalValue), color: 'rose' },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <p className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Property Performance</h3>
              <div className="h-64">
                {viewsData.length > 0 ? (
                  <ResponsiveContainer>
                    <BarChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#3b82f6" name="Views" radius={[4,4,0,0]} />
                      <Bar dataKey="inquiries" fill="#10b981" name="Inquiries" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-gray-500 text-center py-20">No data yet</p>}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Recent Inquiries</h3>
              {leads.length === 0 ? <p className="text-gray-500 text-sm py-8 text-center">No inquiries received yet</p> : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {leads.slice(0, 10).map(l => (
                    <div key={l._id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{l.buyer?.name || 'Buyer'}</p>
                        <p className="text-xs text-gray-500">{l.property?.title}</p>
                        {l.message && <p className="text-xs text-gray-400 mt-0.5 italic">"{l.message}"</p>}
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className={`badge ${l.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{l.status}</span>
                        <p className="text-xs text-gray-400 mt-1">{new Date(l.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
