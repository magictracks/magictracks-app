const html = require('choo/html');
const AppHeader = require('../components/AppHeader')
const AppFooter = require('../components/AppFooter')

module.exports = view

function view (state, emit) {

  if(state.authenticated === true){
    return html`
    <body class="w-100 h-100 code lh-copy bg-washed-blue ma0 flex flex-column">
      ${state.cache(AppHeader, "AppHeader", state, emit).render()}
      <main class="flex flex-column pa2 flex-1 h-100">
        <div class="flex flex-row w-100 h-100">
        <section class="w5 flex flex-column h-100 ma0 bt bb bw2">
          <!-- Browse -->
          <section class="mt2">
            <!-- <h6 class="f6 ma0">BROWSE</h6> -->
            <ul class="list pl0">
              <li class="f7">Browse</li>
            </ul>
          </section>
          <!-- YOUR LIBRARY -->
          <section class="ma0">
            <h6 class="f6 ma0">YOUR LIBRARY</h6>
            <ul class="list pl0">
              <li class="f7">Starred</li>
              <li class="f7">Resources</li>
              <li class="f7">Sections</li>
            </ul>
          </section>
          <!-- YOUR COLLABORATIONS -->
          <section>
            <h6 class="f6 ma0">COLLABORATIONS</h6>
            <ul class="list pl0">
              <li class="f7">No Collaborations yet!</li>
            </ul>
          </section>
          <!-- YOUR PLAYLISTS / TODO: if no playlists show "no playlists" -->
          <section>
            <h6 class="f6 ma0">PLAYLISTS <span>⊕</span></h6>
            <ul class="list pl0">
            ${state.playlists.map(playlist => {
              return html`
                  <li class="f7 truncate">${playlist.title}</li>
              `
            })}
            </ul>
          </section>
        </section>
        <section class="flex flex-column h-100 ma0 w-100 pl2 pr2">
          <div class="bt bb bw2 w-100 h-100">
            <section class="flex flex-row w-100 h5 mt2">
              <section class="h5 w5">
                <div class="bg-moon-gray w-100 h-100"></div>
              </section>
              <section class="flex flex-column justify-end pl4 pr2">
                <p class="ma0">Playlist</p>
                <h1 class="ma0">Interactive Web Maps</h1>
                <p class="ma0">Created by @joeyklee in collaboration with @shiffman</p>
                <p class="ma0">Tags: maps, cartography, leafletjs, web, mapping</p>
                <p class="ma0">⚙️ Edit Details </p>
              </section>
            </section>
            <section class="flex flex-row w-100">
              
            </section>
          </div> 
        </section>
        </div>
      </main>
      ${state.cache(AppFooter, "AppFooter", state, emit).render()}
    </body>
  `
  } else {
    
    const redirect = function(){
      console.log(state);
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