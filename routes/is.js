function isSession(req, res, next){
  if(req.session.racer) res.locals.isSession = true
  else res.locals.isSession = false
  next()
}

module.exports = {
  isSession
}