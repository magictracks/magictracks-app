// // Connect to the `http://feathers-api.com/messages` service
const api = require('../components/api').api;
const resources = api.service('resources');


resources.find({}).then((data) => {
  console.log(data);
})

module.exports = store

function store (state, emitter,app) {
  // state.totalClicks = 0
  

  emitter.on('DOMContentLoaded', function () {
    emitter.on('db:test', function (count) {
      // state.totalClicks += count

      emitter.emit(state.events.RENDER)
    })
  })
}
