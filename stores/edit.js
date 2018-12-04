const {
  feathersClient
} = require('../components/api');
const axios = require('axios');

module.exports = store

store.storeName = 'edit'

function store(state, emitter) {

  state.edit = {
    playlists: [],
    sections: [],
    resources: [],
    selected: {},

  }

  // Set Initial State
  feathersClient.authenticate().then((authResponse) => {
    console.log("brilliant! you're auth'd!")
    state.user.username = authResponse.username;
    state.user.id = authResponse.id;
    state.user.authenticated = true;
    // emitter.emit("pushState", "app");
    return authResponse;
  }).then((authResponse) => {
    // GET the playlists owned by the user
    let query = {
      query: {
        "submittedBy": state.user.id
      }
    }
    return feathersClient.service("playlists").find(query)
  }).then(res => {
    state.edit.playlists = res.data;

    if (Object.keys(state.params).length > 0) {
      let itemId = state.params.id;
      let itemDb = state.params.db;

      if (itemId && itemDb) {
        return feathersClient.service(itemDb).get(itemId)
      } else if (itemDb) {
        return res.data[0]
      }
    } else {
      return res.data[0];
    }
  }).then(res => {
    console.log("1")
    state.edit.selected = res
    let query = {
      query: {
        "submittedBy": state.user.id
      }
    }
    return feathersClient.service("sections").find(query)
  }).then(res => {
    console.log("2")
    state.edit.sections = res.data;
    let query = {
      query: {
        "submittedBy": state.user.id
      }
    }
    return feathersClient.service("resources").find(query)
  }).then(res => {
    console.log("3")
    state.edit.resources = res.data;
    emitter.emit(state.events.RENDER);
  }).catch(err => {
    return err;
  });


  emitter.on('DOMContentLoaded', function () {

    /*********
     * FILTER MENU  
     **********/
    emitter.on("edit:filter", function () {
      let itemDb = state.params.db;

      feathersClient.service(itemDb).find({
        query: {
          "submittedBy": state.user.id
        }
      }).then(res => {
        state.edit[itemDb] = res.data;
        emitter.emit(state.events.RENDER)
      });
    })

    // SELECT THE PLAYLIST, SECTION, OR RESOURCE
    emitter.on("edit:select", function () {
      let itemId = state.params.id;
      let itemDb = state.params.db;
      console.log(itemId, itemDb)
      feathersClient.service(itemDb).get(itemId).then(res => {
        state.edit.selected = res;
        emitter.emit(state.events.RENDER);
      })
    });

    // SELECT AND EDIT THIS FEATURE USING QUERY PARAMS
    emitter.on("edit:selectAndEdit", function(_id, _db){
      console.log("SELECT AND EDIT", _id, _db);
      feathersClient.service(_db).get(_id).then(res => {
        state.edit.selected = res;
        emitter.emit(state.events.RENDER);
      })
      
    })


    // REFRESH ALL THE DATA
    emitter.on("edit:refresh", function(){
      let query = {
        query: {
          "submittedBy": state.user.id
        }
      }

      feathersClient.service("playlists").find(query).then(res=>{
        console.log(state.edit.playlists.length)
        console.log(res.data.length)
        console.log(1)
        state.edit.playlists = res.data;
        return feathersClient.service("sections").find(query);
      }).then(res =>{
        console.log(2)
        state.edit.sections = res.data;
        return feathersClient.service("resources").find(query);
      }).then(res =>{
        console.log(3)
        state.edit.resources = res.data;
        
        if (Object.keys(state.params).length > 0) {
          let itemId = state.params.id;
          let itemDb = state.params.db;
    
          if (itemId && itemDb) {
            return feathersClient.service(itemDb).get(itemId)
          } else if (itemDb) {
            return state.edit[itemDb][state.edit[itemDb].length - 1 ]
          }
        } else {
          return state.edit[itemDb][state.edit[itemDb].length - 1];
        }
      }).then(res =>{
        console.log(res);
        state.edit.selected = res;
        emitter.emit(state.events.RENDER);
      })
      .catch(err =>{
        return err;
      })

    })


    // ADD PLAYLIST TO USER 
    emitter.on("edit:addPlaylist", function () {
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
            state.edit.selected = _newData.data;

            emitter.emit("edit:refresh");
            // emitter.emit(state.events.RENDER); // NEED TO UPDATE ALL THE PLAYLISTS, SECTIONS, & RESOURCES
          })
          .catch(function (error) {
            console.log(error);
          });
      }).catch(err => {
        return err;
      })
    });

    // ADD SECTION TO PLAYLIST 


    /**
     * DELETE
     */
    // DELETE SELECTED
    // TODO: if higher level is deleted, jump back to root 
    emitter.on("edit:deleteSelectedFeature", function(_id, _db){
      console.log("~~~~~~~~", state.params)
        if(state.params.db == _db){   
          console.log("IS THIS FIRING???")  
          emitter.emit("pushState", `/edit/${_db}`)
        }

      feathersClient.service(_db).remove(_id).then( deleteResponse => {
        state.edit.selected = {};

        emitter.emit("edit:refresh");
      }).catch(err => {
        return err;
      })
  })


  });
}