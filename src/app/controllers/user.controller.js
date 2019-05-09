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

async function changePassword(req, res, next){

    try{
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        // @ts-ignore
        let user = await User.canLogin(req.user.username, oldPassword);
        if(user){
                // @ts-ignore
               let changed = await user.changePassword(newPassword);
               if(changed){
                    res.sendStatus(200);
               }else{
                    throw new Error('Could not change password');
               }
        }else{
            next(createError(httpStatus.FORBIDDEN, 'not permitted to change password'));
        }
    }catch(error){
        console.log(error);
        next(createError('Error occured while changing password'));
    }

}

export default {list, changePassword};



