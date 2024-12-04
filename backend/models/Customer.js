const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    location: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    paidStatus: { type: Boolean, default: false },
    visitStatus: { type: Boolean, default: false },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Customer', customerSchema);
  
