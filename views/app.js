const html = require('choo/html');
const AppHeader = require('../components/AppHeader')
const AppFooter = require('../components/AppFooter')
const EditorMain = require('../components/EditorMain')
const SidebarNav = require('../components/SidebarNav')

module.exports = view

function view (state, emit) {

  const switchSelected = function(e){
    console.log(e.target.dataset.id)
    emit("db:playlists:select", e.target.dataset.id );
  }

  if(state.authenticated === true ){

      return html`
      <body class="w-100 h-100 code lh-copy bg-washed-blue ma0 flex flex-column">
        ${state.cache(AppHeader, "AppHeader", state, emit).render()}
        <main class="flex flex-column pl2 pr2 flex-1 h-100 pb6">
          <div class="flex flex-row w-100 h-100">
          ${state.cache( SidebarNav,"SidebarNav", state, emit).render()}
          <section class="flex flex-column h-100 ma0 w-100 pl2 pr2">
            ${state.cache(EditorMain, "EditorMain", state, emit).render()}
          </section>
          </div>
        </main>
        ${state.cache(AppFooter, "AppFooter", state, emit).render()}
      </body>
    `
  } else {
    const redirect = function(){
      emit("db:users:redirect")
    }

    return html`
    <body>
      <h1>You're not authorized! </h1>
      <button onclick=${redirect}>go to login</button>
    </body>
    `
  }

}