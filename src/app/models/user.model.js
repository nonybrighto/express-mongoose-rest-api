import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './../../config/config';
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

UserSchema.methods.generateJwtToken = function(){

    let expireDays = config.get('jwt_token-expire-days');

    console.log(this);
    return jwt.sign(
        {id:this.id, username: this.username, email: this.email},
        config.get('jwt-secret'),
        {expiresIn: expireDays+' days'}
    );
}

UserSchema.methods.toAuthJSON = function(){

    let expireDays = config.get('jwt_token-expire-days');
    let expirationDate = new Date();
    expirationDate.setDate(new Date().getDate() + expireDays);

    return {token: this.generateJwtToken(), tokenExpires: expirationDate, user: {id: this.id, username: this.username, email: this.email}};
}

UserSchema.methods.changePassword = async function(newPassword){

     this.password = newPassword;
     let user = await this.save();
     console.log(user);
     if(user){
         return true;
     }
     return false;

}


UserSchema.statics.canLogin = async function(credential, password){

    let userDataToFind = {};
    if(validEmail(credential)){
        userDataToFind['email'] = credential;
    }else{
        userDataToFind['username'] = credential;
    }
   
    let user = await this.findOne(userDataToFind).select('+password +email').exec();
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

UserSchema.statics.findOrCreateSocialUser = async function({email, name, profilePhoto}){

    let user = this.find({email: email}).exec();
    if(user){
        return user;
    }else{
        let username = name.split(' ')[0].trim();
        while(await this.findOne({username: username})){
            let randomNumbers = Math.floor(Math.random() * 200);
            username = username+randomNumbers;
        }

        let  randomPasswordString  = Math.random().toString(36).slice(-8);
        let user = this({username: username, email:email, password:randomPasswordString, profilePhoto: profilePhoto});
        let userRegistered = await user.save();

        return userRegistered;
    }

}


export default mongoose.model('User', UserSchema);