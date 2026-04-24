const mongoose = require('mongoose');

const localityDataSchema = new mongoose.Schema({
  city: { type: String, required: true },
  locality: { type: String, required: true },
  state: { type: String, required: true },
  avgPricePerSqFt: { type: Number, required: true },
  medianPrice: { type: Number, required: true },
  priceHistory: [{
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    avgPrice: { type: Number, required: true },
  }],
  demandScore: { type: Number, min: 1, max: 100, default: 50 },
  supplyScore: { type: Number, min: 1, max: 100, default: 50 },
  nearbyLocalities: [{ type: String }],
  infrastructure: {
    metro: { type: Number, default: 0 },
    hospital: { type: Number, default: 0 },
    school: { type: Number, default: 0 },
    mall: { type: Number, default: 0 },
    airport: { type: Number, default: 0 },
  },
  ratings: {
    connectivity: { type: Number, min: 1, max: 5, default: 3 },
    safety: { type: Number, min: 1, max: 5, default: 3 },
    livability: { type: Number, min: 1, max: 5, default: 3 },
    appreciation: { type: Number, min: 1, max: 5, default: 3 },
  },
}, { timestamps: true });

localityDataSchema.index({ city: 1, locality: 1 }, { unique: true });

module.exports = mongoose.model('LocalityData', localityDataSchema);
