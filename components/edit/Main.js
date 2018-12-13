// var Component = require('choo/component')
const html = require('choo/html');
const css = require('sheetify');
const MainNav = require('../MainNav');
const MainContent = require('./MainContent');


module.exports = function(id, state, emit) {

  return html `
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

