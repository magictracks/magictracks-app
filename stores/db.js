// // Connect to the `http://feathers-api.com/messages` service
const {
  feathersClient
} = require('../components/api');
const axios = require('axios');

module.exports = store


function store(state, emitter, app) {
  // const playlists = new Playlists();

  state.community = {
    db:{
      playlists: {
        currentPage:"",
        selected: {},
        all: []
      },
      sections: {
        currentPage:"",
        selected: {},
        all: []
      },
      resources: {
        currentPage:"",
        selected: {},
        all: []
      }
    }
  }

  state.user.db = {
    editing: "playlists", // set initial state to playlists
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
  };

  state.selected = {
    id:"",
    db:""
  };

  state.playlists = {
    selected:{},
    all:[]  
  }
  
  

  // state.addModal = {
  //   toggled: false,
  //   currentStep: 0,
  //   selectedPlaylist: {},
  //   selectedSection: {},
  //   submittedResource: {}
  // }

  
  function initialize(){
    feathersClient.authenticate().then( (authResponse) => {
      console.log("brilliant! you're auth'd!")
        state.user.username = authResponse.username;
        state.user.id = authResponse.id;
        state.user.authenticated = true;
        emitter.emit("pushState", "app");
        return authResponse;
    }).then( (authResponse) => {
      let query = { query: { "submittedBy": state.user.id }}
      return feathersClient.service("playlists").find(query)
    }).then(selectedPlaylists => {

      state.user.db.playlists.all = selectedPlaylists;

      if(isEmpty(state.user.db.playlists.selected) == true){
        state.user.db.playlists.selected = selectedPlaylists[selectedPlaylists.length - 1];
        state.user.db.editing = state.user.db.playlists.selected.featureType
      } else { 
        state.user.db.playlists.selected = selectedPlaylists.filter( item => item._id == state.user.db.playlists.selected._id)[0];
        state.user.db.editing = state.user.db.playlists.selected.featureType
      }
      emitter.emit(state.events.RENDER);
    })
    .catch( err => {
      return err;
    });
  }
  initialize();


  emitter.on('DOMContentLoaded', function () {

    /** 
     * When a feature is clicked > query the respective collection by id >
     * user.db.editing == "playlists", "sections", or "resources"
     */
    emitter.on('db:feature:select', function (_id, _db) {
      feathersClient.service(_db).get(_id).then(data => {
          state.user.db[_db].selected = data;
          state.user.db.editing = _db;
          emitter.emit(state.events.RENDER)
        }).catch(err => {
          return err;
        });
    });

    // delete a feature from the DB
    emitter.on('db:feature:delete', function () {
      feathersClient.authenticate()
        .then((response) => {

          feathersClient.service(state.user.db.editing).remove(state.user.db[state.user.db.editing].selected._id)
            .then((deleteResponse) => {
              // emitter.emit(state.events.RENDER);
              // if it is a playlist, set the selected to the next available playlist
              if(state.user.db.editing == "playlists"){
                let idx = state.user.db.playlists.all.findIndex( i => i._id == state.user.db.playlists.selected._id)
                if(idx == 0){
                  state.user.db.playlists.selected = state.user.db.playlists.all[idx + 1]
                } else {
                  state.user.db.playlists.selected = state.user.db.playlists.all[idx - 1]
                }
              }
              
              emitter.emit("db:playlists:find", {"query":{ "submittedBy": state.user.id }})
            }).catch(innerErr => {
              return innerErr
            })
        }).catch(outerErr => {
          return outerErr;
        })
    })

    emitter.on('db:feature:patch', function ( _formData) {

      let _id = state.user.db[state.user.db.editing].selected._id;
      let _db = state.user.db.editing;
      let input = {
        "title": _formData.get("title"),
        "description": _formData.get("description")
        // "$set": {
        //   "tags": string2array(_formData.get("tags")) ,
        //   "collaborators": string2array(_formData.get("tags"))
        // }
      }

      console.log(input, "-------",_id, "-------", _db);

      feathersClient.service(_db).patch(_id,input,{}).then(data => {
          state.user.db[_db].selected = data;
          state.user.db.editing = _db;
          // emitter.emit(state.events.RENDER)
          emitter.emit("db:playlists:find", {"query":{ "submittedBy": state.user.id }} )
        }).catch(err => {
          return err;
        });
    });

   
    /** ******** 
     * PLAYLISTS
     **********************/
    emitter.on("db:playlists:find", function(_query){
      feathersClient.service("playlists").find(_query).then( (selectedPlaylists) => {
        state.user.db['playlists'].all = selectedPlaylists;

        if(isEmpty(state.user.db.playlists.selected) == true){
          state.user.db.playlists.selected = selectedPlaylists[selectedPlaylists.length - 1];
          state.user.db.editing = state.user.db.playlists.selected.featureType
        } else { 
          state.user.db.playlists.selected = selectedPlaylists.filter( item => item._id == state.user.db.playlists.selected._id)[0];
          // state.user.db.editing = state.user.db.playlists.selected.featureType
        }

        emitter.emit(state.events.RENDER);
      }).catch(err => {
        console.log(err);
        state.user.db.playlists.all = [];
        emitter.emit(state.events.RENDER);
      })
    })


    emitter.on("db:playlists:addJSON", function () {
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
            state.user.db['playlists'].selected = _newData.data;
            state.user.db.editing = _newData.data.featureType;
            emitter.emit("db:playlists:find", {"query":{ "submittedBy": state.user.id }} )
          })
          .catch(function (error) {
            console.log(error);
          });
      }).catch(err => {
        return err;
      })
    })


    emitter.on("db:sections:reorder", function(_id, _newIndex){
      let p = state.user.db.playlists.selected;
      p.sections.push(p.sections.splice(p.sections.findIndex(v => v._id == _id), _newIndex)[0])
      emitter.emit(state.events.RENDER)

    })


    // emitter.on('db:AddModal:toggle', function () {
    //   state.addModal.toggled = !state.addModal.toggled;
    //   console.log(state.addModal.toggled);
    //   emitter.emit(state.events.RENDER);
    // })
    // emitter.on('db:AddModal:currentStep', function (_currentStep) {
    //   state.addModal.currentStep = _currentStep;
    //   emitter.emit(state.events.RENDER);
    // })
    // emitter.on('db:AddModal:selectedPlaylist', function (_id) {
    //   state.addModal.selectedPlaylist = state.playlists.all.filter(playlist => playlist._id == _id)[0];
    //   emitter.emit(state.events.RENDER);
    // })
    // emitter.on('db:AddModal:selectedSection', function (_id) {
    //   state.addModal.selectedSection = state.addModal.selectedPlaylist.sections.filter(section => section._id == _id)[0];
    //   emitter.emit(state.events.RENDER);
    // })

    // // send the data to resources
    // emitter.on("db:resources:create", function (resourceData) {
    //   feathersClient.authenticate().then(response => {
    //     feathersClient.service('resources').create(resourceData).then(data => {
    //       console.log("Resource subcessfully submitted");
    //       console.log(data);
    //       state.addModal.submittedResource = data;
    //       emitter.emit(state.events.RENDER);
    //     }).catch(err => {
    //       return err;
    //     })
    //   }).catch(err => {
    //     return err;
    //   })
    // })

    // emitter.on("db:resources:patch", function (_id, resourceData) {
    //   feathersClient.authenticate().then(response => {
    //     feathersClient.service('resources').patch(_id, resourceData).then(data => {
    //       console.log("Resource subcessfully submitted");
    //       console.log(data);
    //       state.addModal.submittedResource = data;
    //       emitter.emit(state.events.RENDER);
    //     }).catch(err => {
    //       return err;
    //     })
    //   }).catch(err => {
    //     return err;
    //   })
    // })

    // emitter.on("db:sections:patch", function (_id, _data) {
    //   feathersClient.authenticate().then(response => {
    //     feathersClient.service('sections').patch(_id, _data).then(data => {
    //       console.log("Resource subcessfully submitted");
    //       console.log(data);
    //       state.addModal.selectedSection = data;
    //       emitter.emit(state.events.RENDER);
    //     }).catch(err => {
    //       return err;
    //     })
    //   }).catch(err => {
    //     return err;
    //   })
    // })

    // emitter.on('db:playlists:addNewSection', function (_id, _data) {
    //   feathersClient.authenticate().then(authResponse => {

    //     feathersClient.service('sections').create(_data).then((sectionResponse) => {

    //       let patchData = {
    //         "$push": {
    //           "sections": sectionResponse._id
    //         }
    //       }

    //       feathersClient.service('playlists').patch(_id, patchData).then((playlistResponse) => {
    //         // console.log(playlistResponse);
    //         console.log(_id, sectionResponse, playlistResponse)
    //         state.addModal.selectedPlaylist = playlistResponse;
    //         state.playlists.selected = state.addModal.selectedPlaylist;
    //         state.addModal.selectedSection = sectionResponse;
    //         console.log("update dropdown!!!")
    //         // emitter.emit("db:playlists:find");
    //         emitter.emit(state.events.RENDER);
    //       }).catch(err => {
    //         return err;
    //       })
    //     });
    //   }).catch(err => {
    //     return err;
    //   })
    // })


    // emitter.on("db:playlists:add", function () {
    //   feathersClient.authenticate().then(response => {
    //     let newPlaylist = {
    //       "title": "New Playlist! Edit me!",
    //       "description": "New Playlist description! Edit me!",
    //       "sections": [{
    //         "title": "Unsorted",
    //         "description": "a section for all your unsorted links",
    //         "resources": [{
    //           "title": "empty resource container"
    //         }]
    //       }]
    //     }
    //     console.log("trying to post to playlists")

    //     console.log(response)
    //     axios.post('https://localhost:3030/playlists/addJSON', newPlaylist, {
    //         "headers": {
    //           'Authorization': "bearer " + response.accessToken
    //         },
    //         'Content-Type': 'application/json'
    //       })
    //       .then(function (data) {
    //         console.log(data);

    //         emitter.emit("db:playlists:find")
    //         // emitter.emit(state.events.RENDER);
    //       })
    //       .catch(function (error) {
    //         console.log(error);
    //       });

    //   }).catch(err => {
    //     return err;
    //   })
    // })



    // emitter.on('db:playlists:find', function (_id) {
    //   feathersClient.service("playlists").find({
    //       query: {
    //         submittedBy: state.user.id
    //       }
    //     })
    //     .then((data) => {
    //       if (Object.keys(state.playlists.selected).length > 0) {
    //         state.playlists.selected = data.filter(playlist => playlist._id == state.playlists.selected._id)[0];
    //       } else {
    //         state.playlists.selected = data[data.length - 1];
    //       }
    //       state.playlists.all = data;
    //       emitter.emit(state.events.RENDER);
    //     }).catch(err => {
    //       console.log(err);
    //       state.playlists = [];
    //       emitter.emit(state.events.RENDER);
    //     })
    // })

    // emitter.on('db:delete', function () {
    //   feathersClient.authenticate()
    //     .then((response) => {
    //       console.log(state.selectedItemDb)
    //       console.log(state.selectedItem._id)
    //       feathersClient.service(state.selectedItemDb).remove(state.selectedItem._id)
    //         .then((deleteResponse) => {
    //           console.log(deleteResponse);
    //           // emitter.emit(state.events.RENDER);
    //           emitter.emit("db:playlists:find")
    //         }).catch(innerErr => {
    //           return innerErr
    //         })
    //     }).catch(outerErr => {
    //       return outerErr;
    //     })
    // })

    // emitter.on('db:patch', function (_id, _formData) {
    //   // state.playlists.selected = state.playlists.all.filter(playlist => playlist._id == _id)[0];

    //   let formData = {
    //     title: _formData.get("title"),
    //     description: _formData.get("description"),
    //     url: _formData.get("url")
    //   }

    //   // TODO -- refactor: https://github.com/choojs/choo/issues/645

    //   feathersClient.authenticate().then((response) => {

    //     feathersClient.service(state.selectedItemDb).patch(_id, formData, {})
    //       .then(data => {
    //         state.selectedItem = data;

    //         // emitter.emit(state.events.RENDER)
    //         emitter.emit("db:playlists:find");
    //       }).catch(err => {
    //         console.log(err);
    //         return err;
    //       })
    //   }).catch(err => {
    //     console.log(err);
    //     return err;
    //   })
    //   console.log(emitter);
    //   // emitter.emit(state.events.RENDER)
    // })

  }) // end DOMCONTENTLOADED

} // end state


