const mongoose = require('mongoose');

const GiftSubSchema = new mongoose.Schema({
  createdDate: {
    default: Date.now,
    type: Date
  },
  description: {
    default: '',
    type: String
  },
  name: {
    required: true,
    type: String
  }
});

GiftSubSchema.set('toJSON', { virtuals: true });
GiftSubSchema.set('toObject', { virtuals: true });
GiftSubSchema.virtual('id').get(function virtualizeId () {
 
  return this._id;
  
});

module.exports = GiftSubSchema;
