// // Connect to the `http://feathers-api.com/messages` service
const {
  feathersClient
} = require('../components/api');

const axios = require('axios');

module.exports = store

function store(state, emitter, app) {
  // state.totalClicks = 0
  state.authenticated;
  state.user = {
    username: "",
    id:""
  }
  state.playlists = {
    selected: {},
    all: []
  }
  state.selectedItem = {};
  state.selectedItemDb = "";

  state.browse = {
    playlists:[],
    sections:[],
    resource:[],
    starred:[]
  }

  state.addModal = {
    toggled: false,
    currentStep:0,
    selectedPlaylist:{},
    selectedSection:{},
    submittedResource:{}
  }
  

  // check auth status
  feathersClient.authenticate().then((response) => {
    console.log("brilliant! you're auth'd!")
    state.user.username = response.username;
    state.user.id = response.id;
    emitter.emit("pushState", "app");
    state.authenticated = true;
  }).then( () => {
    // then get the playlists 
    feathersClient.service("playlists").find({query:{submittedBy: state.user.id}})
    .then((data) =>{
      state.playlists.selected = data[data.length-1];
      state.selectedItem = data[data.length-1];
      state.playlists.all = data;
      emitter.emit(state.events.RENDER);
    }).catch(err => {
      console.log(err);
      state.playlists = [];
      emitter.emit(state.events.RENDER);
    })
  })
  .catch( err =>{
    console.log("not auth'd friend!")
    state.authenticated = false;
    emitter.emit(state.events.RENDER);
  });

  emitter.on('DOMContentLoaded', function () {
    // general purpose

    emitter.on('db:AddModal:toggle', function(){
      state.addModal.toggled = !state.addModal.toggled;
      console.log(state.addModal.toggled);
      emitter.emit(state.events.RENDER);
    })
    emitter.on('db:AddModal:currentStep', function(_currentStep){
      state.addModal.currentStep = _currentStep;
      emitter.emit(state.events.RENDER);
    })
    emitter.on('db:AddModal:selectedPlaylist', function(_id){
      state.addModal.selectedPlaylist = state.playlists.all.filter(playlist => playlist._id == _id)[0];
      emitter.emit(state.events.RENDER);
    })
    emitter.on('db:AddModal:selectedSection', function(_id){
      state.addModal.selectedSection = state.addModal.selectedPlaylist.sections.filter(section => section._id == _id)[0];
      emitter.emit(state.events.RENDER);
    })

    // send the data to resources
    emitter.on("db:resources:create", function(resourceData){
      feathersClient.authenticate().then(response => {
        feathersClient.service('resources').create(resourceData).then( data => {
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
    emitter.on("db:resources:patch", function(_id, resourceData){
      feathersClient.authenticate().then(response => {
        feathersClient.service('resources').patch(_id,resourceData).then( data => {
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

    emitter.on("db:sections:patch", function(_id, _data){
      feathersClient.authenticate().then(response => {
        feathersClient.service('sections').patch(_id,_data).then( data => {
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

    emitter.on('db:playlists:addNewSection', function(_id, _data){
      feathersClient.authenticate().then(authResponse => {

        feathersClient.service('sections').create(_data).then( (sectionResponse) => {
            
            let patchData = {
              "$push": {"sections": sectionResponse._id}
            }

            feathersClient.service('playlists').patch(_id, patchData).then( (playlistResponse) => {
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


    emitter.on("db:playlists:add", function(){
      feathersClient.authenticate().then(response => {
        let newPlaylist = {
          "title":"New Playlist! Edit me!",
          "description":"New Playlist description! Edit me!",
          "sections":[{
            "title":"Unsorted",
            "description":"a section for all your unsorted links",
            "resources":[
              {"title":"empty resource container"}
            ]
          }]
        }
        console.log("trying to post to playlists")

        console.log(response)
        axios.post('https://localhost:3030/playlists/addJSON', newPlaylist, {
          "headers": {'Authorization': "bearer " + response.accessToken},
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
        // feathersClient.service('playlists').create().then( data => {
        //   console.log("Resource subcessfully submitted");
        //   console.log(data);
        //   state.addModal.selectedSection = data;
        //   emitter.emit(state.events.RENDER);
        // }).catch(err => {
        //   return err;
        // })

      }).catch(err => {
        return err;
      })
    })
    
    

    emitter.on('db:playlists:find', function(_id){
      feathersClient.service("playlists").find({query:{submittedBy: state.user.id}})
        .then((data) =>{
            if(Object.keys(state.playlists.selected).length > 0 ){
              state.playlists.selected = data.filter(playlist => playlist._id ==  state.playlists.selected._id)[0];
            } else{
              state.playlists.selected = data[data.length-1];
            }
          state.playlists.all = data;
          emitter.emit(state.events.RENDER);
        }).catch(err => {
          console.log(err);
          state.playlists = [];
          emitter.emit(state.events.RENDER);
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
        .then( data => {
          state.selectedItem  = data;

          // emitter.emit(state.events.RENDER)
          emitter.emit("db:playlists:find");
        }).catch(err =>{
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
    
    emitter.on('db:users:redirect', function () {
      emitter.emit("pushState", "/");
    })

    emitter.on('db:users:logout', function () {
      feathersClient.logout();
      emitter.emit("pushState", "/");
    })

    emitter.on('db:playlists:select', function (_id) {
      state.playlists.selected = state.playlists.all.filter(playlist => playlist._id == _id)[0];
      emitter.emit(state.events.RENDER)
    })

    emitter.on('db:feature:select', function (_id, _db) {
      console.log(_id, _db);
      feathersClient.service(_db).get(_id)
        .then( data => {
          state.selectedItem  = data;
          state.selectedItemDb = _db;
          emitter.emit(state.events.RENDER)
        }).catch(err =>{
          return err;
        })
    })


    emitter.on('db:test', function (test) {
      if(!test){
        console.log("testing testing testing");
      }else{
        console.log("testing with a payload:", test);
      }
      
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
        feathersClient.authenticate().then((response) => {
          console.log("from db:users:login")
          state.user.username = response.username;
          state.user.id = response._id;
          state.authenticated = true;
          emitter.emit("pushState", "app")
        }).catch( err =>{
          console.log("not auth'd friend!")
          state.authenticated = false;
          emitter.emit("pushState", "login")
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
        feathersClient.authenticate(payload).then((response) => {
          // Logged in
          console.log("logged in!")
          state.authenticated = true;
          state.user.username = response.username;
          state.user.id = response._id;
          emitter.emit("pushState", "app")
        }).catch(e => {
          // Show login page (potentially with `e.message`)
          console.error('Authentication error', e);
          state.authenticated = false;
          emitter.emit("pushState", "/")
        });
      }

    });
  })
}