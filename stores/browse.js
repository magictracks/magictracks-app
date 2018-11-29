const {
  feathersClient
} = require('../components/api');

module.exports = store

store.storeName = 'browse'
function store (state, emitter) {
  
  // The single source of Truth!
  state.community = {
    playlists:[],
    sections:[],
    resources:[],
    users:[],
    selected:{}
  }


  feathersClient.service("playlists").find({}).then(res => {
    state.community.playlists = res.data;
    if(Object.keys(state.params).length > 0 ){
      let itemId = state.params.id;
      let itemDb = state.params.db;
      if(itemId){
        return feathersClient.service(itemDb).get(itemId)
      } 
    } else {
      return res;
    }
  }).then( res => {
    console.log("1")
    state.community.selected = res.data
    return feathersClient.service("sections").find({})
  }).then(res => {
    console.log("2")
    state.community.sections = res.data;
    return feathersClient.service("resources").find({})
  }).then(res => {
    console.log("3")
    state.community.resources = res.data;
    return feathersClient.service("users").find({})
  }).then(res => {
    console.log("4")
    state.community.users = res.data;
    emitter.emit(state.events.RENDER);
  }).catch(err => {
    return err;
  });

  

  emitter.on('DOMContentLoaded', function () {

    emitter.on("browse:filter", function(){
      let itemDb = state.params.db;

      feathersClient.service( itemDb ).find({}).then(res => {
        state.community[itemDb] = res.data;
        // emitter.emit("pushState", `browse/${itemDb}`)
        emitter.emit(state.events.RENDER)
      });
    })  

    emitter.on("browse:select", function(){
      let itemId = state.params.id;
      let itemDb = state.params.db;
      console.log(itemId, itemDb)
      feathersClient.service(itemDb).get(itemId).then(res => {
        state.community.selected = res;
        emitter.emit(state.events.RENDER);
      })
    });


  })
}