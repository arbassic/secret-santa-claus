const express = require('express');
const router = new express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {

  console.log('got get call on: /users');
  res.send('respond with a resource');

});

router.post('/register', (req, res, next) => {
  
  // console.log('got post call on: /users/register');
  res.send('{ "status": 1 }');
  
});

module.exports = router;
