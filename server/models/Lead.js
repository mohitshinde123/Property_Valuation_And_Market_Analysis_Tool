const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'negotiating', 'closed', 'lost'],
    default: 'new',
  },
  notes: { type: String, default: '' },
  contactDate: { type: Date },
  message: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
