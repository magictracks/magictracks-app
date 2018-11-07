// // Connect to the `http://feathers-api.com/messages` service
const {
  feathersClient
} = require('../components/api');

module.exports = store

function store(state, emitter, app) {
  // state.totalClicks = 0


  emitter.on('DOMContentLoaded', function () {
    emitter.on('db:test', function (count) {
      // state.totalClicks += count

      emitter.emit(state.events.RENDER)
    })

    /** 
     * SIGNUP
     */
    emitter.on('db:users:signup', function (formData) {

      let credentials = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password")
      }
      
      feathersClient.service('users').create(credentials).then(() => {
        console.log("sign up successful yo!")
        emitter.emit("db:users:login", formData)
        // emitter.emit(state.events.RENDER)
      }).catch(err => {
        console.log(err);
      })
    });

    /** 
     * LOGIN
     */
    emitter.on("db:users:login", function (formData) {
      if (!formData) {
        // try to auth using JWT from local Storage
        api.authenticate().then(() => {
          console.log("brilliant! you're auth'd!")
          emitter.emit("pushState", "app")
        });
      } else {
        // If we get login information, add the strategy we want to use for login
        let credentials = {
          username: formData.get("username"),
          email: formData.get("email"),
          password: formData.get("password")
        }
        // create the payload
        const payload = Object.assign({
          strategy: 'local'
        }, credentials);

        // call authenticate!
        feathersClient.authenticate(payload).then(() => {
          // Logged in
          console.log("logged in!")
          emitter.emit("pushState", "app")
        }).catch(e => {
          // Show login page (potentially with `e.message`)
          console.error('Authentication error', e);
          emitter.emit("pushState", "")
        });
      }

    });
  })
}