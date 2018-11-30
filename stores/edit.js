const {
  feathersClient
} = require('../components/api');

module.exports = store

store.storeName = 'edit'
function store (state, emitter) {

  state.edit = {
    playlists:[],
    sections:[],
    resources:[],
    selected:{}
  }


    // .then(selectedPlaylists => {
    //   state.user.playlists.all = selectedPlaylists.data;

    //   // set the selected playlist
    //   if(isEmpty(state.user.playlists.selected) === true){
    //     state.user.playlists.selected =  state.user.playlists.all[ state.user.playlists.all.length - 1];
    //   }

    //   emitter.emit(state.events.RENDER);
    // })
 

  // Set Initial State
  feathersClient.authenticate().then( (authResponse) => {
    console.log("brilliant! you're auth'd!")
      state.user.username = authResponse.username;
      state.user.id = authResponse.id;
      state.user.authenticated = true;
      // emitter.emit("pushState", "app");
      return authResponse;
  }).then( (authResponse) => {
    // GET the playlists owned by the user
    let query = { query: { "submittedBy": state.user.id }}
    return feathersClient.service("playlists").find(query)
  }).then(res => {
    state.edit.playlists = res.data;
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
    state.edit.selected = res.data
    let query = { query: { "submittedBy": state.user.id }}
    return feathersClient.service("sections").find({})
  }).then(res => {
    console.log("2")
    state.edit.sections = res.data;
    let query = { query: { "submittedBy": state.user.id }}
    return feathersClient.service("resources").find({})
  }).then(res => {
    console.log("3")
    state.edit.resources = res.data;
    emitter.emit(state.events.RENDER);
  }).catch(err => {
    return err;
  });

  
  emitter.on('DOMContentLoaded', function () {

    emitter.on("edit:filter", function(){
      let itemDb = state.params.db;

      feathersClient.service( itemDb ).find({query: {"submittedBy":state.user.id}}).then(res => {
        state.edit[itemDb] = res.data;
        emitter.emit(state.events.RENDER)
      });
    })  

    emitter.on("edit:select", function(){
      let itemId = state.params.id;
      let itemDb = state.params.db;
      console.log(itemId, itemDb)
      feathersClient.service(itemDb).get(itemId).then(res => {
        state.edit.selected = res;
        emitter.emit(state.events.RENDER);
      })
    });

  })
}