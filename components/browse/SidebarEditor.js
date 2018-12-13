const html = require('choo/html');
const css = require('sheetify');
const SidebarHeader = require('../../components/SidebarHeader');

module.exports = function(id, state, emit) {

    let selected = state.browse.selected;

    // function submitInputEditor(e) {
    //     e.preventDefault();
    //     let form = document.querySelector("#inputEditor");
    //     let formData = new FormData(form);
    //     let id = state.browse.selected._id;
    //     let db = state.browse.selected.featureType;
    //     emit("browse:updateSelectedFeature", id, db, formData);
    // }

    // function showAddOptions(selected, state, emit) {
    //     function addResourceToSection(e) {
    //         emit("browse:sections:addResource", selected._id, selected.featureType)
    //     }

    //     function addSectionToPlaylist(e) {
    //         emit("browse:playlists:addSection", selected._id, selected.featureType)
    //     }

    //     if (selected.featureType == "playlists") {
    //         console.log("this is a playlist")
    //         return html `
    //       <button class="ba bw0 f7" onclick=${addSectionToPlaylist}>⊕ Add Section to Playlist</button>
    //     `
    //     } else if (selected.featureType == "sections") {
    //         console.log("this is a section")
    //         return html `
    //       <button class="ba bw0 f7" onclick=${addResourceToSection}>⊕ Add Resource to Section</button>
    //     `
    //     } else if (selected.featureType == "resources") {
    //         console.log("this is a resource")
    //     }
    // }


    // return html `
    //   <section class="bw2 flex flex-column ba w-100 mt2 h-auto flex-1 justify-between">
    //     <div class="w-100 pa2 overflow-y-scroll mb2" style="max-height: 532px;">
    //       <div class="w-100 tc"><small class="f7">Edit Selected | <span class="pointer hover-bg-purple" onclick=${deleteSelected}>🗑 delete </delete> </small></div>
    //       <div class="">
    //         <form id="inputEditor" name="inputEditor" class="w-100 flex flex-column f7">
    //           <label class="">URL</label> <input type="text" name="url" value=${selected.url || "url"}/>
    //           <label class="">Title</label> <input class="pa2 ba bw1" type="text" name="title" value=${selected.title || "title"}/>
    //           <label class="">Description</label> <textarea form="inputEditor" name="description" class="h4 pa2 ba bw1">${ selected.description ||"description"}</textarea>
    //           <label class="">Add Tags</label> 
    //           ${SidebarTagsInput(selected.tags, state, emit)}
    //           <label class="">Add Collaborators</label>
    //           ${SidebarCollaboratorInput(selected.collaborators, state, emit)}
    //         </form>
    //         <label class="mt2 f7"> Drag to Reorder 
    //         ${SidebarSortableList(selected, state, emit)}
    //         </label>
    //         ${showAddOptions(selected, state, emit)}
    //       </div>
    //     </div>
    //     <button onclick=${submitInputEditor} class="pa2 ba bw2 b--near-black white bg-near-black hover-washed-blue">SAVE</button>
    //   </section>
    //   `

      return html `
    <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto flex-1 justify-between">
      <!-- SIDEBAR EDIT AREA -->
      <div class="tc w-100 tc f7 mt2">Selected:</div>
      <!-- MAIN AREA -->
      <div class="w-100 pa2 overflow-y-scroll mb2 ma0 f7">
        <!-- SUGGEST -->
        <fieldset>
          <legend class="pl2 pr2">Suggest a link</legend>
          <form class="w-100 flex flex-column">
            <label>URL</label>
            <input type="text" name="url">
            <label>Note</label>
            <input type="text" name="note">
            <input class="mt2 pa2 b--purple bg-washed-green ba" type="submit" value="SUGGEST">
          </form>
        </fieldset>

        <!-- MAKE A COMMENT -->
        <fieldset class="mt2">
          <legend class="pl2 pr2">Make a comment</legend>
          <form class="w-100 flex flex-column">
            <label>Text</label>
            <input type="text" name="text">
            <input class="mt2 pa2 b--purple bg-washed-green b--black ba" type="submit" value="COMMENT">
          </form>
        </fieldset>

        <!-- EXPRESS ENTHUSIASM -->
        <fieldset class="mt2">
          <legend class="pl2 pr2">Express Enthusiasm</legend>
          <button class="w-100 ba b--purple b--black bg-washed-green pa2">🌈 This is Awesome ❤️</button>
        </fieldset>
      </div>
      <button onclick=${() => console.log("hello")} class="pa2 ba f6 bw2 b--near-black white bg-near-black hover-washed-blue">COPY TO
        YOUR LIBRARY</button>
    </section>
    `

}
