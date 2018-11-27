const html = require('choo/html');
const css = require('sheetify');

const SidebarHeader = require('../components/SidebarHeader');
const MainNav = require('../components/MainNav');

module.exports = view;


function view(state, emit) {

    return html `
    <body class="w-100 h-100 code lh-copy bg-washed-blue ma0 flex flex-column items-center">
      <section class="mw8 w-100 h-100 pa2 flex flex-row">
        <!-- SIDEBAR -->
        ${Sidebar("Sidebar", state, emit)}

        <!-- BROWSE AREA -->
        ${BrowseMain("BrowseMain", state, emit)}
      </section>
    </body> 
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
    
    return html`
    <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto flex-1 justify-between mh-440px">
      <!-- SIDEBAR EDIT AREA --> 
      <div class="tc w-100 tc f7 mt2">Selected</div>
        <!-- MAIN AREA -->
        <div class="w-100 pa2 overflow-y-scroll mb2 ma0 f7">
            <!-- SUGGEST -->
            <fieldset>
              <legend class="pl2 pr2">Suggest a link</legend>
              <form class="w-100 flex flex-column">
                <label>URL</label>
                <input type="text" name="url">
                <label>Note</label>
                <input type="text" name="note">
                <input class="mt2 pa2 b--purple bg-washed-green ba" type="submit" value="SUGGEST">
              </form>
            </fieldset>

            <!-- MAKE A COMMENT -->
            <fieldset class="mt2">
              <legend class="pl2 pr2">Make a comment</legend>
              <form class="w-100 flex flex-column">
                <label>Text</label>
                <input type="text" name="text">
                <input class="mt2 pa2 b--purple bg-washed-green b--black ba" type="submit" value="COMMENT">
              </form>
            </fieldset>

            <!-- EXPRESS ENTHUSIASM -->
            <fieldset class="mt2">
              <legend class="pl2 pr2">Express Enthusiasm</legend>
              <button class="w-100 ba b--purple b--black bg-washed-green pa2">🌈 This is Awesome ❤️</button>
            </fieldset>
        </div>
        <button onclick=${()=>{console.log("clicked!")}} class="pa2 ba f6 bw2 b--near-black white bg-near-black hover-washed-blue">COPY TO YOUR LIBRARY</button>
    </section>
    `

}

function SidebarNav(id, state, emit){
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

      <p>PLAYLISTS <span class="hover-bg-purple cursor fr" onclick=${test}>⊕ Add</span> </p>
      <ul class="list pl1">
      </ul>
    </div>
  </section>
  `
}

function test(e){
  console.log("clicked")
}


function BrowseMain(id, state, emit){
  return html`
  <section class="main w-100 flex flex-column ml2-ns"> 
      <!-- PRIMARY AREA -->
      <section class="w-100 flex-1 ba b--black bw2 bg-near-white h-100 overflow-auto">    
        ${MainNav("MainNav", state, emit)}
      </section>
  </section>
  `
}
