const html = require("choo/html");
const Sections = require("./Sections");
const css = require('sheetify');

module.exports = function(playlist, state, emit){

    function editSelected(e){
      
      let id = e.currentTarget.dataset.id;
      let db = e.currentTarget.dataset.db;
      emit("edit:selectAndEdit", id, db)
    }

    return html`
    <section class="shadow-1">
      <!-- HEADER AREA -->
      <div class="pa3 bg-animate hover-bg-washed-green" data-id="${playlist._id}" data-db="${playlist.featureType}" onclick=${editSelected}>
        <div>
          <h3 class="f3 mt0 mb2">${playlist.title}</h3>
        </div>
        <div class="flex flex-row w-100">
          <div class="w-40 pr2 f7 flex flex-column">
            <p class="ma0">created by: ${playlist.submittedBy}</p>
            <p class="ma0">tags:</p>
            <p class="ma0">comments:</p>
            <p class="ma0">images:</p>
          </div>
          <div class="w-60 pl2 f7">
            ${playlist.description}
          </div>
        </div>
      </div>
      <!-- SECTIONS & RESOURCES -->
        <section class="pa2">
        ${Sections(playlist.sections, state, emit)}
        </section>
      </section>
    `
}