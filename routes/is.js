function isSession(req, res, next){
  if(req.session.racer) req.locals.isSession = true
  else req.locals.isSession = false
  next()
}

module.exports = {
  isSession
}