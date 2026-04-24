const { calculateValuation } = require('../utils/valuationEngine');

exports.getValuation = async (req, res) => {
  try {
    const { city, locality, propertyType, area, bedrooms, floor, totalFloors,
      furnishing, age, amenities, parking } = req.body;

    if (!city || !area) {
      return res.status(400).json({ message: 'City and area are required' });
    }

    const result = await calculateValuation({
      city, locality, propertyType,
      area: Number(area),
      bedrooms: Number(bedrooms) || 0,
      floor: Number(floor) || 0,
      totalFloors: Number(totalFloors) || 1,
      furnishing: furnishing || 'unfurnished',
      age: age || 'new',
      amenities: amenities || [],
      parking: Number(parking) || 0,
    });

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
