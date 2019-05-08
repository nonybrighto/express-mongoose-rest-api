import User from  '../models/user.model';
import createError from 'http-errors';
import JwtHelper from './../helpers/jwt_helper';
import httpStatus from 'http-status';

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
    try{
        // @ts-ignore
        let user = await User.canLogin(req.body.credential, req.body.password);
        if(user){
            let helper = new JwtHelper(user);
            helper.sendJwtResponse(res);
        }else{
            next(createError(httpStatus.FORBIDDEN,'Invalid login credentials'));
        }
        
    }catch(error){
        console.log(error);
        next(createError('Error occured while adding user'));
     }
}

export default {register, login}