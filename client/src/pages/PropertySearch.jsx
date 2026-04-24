import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import PropertyCard from '../components/property/PropertyCard';
import Loader from '../components/common/Loader';
import { CITIES, PROPERTY_TYPES, LISTING_TYPES, FURNISHING_OPTIONS, BEDROOM_OPTIONS, SORT_OPTIONS, AGE_OPTIONS } from '../utils/constants';
import { HiFilter, HiX, HiSearch } from 'react-icons/hi';

export default function PropertySearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [compareList, setCompareList] = useState([]);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    propertyType: searchParams.get('propertyType') || '',
    listingType: searchParams.get('listingType') || 'sale',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    furnishing: searchParams.get('furnishing') || '',
    age: searchParams.get('age') || '',
    sort: searchParams.get('sort') || 'date',
    page: parseInt(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    fetchProperties();
  }, [filters.page, filters.sort]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, val]) => { if (val) params[key] = val; });
      const res = await propertyAPI.getAll(params);
      setProperties(res.data.properties);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    setSearchParams(params);
    fetchProperties();
  };

  const clearFilters = () => {
    setFilters({ search: '', city: '', propertyType: '', listingType: 'sale', priceMin: '', priceMax: '', bedrooms: '', furnishing: '', age: '', sort: 'date', page: 1 });
    setSearchParams({});
    setTimeout(fetchProperties, 0);
  };

  const toggleCompare = (property) => {
    setCompareList(prev => {
      const exists = prev.find(p => p._id === property._id);
      if (exists) return prev.filter(p => p._id !== property._id);
      if (prev.length >= 4) return prev;
      return [...prev, property];
    });
  };

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Search</h1>
          <p className="text-gray-500 text-sm">{pagination.total || 0} properties found</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={filters.sort} onChange={e => { updateFilter('sort', e.target.value); }}
            className="input-field text-sm py-2 w-auto">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary text-sm flex items-center gap-1 md:hidden">
            <HiFilter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <aside className={`${showFilters ? 'fixed inset-0 z-40 bg-white p-4 overflow-y-auto' : 'hidden'} md:block md:static md:w-72 shrink-0`}>
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h2 className="font-semibold text-lg">Filters</h2>
            <button onClick={() => setShowFilters(false)}><HiX className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Search</label>
              <div className="relative">
                <input type="text" value={filters.search} onChange={e => updateFilter('search', e.target.value)}
                  placeholder="Search properties..." className="input-field text-sm pr-10" />
                <HiSearch className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Listing Type</label>
              <div className="flex gap-1">
                {LISTING_TYPES.map(t => (
                  <button key={t.value} type="button" onClick={() => updateFilter('listingType', t.value)}
                    className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${filters.listingType === t.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">City</label>
              <select value={filters.city} onChange={e => updateFilter('city', e.target.value)} className="input-field text-sm">
                <option value="">All Cities</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Property Type</label>
              <select value={filters.propertyType} onChange={e => updateFilter('propertyType', e.target.value)} className="input-field text-sm">
                <option value="">All Types</option>
                {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Bedrooms</label>
              <div className="flex gap-1">
                <button type="button" onClick={() => updateFilter('bedrooms', '')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium ${!filters.bedrooms ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Any</button>
                {BEDROOM_OPTIONS.map(b => (
                  <button key={b} type="button" onClick={() => updateFilter('bedrooms', String(b))}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium ${filters.bedrooms === String(b) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{b}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Min Price</label>
                <input type="number" value={filters.priceMin} onChange={e => updateFilter('priceMin', e.target.value)}
                  placeholder="Min" className="input-field text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Max Price</label>
                <input type="number" value={filters.priceMax} onChange={e => updateFilter('priceMax', e.target.value)}
                  placeholder="Max" className="input-field text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Furnishing</label>
              <select value={filters.furnishing} onChange={e => updateFilter('furnishing', e.target.value)} className="input-field text-sm">
                <option value="">Any</option>
                {FURNISHING_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Property Age</label>
              <select value={filters.age} onChange={e => updateFilter('age', e.target.value)} className="input-field text-sm">
                <option value="">Any</option>
                {AGE_OPTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm flex-1">Apply</button>
              <button type="button" onClick={clearFilters} className="btn-secondary text-sm">Clear</button>
            </div>
          </form>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {compareList.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-orange-700">{compareList.length}/4 properties selected for comparison</span>
              <div className="flex gap-2">
                <button onClick={() => setCompareList([])} className="text-xs text-gray-600 hover:text-gray-800">Clear</button>
                <a href={`/compare?ids=${compareList.map(p => p._id).join(',')}`} className="btn-accent text-xs py-1 px-3">Compare Now</a>
              </div>
            </div>
          )}

          {loading ? <Loader /> : properties.length === 0 ? (
            <div className="text-center py-16">
              <HiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No properties found</h3>
              <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search criteria</p>
              <button onClick={clearFilters} className="btn-primary text-sm">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map(prop => (
                  <PropertyCard key={prop._id} property={prop} onCompare={toggleCompare}
                    isComparing={compareList.some(p => p._id === prop._id)} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button disabled={pagination.current <= 1}
                    onClick={() => { updateFilter('page', pagination.current - 1); window.scrollTo(0, 0); }}
                    className="btn-secondary text-sm disabled:opacity-50">Previous</button>
                  <span className="text-sm text-gray-600">Page {pagination.current} of {pagination.pages}</span>
                  <button disabled={pagination.current >= pagination.pages}
                    onClick={() => { updateFilter('page', pagination.current + 1); window.scrollTo(0, 0); }}
                    className="btn-secondary text-sm disabled:opacity-50">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
