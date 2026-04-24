const mongoose = require('mongoose');

const savedSearchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'My Search' },
  filters: {
    city: String,
    locality: String,
    propertyType: String,
    listingType: String,
    priceMin: Number,
    priceMax: Number,
    areaMin: Number,
    areaMax: Number,
    bedrooms: Number,
  },
  emailAlert: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('SavedSearch', savedSearchSchema);
