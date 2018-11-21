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



    emitter.on("db:deleteSelectedFeature", function(_id, _db){
      feathersClient.service(_db).remove(_id).then( deleteResponse => {
        console.log(deleteResponse)
        state.selected.id = "";
        state.selected.db = "";
        state.selected.data = {};
        if(_db == "playlists"){
          state.user.playlists.selected = {};
        }
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

    emitter.on("user:playlists:addSection", function(_id, _db){
      let newSection = {
        "title":"Hi! I'm a new section!",
        "description":"Hi! describe me!"
      }
      // first create an empty placeholder section
      feathersClient.service("sections").create(newSection).then( _newSection => {
        // send it on
        return _newSection
      }).then(_newSection => {
        let updateCmd = {
          "$push":{"sections": _newSection._id}
        }
        return feathersClient.service("playlists").patch(_id, updateCmd,{})
      }).then(_newPlaylist => {
        // update the playlists with the new stuff
        emitter.emit("user:playlists:refresh");
      })
      .catch(err => {
        return err;
      })
    });

    emitter.on("user:sections:addResource", function(_id, _db){
      let newResource = {
        "title":"Hi! I'm a new resource!",
        "description":"Hi! describe me!"
      }
      // first create an empty placeholder section
      feathersClient.service("resources").create(newResource).then( _newResource => {
        // send it on
        return _newResource
      }).then(_newResource => {
        let updateCmd = {
          "$push":{"resources": _newResource._id}
        }
        return feathersClient.service("sections").patch(_id, updateCmd,{})
      }).then(_newPlaylist => {
        // update the playlists with the new stuff
        emitter.emit("user:playlists:refresh");
      })
      .catch(err => {
        return err;
      })
    });

    emitter.on("user:playlists:addJSON", function () {
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
        axios.post('https://localhost:3030/playlists/addJSON', newPlaylist, {
            "headers": {
              'Authorization': "bearer " + response.accessToken
            },
            'Content-Type': 'application/json'
          })
          .then(function (_newData) {
            state.user.playlists.selected.data = _newData.data;
            state.user.playlists.selected.id = _newData.data._id;
            state.user.playlists.selected.db = _newData.data.featureType;

            emitter.emit("user:playlists:refresh");
          })
          .catch(function (error) {
            console.log(error);
          });
      }).catch(err => {
        return err;
      })
    });


  }) // end DOMCONTENTLOADED

} // end state


// HELPER FUNCTIONS
function isEmpty(_obj){
  return Object.keys(_obj).length > 0 ? false:true;
}
function string2array(_str){
  return _str.split(',')
}
