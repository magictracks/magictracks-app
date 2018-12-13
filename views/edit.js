const html = require('choo/html');
const css = require('sheetify');

// Components
const EditMain = require('../components/edit/Main');
const Sidebar = require('../components/edit/Sidebar');

module.exports = view;

function view(state, emit) {

  if (state.user.authenticated === true) {
    return html `
    <body class="w-100 h-100 code lh-copy bg-washed-blue ma0 flex flex-column items-center">
      <section class="mw9 w-100 h-100 pa2 flex flex-row">
        <!-- SIDEBAR -->
        ${Sidebar("Sidebar", state, emit)}

        <!-- BROWSE AREA -->
        ${EditMain("MainView", state, emit)}
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