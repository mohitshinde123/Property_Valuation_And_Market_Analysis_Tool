const formatPrice = (price) => {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} L`;
  if (price >= 1000) return `${(price / 1000).toFixed(2)} K`;
  return price.toString();
};

const buildPropertyFilter = (query) => {
  const filter = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }
  if (query.city) filter['address.city'] = new RegExp(query.city, 'i');
  if (query.locality) filter['address.locality'] = new RegExp(query.locality, 'i');
  if (query.propertyType) filter.propertyType = query.propertyType;
  if (query.listingType) filter.listingType = query.listingType;
  if (query.furnishing) filter.furnishing = query.furnishing;
  if (query.age) filter.age = query.age;
  if (query.status) filter.status = query.status;
  if (query.verified) filter.verified = query.verified === 'true';

  if (query.priceMin || query.priceMax) {
    filter.price = {};
    if (query.priceMin) filter.price.$gte = Number(query.priceMin);
    if (query.priceMax) filter.price.$lte = Number(query.priceMax);
  }

  if (query.areaMin || query.areaMax) {
    filter.area = {};
    if (query.areaMin) filter.area.$gte = Number(query.areaMin);
    if (query.areaMax) filter.area.$lte = Number(query.areaMax);
  }

  if (query.bedrooms) filter.bedrooms = Number(query.bedrooms);

  if (query.amenities) {
    const amenityList = query.amenities.split(',');
    filter.amenities = { $all: amenityList };
  }

  return filter;
};

module.exports = { formatPrice, buildPropertyFilter };
