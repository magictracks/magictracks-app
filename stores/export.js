module.exports = store

store.storeName = 'export'
function store (state, emitter) {
  emitter.on('DOMContentLoaded', function () {
  })
}