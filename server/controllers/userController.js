const User = require('../models/User');
const Property = require('../models/Property');
const SavedSearch = require('../models/SavedSearch');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveProperty = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const propId = req.params.propertyId;
    const idx = user.savedProperties.indexOf(propId);
    if (idx > -1) {
      user.savedProperties.splice(idx, 1);
    } else {
      user.savedProperties.push(propId);
    }
    await user.save();
    res.json({ savedProperties: user.savedProperties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSavedProperties = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProperties');
    res.json(user.savedProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSavedSearch = async (req, res) => {
  try {
    const search = await SavedSearch.create({ user: req.user._id, ...req.body });
    res.status(201).json(search);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSavedSearches = async (req, res) => {
  try {
    const searches = await SavedSearch.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(searches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSavedSearch = async (req, res) => {
  try {
    await SavedSearch.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Search deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProperties, usersByRole, propertiesByType] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Property.aggregate([{ $group: { _id: '$propertyType', count: { $sum: 1 } } }]),
    ]);
    res.json({ totalUsers, totalProperties, usersByRole, propertiesByType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
