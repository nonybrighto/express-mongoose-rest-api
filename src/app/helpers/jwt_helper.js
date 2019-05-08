import jwt from 'jsonwebtoken';
import config from './../../config/config';
import  _  from 'lodash';

//TODONOW: control how long it takes for a token to expire
class JwtHelper{

    constructor(user){
       delete user._doc.password;
       this.user = _.omit(user, ['password']);
    }

    generateJwtToken() {
        
        let expireDays = config.get('jwt_token-expire-days');

        return jwt.sign(
            this.user.toJSON(),
            config.get('jwt-secret'),
            {expiresIn: expireDays+' days'}
        );
    }

    sendJwtResponse(res, status = 200){
        let expireDays = config.get('jwt_token-expire-days');
        let expirationDate = new Date();
        expirationDate.setDate(new Date().getDate() + expireDays);
        
        res.status(status).send({token: this.generateJwtToken(), tokenExpires: expirationDate, user: this.user})
    }
}

export default JwtHelper;