const html = require('choo/html');
const css = require('sheetify');
const Sortable = require('sortablejs');

// Components
const SidebarHeader = require('../components/SidebarHeader');
const Playlist = require('../components/Playlist');
const Resource = require('../components/Resource');
const Section = require('../components/Section');
const MainNav = require('../components/MainNav');

// css `
// .mh-400px {
// max-height: 300px;
// }

// .mh-500px{
//   max-height:500px;
// }
// `;

module.exports = view;


function view(state, emit) {

  if (state.user.authenticated === true) {
    return html `
    <body class="w-100 h-100 code lh-copy bg-washed-blue ma0 flex flex-column items-center">
      <section class="mw8 w-100 h-100 pa2 flex flex-row">
        <!-- SIDEBAR -->
        ${Sidebar("Sidebar", state, emit)}

        <!-- BROWSE AREA -->
        ${MainView("MainView", state, emit)}
      </section>
    </body> 
  `;
  } else {
    return html `
    <body class="w-100 h-100 code lh-copy bg-washed-blue ma0 flex flex-column justify-center items-center">
      <section class="mw8 w-100 h-100 pa2 flex flex-column tc justify-center items-center">
      <h1>You're not authorized!</h1>
      <button class="mw6" onclick="${(e) => emit('db:users:redirect')}">go to login</button>
      </section>
    </body>
    `;
  }
}

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
          <ul class="w-100 flex flex-row-ns flex-column list pl0 f6 justify-between">
            <li class="mr2 pointer pa2 ${highlightSelected('playlists')}" onclick=${changeFilter} data-db="playlists">Playlists</li>
            <li class="mr2 pointer pa2 ${highlightSelected('sections')}" onclick=${changeFilter} data-db="sections">Sections</li>
            <li class="mr2 pointer pa2 ${highlightSelected('resources')}" onclick=${changeFilter} data-db="resources">Resources</li>
          </ul>
        </fieldset>
      </menu>
      `
  }

  function RenderItems() {
    function goBack(e) {
      let db = e.currentTarget.dataset.db;
      emit("pushState", `/edit/${db}`);
    }

    function addPlaylist(e){
      e.preventDefault();
      console.log("addPlaylist");
      emit("user:playlists:addJSON");
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
    

    if (state.params && Object.keys(state.params).length > 0) {

      if (state.params.hasOwnProperty('id')) {
        console.log("yes params")
        return html `
          <section class="w-100 flex flex-column mt4">
            <div class="w-100 mb4 pl2" onclick=${goBack} data-db="${state.edit.selected.featureType}">
              <p class="ma0 underline pointer">Go Back ↩ </p>
            </div>
            ${RenderSelectedItem(state.edit.selected)}
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
      return Section(item, state, emit)
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


function Sidebar(id, state, emit){
  return html`
    <section class="flex flex-column h-100 w5-ns w-100 flex-1">
      <!-- HEADER -->
      ${SidebarHeader("SidebarHeader", state, emit)}

      <!-- SIDEBAR EDIT AREA --> 
      ${SidebarEdit("SidebarEdit", state, emit)}

      <!-- USER NAV -->
      
    </section>
  `
  //${SidebarNav("SidebarNav", state, emit)}
}

