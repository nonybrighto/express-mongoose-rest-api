import passport from 'passport';
import RateLimit from 'express-rate-limit';
import createError from 'http-errors';
import httpStatus from 'http-status';

const loginLimiter = new RateLimit({
    windowMs: 2 * 60 * 1000,
    max: 15,
    message:"Too many login attempts, please try again after 5 minutes",
    skipSuccessfulRequests:true
  });


function jwtRequiredAuthentication(req, res, next){

  passport.authenticate('jwt', {session: false}, (err, user, info) => {

    if (err || !user) {
      next(createError(httpStatus.UNAUTHORIZED, 'Request not authorized'));
    }else{
      req.user = user;
    }
  next();
  })(req, res, next);
  
}

function jwtOptionalAuthentication(req, res, next){

  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if(user){
      req.user = user;
    }
  next();
  })(req, res, next);
  
}

export {loginLimiter, jwtRequiredAuthentication, jwtOptionalAuthentication}