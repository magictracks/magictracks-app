const html = require('choo/html');
const css = require('sheetify');

module.exports = function(id, state, emit){

  function changeFilter(e) {
    let db = e.currentTarget.dataset.db;
    console.log(db);
    emit("pushState", `/browse/${db}`)
    emit("browse:filter");
  }
  
    function highlightSelected(_db) {
  
      if (state.params.db == _db) {
        return " bg-purple white "
      } else {
        return " bg-near-white black "
      }
    }
  
    return html `
    <menu class="w-100 pa0 ma0">
      <fieldset>
        <legend class="f7">Browse by </legend>
        <ul class="w-100 flex flex-row-ns flex-column list pl0 f6 justify-start">
          <li class="mr2 pointer pa2 ${highlightSelected('playlists')}" onclick=${changeFilter} data-db="playlists">Playlists</li>
          <li class="mr2 pointer pa2 ${highlightSelected('sections')}" onclick=${changeFilter} data-db="sections">Sections</li>
          <li class="mr2 pointer pa2 ${highlightSelected('resources')}" onclick=${changeFilter} data-db="resources">Resources</li>
          <li class="mr2 pointer pa2 ${highlightSelected('users')}" onclick=${changeFilter} data-db="users">Contributors</li>
        </ul>
      </fieldset>
    </menu>
    `
}

// <li class="mr2 pointer pa2 ${highlightSelected('tags')}" onclick=${changeFilter} data-db="tags">Tags</li>
//<li class="mr2 pointer pa2 ${highlightSelected('')}" onclick=${changeFilter} data-db="">Surprise me 🎊 </li>