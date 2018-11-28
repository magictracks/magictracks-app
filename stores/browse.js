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

    emitter.on("browse:select", function(){
      let itemId = state.params.id;
      let itemDb = state.params.db;
      feathersClient.service(itemDb).get(itemId).then(res => {
        state.community.selected = res;
        emitter.emit(state.events.RENDER);
      })
    });


  })
}