export const formatPrice = (price) => {
  if (!price) return '0';
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} L`;
  if (price >= 1000) return `${(price / 1000).toFixed(0)} K`;
  return price.toLocaleString('en-IN');
};

export const formatArea = (area) => `${area?.toLocaleString('en-IN')} sq.ft`;

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'independent-house', label: 'Independent House' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'pg', label: 'PG' },
];

export const LISTING_TYPES = [
  { value: 'sale', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
  { value: 'lease', label: 'Lease' },
];

export const FURNISHING_OPTIONS = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
];

export const AGE_OPTIONS = [
  { value: 'new', label: 'New Construction' },
  { value: '1-5', label: '1-5 Years' },
  { value: '5-10', label: '5-10 Years' },
  { value: '10+', label: '10+ Years' },
];

export const AMENITIES_LIST = [
  'gym', 'pool', 'garden', 'security', 'lift', 'power-backup',
  'club-house', 'children-play-area', 'sports-facility',
  'water-supply', 'vaastu-compliant',
];

export const CITIES = [
  'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad',
  'Chennai', 'Pune', 'Kolkata', 'Ahmedabad',
];

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];

export const SORT_OPTIONS = [
  { value: 'date', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'area', label: 'Area: Largest First' },
];

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
