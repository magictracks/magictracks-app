var feathers = require('@feathersjs/feathers');
var rest = require('@feathersjs/rest-client');
const auth = require('@feathersjs/authentication-client');
// Connect to a different URL
const restClient = rest('https://localhost:3030')
// Configure an AJAX library (see below) with that client 
// const api = feathersConnection.configure(restClient.axios(axios));
const feathersClient = feathers().configure(restClient.fetch(window.fetch));

feathersClient.configure(auth({
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

console.log('-------------------------')
console.log(`
NOTE: if you are having trouble with https issues during development
- FIRST: Follow along here: https://alexanderzeitler.com/articles/Fixing-Chrome-missing_subjectAltName-selfsigned-cert-openssl/
- THEN: in your browser add the security exceptions for the URLS:
https://localhost:3030
https://localhost:8080

To do this you can just navigate to those URLs and you'll get a prompt
asking you to confirm the security exception.

This should be sorted in production with an actual HTTPS certificate

`)
console.log('-------------------------')


module.exports = {
    feathersClient
};