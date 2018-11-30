const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./user.model');
const UserMember = require('./user-member.model');


const SALT_LENGTH = 10;

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

  return User.findById(id).select('-hash');

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


async function createUnregistered(userParam) {

  const user = new UserMember(userParam);

  // save user
  const result = await user.save();
  
  return result;

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


module.exports = {
  addEventForUser,
  authenticate,
  create,
  createUnregistered,
  delete: deleteUser,
  getAll,
  getById,
  update
};
