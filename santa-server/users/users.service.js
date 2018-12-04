const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./user.model');
const UserMember = require('./user-member.model');
const md5Hex = require('md5-hex');

const SALT_LENGTH = 10;
const TOKEN_LENGTH = 8;

async function authenticate({ username, password }) {

  if (!password) {
    
    throw new Error('Password empty'); 
    
  }

  const user = await User.findOne({ username })
    .populate('events');

  if (user && bcrypt.compareSync(password, user.hash)) {

    const { hash, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user.id }, process.env.SECRET);

    return {
      ...userWithoutHash,
      token
    };

  }

  throw new Error('User not authenticated');

}


function getAll() {

  return User.find().select('-hash');
  
}

function getById(id) {

  return User.findById(id)
    .populate('events')
    .select('-hash');

}


async function create(userParam) {

  // validate
  if (await User.findOne({ username: userParam.username })) {

    throw new Error(`Username "${userParam.username}" is already taken`);

  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {

    user.hash = bcrypt.hashSync(userParam.password, SALT_LENGTH);

  }

  // save user
  await user.save();
  
}


async function update(id, userParam) {

  const user = await User.findById(id);

  // validate
  if (!user) {
    
    throw new Error('User not found');

  }

  if (user.username !== userParam.username &&
    await User.findOne({ username: userParam.username })) {

    throw new Error(`Username "${userParam.username}" is already taken`);

  }

  // hash password if it was entered
  if (userParam.password) {

    userParam.hash = bcrypt.hashSync(userParam.password, SALT_LENGTH);

  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();

}


async function deleteUser(id) {

  await User.findByIdAndRemove(id);

}

async function addEventForUser(userId, eventId) {

  const result = await User.findOneAndUpdate(
    { _id: userId },
    { $push: { events: eventId } }
  );

  return result;

}


// User Members & Gifts


function getUserMemberById(id) {

  return UserMember.findById(id)
    .populate({
      path: 'event',
      populate: {
        path: 'members',
        select: '-token -event -createdDate \
-gifts.description -gifts.name -gifts.createdDate'
      },
      select: '-_id -createdDate'
    })
    .select({ token: 0 });

}


function authUserMemberById(id, token) {

  return UserMember.findOne({
    _id: id,
    token
  })
    .populate('event', '-members')
    .populate({
      path: 'pairedMemberId',
      select: '-token -event -createdDate'
    });

}

async function createUnregistered(userParam) {

  const user = new UserMember(userParam);

  user.token = md5Hex(userParam.username).substr(TOKEN_LENGTH);

  // save user
  const result = await user.save();
  
  return result;

}

async function addGift(memberId, giftParam) {
  
  const result = await UserMember.findOneAndUpdate(
    { _id: memberId },
    { $push: { gifts: giftParam } },
    { new: true }
  );

  return result;
  
}


async function updateGift(userId, giftId, giftParam) {

  const result = await UserMember.updateOne(
    {
      _id: userId, 
      'gifts._id': giftId 
    },
    {
      $set: {
        'gifts.$.description': giftParam.description,
        'gifts.$.name': giftParam.name
      }
    }, (err, raw) => {

      console.error(err);

    }
  );

  return { ok: result.ok };

}


async function updateLetter(id, letter) {

  const result = await UserMember.findByIdAndUpdate(id, {
    $set: { letter: letter.letter }
  });

  await result;

}

module.exports = {
  addEventForUser,
  addGift,
  authUserMemberById,
  authenticate,
  create,
  createUnregistered,
  delete: deleteUser,
  getAll,
  getById,
  getUserMemberById,
  update,
  updateGift,
  updateLetter
};
