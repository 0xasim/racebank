var express = require('express');
var router = express.Router();

router.get('/', hasSession, (req, res, next) => {
  res.redirect('/transaction')
});

function hasSession(req, res, next){
  if(req.session.racer) next()
  else res.redirect('/new')
}
module.exports = router;