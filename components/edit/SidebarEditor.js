const html = require('choo/html');
const css = require('sheetify');
const SidebarHeader = require('../../components/SidebarHeader');
const SidebarSortableList = require('./SidebarSortableList');
const SidebarTagsInput = require('./SidebarTagsInput');
const SidebarCollaboratorInput = require('./SidebarCollaboratorInput');

module.exports = function(id, state, emit) {

    let selected = state.edit.selected;

    function submitInputEditor(e) {
        e.preventDefault();
        let form = document.querySelector("#inputEditor");
        let formData = new FormData(form);
        let id = state.edit.selected._id;
        let db = state.edit.selected.featureType;
        emit("edit:updateSelectedFeature", id, db, formData);
    }

    function deleteSelected(e) {
        let id = state.edit.selected._id;
        let db = state.edit.selected.featureType;
        emit("edit:deleteSelectedFeature", id, db);
    }

    function showAddOptions(selected, state, emit) {
        function addResourceToSection(e) {
            emit("edit:sections:addResource", selected._id, selected.featureType)
        }

        function addSectionToPlaylist(e) {
            emit("edit:playlists:addSection", selected._id, selected.featureType)
        }

        if (selected.featureType == "playlists") {
            console.log("this is a playlist")
            return html `
          <button class="ba bw0 f7" onclick=${addSectionToPlaylist}>⊕ Add Section to Playlist</button>
        `
        } else if (selected.featureType == "sections") {
            console.log("this is a section")
            return html `
          <button class="ba bw0 f7" onclick=${addResourceToSection}>⊕ Add Resource to Section</button>
        `
        } else if (selected.featureType == "resources") {
            console.log("this is a resource")
        }
    }


    return html `
      <section class="bw2 flex flex-column ba w-100 mt2 h-auto flex-1 justify-between">
        <div class="w-100 pa2 overflow-y-scroll mb2" style="max-height: 532px;">
          <div class="w-100 tc"><small class="f7">Edit Selected | <span class="pointer hover-bg-purple" onclick=${deleteSelected}>🗑 delete </delete> </small></div>
          <div class="">
            <form id="inputEditor" name="inputEditor" class="w-100 flex flex-column f7">
              <label class="">URL</label> <input type="text" name="url" value=${selected.url || "url"}/>
              <label class="">Title</label> <input class="pa2 ba bw1" type="text" name="title" value=${selected.title || "title"}/>
              <label class="">Description</label> <textarea form="inputEditor" name="description" class="h4 pa2 ba bw1">${ selected.description ||"description"}</textarea>
              <label class="">Add Tags</label> 
              ${SidebarTagsInput(selected.tags, state, emit)}
              <label class="">Add Collaborators</label>
              ${SidebarCollaboratorInput(selected.collaborators, state, emit)}
            </form>
            <label class="mt2 f7"> Drag to Reorder 
            ${SidebarSortableList(selected, state, emit)}
            </label>
            ${showAddOptions(selected, state, emit)}
          </div>
        </div>
        <button onclick=${submitInputEditor} class="pa2 ba bw2 b--near-black white bg-near-black hover-washed-blue">SAVE</button>
      </section>
      `

}