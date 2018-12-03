const mongoose = require('mongoose');
const GiftSubSchema = require('./gift.schema');

const UserMember = new mongoose.Schema({
  createdDate: {
    default: Date.now,
    type: Date
  },
  event: {
    ref: 'Event',
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  gifts: {
    type: [GiftSubSchema]
  },
  letter: {
    default: '',
    required: false,
    type: String
  },
  username: {
    required: false,
    type: String
  }
});

UserMember.set('toJSON', { virtuals: true });
UserMember.set('toObject', { virtuals: true });
UserMember.virtual('id').get(function virtualizeId () {
 
  return this._id;
  
});

module.exports = mongoose.model('UserMember', UserMember);
