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

router.post('/', verifySession, verifyTransactionInputs, verifyTransactionAccounts, makeTransaction,async function(req, res, next){
  console.log(req.session)
  let ret = await db.collection('accounts').find()
  let data = await ret.toArray()
  console.log(data)
  res.send(data)
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
async function makeTransaction(req, res, next){
  let filter = {
    _id: req.body.to
  }
  let updateDoc = {
    $inc: {
      amount: Number(req.body.amount) // increment -amount  = decrement amount
    }
  }
  let up = await db.collection('accounts').updateOne(filter, updateDoc)
  console.log(up.nModified)
  next()
}

module.exports = router;
