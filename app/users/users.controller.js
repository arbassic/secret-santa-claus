const express = require('express');
const router = new express.Router();
const userService = require('./users.service');


const BAD_HTTP_REQUEST = 400;
const NOT_FOUND = 404;

function authenticate(req, res, next) {

  const promise = userService.authenticate(req.body);

  promise.then((user) => {

    if (user) {
      
      res.json(user);

    } else {
      
      res.status(BAD_HTTP_REQUEST)
        .json({ message: 'Username or password is incorrect' });
      
    }

  }).catch((err) => {
    
    next(err);

  });
  
}

function register(req, res, next) {
  
  req.body.type = 'registered';
  userService.create(req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
  
}

function unregistered(req, res, next) {
  
  req.body.user.event = req.body.eventId;
  userService.createUnregistered(req.body.user)
    .then(user => res.json(user))
    .catch(err => next(err));
  
}


function getAll(req, res, next) {

  userService.getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
  
}


function getCurrent(req, res, next) {

  const promise = userService.getById(req.user.sub)
    .then((user) => {
    
      if (user) {
      
        res.json(user);

      } else {
        
        res.sendStatus(NOT_FOUND);

      }
  
    })
    .catch(err => next(err));
  
}


function getById(req, res, next) {

  userService.getById(req.params.id)
    .then((user) => {

      if (user) {

        res.json(user);

      } else {
        
        res.sendStatus(NOT_FOUND);

      }
      
    })
    .catch(err => next(err));

}


function getUserMemberById(req, res, next) {

  userService.getUserMemberById(req.params.id)
    .then((user) => {

      if (user) {

        res.json(user);

      } else {
        
        res.sendStatus(NOT_FOUND);

      }
      
    })
    .catch(err => next(err));

}


function update(req, res, next) {

  const promise = userService.update(req.params.id, req.body);
  
  promise.then(() => res.json({}))
    .catch(err => next(err));
  
}

function addGift(req, res, next) {

  const promise = userService.addGift(req.params.memberId, req.body);
  
  promise.then(gift => res.json(gift))
    .catch(err => next(err));
  
}

function updateGift(req, res, next) {

  const promise = userService.updateGift(req.params.id, req.body.id, req.body);
  
  promise.then(result => res.json(result))
    .catch(err => next(err));
  
}

function updateLetter(req, res, next) {

  const promise = userService.updateLetter(
    req.params.id,
    req.body.id,
    req.body
  );
  
  promise.then(() => res.json({}))
    .catch(err => next(err));
  
}


function deleteUser(req, res, next) {

  const promise = userService.delete(req.params.id);
  
  promise.then(() => res.json({}))
    .catch(err => next(err));
  
}


// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.post('/unregistered', unregistered);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.get('/member/:id', getUserMemberById);
router.post('/member/gift/:memberId', addGift);
router.put('/member/gift/:id', updateGift);
router.put('/member/letter/:id', updateLetter);
router.put('/:id', update);
router.delete('/:id', deleteUser);

module.exports = router;
