const LocalityData = require('../models/LocalityData');
const Property = require('../models/Property');

const FLOOR_PREMIUM = { ground: -0.03, low: 0.0, mid: 0.02, high: 0.01, top: -0.02 };
const AGE_DEPRECIATION = { 'new': 0, '1-5': -0.05, '5-10': -0.10, '10+': -0.18 };
const FURNISHING_BONUS = { 'furnished': 0.10, 'semi-furnished': 0.05, 'unfurnished': 0 };
const AMENITY_WEIGHTS = {
  gym: 0.02, pool: 0.03, garden: 0.015, security: 0.02, lift: 0.015,
  'power-backup': 0.01, 'club-house': 0.02, 'children-play-area': 0.01,
  'sports-facility': 0.015, 'water-supply': 0.01, 'sewage-treatment': 0.005,
  'rain-water-harvesting': 0.005, 'vaastu-compliant': 0.01,
};

function getFloorCategory(floor, totalFloors) {
  if (floor === 0) return 'ground';
  if (floor === totalFloors) return 'top';
  const ratio = floor / totalFloors;
  if (ratio < 0.33) return 'low';
  if (ratio < 0.67) return 'mid';
  return 'high';
}

async function calculateValuation(params) {
  const { city, locality, propertyType, area, bedrooms, floor, totalFloors,
    furnishing, age, amenities, parking } = params;

  const localityData = await LocalityData.findOne({
    city: new RegExp(city, 'i'),
    locality: new RegExp(locality, 'i'),
  });

  if (!localityData) {
    const cityData = await LocalityData.find({ city: new RegExp(city, 'i') });
    if (cityData.length === 0) {
      return { error: 'No data available for this city. Try a major metro city.' };
    }
    const avgCityRate = cityData.reduce((sum, d) => sum + d.avgPricePerSqFt, 0) / cityData.length;
    const baseValue = avgCityRate * area;
    return {
      estimatedValue: Math.round(baseValue),
      lowEstimate: Math.round(baseValue * 0.85),
      highEstimate: Math.round(baseValue * 1.15),
      confidence: 40,
      message: 'Estimate based on city average - locality data not available',
      breakdown: { baseRate: avgCityRate, area, baseValue: Math.round(baseValue) },
      comparables: [],
    };
  }

  const baseRate = localityData.avgPricePerSqFt;
  let adjustedRate = baseRate;
  const adjustments = {};

  const floorCat = getFloorCategory(floor || 0, totalFloors || 1);
  const floorAdj = FLOOR_PREMIUM[floorCat] || 0;
  adjustedRate *= (1 + floorAdj);
  adjustments.floor = { category: floorCat, adjustment: `${(floorAdj * 100).toFixed(1)}%` };

  const ageAdj = AGE_DEPRECIATION[age] || 0;
  adjustedRate *= (1 + ageAdj);
  adjustments.age = { value: age, adjustment: `${(ageAdj * 100).toFixed(1)}%` };

  const furnAdj = FURNISHING_BONUS[furnishing] || 0;
  adjustedRate *= (1 + furnAdj);
  adjustments.furnishing = { value: furnishing, adjustment: `${(furnAdj * 100).toFixed(1)}%` };

  let amenityAdj = 0;
  if (amenities && amenities.length > 0) {
    amenities.forEach(a => { amenityAdj += AMENITY_WEIGHTS[a] || 0.005; });
  }
  adjustedRate *= (1 + amenityAdj);
  adjustments.amenities = { count: amenities?.length || 0, adjustment: `${(amenityAdj * 100).toFixed(1)}%` };

  const parkingAdj = (parking || 0) * 0.015;
  adjustedRate *= (1 + parkingAdj);
  adjustments.parking = { count: parking || 0, adjustment: `${(parkingAdj * 100).toFixed(1)}%` };

  const demandSupplyRatio = localityData.demandScore / Math.max(localityData.supplyScore, 1);
  const dsAdj = (demandSupplyRatio - 1) * 0.05;
  adjustedRate *= (1 + dsAdj);
  adjustments.demandSupply = { ratio: demandSupplyRatio.toFixed(2), adjustment: `${(dsAdj * 100).toFixed(1)}%` };

  const estimatedValue = Math.round(adjustedRate * area);
  const margin = 0.08;

  const confidence = Math.min(90, 50 + (localityData.demandScore > 0 ? 10 : 0) +
    (localityData.priceHistory.length > 12 ? 15 : localityData.priceHistory.length > 6 ? 10 : 5) +
    (amenities?.length > 3 ? 10 : 5) + 5);

  const comparableQuery = {
    'address.city': new RegExp(city, 'i'),
    'address.locality': new RegExp(locality, 'i'),
    status: 'active',
  };
  if (propertyType) comparableQuery.propertyType = propertyType;
  if (bedrooms) comparableQuery.bedrooms = { $gte: bedrooms - 1, $lte: bedrooms + 1 };

  const comparables = await Property.find(comparableQuery)
    .select('title price area bedrooms address propertyType furnishing images')
    .sort({ price: 1 })
    .limit(5);

  return {
    estimatedValue,
    lowEstimate: Math.round(estimatedValue * (1 - margin)),
    highEstimate: Math.round(estimatedValue * (1 + margin)),
    confidence,
    pricePerSqFt: Math.round(adjustedRate),
    baseRate,
    breakdown: {
      baseRate,
      adjustedRate: Math.round(adjustedRate),
      area,
      baseValue: Math.round(baseRate * area),
      adjustments,
    },
    localityInfo: {
      demandScore: localityData.demandScore,
      supplyScore: localityData.supplyScore,
      infrastructure: localityData.infrastructure,
      ratings: localityData.ratings,
      appreciation: localityData.ratings.appreciation,
    },
    comparables,
  };
}

module.exports = { calculateValuation };
