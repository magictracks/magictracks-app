const {
  feathersClient
} = require('../components/api');

module.exports = store

store.storeName = 'browse'
function store (state, emitter) {
  
  // The single source of Truth!
  state.browse = {
    playlists:[],
    sections:[],
    resources:[],
    users:[],
    selected:{}
  }


  // feathersClient.service("playlists").find({}).then(res => {
  //   state.browse.playlists = res.data;
  //   if(Object.keys(state.params).length > 0 ){
  //     let itemId = state.params.id;
  //     let itemDb = state.params.db;
  //     if(itemId){
  //       return feathersClient.service(itemDb).get(itemId)
  //     } 
  //   } else {
  //     return res;
  //   }
  // }).then( res => {
  //   console.log("1")
  //   state.browse.selected = res.data
  //   return feathersClient.service("sections").find({})
  // }).then(res => {
  //   console.log("2")
  //   state.browse.sections = res.data;
  //   return feathersClient.service("resources").find({})
  // }).then(res => {
  //   console.log("3")
  //   state.browse.resources = res.data;
  //   return feathersClient.service("users").find({})
  // }).then(res => {
  //   console.log("4")
  //   state.browse.users = res.data;
  //   emitter.emit(state.events.RENDER);
  // }).catch(err => {
  //   return err;
  // });

  // Set Initial State
  feathersClient.service("playlists").find({}).then(res => {
    state.browse.playlists = res.data;

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
    state.browse.selected = res
  
    return feathersClient.service("sections").find({})
  }).then(res => {
    console.log("2")
    state.browse.sections = res.data;
    
    return feathersClient.service("resources").find({})
  }).then(res => {
    console.log("3")
    state.browse.resources = res.data;
    return feathersClient.service("tags").find({})
  }).then(res => {
    console.log("4")
    state.browse.tags = res.data;
    return feathersClient.service("users").find({})
  }).then(res =>{
    state.browse.users = res.data;
    emitter.emit(state.events.RENDER);
  }).catch(err => {
    return err;
  });

  

  emitter.on('DOMContentLoaded', function () {

    emitter.on("browse:filter", function(){
      let itemDb = state.params.db;

      feathersClient.service( itemDb ).find({}).then(res => {
        state.browse[itemDb] = res.data;
        console.log(res.data[0])
        // emitter.emit("pushState", `browse/${itemDb}`)
        emitter.emit(state.events.RENDER)
      });
    })  

    emitter.on("browse:select", function(){
      let itemId = state.params.id;
      let itemDb = state.params.db;
      console.log(itemId, itemDb)
      feathersClient.service(itemDb).get(itemId).then(res => {
        state.browse.selected = res;
        emitter.emit(state.events.RENDER);
      })
    });

    // REFRESH ALL THE DATA
    emitter.on("browse:refresh", function () {

      feathersClient.service("playlists").find({}).then(res => {
          console.log(1)
          state.browse.playlists = res.data;
          return feathersClient.service("sections").find({});
        }).then(res => {
          console.log(2)
          state.browse.sections = res.data;
          return feathersClient.service("resources").find({});
        }).then(res => {
          console.log(3)
          state.browse.resources = res.data;

          if (Object.keys(state.params).length > 0) {
            let itemId = state.params.id;
            let itemDb = state.params.db;

            if (itemId && itemDb) {
              return feathersClient.service(itemDb).get(itemId)
            } else if (itemDb) {
              return state.browse[itemDb][state.browse[itemDb].length - 1]
            }
          } else {
            return state.browse[itemDb][state.browse[itemDb].length - 1];
          }
        }).then(res => {
          if(isEmpty(state.browse.selected) ){
            state.browse.selected = res;
          }
          
          emitter.emit(state.events.RENDER);
        })
        .catch(err => {
          return err;
        })

    });


  })
}