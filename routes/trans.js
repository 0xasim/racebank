var express = require('express');
const app = require('../app');
var router = express.Router();

/* GET transaction listing. */
router.get('/', verifySession, function(req, res, next) {
  res.render('transaction');
});

router.post('/', verifySession, verifyTransactionInputs, verifyTransactionAccounts, makeTransaction,function(req, res, next){
  res.send('{status: success}')
})

function verifyTransactionInputs(req, res, next){
  let amount = Number(req.body.amount)
  if(req.body.to && amount) next() // && req.body.from???
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
// no confirmation yet weather amount exists
function makeTransaction(req, res, next){
  db.collection('accounts').update({
    _id: req.body.to
  },
  {
    $inc: {
      amount: -req.body.amount // increment -amount  = decrement amount
    }
  })
  next()
}

module.exports = router;
