const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  createdDate: {
    default: Date.now,
    type: Date
  },
  events: [
    {
      ref: 'Event',
      type: mongoose.Schema.Types.ObjectId
    }
  ],
  hash: {
    required: true,
    type: String
  },
  nick: {
    required: false,
    type: String
  },
  type: {
    required: true,
    type: String
  },
  username: {
    required: true,
    type: String,
    unique: true
  }
});

schema.set('toJSON', { virtuals: true });
schema.set('toObject', { virtuals: true });
schema.virtual('id').get(function virtualizeId () {
 
  return this._id;
  
});

module.exports = mongoose.model('User', schema);
