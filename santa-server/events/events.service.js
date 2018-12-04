const Event = require('./event.model');
const UserMember = require('../users/user-member.model');


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


function findResultFor(results, memberId) {
  
  // results: { memberId: string, drawnMemberId: string, }[]
  let result = null;

  results.some(resultObj => {

    if (resultObj.memberId === memberId) {
      
      result = resultObj.drawnMemberId;

      return true;

    }

    return false;

  });

  return result;

}


async function updateResults(id, results) {

  const event = await Event.findById(id);

  // validate
  if (!event) {

    throw new Error('Event not found');

  }


  let error = false;
  const bulkOperations = [];

  event.members.forEach(member => {

    // find result for the member
    const resultMemberId = findResultFor(results, member._id.toHexString());

    if (resultMemberId) {
      
      bulkOperations.push({
        updateOne:
        {
          filter: { _id: member._id.toHexString() },
          update: { pairedMemberId: resultMemberId }
        }
      });
      
    } else {
      
      console.error(`Can't find result for ${member._id.toHexString()}`);
      error = true;

    }

  });

  if (error) {

    throw new Error('Results inconsistent');
    
  } 

  await UserMember.bulkWrite(bulkOperations);
    
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
  update,
  updateResults
};
