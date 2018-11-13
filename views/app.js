const html = require('choo/html');
// const AppHeader = require('../components/AppHeader');
// const AppFooter = require('../components/AppFooter');
// const EditorMain = require('../components/EditorMain');
// const SidebarNav = require('../components/SidebarNav');
const css = require('sheetify');

css `
.mh-400px {
max-height: 300px;
}

.mh-500px{
  max-height:500px;
}
`;

module.exports = view;

function view(state, emit) {
  const switchSelected = function (e) {
    console.log(e.target.dataset.id);
    emit('db:playlists:select', e.target.dataset.id);
    emit('db:feature:select', e.target.dataset.id, e.target.dataset.db)
  };

  const toggleSelectedTab = function (e) {
    let listItems = document.querySelectorAll(".mainNavTab");
    listItems.forEach(item => {
      if (item.classList.contains('near-black')) {
        item.classList.replace('near-black', 'near-white');
        item.classList.replace('bg-near-white', 'bg-near-black');
      }
    })
    e.target.parentNode.classList.replace('near-white', 'near-black');
    e.target.parentNode.classList.replace('bg-near-black', 'bg-near-white');
  }

  const toggleDropdown = function(e){
    e.target.nextElementSibling.classList.toggle('dn');
  }

  // const selectItem = function(e){
  //   emit('db:feature:select', e.target.dataset.id, e.target.dataset.db )
  // }


  if (state.authenticated === true) {
    return html `

<body class="w-100 h-100 code lh-copy bg-washed-blue ma0 flex flex-column items-center">
  <section class="mw8 w-100 h-100 pa2 flex flex-row">
    <!-- sidebar -->
    <section class="flex flex-column h-100 w5-ns w-100 flex-1">
      <!-- logo and profile -->
      <section class="flex flex-column ba bw2 w5-ns w-100 items-center justify-center pa2 h4">
        <div class="ma0">
          <img src="assets/magic-tracks-logo-nobg.png" id="logo" />
        </div>
        <div>
          <p class="ma0 f7">Magic Tracks ✨</p>
        </div>
        <div>
          <p class="ma0 f7">Hi @${state.user.username}! | Account ▾</p>
        </div>
      </section>

      <!-- Editor -->
      <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto flex-1 justify-between">
        <div class="w-100 tc"><small class="f7">Edit Selected</small></div>
        <div class="w-100 pa2 overflow-y-scroll">
          <form class="w-100 flex flex-column f7">
            <label class="">Title</label> <input type="text" value=${state.selectedItem.title}/>

            <label class="">Description</label> <textarea class="h4">${state.selectedItem.description}</textarea>

            <label class="">Tags</label> <input type="text" />

            <label class="">Collaborators</label>
            <input type="text" />
          </form>
        </div>
        <button class="pa2 ba bw2 b--near-black white bg-near-black hover-washed-blue">SAVE</button>
      </section>

      <!-- Nav -->
      <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto mh-400px overflow-y-scroll f7">
        <div class="w-100 pa2">
          <p>YOUR LIBRARY</p>
          <ul class="list pl1">
            <li>Starred Playlists</li>
            <li>Your Resources</li>
          </ul>

          <p>COLLABORATIONS</p>
          <ul class="list pl1">
            <li>None yet!</li>
          </ul>

          <p>PLAYLISTS ⊕</p>
          <ul class="list pl1">
            ${
              state.playlists.all.map( (playlist) => {
              return html`
                <li class="hover-bg-purple hover-white black" onclick=${switchSelected} data-id=${playlist._id} data-db="playlists">${playlist.title}</li>
                `
              })
            }
          </ul>
        </div>
      </section>
    </section>
    <!-- Add resouces container -->
    <section class="main w-100 flex flex-column ml2-ns">
      <!-- add and recent items -->
      <section class="main flex flex-row ba bw2 items-end w-100 pa2 h4">
        <div class="flex flex-column bg-near-white h3 w3 justify-center items-center ba bw2">
          <div>+</div>
          <div>ADD</div>
        </div>
        <div class="flex flex-column w-100 ml2-ns">
          <label class="ma0 pa0 f7">Recently Added</label>
          <div class="w-100 bg-near-white ba bw2 h3"></div>
        </div>
      </section>

      <!-- main -->
      <section class="w-100 flex-1 ba bw2 mt2 bg-near-white">
        <!-- NAV -->
        <nav class="w-100 b--near-black bg-near-black h2 flex flex-row items-center">
          <ul class="list flex flex-row ma0 pa0 h-100 z-max">
            <li class="mainNavTab h-100 bg-near-white near-black pr2 pl2">
              <span onclick=${toggleSelectedTab}>Edit</span> <span onclick=${toggleDropdown}>▾</span>
              <ul class="dn ba bw1 pa2 bg-pink list black">
                <li>new playlist</li>
                <li>new section</li>
                <li>new resource</li>
              </ul>
            </li>
            <li onclick=${toggleSelectedTab} class="mainNavTab h-100 bg-near-black near-white pr2 pl2">
                <span onclick=${toggleSelectedTab}>Export</span> <span onclick=${toggleDropdown}>▾</span>
              <ul class="dn ba bw1 pa2 bg-pink list black">
                <li>as HTML</li>
                <li>as Markdown</li>
                <li>as PDF</li>
              </ul>
            </li>
            <li class="mainNavTab h-100 bg-near-black near-white pr2 pl2"><span onclick=${toggleSelectedTab}>Browse</span></li>
          </ul>
        </nav>
        <!-- main -->
        <section id="mainContent" class="w-100 h-auto overflow-y-scroll flex flex-column pa2 mt2 mh-500px">
          <!-- ARTICLE HEADER -->
          <section class="w-100 h-auto flex flex-column pa2" data-id=${state.playlists.selected._id} data-db="playlists" onclick=${(e) => emit("db:feature:select", state.playlists.selected._id, "playlists") }>
            <div><h3 class="f3 mt0 mb2">${state.playlists.selected.title}</h3></div>
            <div class="flex flex-row w-100">
              <div class="w-40 pr2 f7 flex flex-column">
                <p class="ma0">created by:</p>
                <p class="ma0">tags:</p>
                <p class="ma0">comments:</p>
                <p class="ma0">images:</p>
              </div>
              <div class="w-60 pl2 f7">
                ${state.playlists.selected.description}
              </div>
            </div>
          </section>
          <!-- Sections & Resources --> 
          ${makeSections(state, emit)}

        </section> <!-- end main edit/export/browse -->
      </section> <!-- end main container -->
    </section> <!-- end main container -->
  </section> <!-- end mw8 container -->
</body> 
`;
  } else {
    const redirect = function () {
      emit('db:users:redirect');
    };

    return html `
    <body>
      <h1>You're not authorized!</h1>
      <button onclick="${redirect}">go to login</button>
    </body>
`;
  }
}

