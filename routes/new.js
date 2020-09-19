var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('new',{error: req.param('error')})
})

router.post('/', async function(req, res, next) {
  if(req.body.username){
    let prim_name = req.body.username
    let sec_name = req.body.username.split('').reverse().join('')
    // See if primary i-e entered username already exists
    prim_exists = await db.collection('accounts').findOne({name: prim_name})
    // Reversed username also shouldn't exist
    sec_exists = await db.collection('accounts').findOne({name: sec_name})
    
    if(!prim_exists && !sec_exists){
      let re = /^\w+$/
      var isValid = re.test(prim_name)
      if(isValid && prim_name.length<20){
        let inRes = await db.collection('accounts').insertMany([
          { // Secondary account, reversed username
            name: sec_name, // Reversed username 
            amount: 1000
          },
          { // Primary account, real username
            name: prim_name,  
            amount: 0
          }
        ])
        req.session.racer = {
          prim: {
            id: inRes.insertedIds[1],
            name: prim_name
          },
          sec: {
            id: inRes.insertedIds[0],
            name: sec_name
          },
          ids: [inRes.insertedIds[0], inRes.insertedIds[1]]
        }
        res.redirect('/transaction')
      }
      else res.redirect('/new?error=Invalid Characters in input. Only A-Z, a-z, _, 0-9 allowed or >20')
    }
    else res.redirect('/new?error=Username not available')
  }
  else res.send('Username required')
})

module.exports = router