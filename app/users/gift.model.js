const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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

schema.set('toJSON', { virtuals: true });
schema.set('toObject', { virtuals: true });
schema.virtual('id').get(function virtualizeId () {
 
  return this._id;
  
});

module.exports = mongoose.model('Gift', schema);
