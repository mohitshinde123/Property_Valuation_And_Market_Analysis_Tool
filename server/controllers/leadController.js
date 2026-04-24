const Lead = require('../models/Lead');
const Property = require('../models/Property');

exports.createLead = async (req, res) => {
  try {
    const { propertyId, message } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const lead = await Lead.create({
      property: propertyId,
      buyer: req.user._id,
      seller: property.owner,
      agent: property.agent,
      message,
      status: 'new',
    });

    await Property.findByIdAndUpdate(propertyId, { $inc: { inquiries: 1 } });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyLeads = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'buyer') filter.buyer = req.user._id;
    else if (req.user.role === 'seller') filter.seller = req.user._id;
    else if (req.user.role === 'agent') filter.agent = req.user._id;

    const leads = await Lead.find(filter)
      .populate('property', 'title price address images')
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('property', 'title price address')
      .populate('buyer', 'name email phone');
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate('property', 'title price address')
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone')
      .populate('agent', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
