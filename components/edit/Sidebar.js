const html = require('choo/html');
const css = require('sheetify');
const SidebarHeader = require('../../components/SidebarHeader');
const SidebarEditor = require('./SidebarEditor');

module.exports = function(id, state, emit) {
    return html `
      <section class="flex flex-column h-100 w5-ns w-100 flex-1">
        <!-- HEADER -->
        ${SidebarHeader("SidebarHeader", state, emit)}
  
        <!-- SIDEBAR EDIT AREA --> 
        ${SidebarEditor("SidebarEdit", state, emit)}
      </section>
    `
}