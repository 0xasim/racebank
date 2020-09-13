var express = require('express');
const { route } = require('.');
var router = express.Router();

router.get('/', (req, res, next) => {
  if(!req.session.racer){
    res.render('new')
  }
})

module.exports = router