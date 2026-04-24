import { Link } from 'react-router-dom';
import { HiLocationMarker, HiHome, HiArrowsExpand, HiShieldCheck } from 'react-icons/hi';
import { formatPrice, formatArea } from '../../utils/constants';

const TYPE_GRADIENTS = {
  apartment: 'from-blue-400 to-indigo-500',
  villa: 'from-emerald-400 to-teal-500',
  plot: 'from-amber-400 to-orange-500',
  commercial: 'from-purple-400 to-pink-500',
  pg: 'from-cyan-400 to-blue-500',
  'independent-house': 'from-rose-400 to-red-500',
};

export default function PropertyCard({ property, onCompare, isComparing }) {
  const { _id, title, price, area, bedrooms, bathrooms, propertyType, listingType, address, images, verified, furnishing } = property;
  const gradient = TYPE_GRADIENTS[propertyType] || 'from-blue-400 to-indigo-500';

  return (
    <div className="card-hover-lift group">
      <div className="relative overflow-hidden">
        <div className={`h-52 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          {images?.length > 0 ? (
            <img src={images[0]} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="text-center">
              <HiHome className="w-14 h-14 text-white/40 mx-auto" />
              <p className="text-white/30 text-xs mt-1 capitalize">{propertyType}</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`badge backdrop-blur-md shadow-sm ${listingType === 'sale' ? 'bg-green-500/90 text-white' : listingType === 'rent' ? 'bg-blue-500/90 text-white' : 'bg-purple-500/90 text-white'}`}>
            {listingType === 'sale' ? 'For Sale' : listingType === 'rent' ? 'For Rent' : 'Lease'}
          </span>
          {verified && (
            <span className="badge bg-amber-500/90 text-white backdrop-blur-md shadow-sm">
              <HiShieldCheck className="w-3 h-3 mr-0.5" /> Verified
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="badge bg-white/90 backdrop-blur-md text-gray-700 shadow-sm capitalize text-[10px]">{propertyType}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>

        <p className="text-xl font-bold text-blue-600 mb-2">
          {listingType === 'rent' ? `${formatPrice(price)}/mo` : formatPrice(price)}
        </p>

        <div className="flex items-center text-gray-400 text-xs mb-3">
          <HiLocationMarker className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span className="truncate">{address?.locality}, {address?.city}</span>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-gray-500 mb-4 flex-wrap">
          {bedrooms > 0 && <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg"><HiHome className="w-3 h-3" />{bedrooms} BHK</span>}
          {bathrooms > 0 && <span className="bg-gray-50 px-2 py-1 rounded-lg">{bathrooms} Bath</span>}
          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg"><HiArrowsExpand className="w-3 h-3" />{formatArea(area)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/property/${_id}`} className="btn-primary text-xs py-2 px-4 flex-1 text-center">
            View Details
          </Link>
          {onCompare && (
            <button
              onClick={() => onCompare(property)}
              className={`text-xs py-2 px-3 rounded-xl border transition-all duration-300 ${isComparing ? 'bg-orange-50 border-orange-300 text-orange-600 shadow-sm' : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'}`}
            >
              {isComparing ? 'Added' : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