function makeSections(state, emit){
  if(state.playlists.selected.sections !== undefined){
    return html`
      <section class="w-100 h-auto mt4">
      ${ 
        state.playlists.selected.sections.map( (section, sectionIndex) => {
          return html`
            <section class="w-100 ba bw1 mt2" data-id=${section._id} data-db="sections">
              <!-- SECTION HEADER -->
              <section class="w-100 pa2 bg-near-black white flex flex-column" data-id=${section._id} data-db="sections" onclick=${ function(e){emit("db:feature:select", String(section._id), "sections") }}>
                <h4 class="f4 mt0 mb2">${section.title}</h4>
                <div class="flex flex-row w-100">
                  <div class="w-40 pr2 f7 flex flex-column">
                    <p class="ma0">created by:</p>
                    <p class="ma0">tags:</p>
                    <p class="ma0">comments:</p>
                    <p class="ma0">images:</p>
                  </div>
                  <div class="w-60 pl2 f7">
                    ${section.description}
                  </div>
                </div>
              </section>
              <section class="w-100">
                ${makeResources(section, emit)}
              </section>
            </section>
          `
        })
      }
    </section>
    `
    } else{
      return html`
        <div>nothing yet</div>
      `
    }
  }


  const toggleResourceDetails = function(e){
    this.parentNode.querySelector('.hiddenDetails').classList.toggle('dn');
  }

  function makeResources(section, emit){
    if(section.resources !== undefined){
      return html`
        <div class="overflow-auto">
          <table class="f6 w-100 center" cellspacing="0">
            <thead>
              <tr class="stripe-dark">
                <th class="fw6 tl pa3 bg-white">#</th>
                <th class="fw6 tl pa3 bg-white">☑️</th>
                <th class="fw6 tl pa3 bg-white">Title</th>
                <th class="fw6 tl pa3 bg-white">Details</th>
                <th class="fw6 tl pa3 bg-white">▾</th>
              </tr>
            </thead>
            <tbody class="lh-copy">
              ${section.resources.map( (resource, resourceIndex) => {
                return html`
                <tr class="stripe-dark" data-id=${resource._id} data-db="resources" onclick=${ (e) => { if(!e.target.classList.contains("dropdown")) emit("db:feature:select", String(resource._id), "resources") }}>
                  <td class="pa3">${resourceIndex}</td>
                  <td class="pa3">☑️</td>
                  <td class="pa3"><a class="link black hover-bg-purple hover-white" href="${resource.url}" target="_blank">${resource.title}</a></td>
                  <td class="pa3">
                    ${resource.description}
                    <p class="hiddenDetails dn"> ${resource.url}</p>
                  </td>
                  <td class="pa3 dropdown" onclick=${toggleResourceDetails}>▾</td>
                </tr>
                `
              })}
            </tbody>
          </table>
        </div>
      `
    } else{
      return html`<div>no resources yet!</div>`
    }
  }
