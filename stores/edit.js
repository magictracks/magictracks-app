const {
  feathersClient
} = require('../components/api');
const axios = require('axios');
var FileSaver = require('file-saver');

module.exports = store

store.storeName = 'edit'

function store(state, emitter) {

  state.edit = {
    playlists: [],
    sections: [],
    resources: [],
    tags:[],
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
    return feathersClient.service("tags").find({})
  }).then(res =>{
    state.edit.tags = res.data;
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
    emitter.on("edit:selectAndEdit", function (_id, _db) {
      console.log("SELECT AND EDIT", _id, _db);
      console.log(state.params, state.query)
      feathersClient.service(_db).get(_id).then(res => {
        state.edit.selected = res;
        emitter.emit(state.events.RENDER);
      })

    })


    // REFRESH ALL THE DATA
    emitter.on("edit:refresh", function () {
      let query = {
        query: {
          "submittedBy": state.user.id
        }
      }

      feathersClient.service("playlists").find(query).then(res => {
          console.log(1)
          state.edit.playlists = res.data;
          return feathersClient.service("sections").find(query);
        }).then(res => {
          console.log(2)
          state.edit.sections = res.data;
          return feathersClient.service("resources").find(query);
        }).then(res => {
          console.log(3)
          state.edit.resources = res.data;

          if (Object.keys(state.params).length > 0) {
            let itemId = state.params.id;
            let itemDb = state.params.db;

            if (itemId && itemDb) {
              return feathersClient.service(itemDb).get(itemId)
            } else if (itemDb) {
              return state.edit[itemDb][state.edit[itemDb].length - 1]
            }
          } else {
            return state.edit[itemDb][state.edit[itemDb].length - 1];
          }
        }).then(res => {
          if(isEmpty(state.edit.selected) ){
            state.edit.selected = res;
          }
          
          emitter.emit(state.events.RENDER);
        })
        .catch(err => {
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
     * UPDATE
     */

    emitter.on("edit:updateSelectedFeature", function (_id, _db, _formData) {
      // TODO: add in handling array features
      let submittedChanges = {
        title: _formData.get("title"),
        description: _formData.get("description"),
        url: _formData.get("url")
      }

      feathersClient.service(_db).patch(_id, submittedChanges, {}).then(feature => {
        state.edit.selected = feature;
        emitter.emit("edit:refresh");
      }).catch(err => {
        return err;
      })
    })

    emitter.on("edit:selectedFeature:reorder", function(_parentid, _parentdb, _featureid, _newIndex){

      console.log("~~~~~~~~~~~~",_parentid, _parentdb, _featureid, _newIndex)
      feathersClient.service(_parentdb).get(_parentid).then( response => {
        let list = [];
        let updateCmd = {"$set":{}};
        
        if(response.featureType == "playlists"){
          list = response.sections.map( section => String(section._id) );
          let currentPos = list.findIndex(val => val == String(_featureid));
          
          moveVal(list, currentPos, _newIndex );          
          updateCmd['$set'] = {"sections": list};
        } 
        else if(response.featureType == "sections"){

          list = response.resources.map( resource => String(resource._id) );
          let currentPos = list.findIndex(val => val == String(_featureid));
          
          moveVal(list, currentPos, _newIndex ); 

          updateCmd['$set'] = {"resources": list};
        }
        
        return feathersClient.service(_parentdb).patch(_parentid, updateCmd, {})
      }).then(response => {
        console.log("~~~~~~~~~~~~~~",response)
        state.edit.selected = response;
        emitter.emit("edit:refresh")
      })
      .catch(err => {
        return err;
      })

    })

    // PLAYLIST- ADD SECTION
    emitter.on("edit:playlists:addSection", function(_id, _db){
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
        state.edit.selected= _newPlaylist;
        emitter.emit("edit:refresh");
      })
      .catch(err => {
        return err;
      })
    });

    // PLAYLIST- ADD RESOURCE
    emitter.on("edit:sections:addResource", function(_id, _db){
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
      }).then(_newSection => {
        // update the playlists with the new stuff
        state.edit.selected = _newSection;
        emitter.emit("edit:refresh");
      })
      .catch(err => {
        return err;
      })
    });

    /**
     * DELETE
     */
    // DELETE SELECTED
    // TODO: if higher level is deleted, jump back to root 
    emitter.on("edit:deleteSelectedFeature", function (_id, _db) {
      if (state.params.db == _db) {
        emitter.emit("pushState", `/edit/${_db}`)
      }
      feathersClient.service(_db).remove(_id).then(deleteResponse => {
        state.edit.selected = {};

        emitter.emit("edit:refresh");
      }).catch(err => {
        return err;
      })
    });


    emitter.on("edit:download", function () {
      let _db = state.params.db;
      let _id = state.params.id;
      console.log(FileSaver)
      feathersClient.service(_db).get(_id).then(res => {
        var blob = new Blob([JSON.stringify(res) ], {type: "text/plain;charset=utf-8"});
        console.log(blob)
        FileSaver.saveAs(blob, `${_db}_${_id}.json`);
      }).catch(err => {
        return err;
      })
    });







  });
}


// HELPER FUNCTIONS
function isEmpty(_obj){
  return Object.keys(_obj).length > 0 ? false:true;
}
function string2array(_str){
  return _str.split(',')
}
function moveVal(arr, from, to) {
  arr.splice(to, 0, arr.splice(from, 1)[0]);
};
