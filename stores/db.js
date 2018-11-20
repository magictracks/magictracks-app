// // Connect to the `http://feathers-api.com/messages` service
const {
  feathersClient
} = require('../components/api');
const axios = require('axios');

module.exports = store


function store(state, emitter, app) {
  // The single source of Truth!
  state.community = {
    playlists:[]
  }

  // The single source of Truth!
  state.user.playlists = {
    selected:{},
    all:[]
  }

  state.selected = {
    id:"",
    db:"",
    data:{}
  }


  
  
  function initialize(){
    feathersClient.authenticate().then( (authResponse) => {
      console.log("brilliant! you're auth'd!")
        state.user.username = authResponse.username;
        state.user.id = authResponse.id;
        state.user.authenticated = true;
        emitter.emit("pushState", "app");
        return authResponse;
    }).then( (authResponse) => {
      // GET the playlists owned by the user
      let query = { query: { "submittedBy": state.user.id }}
      return feathersClient.service("playlists").find(query)
    }).then(selectedPlaylists => {
      state.user.playlists.all = selectedPlaylists;

      // set the selected playlist
      if(isEmpty(state.user.playlists.selected) === true){
        state.user.playlists.selected =  state.user.playlists.all[ state.user.playlists.all.length - 1];
      }

      emitter.emit(state.events.RENDER);
    })
    .catch( err => {
      return err;
    });
  }
  initialize();


  emitter.on('DOMContentLoaded', function () {

    // test
    emitter.on("db:test", function(){
      console.log(test);
      emitter.emit(state.events.RENDER);
    });


    emitter.on("user:playlists:select", function(_id, _db){
      console.log(_id, _db);
      state.user.playlists.selected = state.user.playlists.all.filter( playlist => playlist._id == _id )[0];

      // call getSelectedFeature to update the selected 
      emitter.emit("db:getSelectedFeature", _id, _db);
    });

    emitter.on("db:getSelectedFeature", function(_id, _db){
      console.log(_id, _db);
      feathersClient.service(_db).get(_id).then( feature => {
        state.selected.id = feature._id;
        state.selected.db = feature.featureType;
        state.selected.data = feature;
        emitter.emit(state.events.RENDER);
      }).catch(err => {
        return err;
      })
    })

    emitter.on("db:updateSelectedFeature", function(_id, _db, _formData){
      // TODO: add in handling array features
      let submittedChanges = {
        title: _formData.get("title"),
        description: _formData.get("description")
      }

      feathersClient.service(_db).patch(_id, submittedChanges,{}).then( feature => {
        state.selected.id = feature._id;
        state.selected.db = feature.featureType;
        state.selected.data = feature;
        emitter.emit("user:playlists:refresh");
      }).catch(err => {
        return err;
      })
    })

    emitter.on("user:playlists:refresh", function(){
      let query = { query: { "submittedBy": state.user.id }}
      feathersClient.service("playlists").find(query).then( selectedPlaylists => {
        state.user.playlists.all = selectedPlaylists;

        // set the selected playlist
        if(isEmpty(state.user.playlists.selected) === true){
          state.user.playlists.selected =  state.user.playlists.all[ state.user.playlists.all.length - 1];
        } else {
          state.user.playlists.selected =  state.user.playlists.all.filter( playlist => playlist._id == state.user.playlists.selected._id )[0];
        }
        emitter.emit(state.events.RENDER);
      })
    })




  }) // end DOMCONTENTLOADED

} // end state


// HELPER FUNCTIONS
function isEmpty(_obj){
  return Object.keys(_obj).length > 0 ? false:true;
}
function string2array(_str){
  return _str.split(',')
}
