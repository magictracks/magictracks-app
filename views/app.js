const html = require('choo/html');
const css = require('sheetify');

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
      howdy!
    </section>
  </section>
  `
}


function Sidebar(id, state, emit){
  return html`
    <section class="flex flex-column h-100 w5-ns w-100 flex-1">
      <!-- HEADER -->
      ${SidebarHeader("SidebarHeader", state, emit)}

      <!-- SIDEBAR EDIT AREA --> 
      ${SidebarEdit("SidebarEdit", state, emit)}

      <!-- USER NAV -->
      ${SidebarNav("SidebarNav", state, emit)}
    </section>
  `
}

function SidebarEdit(id, state, emit){

    function getSelectedTitle(){
      let selected = state.community.selected;

      if(Object.keys(selected).length > 0 ){
        return selected.title;
      } else {
        return "nothing selected yet"
      }
    }
    
    return html`
    <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto flex-1 justify-start mh-440px">
      <!-- SIDEBAR EDIT AREA --> 
      <div class="tc w-100 tc f7 mt2">Export Details:  <span class="f7">${getSelectedTitle()}</span></div>
        <!-- MAIN AREA -->
        <div class="w-100 pa2 overflow-y-scroll mb2 ma0 f7">
            <!-- SUGGEST -->
            <fieldset>
              <legend class="pl2 pr2">Share</legend>
              <form class="w-100 flex flex-column" >
                <label>Full Screen URL</label>
                <input type="text" name="url">
                <label>Link To Current View</label>
                <input type="text" name="note">
              </form>
            </fieldset>

            <!-- MAKE A COMMENT -->
            <fieldset class="mt2">
              <legend class="pl2 pr2">Data Export</legend>
              <form class="w-100 flex flex-column">
                <label>JSON Export</label>
                <input type="text" name="jsonexport">
                <label>HTML Export</label>
                <input type="text" name="htmlexport">
                <input class="mt2 pa2 b--purple bg-washed-green b--black ba" type="submit" value="DOWNLOAD ALL">
              </form>
            </fieldset>
        </div>
        
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


