const Component = require('choo/component');
const html = require('choo/html');

const AppSidebarHeader = require('./AppSidebarHeader');
const AppSidebarEditor = require('./AppSidebarEditor');
const AppSidebarNav = require('./AppSidebarNav');

class AppSidebar extends Component {
  constructor (id, state, emit) {
    super(id);
    this.id = id;
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {}
  }


  createElement () {
    return html`
    <section id="AppSidebar" class="flex flex-column h-100 w5-ns w-100 flex-1">
      <!-- HEADER -->
      ${this.state.cache(AppSidebarHeader, "AppSidebarHeader", this.state, this.emit).render()}

      <!-- EDITOR -->
      ${this.state.cache(AppSidebarEditor, "AppSidebarEditor", this.state, this.emit).render()}
      
      <!-- NAV -->
      ${this.state.cache(AppSidebarNav, "AppSidebarNav", this.state, this.emit).render()}

    </section>
    `
  }

  update () {
    return true
  }
}

module.exports = AppSidebar

