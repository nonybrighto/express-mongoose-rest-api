import User from  '../models/user.model';
import JwtTokenBlacklist from '../models/jwt_token_blacklist.models';
import createError from 'http-errors';
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
            res.status(httpStatus.CREATED).send(userRegistered.toAuthJSON());
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
                res.status(httpStatus.OK).send(user.toAuthJSON());
            });
        }
    })(req, res, next);
}

async function refreshJwtToken(req, res, next){
    try{
        let userJwtToken = req.headers.authorization.split(' ')[1];
        let currentUserId = req.user.id;
        let user = await User.findById(currentUserId);
        if(user){
            
            //add token to deleted tokens so it can't have access anymore
            let deletedToken = new JwtTokenBlacklist({token: userJwtToken});
            await deletedToken.save();

            res.status(httpStatus.OK).send(user.toAuthJSON());
        }else{
            next(createError(httpStatus.NOT_FOUND, 'Error occured while refreshing token'));
        }
    }catch(error){
        console.log(error);
        next(createError('Error occured while refreshing token'));
    }
}



function googleIdTokenAuth(req, res, next){

    passport.authenticate('google-id-token', { session: false },
        (err, user, info) => {
            if (err || info) {
               return next(createError(httpStatus.BAD_REQUEST, 'Google authentication failed'));
            }
            res.status(httpStatus.OK).send(user.toAuthJSON());
        })(req, res, next);
}


function facebookTokenAuth(req, res, next){

    passport.authenticate('facebook-token', { session: false },
        (err, user, info) => {
            if (err || info) {
                return next(createError(httpStatus.BAD_REQUEST, 'Facebook authentication failed'));
            }
            res.status(httpStatus.OK).send(user.toAuthJSON());
        })(req, res, next);

}

export default {register, login, refreshJwtToken, googleIdTokenAuth, facebookTokenAuth}