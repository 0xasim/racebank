var express = require('express');
const { Db } = require('mongodb');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('new',{error: req.param('error')})
})

router.post('/', async function(req, res, next) {
  if(req.body.username){
    results = await db.collection('accounts').findOne({name: req.body.username})
    console.log(results)
    if(!results){
      let re = /^\w+$/
      var isValid = re.test(req.body.username)
      if(isValid){
        
      }
      else res.redirect('/new?error=Invalid Characters in input. Only A-Z, a-z, _, 0-9 allowed')
    }
    else res.redirect('/new?error=Username not available')
  }
  else res.send('Username required')
})

module.exports = router