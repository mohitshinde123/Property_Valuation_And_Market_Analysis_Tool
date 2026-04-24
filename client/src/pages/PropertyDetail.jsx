import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyAPI, leadAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import { formatPrice, formatArea } from '../utils/constants';
import { HiLocationMarker, HiHome, HiPhone, HiMail, HiArrowsExpand, HiShieldCheck, HiHeart, HiEye, HiChat } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    propertyAPI.getById(id)
      .then(res => {
        setProperty(res.data);
        if (user) {
          setSaved(user.savedProperties?.includes(id));
        }
      })
      .catch(() => toast.error('Property not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to send inquiry'); return; }
    try {
      await leadAPI.create({ propertyId: id, message });
      setInquirySent(true);
      toast.success('Inquiry sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send inquiry');
    }
  };

  const handleSave = async () => {
    if (!user) { toast.error('Please login to save properties'); return; }
    try {
      await userAPI.saveProperty(id);
      setSaved(!saved);
      toast.success(saved ? 'Removed from saved' : 'Property saved!');
    } catch { toast.error('Failed to save property'); }
  };

  if (loading) return <Loader />;
  if (!property) return <div className="text-center py-16"><h2 className="text-xl font-semibold text-gray-700">Property not found</h2></div>;

  const { title, description, price, area, bedrooms, bathrooms, balconies, propertyType, listingType,
    floor, totalFloors, furnishing, parking, facing, age, amenities, address, verified, owner, views, inquiries } = property;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link to="/search" className="hover:text-blue-600">Properties</Link>
        <span>/</span>
        <span className="text-gray-900">{title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="card overflow-hidden">
            <div className="h-64 md:h-96 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              {property.images?.length > 0 ? (
                <img src={property.images[0]} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <HiHome className="w-24 h-24 text-blue-300 mx-auto" />
                  <p className="text-gray-400 mt-2">No images available</p>
                </div>
              )}
            </div>
          </div>

          {/* Title & Price */}
          <div className="card p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`badge ${listingType === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {listingType === 'sale' ? 'For Sale' : 'For Rent'}
              </span>
              <span className="badge bg-gray-100 text-gray-700 capitalize">{propertyType}</span>
              {verified && <span className="badge bg-amber-100 text-amber-700"><HiShieldCheck className="w-3 h-3 mr-1" />Verified</span>}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <HiLocationMarker className="w-4 h-4 mr-1" />
              {address?.street && `${address.street}, `}{address?.locality}, {address?.city}, {address?.state} {address?.pincode && `- ${address.pincode}`}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-blue-600">
                {listingType === 'rent' ? `${formatPrice(price)}/mo` : formatPrice(price)}
              </p>
              <p className="text-sm text-gray-500">{formatPrice(Math.round(price / area))}/sq.ft</p>
            </div>
          </div>

          {/* Key Details */}
          <div className="card p-6">
            <h2 className="font-semibold text-lg mb-4">Property Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Area', value: formatArea(area), icon: HiArrowsExpand },
                { label: 'Bedrooms', value: `${bedrooms} BHK` },
                { label: 'Bathrooms', value: bathrooms },
                { label: 'Balconies', value: balconies },
                { label: 'Floor', value: `${floor} of ${totalFloors}` },
                { label: 'Furnishing', value: furnishing },
                { label: 'Parking', value: `${parking} spots` },
                { label: 'Facing', value: facing },
                { label: 'Age', value: age === 'new' ? 'New' : `${age} years` },
              ].map(d => (
                <div key={d.label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{d.label}</p>
                  <p className="font-semibold text-gray-900 capitalize text-sm">{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="font-semibold text-lg mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Amenities */}
          {amenities?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-semibold text-lg mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map(a => (
                  <span key={a} className="badge bg-blue-50 text-blue-700 py-1.5 px-3 capitalize">{a.replace('-', ' ')}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="card p-4 flex gap-2">
            <button onClick={handleSave} className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors ${saved ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>
              <HiHeart className="w-4 h-4" /> {saved ? 'Saved' : 'Save'}
            </button>
            <Link to={`/compare?ids=${id}`} className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 text-center">
              Compare
            </Link>
          </div>

          {/* Stats */}
          <div className="card p-4 flex gap-4">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <HiEye className="w-4 h-4" /> {views} views
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <HiChat className="w-4 h-4" /> {inquiries} inquiries
            </div>
          </div>

          {/* Owner */}
          <div className="card p-6">
            <h3 className="font-semibold mb-3">Listed By</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <HiHome className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{owner?.name || 'Property Owner'}</p>
                <p className="text-xs text-gray-500 capitalize">{owner?.role || 'Owner'}</p>
              </div>
            </div>
            {owner?.phone && (
              <a href={`tel:${owner.phone}`} className="flex items-center gap-2 text-sm text-gray-600 mb-2 hover:text-blue-600">
                <HiPhone className="w-4 h-4" /> {owner.phone}
              </a>
            )}
            {owner?.email && (
              <a href={`mailto:${owner.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                <HiMail className="w-4 h-4" /> {owner.email}
              </a>
            )}
          </div>

          {/* Inquiry Form */}
          <div className="card p-6">
            <h3 className="font-semibold mb-3">Send Inquiry</h3>
            {inquirySent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <HiShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-green-600 font-medium">Inquiry Sent!</p>
                <p className="text-sm text-gray-500 mt-1">The owner will contact you soon</p>
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-3">
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="I'm interested in this property..."
                  rows={3} className="input-field text-sm" required />
                <button type="submit" className="btn-primary w-full text-sm">
                  Send Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Valuation Link */}
          <Link to={`/valuation?city=${address?.city}&locality=${address?.locality}&area=${area}&bedrooms=${bedrooms}&propertyType=${propertyType}&furnishing=${furnishing}`}
            className="card p-4 block hover:border-blue-200 transition-colors">
            <p className="text-sm font-medium text-blue-600">Get Valuation Estimate</p>
            <p className="text-xs text-gray-500 mt-1">See what this property is worth</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
