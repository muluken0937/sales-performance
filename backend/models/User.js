const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['Admin', 'SalesManager', 'SalesUser'], 
      required: true 
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',  
      required: false 
    },
    profileImage: { 
      type: String,  
      required: false 
    }
  },
  { 
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
