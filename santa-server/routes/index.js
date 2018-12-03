const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Helloworld page. */
router.get('/helloworld', function(req, res, next) {
  res.render('helloworld', { title: 'Siemaneczko' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
  const db = req.db;
  const collection = db.get('usercollection');
  collection.find({}, {}, (e, docs) => {
    res.render('userlist', {
      "userlist": docs
    });
  });
});

module.exports = router;
