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
        <!-- main -->
        ${MainContent("MainContent", state, emit)}
      </section>
  </section>
  `
}


function MainContent(id, state, emit){

  function FilterMenu(){
    return html`
      <menu class="w-100 pa0 ma0">
        <fieldset>
        <legend class="f7">Browse by </legend>
        <ul class="w-100 flex flex-row-ns flex-column list pl0 f6 justify-between">
          <li class="mr2">Playlists</li>
          <li class="mr2">Sections</li>
          <li class="mr2">Resources</li>
          <li class="mr2">Contributors</li>
          <li class="mr2">Tags</li>
          <li class="mr2">Surprise Me 🎊</li>
        </ul>
        </fieldset>
      </menu>
    `
  }

  function RenderItems(){

    if(state.params && Object.keys(state.params).length > 0){
      console.log("yes params")
      return html`
      <section class="w-100 flex flex-column mt4">
        ${RenderSelectedItem(state.community.selected)}
      </section>
      `
    } else{
      console.log("No params")
      return html`
      <section class="w-100 flex flex-row flex-wrap mt4">
      ${state.community.playlists.map( playlist => {
           return BrowseItem(playlist)
      })}
      </section>
      `
    }
    
  }

  function RenderSelectedItem(item){
    return html`
      <div>
        <div>
          <h3 class="f3 mt0 mb2">${item.title}</h3>
        </div>
        <div class="flex flex-row w-100">
          <div class="w-40 pr2 f7 flex flex-column">
            <p class="ma0">created by: ${item.submittedBy}</p>
            <p class="ma0">tags:</p>
            <p class="ma0">comments:</p>
            <p class="ma0">images:</p>
          </div>
          <div class="w-60 pl2 f7">
            ${item.description}
          </div>
        </div>
      </div>
    `
  }

  

  function BrowseItem(item){

    css`
      .shadow-strong{
        box-shadow: 2px 2px black;
      }
    `

    function changeRoute(e){
      emit("pushState", `browse/${item.featureType}/${item._id}`)
      emit("browse:select");
    }

    return html`

      <div class="w5 h5 ba b--near-white bw2 bg-washed-red pa2 f7 ma1 shadow-strong" data-id="${item._id}" data-db="${item.featureType}" onclick=${changeRoute}>
        
        <p class="ma0 b f6">${item.title}</p>
        <p class="ma0 f7 truncate mt2">${item.description}</p>
        <p class="ma0 f7 truncate mt2">By: ${item.submittedBy}</p>
        
      </div>
    `
  }


  return html`
  <section class="w-100 h-auto overflow-y-scroll flex flex-column pa2 mt2">
    <!-- FILTER MENU -->
    ${FilterMenu()}

    <!-- SELECTED ITEMS TO BROWSE --> 
    ${RenderItems()}
  </section>
  `
}