const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  cashAmount: {
    default: 100,
    type: Number
  },
  cashCurrency: {
    default: 'PLN',
    type: String
  },
  createdDate: {
    default: Date.now,
    type: Date
  },
  members: [
    {
      ref: 'UserMember',
      type: mongoose.Schema.Types.ObjectId
    }
  ],
  name: {
    required: true,
    type: String
  },
  namePrivate: {
    default: null,
    type: String
  },
  open: {
    default: true,
    type: Boolean
  }
});

schema.set('toJSON', { virtuals: true });
schema.set('toObject', { virtuals: true });
schema.virtual('id').get(function virtualizeId () {
 
  return this._id;
  
});

module.exports = mongoose.model('Event', schema);