function SidebarEdit(id, state, emit){
    
    let selected = state.selected.data;

    function submitInputEditor(e){
      e.preventDefault();
      let form = document.querySelector("#inputEditor");
      let formData = new FormData(form);
      let id = state.selected.data._id;
      let db = state.selected.data.featureType;
      emit("db:updateSelectedFeature", id, db, formData);
    }
  
    function deleteSelected(e){
      let id = state.selected.data._id;
      let db = state.selected.data.featureType;
      emit("db:deleteSelectedFeature", id, db);
      
    }

    // TODO: add in toggle visibility - need to add into DB prop for show or hide 
    function makeSortableList(selected, state, emit){
      // create a new element 
      var newUl = document.createElement("ol"); 
      // and give it some content 
      // var newContent = document.createTextNode("Hi there and greetings!"); 
      console.log(selected);
      if(selected.sections){
        selected.sections.forEach( section => {
          let newLi = document.createElement("li");
          newLi.className += " pointer "
          let newContent = document.createTextNode(`${section.title}`)
          newLi.dataset.featureid = section._id;
          newLi.dataset.parentid = selected._id;
          newLi.dataset.parentdb = selected.featureType;
          newLi.appendChild(newContent);
          newUl.appendChild(newLi);  
        })

        let sortable = Sortable.create(newUl, {
              onEnd: function(evt){
                console.log("sortable", evt.newIndex);
                // console.log("🌮🌮🌮",evt);
                emit("db:selectedFeature:reorder", evt.clone.dataset.parentid, evt.clone.dataset.parentdb,  evt.clone.dataset.featureid, evt.newIndex)
              }
            });

        return sortable.el;
      } else if (selected.resources){
        selected.resources.forEach( resource => {
          let newLi = document.createElement("li");
          newLi.className += " pointer ";
          let newContent = document.createTextNode(resource.title)
          newLi.dataset.featureid = resource._id;
          newLi.dataset.parentid = selected._id;
          newLi.dataset.parentdb = selected.featureType;
          newLi.appendChild( newContent);
          newUl.appendChild(newLi);  
        })
        let sortable = Sortable.create(newUl, {
              onEnd: function(evt){
                console.log(evt.newIndex);
                console.log("🌮🌮🌮",evt);
                emit("db:selectedFeature:reorder", evt.clone.dataset.parentid, evt.clone.dataset.parentdb,  evt.clone.dataset.featureid, evt.newIndex)
              }
            });

        return sortable.el;
      }
      
    }


  function showAddOptions(selected, state, emit){
    function addResourceToSection(e){
      emit("user:sections:addResource", selected._id, selected.featureType)
    }
    function addSectionToPlaylist(e){
      emit("user:playlists:addSection", selected._id, selected.featureType)
    }

    if(selected.featureType == "playlists"){
      console.log("this is a playlist")
      return html`
        <button class="ba bw0 f7" onclick=${addSectionToPlaylist}>⊕ Add Section to Playlist</button>
      `
    } else if ( selected.featureType == "sections"){
      console.log("this is a section")
      return html`
        <button class="ba bw0 f7" onclick=${addResourceToSection}>⊕ Add Resource to Section</button>
      `
    } else if (selected.featureType == "resources"){
      console.log("this is a resource")
    }
  }

    return html`
    <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto flex-1 justify-between">
      <div class="w-100 tc"><small class="f7">Edit Selected | <span class="pointer hover-bg-purple" onclick=${deleteSelected}>🗑 delete </delete> </small></div>
      <div class="w-100 pa2 overflow-y-scroll mb2">
        <form id="inputEditor" name="inputEditor" class="w-100 flex flex-column f7">
          <label class="">Title</label> <input type="text" name="title" value=${selected.title || "title"}/>
          <label class="">Description</label> <textarea form="inputEditor" name="description" class="h4">${ selected.description ||"description"}</textarea>
          <label class="">Tags</label> <input type="text" name="tags" value=${"tags"}/>
          <label class="">Collaborators</label><input type="text" name="collaborators" value=${"collaborators"}/>
          <label class="">URL</label> <input type="text" name="url" value=${selected.url || "url"}/>
        </form>
        <label class="mt2 f7"> Drag to Reorder 
        ${makeSortableList(selected, state, emit)}
        </label>
        ${showAddOptions(selected, state, emit)}
      </div>
      <button onclick=${submitInputEditor} class="pa2 ba bw2 b--near-black white bg-near-black hover-washed-blue">SAVE</button>
    </section>
    `

}


//<button onclick=${()=>{console.log("clicked!")}} class="pa2 ba f6 bw2 b--near-black white bg-near-black hover-washed-blue">COPY TO YOUR LIBRARY</button>

function SidebarNav(id, state, emit){
  function switchSelected(e) {
    e.preventDefault();
    let id = e.currentTarget.dataset.id;
    let db = e.currentTarget.dataset.db;
    emit("user:playlists:select", id, db);
  };

  function addPlaylist(e){
    e.preventDefault();
    console.log("addPlaylist");
    emit("user:playlists:addJSON");
  }

  return html`
  <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto mh-400px overflow-y-scroll f7">
    <div class="w-100 pa2">

      <!--
      <p>YOUR LIBRARY</p>
      <ul class="list pl1">
        <li>Starred Playlists</li>
        <li>Your Resources</li>
      </ul>
      -->

      <!--
      <p>COLLABORATIONS</p>
      <ul class="list pl1">
        <li>None yet!</li>
      </ul>
      --> 

      <p>PLAYLISTS <span class="hover-bg-purple cursor fr" onclick=${addPlaylist}>⊕ Add</span> </p>
      <ul class="list pl1">
      ${
          state.user.playlists.all.map( (playlist) => {
          return html`
            <li class="hover-bg-purple hover-white black" onclick=${switchSelected} data-id=${playlist._id} data-db="${playlist.featureType}">${playlist.title}</li>
            `
          })
        }
      </ul>
    </div>
  </section>
  `
}

function test(e){
  console.log("clicked")
}


