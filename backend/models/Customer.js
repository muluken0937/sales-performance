const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phoneNumber: { type: String, required: true },
    location: { type: String, required: true },
    paidStatus: { type: Boolean, default: false },
    visitStatus: { type: Boolean, default: false },
    descriptions: [{
      text: String,
      createdAt: { type: Date, default: Date.now }
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPendingApproval: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);