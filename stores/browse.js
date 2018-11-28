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
    selected:{}
  }


  feathersClient.service("playlists").find({}).then(res => {
    state.community.playlists = res;
    if(Object.keys(state.params).length > 0 ){
      let itemId = state.params.id;
      let itemDb = state.params.db;
      return feathersClient.service(itemDb).get(itemId);  
    } else{
      return res[0];
    }
    
  }).then( res => {
    state.community.selected = res
    emitter.emit(state.events.RENDER);
  }).catch(err => {
    return err;
  })


  emitter.on('DOMContentLoaded', function () {

    emitter.on("browse:filter", function(){
      let itemDb = state.params.db;
      
      console.log("stores:browse ", itemDb);

      feathersClient.service( itemDb ).find({}).then(res => {
        console.log(res);
        state.community[itemDb] = res;
        
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