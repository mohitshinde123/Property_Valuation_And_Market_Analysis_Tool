import { useState, useEffect } from 'react';
import { userAPI, leadAPI, propertyAPI } from '../../services/api';
import Loader from '../../components/common/Loader';
import { formatPrice } from '../../utils/constants';
import { HiUsers, HiHome, HiEye, HiChat, HiTrash, HiShieldCheck, HiXCircle, HiCheckCircle, HiChartBar, HiCog, HiUserGroup, HiOfficeBuilding, HiClipboardList } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('dashboard');
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => {
    Promise.all([
      userAPI.getDashboardStats().catch(() => ({ data: {} })),
      userAPI.getAll().catch(() => ({ data: [] })),
      leadAPI.getAll().catch(() => ({ data: [] })),
      propertyAPI.getAll({ limit: 200 }).catch(() => ({ data: { properties: [] } })),
    ]).then(([s, u, l, p]) => {
      setStats(s.data);
      setUsers(u.data);
      setLeads(l.data);
      setAllProperties(p.data.properties || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await userAPI.updateRole(userId, role);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u));
      toast.success('Role updated');
    } catch { toast.error('Failed to update role'); }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await userAPI.delete(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete user'); }
  };

  const handleVerifyProperty = async (propId, verified) => {
    try {
      await propertyAPI.update(propId, { verified });
      setAllProperties(prev => prev.map(p => p._id === propId ? { ...p, verified } : p));
      toast.success(verified ? 'Property verified' : 'Verification removed');
    } catch { toast.error('Failed to update property'); }
  };

  const handlePropertyStatus = async (propId, status) => {
    try {
      await propertyAPI.update(propId, { status });
      setAllProperties(prev => prev.map(p => p._id === propId ? { ...p, status } : p));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const handleDeleteProperty = async (propId) => {
    if (!confirm('Delete this property listing?')) return;
    try {
      await propertyAPI.delete(propId);
      setAllProperties(prev => prev.filter(p => p._id !== propId));
      toast.success('Property deleted');
    } catch { toast.error('Failed to delete property'); }
  };

  if (loading) return <Loader />;

  const sellers = users.filter(u => u.role === 'seller');
  const buyers = users.filter(u => u.role === 'buyer');
  const roleData = stats?.usersByRole?.map(r => ({ name: r._id, count: r.count })) || [];
  const typeData = stats?.propertiesByType?.map(r => ({ name: r._id, count: r.count })) || [];
  const filteredUsers = userFilter ? users.filter(u => u.role === userFilter) : users;

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: HiChartBar },
    { key: 'users', label: 'User Management', icon: HiUsers },
    { key: 'sellers', label: 'Seller Management', icon: HiOfficeBuilding },
    { key: 'buyers', label: 'Buyer Management', icon: HiUserGroup },
    { key: 'moderation', label: 'Listing Moderation', icon: HiClipboardList },
    { key: 'controls', label: 'Platform Controls', icon: HiCog },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Platform overview and management</p>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <t.icon className="w-4 h-4" /> <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {tab === 'dashboard' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Users', value: stats?.totalUsers || 0, icon: HiUsers, color: 'blue' },
              { label: 'Total Properties', value: stats?.totalProperties || 0, icon: HiHome, color: 'green' },
              { label: 'Total Leads', value: leads.length, icon: HiChat, color: 'purple' },
              { label: 'Active Leads', value: leads.filter(l => l.status === 'new').length, icon: HiEye, color: 'orange' },
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Users by Role</h3>
              <div className="h-56">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={roleData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Properties by Type</h3>
              <div className="h-56">
                <ResponsiveContainer>
                  <BarChart data={typeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4,4,0,0]}>
                      {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {leads.slice(0, 8).map(l => (
                <div key={l._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-sm"><span className="font-medium">{l.buyer?.name}</span> inquired about <span className="font-medium">{l.property?.title}</span></p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(l.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
              {leads.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>}
            </div>
          </div>
        </>
      )}

      {/* User Management Tab */}
      {tab === 'users' && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600">Filter by role:</span>
            {['', 'admin', 'seller', 'buyer'].map(r => (
              <button key={r} onClick={() => setUserFilter(r)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${userFilter === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {r || 'All'}
              </button>
            ))}
            <span className="text-sm text-gray-400 ml-auto">{filteredUsers.length} users</span>
          </div>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Name', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{u.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{u.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{u.phone || '-'}</td>
                      <td className="py-3 px-4">
                        <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}
                          className="text-xs border rounded-lg px-2 py-1 capitalize">
                          {['admin', 'buyer', 'seller'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700">
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Seller Management Tab */}
      {tab === 'sellers' && (
        <>
          <p className="text-sm text-gray-500 mb-4">{sellers.length} registered sellers</p>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Seller', 'Email', 'Phone', 'Properties', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sellers.map(s => {
                    const sellerProps = allProperties.filter(p => p.owner?._id === s._id || p.owner === s._id);
                    return (
                      <tr key={s._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{s.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{s.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{s.phone || '-'}</td>
                        <td className="py-3 px-4">
                          <span className="badge bg-blue-100 text-blue-700">{sellerProps.length} listings</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <button onClick={() => handleDeleteUser(s._id)} className="text-red-500 hover:text-red-700">
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Buyer Management Tab */}
      {tab === 'buyers' && (
        <>
          <p className="text-sm text-gray-500 mb-4">{buyers.length} registered buyers</p>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Buyer', 'Email', 'Phone', 'Inquiries', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {buyers.map(b => {
                    const buyerLeads = leads.filter(l => l.buyer?._id === b._id || l.buyer === b._id);
                    return (
                      <tr key={b._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{b.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{b.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{b.phone || '-'}</td>
                        <td className="py-3 px-4">
                          <span className="badge bg-green-100 text-green-700">{buyerLeads.length} inquiries</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <button onClick={() => handleDeleteUser(b._id)} className="text-red-500 hover:text-red-700">
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Listing Moderation Tab */}
      {tab === 'moderation' && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-sm text-gray-500">{allProperties.length} total listings</p>
            <span className="badge bg-green-100 text-green-700">{allProperties.filter(p => p.verified).length} verified</span>
            <span className="badge bg-yellow-100 text-yellow-700">{allProperties.filter(p => !p.verified).length} unverified</span>
          </div>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Property', 'Owner', 'Price', 'Verified', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {allProperties.map(p => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{p.title}</p>
                        <p className="text-xs text-gray-500">{p.address?.locality}, {p.address?.city}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{p.owner?.name || 'Unknown'}</td>
                      <td className="py-3 px-4 text-sm font-medium">{formatPrice(p.price)}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleVerifyProperty(p._id, !p.verified)}
                          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-colors ${p.verified ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {p.verified ? <><HiCheckCircle className="w-3.5 h-3.5" /> Verified</> : <><HiXCircle className="w-3.5 h-3.5" /> Unverified</>}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <select value={p.status} onChange={e => handlePropertyStatus(p._id, e.target.value)}
                          className="text-xs border rounded-lg px-2 py-1 capitalize">
                          {['active', 'inactive', 'sold', 'rented'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleDeleteProperty(p._id)} className="text-red-500 hover:text-red-700">
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Platform Controls Tab */}
      {tab === 'controls' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><HiShieldCheck className="w-5 h-5 text-green-600" /> Platform Health</h3>
            <div className="space-y-3">
              {[
                { label: 'Database Status', value: 'Connected', color: 'green' },
                { label: 'API Status', value: 'Operational', color: 'green' },
                { label: 'Total Users', value: users.length },
                { label: 'Total Properties', value: allProperties.length },
                { label: 'Active Listings', value: allProperties.filter(p => p.status === 'active').length },
                { label: 'Pending Verifications', value: allProperties.filter(p => !p.verified).length },
                { label: 'Open Leads', value: leads.filter(l => l.status === 'new').length },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className={`text-sm font-medium ${item.color === 'green' ? 'text-green-600' : 'text-gray-900'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><HiChartBar className="w-5 h-5 text-blue-600" /> Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Sellers', value: sellers.length, color: 'blue' },
                { label: 'Buyers', value: buyers.length, color: 'green' },
                { label: 'Verified Listings', value: allProperties.filter(p => p.verified).length, color: 'amber' },
                { label: 'Sold Properties', value: allProperties.filter(p => p.status === 'sold').length, color: 'purple' },
                { label: 'Total Leads', value: leads.length, color: 'rose' },
                { label: 'Closed Leads', value: leads.filter(l => l.status === 'closed').length, color: 'cyan' },
              ].map(s => (
                <div key={s.label} className={`bg-${s.color}-50 rounded-lg p-3 text-center`}>
                  <p className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
