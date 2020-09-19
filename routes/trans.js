var express = require('express');
const app = require('../app');
var router = express.Router();

/* GET transaction listing. */
router.get('/', verifySession, function(req, res, next) {
  //console.log(req.session)
  res.render('transaction', {
    prim: req.session.racer.prim,
    sec: req.session.racer.sec
  });
});

router.post('/', verifySession, verifyTransactionInputs, verifyTransactionAccounts, makeTransaction,function(req, res, next){
  res.send('{status: success}')
})

function verifyTransactionInputs(req, res, next){
  let amount = Number(req.body.amount)
  if(req.body.from && req.body.to && amount) next() // ???
  else res.send('{status: failed, message: missing params}')
}

function verifyTransactionAccounts(req, res, next){
  if (req.session.racer.ids.includes(req.body.from) && req.session.racer.ids.includes(req.body.to)) next()
  else res.send('{status: failed, message: Transaction can only be done with accounts you own}')
}

function verifySession(req, res, next){
  if(req.session.racer) next()
  else res.redirect('/new')
}
// no confirmation yet weather amount exists
function makeTransaction(req, res, next){
  let up = db.collection('accounts').updateOne(
    {
      _id: req.body.to
    },
    {
      $inc: {
        amount: Number(req.body.amount) // increment -amount  = decrement amount
      }
    })
  up.then(
    res => console.log(`Updated ${res.result.n} documents`),
    err => console.error(`Something went wrong: ${err}`),
  )
  next()
}

module.exports = router;
