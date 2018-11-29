module.exports = store

store.storeName = 'export'
function store (state, emitter) {

  state.export = {
    selected:{}
  }

  
  emitter.on('DOMContentLoaded', function () {
  })
}