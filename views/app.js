const html = require('choo/html');
const AppHeader = require('../components/AppHeader');
const AppFooter = require('../components/AppFooter');
const EditorMain = require('../components/EditorMain');
const SidebarNav = require('../components/SidebarNav');
const css = require('sheetify');

css`
.mh-400px {
max-height: 300px;
}
`;

module.exports = view;

function view(state, emit) {
const switchSelected = function(e) {
console.log(e.target.dataset.id);
emit('db:playlists:select', e.target.dataset.id);
};

if (state.authenticated === true) {
return html`

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
          <p class="ma0 f7">Hi @username! | Account ▾</p>
        </div>
      </section>

      <!-- Editor -->
      <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto overflow-y-scroll flex-1 justify-between">
        <div class="w-100 pa2">
          <form class="w-100 flex flex-column f7">
            <label class="">Title</label> <input type="text" />

            <label class="">Description</label> <textarea></textarea>

            <label class="">Tags</label> <input type="text" />

            <label class="">Collaborators</label>
            <input type="text" />
          </form>
        </div>
        <button class="pa2 ba bw2 b--near-black white bg-near-black">SAVE</button>
      </section>

      <!-- Nav -->
      <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto mh-400px overflow-y-scroll f7">
        <div class="w-100 pa2">
          <p>YOUR LIBRARY</p>
          <ul class="list pl0">
            <li>Starred Playlists</li>
            <li>Your Resources</li>
          </ul>

          <p>COLLABORATIONS</p>
          <ul class="list pl0">
            <li>None yet!</li>
          </ul>

          <p>PLAYLISTS ⊕</p>
          <ul class="list pl0">
            <li>HTML & CSS Primer</li>
            <li>Interactive Web Maps</li>
            <li>Data Visualization with P5.js</li>
            <li>Color Theory & Practice Workshop</li>
          </ul>
        </div>
      </section>
    </section>
    <!-- main -->
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
          <ul class="list h-100 pl2 flex flex-row near-black bg-near-white f7 mr2 items-center">
            <li class="mr2">Edit ▾</li>
          </ul>
          <ul class="list h-100 pl2 flex flex-row near-white bg-near-black f7 mr2 items-center">
              <li class="mr2">Export ▾</li>
            </ul>
          <ul class="list h-100 pl0 flex flex-row white f7 items-center">
              <li class="mr2">Browse</li>
          </ul>
        </nav>
        <!-- main -->
        <section class="w-100 h-auto overflow-y-scroll">

        </section>
      </section>

    </section>

  </section>
</body>
`;
} else {
const redirect = function() {
emit('db:users:redirect');
};

return html`

<body>
  <h1>You're not authorized!</h1>
  <button onclick="${redirect}">go to login</button>
</body>
`;
}
}

/**
<!--Editor Area -->
<main class="w-100 flex flex-column flex-row-ns mt2 ma0 pa0">
  <!--Editor sidebar -->
  <section class="flex flex-column w5-ns w-100">
    <section class="w-100 h-auto pa2 ba bw2">
      <div class="w-100">
        <form class="w-100">
          <label class="f7">Title
            <input type="text">
          </label>
          <label class="f7">Description
            <textarea></textarea>
          </label>
          <label class="f7">Tags
            <input type="text">
          </label>
          <label class="f7">Collaborators
            <input type="text">
          </label>
        </form>
      </div>
      <button class="w-100 h2 mt2">save</button>
    </section>

    <section class="w-100 h5 ba bw2 mt2 pa2">
      hello
    </section>

  </section>
  <!--Editor area -->
  <section class="flex flex-column w-100 h-100 ml2-ns ba bw2">

  </section>
</main>
*/

/**

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
*/