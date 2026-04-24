import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import Loader from '../components/common/Loader';
import { formatPrice, formatArea } from '../utils/constants';
import { HiX, HiSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function CompareProperties() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    const ids = searchParams.get('ids');
    if (ids) {
      const idList = ids.split(',').filter(Boolean);
      setLoading(true);
      Promise.all(idList.map(id => propertyAPI.getById(id).catch(() => null)))
        .then(results => setProperties(results.filter(r => r?.data).map(r => r.data)))
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

  const addProperty = async () => {
    if (!searchId.trim()) return;
    if (properties.length >= 4) { toast.error('Maximum 4 properties for comparison'); return; }
    try {
      const res = await propertyAPI.getById(searchId.trim());
      if (properties.find(p => p._id === res.data._id)) {
        toast.error('Property already added');
        return;
      }
      setProperties(prev => [...prev, res.data]);
      setSearchId('');
    } catch {
      toast.error('Property not found');
    }
  };

  const removeProperty = (id) => setProperties(prev => prev.filter(p => p._id !== id));

  if (loading) return <Loader />;

  const compareFields = [
    { label: 'Price', fn: p => formatPrice(p.price) },
    { label: 'Price/sqft', fn: p => formatPrice(p.pricePerSqFt || Math.round(p.price / p.area)) },
    { label: 'Area', fn: p => formatArea(p.area) },
    { label: 'Type', fn: p => p.propertyType },
    { label: 'Listing', fn: p => p.listingType },
    { label: 'Bedrooms', fn: p => `${p.bedrooms} BHK` },
    { label: 'Bathrooms', fn: p => p.bathrooms },
    { label: 'Floor', fn: p => `${p.floor} of ${p.totalFloors}` },
    { label: 'Furnishing', fn: p => p.furnishing },
    { label: 'Age', fn: p => p.age },
    { label: 'Parking', fn: p => `${p.parking} spots` },
    { label: 'Facing', fn: p => p.facing },
    { label: 'Location', fn: p => `${p.address?.locality}, ${p.address?.city}` },
    { label: 'Amenities', fn: p => p.amenities?.length || 0 },
    { label: 'Verified', fn: p => p.verified ? 'Yes' : 'No' },
    { label: 'Status', fn: p => p.status },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Properties</h1>
        <p className="text-gray-500">Side-by-side comparison of up to 4 properties</p>
      </div>

      <div className="flex items-center gap-2 mb-6 max-w-md mx-auto">
        <input type="text" value={searchId} onChange={e => setSearchId(e.target.value)}
          placeholder="Enter property ID to add" className="input-field text-sm" />
        <button onClick={addProperty} className="btn-primary text-sm whitespace-nowrap flex items-center gap-1">
          <HiSearch className="w-4 h-4" /> Add
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 mb-2">No properties selected for comparison</p>
          <p className="text-sm text-gray-400">Add properties from the search page using the "Compare" button, or enter a property ID above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 bg-gray-50 rounded-tl-xl font-medium text-gray-600 text-sm w-36">Feature</th>
                {properties.map(p => (
                  <th key={p._id} className="py-3 px-4 bg-gray-50 last:rounded-tr-xl">
                    <div className="relative">
                      <button onClick={() => removeProperty(p._id)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200">
                        <HiX className="w-3 h-3" />
                      </button>
                      <div className="h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                        {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <span className="text-blue-300 text-xs">No image</span>}
                      </div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{p.title}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareFields.map((field, i) => (
                <tr key={field.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="py-2.5 px-4 text-sm font-medium text-gray-600">{field.label}</td>
                  {properties.map(p => (
                    <td key={p._id} className="py-2.5 px-4 text-sm text-gray-900 capitalize text-center">{field.fn(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
