import { useState, useEffect } from 'react';
import { marketAPI } from '../services/api';
import Loader from '../components/common/Loader';
import { CITIES, MONTH_NAMES, formatPrice } from '../utils/constants';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { HiTrendingUp, HiLocationMarker, HiChartBar } from 'react-icons/hi';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function MarketAnalysis() {
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [cityData, setCityData] = useState(null);
  const [overview, setOverview] = useState(null);
  const [topLocalities, setTopLocalities] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      marketAPI.getOverview().catch(() => ({ data: null })),
      marketAPI.getTopLocalities().catch(() => ({ data: [] })),
      marketAPI.getCities().catch(() => ({ data: [] })),
    ]).then(([ov, top, cities]) => {
      setOverview(ov.data);
      setTopLocalities(top.data);
      setAllCities(cities.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCity) {
      marketAPI.getCityTrends(selectedCity)
        .then(res => setCityData(res.data))
        .catch(() => setCityData(null));
    }
  }, [selectedCity]);

  if (loading) return <Loader text="Loading market data..." />;

  const trendData = cityData?.trends?.map(t => ({
    name: `${MONTH_NAMES[t.month - 1]} ${t.year}`,
    price: t.avgPrice,
  })) || [];

  const localityCompare = cityData?.localities?.map(l => ({
    name: l.locality,
    price: l.avgPricePerSqFt,
    demand: l.demandScore,
  })) || [];

  const cityCompare = allCities.map(c => ({
    name: c._id,
    price: Math.round(c.avgPrice),
    localities: c.localityCount,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Analysis</h1>
        <p className="text-gray-500">Real-time price trends and locality insights across India</p>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Properties', value: overview.totalProperties?.toLocaleString(), color: 'blue' },
            { label: 'Cities Covered', value: overview.totalCities, color: 'green' },
            { label: 'Total Localities', value: overview.totalLocalities, color: 'purple' },
            { label: 'Avg Price/sqft', value: formatPrice(overview.avgPricePerSqFt), color: 'orange' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <p className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* City Selector */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-sm font-medium text-gray-600">Select City:</span>
        {CITIES.map(city => (
          <button key={city} onClick={() => setSelectedCity(city)}
            className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${selectedCity === city ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {city}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trend */}
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
            <HiTrendingUp className="w-5 h-5 text-blue-600" /> Price Trend - {selectedCity}
          </h3>
          <p className="text-xs text-gray-500 mb-4">Average price per sq.ft over 24 months</p>
          <div className="h-72">
            {trendData.length > 0 ? (
              <ResponsiveContainer>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={3} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => formatPrice(v)} />
                  <Tooltip formatter={v => [`${formatPrice(v)}/sqft`, 'Avg Price']} />
                  <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-500 text-center py-20">No trend data available</p>}
          </div>
        </div>

        {/* Locality Comparison */}
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
            <HiLocationMarker className="w-5 h-5 text-green-600" /> Locality Prices - {selectedCity}
          </h3>
          <p className="text-xs text-gray-500 mb-4">Price per sq.ft comparison across localities</p>
          <div className="h-72">
            {localityCompare.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={localityCompare} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={v => formatPrice(v)} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => formatPrice(v)} />
                  <Bar dataKey="price" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-500 text-center py-20">No locality data available</p>}
          </div>
        </div>

        {/* City Comparison */}
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
            <HiChartBar className="w-5 h-5 text-purple-600" /> City Price Comparison
          </h3>
          <p className="text-xs text-gray-500 mb-4">Average price per sq.ft across all cities</p>
          <div className="h-72">
            {cityCompare.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={cityCompare}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => formatPrice(v)} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => formatPrice(v)} />
                  <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                    {cityCompare.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-500 text-center py-20">No city data available</p>}
          </div>
        </div>

        {/* Demand vs Supply */}
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-1">Demand vs Supply - {selectedCity}</h3>
          <p className="text-xs text-gray-500 mb-4">Locality-wise demand and supply scores</p>
          <div className="h-72">
            {localityCompare.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={cityData?.localities?.map(l => ({ name: l.locality, demand: l.demandScore, supply: l.supplyScore })) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="demand" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="supply" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-500 text-center py-20">No data available</p>}
          </div>
        </div>
      </div>

      {/* Top Appreciating Localities */}
      {topLocalities.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-4">Top Appreciating Localities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topLocalities.slice(0, 10).map((loc, i) => (
              <div key={loc._id} className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="font-medium text-sm text-gray-900 truncate">{loc.locality}</span>
                </div>
                <p className="text-xs text-gray-500">{loc.city}</p>
                <p className="text-lg font-bold text-blue-600 mt-1">{formatPrice(loc.avgPricePerSqFt)}/sqft</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-green-600 font-medium">{loc.ratings?.appreciation}/5</span>
                  <span className="text-xs text-gray-400">appreciation</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
