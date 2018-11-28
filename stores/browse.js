const {
  feathersClient
} = require('../components/api');

module.exports = store

store.storeName = 'browse'
function store (state, emitter) {
  
  // The single source of Truth!
  state.community = {
    playlists:[]
  }


  feathersClient.service("playlists").find({}).then(res => {
    state.community.playlists = res;
  })


  emitter.on('DOMContentLoaded', function () {
  })
}