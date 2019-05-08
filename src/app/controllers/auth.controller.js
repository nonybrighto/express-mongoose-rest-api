import User from  '../models/user.model';
import createError from 'http-errors';
import JwtHelper from './../helpers/jwt_helper';
import httpStatus from 'http-status';
import passport from 'passport';

async function register(req, res, next){
    try{
        if(await User.findOne({username: req.body.username})){
            next(createError(httpStatus.CONFLICT,'Username already exists'));
        }else if(await User.findOne({email: req.body.email})){
            next(createError(httpStatus.CONFLICT,'Email already exists'));
        }else{
            const user =  new User(req.body);
            let userRegistered = await user.save();
            let helper = new JwtHelper(userRegistered);
            helper.sendJwtResponse(res);
        }
         
    }catch(error){
        console.log(error);
        next(createError('Error occured while adding user'));
     }
}

async function login(req, res, next){
    passport.authenticate('local', { session: false }, (err, user, info) => {

        if (err || !user) {
            next(createError(httpStatus.BAD_REQUEST, 'Login failed'));
        }else{
            req.login(user, { session: false }, (err) => {
                if (err) {
                   next(createError(httpStatus.BAD_REQUEST, 'Login failed'));
                }
                let helper = new JwtHelper(user);
                helper.sendJwtResponse(res);
            });
        }
    })(req, res, next);
}

function googleIdTokenAuth(req, res, next){

    passport.authenticate('google-id-token', { session: false },
        (err, user, info) => {
            if (err || info) {
               return next(createError(httpStatus.BAD_REQUEST, 'Google authentication failed'));
            }
            let helper = new JwtHelper(user);
            helper.sendJwtResponse(res);
        })(req, res, next);
}


function facebookTokenAuth(req, res, next){

    passport.authenticate('facebook-token', { session: false },
        (err, user, info) => {
            if (err || info) {
                return next(createError(httpStatus.BAD_REQUEST, 'Facebook authentication failed'));
            }
            let helper = new JwtHelper(user);
            helper.sendJwtResponse(res);
        })(req, res, next);

}

export default {register, login, googleIdTokenAuth, facebookTokenAuth}