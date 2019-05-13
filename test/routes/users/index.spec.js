
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/app';
import User from '../../../src/app/models/user.model';
import {clearMockDB} from '../../config/mock_db_config';

chai.use(chaiHttp);

const expect = chai.expect;


describe('users/', function(){

    before(async function(){
        clearMockDB();
    });

    describe('GET', function(){


        it('Should return 200 on success with no user', async function(){


               let response = await chai.request(app)
                .get('/api/v1/users/')
                .set('Content-Type','application/json');
                console.log(response.body);
                expect(response).to.have.status(200);
                expect(response.body).to.have.property('results').with.lengthOf(0);
        });

        it('Should return 200 on success with 1 user', async function(){

                let userProperties = {username:'Peter', email:'peter@gmail.com', password:'password@1'};
                let user = new User(userProperties);
                await user.save();

               let response = await chai.request(app)
                .get('/api/v1/users/')
                .set('Content-Type','application/json');
                console.log(response.body);
                expect(response).to.have.status(200);
                expect(response.body).to.have.property('results').with.lengthOf(1);
                expect(response.body.results[0].username).to.be.equals(userProperties.username);
        });

    });

});