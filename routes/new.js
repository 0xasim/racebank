var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('new',{error: req.param('error')})
})

router.post('/', async function(req, res, next) {
  if(req.body.username){
    // See if primary i-e entered username already exists
    prim = await db.collection('accounts').findOne({name: req.body.username})
    // Reversed username also shouldn't exist
    sec = await db.collection('accounts').findOne({name: req.body.username.split('').reverse().join('')})
    
    if(!prim && !sec){
      let re = /^\w+$/
      var isValid = re.test(req.body.username)
      if(isValid && req.body.username.length<20){
        let inRes = await db.collection('accounts').insertMany([
          { // Secondary account, reversed username
            name: req.body.username.split('').reverse().join(''), // Reversed username 
            amount: 1000
          },
          { // Primary account, real username
            name: req.body.username,  
            amount: 0
          }
        ])
        req.session.racer = inRes.insertedIds
        res.redirect('/transaction')
      }
      else res.redirect('/new?error=Invalid Characters in input. Only A-Z, a-z, _, 0-9 allowed or >20')
    }
    else res.redirect('/new?error=Username not available')
  }
  else res.send('Username required')
})

module.exports = router