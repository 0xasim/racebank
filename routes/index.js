var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  // find() returns cursor, not data
  let cursor = db.collection('accounts').find({})
  let accounts = await cursor.toArray()
  let data = {
    title: 'Racing Bank',
    accounts: accounts
  }
  console.log(data)
  res.render('index', data);
});

module.exports = router;
