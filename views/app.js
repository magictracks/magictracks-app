const html = require('choo/html');
const AppHeader = require('../components/AppHeader')
const AppFooter = require('../components/AppFooter')

module.exports = view

function view (state, emit) {

  if(state.authenticated === true){
    return html`
    <body class="w-100 h-100 code lh-copy bg-washed-blue ma0 flex flex-column">
      ${state.cache(AppHeader, "AppHeader", state, emit).render()}
      <main class="flex flex-column pl2 pr2 flex-1 h-100 pb6">
        <div class="flex flex-row w-100 h-100">
        <section class="w-20 flex flex-column h-100 ma0 bt bb bw2">
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
            ${state.playlists.all.map(playlist => {
              return html`
                  <li class="f7 truncate">${playlist.title}</li>
              `
            })}
            </ul>
          </section>
        </section>
        <section class="flex flex-column h-100 ma0 w-60 pl2 pr2">
          <div class="bt bb bw2 w-100 h-auto mb6">
            <!-- Meta Details -->
            <section class="flex flex-row w-100 h5 mt2">
              <section class="h5 w5">
                <div class="bg-near-white w-100 h-100"></div>
              </section>
              <section class="flex flex-column justify-end pl4 pr2 w-100">
                <p class="ma0 f7">Playlist</p>
                <h1 class="ma0 f4">${state.playlists.selected.title}</h1>
                <p class="ma0 f7">Created by ${ state.playlists.selected.submittedBy || "username"}</p>
                <p class="ma0 f7">Description: ${ state.playlists.selected.description || "description"}</p>
                <p class="ma0 f7">Tags: ${ state.playlists.selected.tags.map(tag => html`${tag}`) || "tags"}</p>
                <p class="ma0 f7">⚙️ Edit Details </p>
                <div>
                  <p>Export 🚀</p>
                    <ul class="list pl0">
                      <li></li>
                      <li></li>
                      <li></li>
                    </ul>
                  </div>
              </section>
            </section>
            <!-- TODO: Playlist Tools for filtering sections -->
            
            <!-- Sections -->

            <section class="flex flex-column w-100 mt4">
              ${state.playlists.selected.sections.map(section =>
                html`
                <section class="flex flex-row w-100 mt2 mb4 pb4">
                  <section class="h5 w5 ba bw1 pa2">
                    <p class="ma0 f7">section</p>
                    <p class="ma0 f6 b">${section.title}</p>
                    <p class="ma0 f7">Created by ${ section.submittedBy || "username"}</p>
                    <p class="ma0 f7">Description: ${ section.description || "description"}</p>
                    <p class="ma0 f7">⚙️ Edit Details </p>
                  </section>
                  <section class="flex flex-column justify-end pl4 w-100">
                  <div class="overflow-auto">
                    <table class="f6 w-100 mw8 center" cellspacing="0">
                      <thead>
                        <tr>
                          <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Track</th>
                          <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Title</th>
                          <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Details</th>
                          <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Edit</th>
                        </tr>
                      </thead>
                      <tbody class="lh-copy">
                        ${section.resources.map( (resource, idx) => 
                          html`
                          <tr>
                            <td class="pv3 pr3 bb b--black-20">${idx}</td>
                            <td class="pv3 pr3 bb b--black-20"><a href="${resource.url}">${resource.title}</a></td>
                            <td class="pv3 pr3 bb b--black-20">${resource.description || "dropdown to details"}</td>
                            <td class="pv3 pr3 bb b--black-20">⚙️</td>
                          </tr>
                          `
                          )}
                      </tbody>
                    </table>
                </div>

                  </section>
                </section>
                `
              )}
            </section>
            
          </div> 
        </section>
        <section class="w-20 flex flex-column h-100 ma0 bt bb bw2">
        hello
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