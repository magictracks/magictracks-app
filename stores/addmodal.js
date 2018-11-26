const {
  feathersClient
} = require('../components/api');

module.exports = store

store.storeName = 'addmodal'
function store (state, emitter) {

   state.addModal = {
      toggled: false,
      currentStep: 0,
      submittedResource:{},
      selectedPlaylist:{},
      selectedSection:{}
    }


  emitter.on('DOMContentLoaded', function () {
    
    emitter.on("addModal:toggle", function(){
      state.addModal.toggled = !state.addModal.toggled;
      emitter.emit(state.events.RENDER);
    });

    emitter.on('addModal:currentStep', function (_currentStep) {
        state.addModal.currentStep = _currentStep;
        emitter.emit(state.events.RENDER);
    });

    emitter.on('addModal:createResource', function(_url){
      feathersClient.service("resources").create(_url).then(res => {
        console.log(res);
        state.addModal.submittedResource = res;
        emitter.emit(state.events.RENDER);
      })
    });

    emitter.on('addModal:editResource', function(_formData){
      let id =  state.addModal.submittedResource._id;

      feathersClient.service("resources").patch(id, _formData).then(res => {
        console.log(res);
        state.addModal.submittedResource = res;
        emitter.emit(state.events.RENDER);
      })
    });

     emitter.on('addModal:selectedPlaylist', function (_id) {
      state.addModal.selectedPlaylist = state.user.playlists.all.filter(playlist => playlist._id == _id)[0];
      emitter.emit(state.events.RENDER);
    });

    emitter.on('addModal:selectedSection', function (_id) {
      state.addModal.selectedSection = state.addModal.selectedPlaylist.sections.filter(section => section._id == _id)[0];
      emitter.emit(state.events.RENDER);
    });
    
    emitter.on('addModal:addSectionToPlaylist', function(_playlistId, _data){

      feathersClient.service("sections").create(_data).then(_newSection => {
        
        let sectionId = _newSection._id;
        let patchData = {
          "$push": {sections: sectionId}
        };

        return feathersClient.service("playlists").patch(_playlistId, patchData)
      }).then(_newPlaylist => {
        emitter.emit("user:playlists:refresh");
      }).catch(err => {
        return err;
      })
    })

    emitter.on('addModal:submitOrganize', function(_sectionId, _data){
      feathersClient.service("sections").patch(_sectionId, _data).then(res => {
        emitter.emit("user:playlists:refresh");
      }).catch(err => {
        return err;
      })

    })


  })
}



      
  // emitter.on('db:AddModal:selectedPlaylist', function (_id) {
  //   state.addModal.selectedPlaylist = state.playlists.all.filter(playlist => playlist._id == _id)[0];
  //   emitter.emit(state.events.RENDER);
  // })

  // emitter.on('db:AddModal:selectedSection', function (_id) {
  //   state.addModal.selectedSection = state.addModal.selectedPlaylist.sections.filter(section => section._id == _id)[0];
  //   emitter.emit(state.events.RENDER);
  // })