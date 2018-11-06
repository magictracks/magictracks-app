var feathers = require('@feathersjs/feathers');
var rest = require('@feathersjs/rest-client');
const auth = require('@feathersjs/authentication-client');
// Configure feathers
const feathersConnection = feathers();
// Connect to a different URL
const restClient = rest('http://127.0.0.1:3030')
// Configure an AJAX library (see below) with that client 
const api = feathersConnection.configure(restClient.fetch(window.fetch));

api.configure(auth({
    header: 'Authorization', // the default authorization header for REST
    prefix: '', // if set will add a prefix to the header value. for example if prefix was 'JWT' then the header would be 'Authorization: JWT eyJ0eXAiOiJKV1QiLCJhbGciOi...'
    path: '/authentication', // the server-side authentication service path
    jwtStrategy: 'jwt', // the name of the JWT authentication strategy
    entity: 'user', // the entity you are authenticating (ie. a users)
    service: 'users', // the service to look up the entity
    cookie: 'feathers-jwt', // the name of the cookie to parse the JWT from when cookies are enabled server side
    storageKey: 'feathers-jwt', // the key to store the accessToken in localstorage or AsyncStorage on React Native
    storage: localStorage // Passing a WebStorage-compatible object to enable automatic storage on the client.
}));


module.exports = {
    api
};