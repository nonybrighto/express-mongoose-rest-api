import User from  '../models/user.model';
import httpStatus from 'http-status';
import createError from 'http-errors';


async function list(req, res, next){
       
    try{        
        const users = await User.find().exec();
        res.status(httpStatus.OK).send(users);
    }catch(error){
        next(createError('Error occured while getting users'));
    }
    
}

export default {list};



