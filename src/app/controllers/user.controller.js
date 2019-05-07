import User from  '../models/user.model';
import httpStatus from 'http-status';
import createError from 'http-errors';

function list(req, res, next){
       
    try{        
        const users = User.find().exec();
        res.status(httpStatus.OK).send(users);
    }catch(error){
        next(createError('Error occured while getting users'));
    }
    
}

async function add(req, res, next){
    try{
        const user =  new User(req.body);
        await user.save();
    }catch(error){
        next(createError('Error occured while adding user'));
     }
}


export default {list, add};



