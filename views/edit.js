const html = require('choo/html');
const css = require('sheetify');

// Components
const MainView = require('../components/edit/MainView');
const Sidebar = require('../components/edit/Sidebar');

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
      <button class="mw6" onclick="${(e) => emit('pushState', "/login")}">go to login</button>
      </section>
    </body>
    `;
  }
}


//<button onclick=${()=>{console.log("clicked!")}} class="pa2 ba f6 bw2 b--near-black white bg-near-black hover-washed-blue">COPY TO YOUR LIBRARY</button>

// function SidebarNav(id, state, emit){
//   function switchSelected(e) {
//     e.preventDefault();
//     let id = e.currentTarget.dataset.id;
//     let db = e.currentTarget.dataset.db;
//     emit("user:playlists:select", id, db);
//   };

//   function addPlaylist(e){
//     e.preventDefault();
//     console.log("addPlaylist");
//     emit("edit:addPlaylist");
//   }

//   return html`
//   <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto mh-400px overflow-y-scroll f7">
//     <div class="w-100 pa2">

//       <!--
//       <p>YOUR LIBRARY</p>
//       <ul class="list pl1">
//         <li>Starred Playlists</li>
//         <li>Your Resources</li>
//       </ul>
//       -->

//       <!--
//       <p>COLLABORATIONS</p>
//       <ul class="list pl1">
//         <li>None yet!</li>
//       </ul>
//       --> 

//       <p>PLAYLISTS <span class="hover-bg-purple cursor fr" onclick=${addPlaylist}>⊕ Add</span> </p>
//       <ul class="list pl1">
//       ${
//           state.user.playlists.all.map( (playlist) => {
//           return html`
//             <li class="hover-bg-purple hover-white black" onclick=${switchSelected} data-id=${playlist._id} data-db="${playlist.featureType}">${playlist.title}</li>
//             `
//           })
//         }
//       </ul>
//     </div>
//   </section>
//   `
// }

// function test(e){
//   console.log("clicked")
// }


