const Property = require('../models/Property');
const { buildPropertyFilter } = require('../utils/helpers');

exports.getProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = buildPropertyFilter(req.query);
    if (!filter.status) filter.status = 'active';

    let sort = { createdAt: -1 };
    if (req.query.sort) {
      const sortMap = {
        'price_asc': { price: 1 },
        'price_desc': { price: -1 },
        'date': { createdAt: -1 },
        'area': { area: -1 },
      };
      sort = sortMap[req.query.sort] || sort;
    }

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate('owner', 'name email phone')
        .populate('agent', 'name email phone')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Property.countDocuments(filter),
    ]);

    res.json({
      properties,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('owner', 'name email phone role')
      .populate('agent', 'name email phone role');

    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const propertyData = { ...req.body, owner: req.user._id };
    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map(f => `/uploads/${f.filename}`);
    }
    const property = await Property.create(propertyData);
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin' && req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      req.body.images = [...(property.images || []), ...newImages];
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'active', verified: true })
      .sort({ views: -1 })
      .limit(8)
      .populate('owner', 'name');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCities = async (req, res) => {
  try {
    const cities = await Property.distinct('address.city');
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLocalities = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = city ? { 'address.city': new RegExp(city, 'i') } : {};
    const localities = await Property.distinct('address.locality', filter);
    res.json(localities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
