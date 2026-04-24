import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { valuationAPI } from '../services/api';
import PropertyCard from '../components/property/PropertyCard';
import Loader from '../components/common/Loader';
import { CITIES, PROPERTY_TYPES, FURNISHING_OPTIONS, AGE_OPTIONS, AMENITIES_LIST, formatPrice, formatArea } from '../utils/constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { HiCurrencyRupee, HiTrendingUp, HiShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ValuationTool() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    city: searchParams.get('city') || '',
    locality: searchParams.get('locality') || '',
    propertyType: searchParams.get('propertyType') || 'apartment',
    area: searchParams.get('area') || '',
    bedrooms: searchParams.get('bedrooms') || '2',
    floor: '5',
    totalFloors: '15',
    furnishing: searchParams.get('furnishing') || 'semi-furnished',
    age: 'new',
    parking: '1',
    amenities: [],
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.city || !form.area) { toast.error('City and area are required'); return; }
    setLoading(true);
    try {
      const res = await valuationAPI.calculate({
        ...form,
        area: Number(form.area),
        bedrooms: Number(form.bedrooms),
        floor: Number(form.floor),
        totalFloors: Number(form.totalFloors),
        parking: Number(form.parking),
      });
      setResult(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Valuation failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (a) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a],
    }));
  };

  const breakdownData = result?.breakdown?.adjustments ? Object.entries(result.breakdown.adjustments).map(([key, val]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    adjustment: parseFloat(val.adjustment),
  })) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Valuation Tool</h1>
        <p className="text-gray-500">Get an instant estimate of your property's market value</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card p-6 space-y-4 sticky top-20">
            <h2 className="font-semibold text-lg mb-2">Property Details</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">City *</label>
                <select value={form.city} onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))} className="input-field text-sm" required>
                  <option value="">Select City</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Locality</label>
                <input type="text" value={form.locality} onChange={e => setForm(prev => ({ ...prev, locality: e.target.value }))}
                  placeholder="e.g., Bandra West" className="input-field text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Property Type</label>
                <select value={form.propertyType} onChange={e => setForm(prev => ({ ...prev, propertyType: e.target.value }))} className="input-field text-sm">
                  {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Area (sq.ft) *</label>
                <input type="number" value={form.area} onChange={e => setForm(prev => ({ ...prev, area: e.target.value }))}
                  placeholder="1200" className="input-field text-sm" required />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Bedrooms</label>
                <select value={form.bedrooms} onChange={e => setForm(prev => ({ ...prev, bedrooms: e.target.value }))} className="input-field text-sm">
                  {[1,2,3,4,5].map(b => <option key={b} value={b}>{b} BHK</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Floor</label>
                <input type="number" value={form.floor} onChange={e => setForm(prev => ({ ...prev, floor: e.target.value }))} className="input-field text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Total Floors</label>
                <input type="number" value={form.totalFloors} onChange={e => setForm(prev => ({ ...prev, totalFloors: e.target.value }))} className="input-field text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Furnishing</label>
                <select value={form.furnishing} onChange={e => setForm(prev => ({ ...prev, furnishing: e.target.value }))} className="input-field text-sm">
                  {FURNISHING_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Property Age</label>
                <select value={form.age} onChange={e => setForm(prev => ({ ...prev, age: e.target.value }))} className="input-field text-sm">
                  {AGE_OPTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Parking Spots</label>
              <input type="number" value={form.parking} onChange={e => setForm(prev => ({ ...prev, parking: e.target.value }))} className="input-field text-sm" min="0" max="5" />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-2 block">Amenities</label>
              <div className="flex flex-wrap gap-1.5">
                {AMENITIES_LIST.map(a => (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)}
                    className={`badge py-1.5 px-2.5 cursor-pointer capitalize transition-colors ${form.amenities.includes(a) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {a.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Calculating...' : 'Get Valuation'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? <Loader text="Calculating valuation..." /> : result ? (
            <>
              {/* Valuation Card */}
              <div className="glass-card p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-1">Estimated Market Value</p>
                  <p className="text-4xl font-bold text-blue-600">{formatPrice(result.estimatedValue)}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Range: {formatPrice(result.lowEstimate)} - {formatPrice(result.highEstimate)}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/70 rounded-xl p-3">
                    <HiCurrencyRupee className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{formatPrice(result.pricePerSqFt || result.baseRate)}</p>
                    <p className="text-xs text-gray-500">Per sq.ft</p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-3">
                    <HiTrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{result.confidence || 0}%</p>
                    <p className="text-xs text-gray-500">Confidence</p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-3">
                    <HiShieldCheck className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{formatArea(Number(form.area))}</p>
                    <p className="text-xs text-gray-500">Area</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              {breakdownData.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-semibold text-lg mb-4">Price Adjustments</h3>
                  <div className="h-64">
                    <ResponsiveContainer>
                      <BarChart data={breakdownData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={v => `${v}%`} />
                        <YAxis type="category" dataKey="name" width={80} />
                        <Tooltip formatter={v => `${v}%`} />
                        <Bar dataKey="adjustment" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-xs">Base Rate</p>
                      <p className="font-semibold">{formatPrice(result.breakdown?.baseRate)}/sq.ft</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-xs">Adjusted Rate</p>
                      <p className="font-semibold">{formatPrice(result.breakdown?.adjustedRate)}/sq.ft</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Locality Info */}
              {result.localityInfo && (
                <div className="card p-6">
                  <h3 className="font-semibold text-lg mb-4">Locality Insights</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-600">{result.localityInfo.demandScore}</p>
                      <p className="text-xs text-gray-500">Demand Score</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">{result.localityInfo.supplyScore}</p>
                      <p className="text-xs text-gray-500">Supply Score</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-amber-600">{result.localityInfo.appreciation}/5</p>
                      <p className="text-xs text-gray-500">Appreciation</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-purple-600">{result.localityInfo.ratings?.livability}/5</p>
                      <p className="text-xs text-gray-500">Livability</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparables */}
              {result.comparables?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Comparable Properties</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.comparables.map(p => <PropertyCard key={p._id} property={p} />)}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card p-12 text-center">
              <HiCurrencyRupee className="w-16 h-16 text-blue-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Enter Property Details</h3>
              <p className="text-gray-500 text-sm">Fill in the form to get an instant property valuation with detailed breakdown and comparable analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
