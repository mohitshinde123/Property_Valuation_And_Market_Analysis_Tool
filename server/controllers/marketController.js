const LocalityData = require('../models/LocalityData');
const Property = require('../models/Property');

exports.getCityTrends = async (req, res) => {
  try {
    const { city } = req.params;
    const localities = await LocalityData.find({ city: new RegExp(city, 'i') })
      .sort({ avgPricePerSqFt: -1 });

    if (localities.length === 0) {
      return res.status(404).json({ message: 'No data found for this city' });
    }

    const allHistory = {};
    localities.forEach(loc => {
      loc.priceHistory.forEach(ph => {
        const key = `${ph.year}-${String(ph.month).padStart(2, '0')}`;
        if (!allHistory[key]) allHistory[key] = { month: ph.month, year: ph.year, prices: [] };
        allHistory[key].prices.push(ph.avgPrice);
      });
    });

    const trends = Object.values(allHistory)
      .map(h => ({
        month: h.month,
        year: h.year,
        avgPrice: Math.round(h.prices.reduce((a, b) => a + b, 0) / h.prices.length),
      }))
      .sort((a, b) => a.year - b.year || a.month - b.month);

    const avgCityPrice = Math.round(
      localities.reduce((sum, l) => sum + l.avgPricePerSqFt, 0) / localities.length
    );

    res.json({ city, avgPricePerSqFt: avgCityPrice, localities, trends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLocalityDetail = async (req, res) => {
  try {
    const { city, locality } = req.params;
    const data = await LocalityData.findOne({
      city: new RegExp(city, 'i'),
      locality: new RegExp(locality, 'i'),
    });
    if (!data) return res.status(404).json({ message: 'Locality not found' });

    const propertyCount = await Property.countDocuments({
      'address.city': new RegExp(city, 'i'),
      'address.locality': new RegExp(locality, 'i'),
      status: 'active',
    });

    const typeDistribution = await Property.aggregate([
      { $match: { 'address.city': new RegExp(city, 'i'), 'address.locality': new RegExp(locality, 'i'), status: 'active' } },
      { $group: { _id: '$propertyType', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
    ]);

    const bedroomPrices = await Property.aggregate([
      { $match: { 'address.city': new RegExp(city, 'i'), 'address.locality': new RegExp(locality, 'i'), status: 'active' } },
      { $group: { _id: '$bedrooms', count: { $sum: 1 }, avgPrice: { $avg: '$price' }, avgPricePerSqFt: { $avg: '$pricePerSqFt' } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ ...data.toObject(), propertyCount, typeDistribution, bedroomPrices });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopLocalities = async (req, res) => {
  try {
    const localities = await LocalityData.find()
      .sort({ 'ratings.appreciation': -1 })
      .limit(10);
    res.json(localities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCities = async (req, res) => {
  try {
    const cities = await LocalityData.aggregate([
      {
        $group: {
          _id: '$city',
          avgPrice: { $avg: '$avgPricePerSqFt' },
          localityCount: { $sum: 1 },
          avgDemand: { $avg: '$demandScore' },
        },
      },
      { $sort: { avgPrice: -1 } },
    ]);
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMarketOverview = async (req, res) => {
  try {
    const [totalProperties, totalCities, localities, recentProperties] = await Promise.all([
      Property.countDocuments({ status: 'active' }),
      LocalityData.distinct('city'),
      LocalityData.find().sort({ avgPricePerSqFt: -1 }).limit(5),
      Property.find({ status: 'active' }).sort({ createdAt: -1 }).limit(5).select('title price address propertyType'),
    ]);

    const avgPrice = localities.length > 0
      ? Math.round(localities.reduce((s, l) => s + l.avgPricePerSqFt, 0) / localities.length)
      : 0;

    res.json({
      totalProperties,
      totalCities: totalCities.length,
      totalLocalities: await LocalityData.countDocuments(),
      avgPricePerSqFt: avgPrice,
      topLocalities: localities,
      recentProperties,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
