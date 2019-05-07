import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {validEmail} from '../helpers/validators';


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        select: false
    },
    password: {
        type: String,
        required: true,
        select: false
    }
});
UserSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false
});

// @ts-ignore
UserSchema.pre('save', async function (next){

    let passwordHash = await bcrypt.hash(this.password, 10);
    this.password = passwordHash;

    next();

});


UserSchema.statics.canLogin = async function(credential, password){

    let userDataToFind = {};
    if(validEmail(credential)){
        userDataToFind['email'] = credential;
    }else{
        userDataToFind['username'] = credential;
    }
   
    let user = await this.find(userDataToFind).exec();
    if(user){
        let passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                return user;
            } else {
                return false;
            }
    }
    return false;
}


export default mongoose.model('User', UserSchema);