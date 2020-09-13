var express = require('express');
const app = require('../app');
var router = express.Router();

/* GET transaction listing. */
router.get('/', verifySession, function(req, res, next) {
  res.render('transaction');
});

router.post('/', verifySession, verifyTransactionInputs, verifyTransactionAccounts, function(req, res, next){
  res.send('{status: success}')
})

function verifyTransactionInputs(req, res, next){
  let amount = Number(req.body.amount)
  if(req.body.to && req.body.from && amount) next()
  else res.send('{status: failed}')
}

function verifyTransactionAccounts(req, res, next){
  if ((req.body.from in req.session.racer) && (req.body.to in req.session.racer)) next()
  else res.send('{status: failed, message: Transaction can only be done with accounts you own}')
}

function verifySession(req, res, next){
  if(req.session.racer) next()
  else res.redirect('/new')
}
module.exports = router;
