
// var Component = require('choo/component')
var html = require('choo/html');
const css = require('sheetify');
const Playlist = require('../../components/Playlist');
const Resource = require('../../components/Resource');
const Section = require('../../components/Section');
const MainNav = require('../../components/MainNav');


module.exports = MainView;

function MainView(id, state, emit){
  
    return html`
    <section class="main w-100 flex flex-column ml2-ns"> 
      <!-- PRIMARY AREA -->
      <section class="w-100 flex-1 ba b--black bw2 bg-near-white h-100 overflow-auto">    
        ${MainNav("MainNav", state, emit)}
        <!-- main -->
        ${MainContent("MainContent", state, emit)}
      </section>
    </section>
    `
  }
  
  function MainContent(id, state, emit) {
  
    function changeFilter(e) {
      let db = e.currentTarget.dataset.db;
      console.log(db);
      emit("pushState", `/edit/${db}`)
      emit("edit:filter");
    }
  
    function highlightSelected(_db) {
  
      if (state.params.db == _db) {
        return " bg-purple white "
      } else {
        return " bg-near-white black "
      }
    }
  
    function FilterMenu() {
      return html `
        <menu class="w-100 pa0 ma0">
          <fieldset>
            <legend class="f7">Browse by </legend>
            <ul class="w-100 flex flex-row-ns flex-column list pl0 f6 justify-start">
              <li class="mr2 pointer pa2 ${highlightSelected('playlists')}" onclick=${changeFilter} data-db="playlists">Playlists</li>
              <li class="mr2 pointer pa2 ${highlightSelected('sections')}" onclick=${changeFilter} data-db="sections">Sections</li>
              <li class="mr2 pointer pa2 ${highlightSelected('resources')}" onclick=${changeFilter} data-db="resources">Resources</li>
            </ul>
          </fieldset>
        </menu>
        `
    }
  
    function RenderItems() {
      // function goBack(e) {
      //   let db = e.currentTarget.dataset.db;
      //   emit("pushState", `/edit/${db}`);
      // }
  
      function addPlaylist(e){
        e.preventDefault();
        console.log("addPlaylist");
        emit("edit:addPlaylist");
      }
  
      function addSection(e){
        e.preventDefault();
        console.log("TODO: addSection");
        // emit("user:playlists:addJSON");
      }
  
      function addResource(e){
        e.preventDefault();
        console.log("TODO: addResource");
        // emit("user:playlists:addJSON");
      }
      
  
      if (state.params && Object.keys(state.params).length > 0 && state.edit.selected.hasOwnProperty("_id")) {
  
        if (state.params.hasOwnProperty('id')) {
          let id = state.params.id;
          let db = state.params.db;
          let selectedFeature = state.edit[db].filter(item => item._id == id)[0];
          console.log("🌈🌈🌈🌈🌈", id, db, state.edit)
          return html `
            <section class="w-100 flex flex-column mt4">
              ${RenderSelectedItem(selectedFeature)}
            </section>
            `
        } else if (state.params.db == "playlists") {
          return html `
            <section class="w-100 flex flex-row flex-wrap mt4">
              
              <div class="overflow-auto w-100 w-50-m w-33-l h5 ba b--near-white bw1 pa2 grow"
                data-db="playlists" onclick=${addPlaylist}>
                <div class="w-100 h-100 flex flex-column justify-center items-center outline"><p class="tc">+ <br> ADD</p></div>
              </div>
  
              ${state.edit.playlists.map( playlist => {
              return BrowseItem(playlist)
              })}
            </section>
            `
        } else if (state.params.db == "sections") {
          return html `
          <section class="w-100 flex flex-row flex-wrap mt4">
  
            <div class="overflow-auto w-100 w-50-m w-33-l h5 ba b--near-white bw1 pa2 grow"
              data-db="playlists" onclick=${addSection}>
              <div class="w-100 h-100 flex flex-column justify-center items-center outline"><p class="tc">+ <br> ADD</p></div>
            </div>
  
            ${state.edit.sections.map( section => {
            return BrowseItem(section)
            })}
          </section>
          `
        } else if (state.params.db == "resources") {
          return html `
            <section class="w-100 flex flex-row flex-wrap mt4">
  
              <div class="overflow-auto w-100 w-50-m w-33-l h5 ba b--near-white bw1 pa2 grow"
              data-db="playlists" onclick=${addSection}>
                <div class="w-100 h-100 flex flex-column justify-center items-center outline"><p class="tc">+ <br> ADD</p></div>
              </div>
  
              ${state.edit.resources.map( resource => {
              return BrowseItem(resource)
              })}
            </section>
          `
        }
      } else {
        return html `
        <section class="w-100 flex flex-row flex-wrap mt4">
          ${state.edit.playlists.map( playlist => {
          return BrowseItem(playlist)
          })}
        </section>
        `
      }
  
    }
  
    function RenderSelectedItem(item) {
  
      if (item.featureType == "playlists") {
        return Playlist(item, state, emit)
      } else if (item.featureType == "sections") {
        return Section(item, 0, state, emit)
      } else if (item.featureType == "resources") {
        return html `
        <div class="flex flex-column w-100 pa2 ba bw2 b--pink">
          <h2 class="ma0"><a class="link black hover-bg-purple hover-white" href="${item.url}">${item.title}</a></h2>
          <p class="ma0 f6 mt2">${item.description}</p>
          <p class="ma0 f6 mt2">🦄 ${item.submittedBy}</p>
          <p class="ma0 mt2"><a class="link black f7" href="${item.url}" target="_blank">🔗 ${item.url}</a></p>
          <p class="ma0 mt2">${item.tags}</p>
        </div>
        `
      } else {
        return html `
        <div>not implemented yet!</div>
        `
      }
  
    }
  
  
    function BrowseItem(item) {
  
          css `
      .shadow-strong{
      box-shadow: 2px 2px black;
      }
      `
  
      function changeRoute(e) {
        emit("pushState", `/edit/${item.featureType}/${item._id}`)
        emit("edit:select");
      }
  
      function checkDb() {
        switch (item.featureType) {
          case "playlists":
            return " bg-washed-red "
            break;
          case "sections":
            return " bg-washed-yellow ";
            break;
          case "resources":
            return " bg-washed-blue "
          default:
            return " bg-near-white "
        }
      }
  
      css `
      .textOverflow{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 75ch;
      }
      `
  
      return html `
        <div class="overflow-auto w-100 w-50-m w-33-l h5 ba b--near-white bw1 pa2 f7 grow ${checkDb()}" data-id="${item._id}"
          data-db="${item.featureType}" onclick=${changeRoute}>
          <p class="ma0 f4 b">${item.title}</p>
          <p class="ma0 f7 mt2 textOverflow">${item.description}</p>
          <p class="ma0 f7 mt2">By: ${item.submittedBy}</p>
        </div>
        `
    }
  
  
    return html `
      <section class="w-100 h-auto overflow-y-scroll flex flex-column pa2 mt2">
        <!-- FILTER MENU -->
        ${FilterMenu()}
  
        <!-- SELECTED ITEMS TO BROWSE -->
        ${RenderItems()}
      </section>
      `
  } // END MainContent()