const Event = require('./event.model');


const SALT_LENGTH = 10;


function getById(id) {

  return Event.findById(id)
    .populate('members');

}

function getAll() {

  return Event.find().select();
  
}

async function create(eventParam) {

  const event = new Event(eventParam);

  // save event
  const result = await event.save();

  return result;
  
}

async function update(id, eventParam) {

  const event = await Event.findById(id);

  // validate
  if (!event) {
    
    throw new Error('Event not found');

  }

  // copy eventParam properties to event
  Object.assign(event, eventParam);

  await event.save();

}

async function deleteEvent(id) {

  await Event.findByIdAndRemove(id);

}

async function addMemberToEvent(eventId, memberId) {

  const result = await Event.findOneAndUpdate(
    { _id: eventId },
    { $push: { members: memberId } }
  );

  return result;

}

module.exports = {
  addMemberToEvent,
  create,
  delete: deleteEvent,
  getAll,
  getById,
  update
};
