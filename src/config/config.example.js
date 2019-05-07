'use strict';

import nconf from 'nconf';

nconf.defaults({
	'api-v1-url': 'http://localhost:3000/api/v1/',
	'env': 'development',
	'base-url': 'http://localhost:3000/',
	'jwt-secret': '0a6b357d-d2fb-46fc-a84e-0295a986cd9f',
	'uuid-namespace': '1b512364-41d5-456e-54b0-cda1fe1f3341',
	'facebook-client-id':'',
	'facebook-client-secret':'',
	'google-client-id':'',
	'jwt_token-expire-days':30
});

export default nconf;