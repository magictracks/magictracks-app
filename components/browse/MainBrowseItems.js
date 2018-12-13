const html = require('choo/html');
const css = require('sheetify');
const MainBrowseItem = require('./MainBrowseItem');

module.exports = function(state, emit){

    let currentDbSelection;

    if (state.params.db == "playlists") {
        currentDbSelection = state.browse["playlists"];
    } else if (state.params.db == "sections") {
        currentDbSelection = state.browse["sections"];
    } else if (state.params.db == "resources") {
        currentDbSelection = state.browse["resources"];
    } else if (state.params.db == "users") {
        currentDbSelection = state.browse["users"];
    } else if (state.params.db == "tags") {
        currentDbSelection = state.browse["tags"];
    } 

    return html`
        <section class="w-100 flex flex-row flex-wrap mt4">
            ${currentDbSelection.map( item => {
                return MainBrowseItem(item, state, emit)
            })}
        </section>
    `
}

// else if (state.params.db == "users") {
//     return html `
//       <section class="w-100 flex flex-row flex-wrap mt4">
//         ${state.browse.users.map( user => {
//         return html`
//         <div class="pa4 tc">
//           <img src="http://tachyons.io/img/logo.jpg" class="br4 h3 w3 dib" alt="avatar">
//           <p class="ma0 f4 b">${user.username || "no name"}</p>
//         </div>
  
//         `
//         })}
//       </section>
//       `
//   }