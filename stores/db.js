// // Connect to the `http://feathers-api.com/messages` service
const {
  feathersClient
} = require('../components/api');
const axios = require('axios');

module.exports = store

function store(state, emitter, app) {
  state.authenticated;

  state.user = {
    username: "",
    id: "",
    authenticated:"",
    selectedCollection: "",
    selectedId: "",
    playlists: {
      selected: {},
      all: []
    },
    sections: {
      selected: {},
      all: []
    },
    resources: {
      selected: {},
      all: []
    }
    // TODO: 
    // comments: {
    //   selected: {},
    //   all: []
    // },
    // tags: {
    //   selected: {},
    //   all: []
    // }
  };

  state.editing = {

  }

  state.browsing = {

  }
  


  state.playlists = {
    selected: {},
    all: []
  }

  state.selectedItem = {};
  state.selectedItemDb = "";



  state.addModal = {
    toggled: false,
    currentStep: 0,
    selectedPlaylist: {},
    selectedSection: {},
    submittedResource: {}
  }


  // check auth status
  feathersClient.authenticate().then((response) => {
      console.log("brilliant! you're auth'd!")
      state.user.username = response.username;
      state.user.id = response.id;
      emitter.emit("pushState", "app");
      state.user.authenticated = true;
    }).then(() => {
      // then get the playlists 
      feathersClient.service("playlists").find({
          query: {
            submittedBy: state.user.id
          }
        })
        .then((data) => {
          state.playlists.selected = data[data.length - 1];
          state.selectedItem = data[data.length - 1];
          state.playlists.all = data;
          emitter.emit(state.events.RENDER);
        }).catch(err => {
          console.log(err);
          state.playlists = [];
          emitter.emit(state.events.RENDER);
        })
    })
    .catch(err => {
      console.log("not auth'd friend!")
      state.user.authenticated = false;
      emitter.emit(state.events.RENDER);
    });

  emitter.on('DOMContentLoaded', function () {
    // general purpose

    emitter.on('db:AddModal:toggle', function () {
      state.addModal.toggled = !state.addModal.toggled;
      console.log(state.addModal.toggled);
      emitter.emit(state.events.RENDER);
    })
    emitter.on('db:AddModal:currentStep', function (_currentStep) {
      state.addModal.currentStep = _currentStep;
      emitter.emit(state.events.RENDER);
    })
    emitter.on('db:AddModal:selectedPlaylist', function (_id) {
      state.addModal.selectedPlaylist = state.playlists.all.filter(playlist => playlist._id == _id)[0];
      emitter.emit(state.events.RENDER);
    })
    emitter.on('db:AddModal:selectedSection', function (_id) {
      state.addModal.selectedSection = state.addModal.selectedPlaylist.sections.filter(section => section._id == _id)[0];
      emitter.emit(state.events.RENDER);
    })

    // send the data to resources
    emitter.on("db:resources:create", function (resourceData) {
      feathersClient.authenticate().then(response => {
        feathersClient.service('resources').create(resourceData).then(data => {
          console.log("Resource subcessfully submitted");
          console.log(data);
          state.addModal.submittedResource = data;
          emitter.emit(state.events.RENDER);
        }).catch(err => {
          return err;
        })
      }).catch(err => {
        return err;
      })
    })

    emitter.on("db:resources:patch", function (_id, resourceData) {
      feathersClient.authenticate().then(response => {
        feathersClient.service('resources').patch(_id, resourceData).then(data => {
          console.log("Resource subcessfully submitted");
          console.log(data);
          state.addModal.submittedResource = data;
          emitter.emit(state.events.RENDER);
        }).catch(err => {
          return err;
        })
      }).catch(err => {
        return err;
      })
    })

    emitter.on("db:sections:patch", function (_id, _data) {
      feathersClient.authenticate().then(response => {
        feathersClient.service('sections').patch(_id, _data).then(data => {
          console.log("Resource subcessfully submitted");
          console.log(data);
          state.addModal.selectedSection = data;
          emitter.emit(state.events.RENDER);
        }).catch(err => {
          return err;
        })
      }).catch(err => {
        return err;
      })
    })

    emitter.on('db:playlists:addNewSection', function (_id, _data) {
      feathersClient.authenticate().then(authResponse => {

        feathersClient.service('sections').create(_data).then((sectionResponse) => {

          let patchData = {
            "$push": {
              "sections": sectionResponse._id
            }
          }

          feathersClient.service('playlists').patch(_id, patchData).then((playlistResponse) => {
            // console.log(playlistResponse);
            console.log(_id, sectionResponse, playlistResponse)
            state.addModal.selectedPlaylist = playlistResponse;
            state.playlists.selected = state.addModal.selectedPlaylist;
            state.addModal.selectedSection = sectionResponse;
            console.log("update dropdown!!!")
            // emitter.emit("db:playlists:find");
            emitter.emit(state.events.RENDER);
          }).catch(err => {
            return err;
          })
        });
      }).catch(err => {
        return err;
      })
    })


    emitter.on("db:playlists:add", function () {
      feathersClient.authenticate().then(response => {
        let newPlaylist = {
          "title": "New Playlist! Edit me!",
          "description": "New Playlist description! Edit me!",
          "sections": [{
            "title": "Unsorted",
            "description": "a section for all your unsorted links",
            "resources": [{
              "title": "empty resource container"
            }]
          }]
        }
        console.log("trying to post to playlists")

        console.log(response)
        axios.post('https://localhost:3030/playlists/addJSON', newPlaylist, {
            "headers": {
              'Authorization': "bearer " + response.accessToken
            },
            'Content-Type': 'application/json'
          })
          .then(function (data) {
            console.log(data);

            emitter.emit("db:playlists:find")
            // emitter.emit(state.events.RENDER);
          })
          .catch(function (error) {
            console.log(error);
          });

      }).catch(err => {
        return err;
      })
    })



    emitter.on('db:playlists:find', function (_id) {
      feathersClient.service("playlists").find({
          query: {
            submittedBy: state.user.id
          }
        })
        .then((data) => {
          if (Object.keys(state.playlists.selected).length > 0) {
            state.playlists.selected = data.filter(playlist => playlist._id == state.playlists.selected._id)[0];
          } else {
            state.playlists.selected = data[data.length - 1];
          }
          state.playlists.all = data;
          emitter.emit(state.events.RENDER);
        }).catch(err => {
          console.log(err);
          state.playlists = [];
          emitter.emit(state.events.RENDER);
        })
    })

    emitter.on('db:delete', function () {
      feathersClient.authenticate()
        .then((response) => {
          console.log(state.selectedItemDb)
          console.log(state.selectedItem._id)
          feathersClient.service(state.selectedItemDb).remove(state.selectedItem._id)
            .then((deleteResponse) => {
              console.log(deleteResponse);
              // emitter.emit(state.events.RENDER);
              emitter.emit("db:playlists:find")
            }).catch(innerErr => {
              return innerErr
            })
        }).catch(outerErr => {
          return outerErr;
        })
    })

    emitter.on('db:patch', function (_id, _formData) {
      // state.playlists.selected = state.playlists.all.filter(playlist => playlist._id == _id)[0];

      let formData = {
        title: _formData.get("title"),
        description: _formData.get("description"),
        url: _formData.get("url")
      }

      // TODO -- refactor: https://github.com/choojs/choo/issues/645

      feathersClient.authenticate().then((response) => {

        feathersClient.service(state.selectedItemDb).patch(_id, formData, {})
          .then(data => {
            state.selectedItem = data;

            // emitter.emit(state.events.RENDER)
            emitter.emit("db:playlists:find");
          }).catch(err => {
            console.log(err);
            return err;
          })
      }).catch(err => {
        console.log(err);
        return err;
      })
      console.log(emitter);
      // emitter.emit(state.events.RENDER)
    })

    

    emitter.on('db:playlists:select', function (_id) {
      state.playlists.selected = state.playlists.all.filter(playlist => playlist._id == _id)[0];
      emitter.emit(state.events.RENDER)
    })

    emitter.on('db:feature:select', function (_id, _db) {
      console.log(_id, _db);
      feathersClient.service(_db).get(_id)
        .then(data => {
          state.selectedItem = data;
          state.selectedItemDb = _db;
          emitter.emit(state.events.RENDER)
        }).catch(err => {
          return err;
        })
    })

    /***************************
     * PLAYLISTS
     ****************************/

     /***************************
     * SECTIONS
     ****************************/


    /***************************
     * RESOURCES
     ****************************/

    /***************************
     * ROUTING
     ****************************/    
    emitter.on('db:users:redirect', pushState("/"))

    /***************************
     * AUTH
     ****************************/
    // SIGNUP
    emitter.on('db:users:signup', signup(formData));
    // LOGIN
    emitter.on("db:users:login", login(formData));
    // LOGOUT
    emitter.on('db:users:logout', logout());

    /***************************
     * TEST
     ****************************/
    emitter.on('db:test', test(_payload) )

  }) // end DOMCONTENTLOADED

  /** CHANGE THE APP ROUTE */
  function pushState(_route){
    emitter.emit("pushState", _route);
  }



  /** TEST FUNCTION */
  function test(_payload){
    if (!_test) {
      console.log("testing testing testing");
    } else {
      console.log("testing with a payload:", _payload);
    }
    emitter.emit(state.events.RENDER)
  }

  /** SIGNUP FUNCTION */
  function signup(_formData){
    let credentials = {
      username: _formData.get("username"),
      email: _formData.get("email"),
      password: _formData.get("password")
    }
    feathersClient.service('users').create(credentials).then( () =>{
      console.log("sign up successful yo!")
      emitter.emit("db:users:login", formData)
    }).catch(err => {
      console.log("sign up unsuccessful! something went wrong!")
      return error;
    });
  }

  /** LOGOUT */
  function logout(){
    feathersClient.logout();
    pushState("/")
  }

  /** LOGIN FUNCTION */
  function login(_formData) {
    if (!_formData) {
        feathersClient.authenticate().then( authResponse => {
          // try to auth using JWT from local Storage
          state.user.username = authResponse.username;
          state.user.id = authResponse._id;
          state.authenticated = true;
          emitter.emit("pushState", "app")
        }).catch(err => {
          console.log("not auth'd friend!")
          state.authenticated = false;
          emitter.emit("pushState", "login")
        });
    } else {
      // If we get login information, add the strategy we want to use for login
        let credentials = {
          username: _formData.get("username"),
          email: _formData.get("email"),
          password: _formData.get("password")
        }
        // create the payload
        const payload = Object.assign({
          strategy: 'local'
        }, credentials);

        feathersClient.authenticate(payload).then(authResponse => {
          state.authenticated = true;
          state.user.username = response.username;
          state.user.id = response._id;
          emitter.emit("pushState", "app")
        }).catch(err => {
          // Show login page (potentially with `e.message`)
          console.error('Authentication error', error);
          state.authenticated = false;
          emitter.emit("pushState", "/")
        });
    }
  } // end login
}