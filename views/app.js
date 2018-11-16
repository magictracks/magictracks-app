const html = require('choo/html');
const css = require('sheetify');
const AddModal = require('../components/app/AddModal');
const AppSidebar = require('../components/app/AppSidebar');
const AppMain = require('../components/app/AppMain');

css `
.mh-400px {
max-height: 300px;
}

.mh-500px{
  max-height:500px;
}
`;

module.exports = view;



// 

function view(state, emit) {

  if (state.authenticated === true) {
    return html `
    <body class="w-100 h-100 code lh-copy bg-washed-blue ma0 flex flex-column items-center">
      <section class="mw8 w-100 h-100 pa2 flex flex-row">
        <!-- SIDEBAR -->
        ${state.cache(AppSidebar, "AppSidebar", state, emit).render() }

        <!-- PRIMARY -->
        ${state.cache(AppMain, "AppMain", state, emit).render() }
      </section>
      
      <!-- ADD RESOURCES MODAL -->
      ${state.cache(AddModal, "AddModal", state, emit).render()}
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
