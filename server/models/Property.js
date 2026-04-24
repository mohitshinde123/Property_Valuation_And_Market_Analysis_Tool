const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  propertyType: {
    type: String,
    enum: ['apartment', 'villa', 'plot', 'commercial', 'pg', 'independent-house'],
    required: true,
  },
  listingType: { type: String, enum: ['sale', 'rent', 'lease'], required: true },
  price: { type: Number, required: true },
  pricePerSqFt: { type: Number },
  area: { type: Number, required: true },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  balconies: { type: Number, default: 0 },
  floor: { type: Number, default: 0 },
  totalFloors: { type: Number, default: 1 },
  furnishing: { type: String, enum: ['furnished', 'semi-furnished', 'unfurnished'], default: 'unfurnished' },
  parking: { type: Number, default: 0 },
  facing: { type: String, enum: ['north', 'south', 'east', 'west', 'north-east', 'north-west', 'south-east', 'south-west'], default: 'east' },
  age: { type: String, enum: ['new', '1-5', '5-10', '10+'], default: 'new' },
  amenities: [{ type: String }],
  address: {
    street: { type: String, default: '' },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, default: '' },
  },
  images: [{ type: String }],
  verified: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'sold', 'rented', 'inactive'], default: 'active' },
  views: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },
}, { timestamps: true });

propertySchema.pre('save', function () {
  if (this.area > 0) {
    this.pricePerSqFt = Math.round(this.price / this.area);
  }
});

propertySchema.index({ 'address.city': 1, 'address.locality': 1 });
propertySchema.index({ propertyType: 1, listingType: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ title: 'text', description: 'text', 'address.locality': 'text', 'address.city': 'text' });

module.exports = mongoose.model('Property', propertySchema);
