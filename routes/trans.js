var express = require('express');
var router = express.Router();

/* GET transaction listing. */
router.get('/', function(req, res, next) {
  res.render('transaction');
});

router.post('/', verifyTransactionInputs, verifyTransactionAccounts, function(req, res, next){
  res.send('{status: success}')
})

function verifyTransactionInputs(req, res, next){
  let amount = Number(req.body.amount)
  if(req.body.to && amount){
    next()
  }
  else res.send('{status: failed}')
}

function verifyTransactionAccounts(req, res, next){

}

module.exports = router;