// HELPER FUNCTIONS
function isEmpty(_obj){
  return Object.keys(_obj).length > 0 ? false:true;
}
function string2array(_str){
  return _str.split(',')
}




// feathersClient.authenticate().then((response) => {
      
  //   }).then(() => {
  //     // then get the playlists 
  //     feathersClient.service("playlists").find({
  //         query: {
  //           submittedBy: state.user.id
  //         }
  //       })
  //       .then((data) => {
  //         state.playlists.selected = data[data.length - 1];
  //         state.selectedItem = data[data.length - 1];
  //         state.playlists.all = data;
  //         emitter.emit(state.events.RENDER);
  //       }).catch(err => {
  //         console.log(err);
  //         state.playlists = [];
  //         emitter.emit(state.events.RENDER);
  //       })
  //   })
  //   .catch(err => {
  //     console.log("not auth'd friend!")
  //     state.user.authenticated = false;
  //     emitter.emit(state.events.RENDER);
  //   });

  // check auth status
  // feathersClient.authenticate().then((response) => {
  //     console.log("brilliant! you're auth'd!")
  //     state.user.username = response.username;
  //     state.user.id = response.id;
  //     emitter.emit("pushState", "app");
  //     state.user.authenticated = true;
  //   }).then(() => {
  //     // then get the playlists 
  //     feathersClient.service("playlists").find({
  //         query: {
  //           submittedBy: state.user.id
  //         }
  //       })
  //       .then((data) => {
  //         state.playlists.selected = data[data.length - 1];
  //         state.selectedItem = data[data.length - 1];
  //         state.playlists.all = data;
  //         emitter.emit(state.events.RENDER);
  //       }).catch(err => {
  //         console.log(err);
  //         state.playlists = [];
  //         emitter.emit(state.events.RENDER);
  //       })
  //   })
  //   .catch(err => {
  //     console.log("not auth'd friend!")
  //     state.user.authenticated = false;
  //     emitter.emit(state.events.RENDER);
  //   });


    /**
   * PLAYLISTS
   */
  
  // function Playlists(){
  //   // GET
  //   this.get = function(_id){
  //     return feathersClient.service("playlists").get(_id);
  //   };
  //   // FIND
  //   this.find = function(_query){
  //     return feathersClient.service("playlists").find(_query);
  //   };
  //   // PATCH
  //   this.patch = function(_id, _data, _params){
      
  //   };
  //   // CREATE
  //   this.create = function(_data){
  //     feathersClient.authenticate().then((authResponse) => {
  //       if(_data){
  //         feathersClient.service("playlists").create(_data).then( (_newPlaylist) => {
  //           return _newPlaylist;
  //         }).catch(err => {
  //           return err;
  //         });
  //       } else {
  //         let placeholder = {"title": "new playlist", "description": "edit me!"}
  //         feathersClient.service("playlists").create(placeholder).then( (_newPlaylist) => {
  //           return _newPlaylist;
  //         }).catch(err => {
  //           return err;
  //         });
  //       }
  //     }).catch( (err) =>{
  //       return err;
  //     });
  //   };
  //   // DELETE
  //   this.delete = function(){

  //   };
  // }
  
  // // playlists.get("5beed37d63dbd913341f2996")

  // /**
  //  * SECTIONS
  //  */
  // function Sections(){
  //   // GET
  //   this.get = function(){

  //   };
  //   // FIND
  //   this.find = function(){

  //   };
  //   // PATCH
  //   this.patch = function(){

  //   };
  //   // CREATE
  //   this.create = function(){

  //   };
  //   // DELETE
  //   this.delete = function(){

  //   };
  // }

  // /**
  //  * RESOURCES
  //  */
  // function Resources(){
  //   // GET
  //   this.get = function(){

  //   };
  //   // FIND
  //   this.find = function(){

  //   };
  //   // PATCH
  //   this.patch = function(){

  //   };
  //   // CREATE
  //   this.create = function(){

  //   };
  //   // DELETE
  //   this.delete = function(){

  //   };
  // }
 