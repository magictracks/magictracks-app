var Component = require('choo/component')
var html = require('choo/html')
const AppTopToolbar = require('./AppTopToolbar')
const AddModal = require('./AddModal')
const MainNav = require('../MainNav')

class AppMain extends Component {
  constructor(id, state, emit) {
    super(id)
    this.id = id;
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {

    }

    this.toggleSelectedTab = this.toggleSelectedTab.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    // this.toggleAddModal = this.toggleAddModal.bind(this);
  }

  toggleSelectedTab(e) {
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

  toggleDropdown(e) {
    e.target.nextElementSibling.classList.toggle('dn');
  }


  // toggleAddModal(e){
  //   e.preventDefault();
  //   this.emit("addModal:toggle");
  // }
  createElement() {
    // <!-- TOPTOOLBAR -->
    // ${this.state.cache(AppTopToolbar, "AppTopToolbar", this.state, this.emit).render() }


    return html `
    <section class="main w-100 flex flex-column ml2-ns">      
      <!-- PRIMARY AREA -->
      <section class="w-100 flex-1 ba bw2 bg-near-white h-100 overflow-auto">
        <!-- NAV -->
        ${MainNav("MainNav", this.state, this.emit)}
        <!-- main -->
        <section id="mainContent" class="w-100 h-auto overflow-y-scroll flex flex-column pa2 mt2">
          ${editView(this.state, this.emit)}
        </section> <!-- end main edit/export/browse -->
      </section> <!-- end main container -->
    </section>
    `
  }
  // ${this.state.cache(AddModal, "AddModal", this.state, this.emit)}

  update() {
    return true
  }
}





function editView(state, emit) {

  function toggleAddModal(e) {
    e.preventDefault();
    emit("addModal:toggle");
  }

  function setSelected(e) {
    e.preventDefault();
    let id = e.currentTarget.dataset.id;
    let db = e.currentTarget.dataset.db;
    emit("db:getSelectedFeature", id, db);
  }

  return html `
    
    <section class="w-100 h-auto flex flex-column pa2">
      
    <!-- HEADER AREA -->  
      <div data-id=${state.user.playlists.selected._id} 
      data-db="${state.user.playlists.selected.featureType}" 
      onclick=${setSelected }>
      <div>
      <h3 class="f3 mt0 mb2">${state.user.playlists.selected.title}</h3>
      </div>
      <div class="flex flex-row w-100">
        <div class="w-40 pr2 f7 flex flex-column">
          <p class="ma0">created by: ${state.user.playlists.selected.submittedBy}</p>
          <p class="ma0">tags:</p>
          <p class="ma0">comments:</p>
          <p class="ma0">images:</p>
        </div>
        <div class="w-60 pl2 f7">
          ${state.user.playlists.selected.description}
        </div>
      </div>
      </div>

      <!-- Sections & Resources --> 
      ${makeSections(state, emit)}

      <!-- Add Modal button --> 
      <div onclick=${toggleAddModal} class="pointer grow z-max absolute bottom-1 right-1 bw2 h3 w3 tc br-100 ba b--mid-gray shadow-5 bg-washed-green flex flex-column justify-center align-center"> <p>+</p> </div>
      
    </section>
    
  `
}


function exportView(state, emit) {
  return html `
  <div> Export view! </div>
  `
}

function browseView(state, emit) {
  return html `
  <section class="w-100 h-auto flex flex-row pa2">
    <div id="paginator" class="w-100 pa2 tc"> back | 1, 2, 3, ... | next</div>
  </section>
  `
}



function makeSections(state, emit) {

  function setSelected(e) {
    e.preventDefault();
    let id = e.currentTarget.dataset.id;
    let db = e.currentTarget.dataset.db;
    emit("db:getSelectedFeature", id, db);
  }


  if (state.user.playlists.selected.sections !== undefined) {
    return html `
      <section class="w-100 h-auto mt4">
      ${ 
        state.user.playlists.selected.sections.map( (section, sectionIndex) => {
          return html`
            <section class="w-100 ba bw1 mt2" data-id=${section._id} data-db="sections">
              <!-- SECTION HEADER -->
              <section class="w-100 pa2 bg-near-black white flex flex-column" 
              data-id=${section._id} data-db="sections" 
              onclick=${setSelected}>
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
                ${makeResources(section, state, emit)}
              </section>
            </section>
          `
        })
      }
    </section>
    `
  } else {
    return html `
        <div>nothing yet</div>
      `
  }
}


const toggleResourceDetails = function (e) {
  this.parentNode.querySelector('.hiddenDetails').classList.toggle('dn');
}

function makeResources(section, state, emit) {
  function setSelected(e) {
    e.preventDefault();
    let id = e.currentTarget.dataset.id;
    let db = e.currentTarget.dataset.db;
    emit("db:getSelectedFeature", id, db);
  }

  if (section.resources !== undefined) {
    return html `
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
                <tr class="stripe-dark" 
                data-id=${resource._id} 
                data-db="resources" 
                onclick=${ (e) => { if(!e.target.classList.contains("dropdown")) setSelected(e) }}>
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
  } else {
    return html `<div>no resources yet!</div>`
  }
}

module.exports = AppMain