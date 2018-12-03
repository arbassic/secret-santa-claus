const express = require('express');
const router = new express.Router();
const eventService = require('./events.service');
const usersService = require('../users/users.service');


const BAD_HTTP_REQUEST = 400;
const NOT_FOUND = 404;


function createNew(req, res, next) {
  
  eventService.create(req.body)
    .then(event => {
      
      // add relation to the user (update user)
      usersService.addEventForUser(req.user.sub, event.id);
  
      res.json({});
      
    })
    .catch(err => next(err));
  
}


function getAll(req, res, next) {

  eventService.getAll()
    .then(events => res.json(events))
    .catch(err => next(err));
  
}


function getById(req, res, next) {

  eventService.getById(req.params.id)
    .then((event) => {

      if (event) {

        res.json(event);

      } else {
        
        res.sendStatus(NOT_FOUND);

      }
      
    })
    .catch(err => next(err));

}


function update(req, res, next) {

  if (req.body.userId) {

    /* 
     * sub-update
     * add the user to the event 
     */
    eventService.addMemberToEvent(req.params.id, req.body.userId)
      .then(() => res.json({}))
      .catch(err => next(err));

    return;

  }
  const promise = eventService.update(req.params.id, req.body);
  
  promise.then(() => res.json({}))
    .catch(err => next(err));
  
}


function deleteEvent(req, res, next) {

  const promise = eventService.delete(req.params.id);
  
  promise.then(() => res.json({}))
    .catch(err => next(err));
  
}


// routes
router.post('/create', createNew);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', deleteEvent);

module.exports = router;
