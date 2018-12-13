
const html = require('choo/html');
const css = require('sheetify');

const Playlist = require('../Playlist');
const Resource = require('../Resource');
const Section = require('../Section');

module.exports = function(state, emit){

    let id = state.params.id;
    let db = state.params.db;
    let selectedFeature = state.edit[db].filter(item => item._id == id)[0];

    function RenderSelectedItem(item) {
  
        if (item.featureType == "playlists") {
          return Playlist(item, state, emit)
        } else if (item.featureType == "sections") {
          return Section(item, 0, state, emit)
        } else if (item.featureType == "resources") {
          return html `
            <div class="flex flex-column w-100 pa2 ba bw2 b--pink">
              <h2 class="ma0"><a class="link black hover-bg-purple hover-white" href="${item.url}">${item.title}</a></h2>
              <p class="ma0 f6 mt2">${item.description}</p>
              <p class="ma0 f6 mt2">🦄 ${item.submittedBy}</p>
              <p class="ma0 mt2"><a class="link black f7" href="${item.url}" target="_blank">🔗 ${item.url}</a></p>
              <p class="ma0 mt2">${item.tags}</p>
            </div>
            `
        } else {
          return html`
            <div>not implemented yet!</div>
            `
        }
    
      }
    
    return html`
        <section class="w-100 flex flex-column mt4">
            ${RenderSelectedItem(selectedFeature)}
        </section>
    `
}