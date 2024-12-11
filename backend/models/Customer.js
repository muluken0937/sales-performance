const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    email: { type: String },                 
    phoneNumber: { type: String, required: true },
    location: { type: String, required: true },
    paidStatus: { type: Boolean, default: false },
    visitStatus: { type: Boolean, default: false },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);