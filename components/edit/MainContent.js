const html = require('choo/html');
const css = require('sheetify');

const MainBrowseItem = require('./MainBrowseItem');
const MainBrowseItems = require('./MainBrowseItems');
const MainFilterMenu = require('./MainFilterMenu');
const MainEditView = require('./MainEditView');

module.exports = function(id, state, emit) {
  
    function RenderItems() {
  
      if (state.params && Object.keys(state.params).length > 0 && state.edit.selected.hasOwnProperty("_id")) {

        if (state.params.hasOwnProperty('id')) {
            // if the params have an ID, get the specific item 
            return MainEditView(state, emit);
        } else {
            // otherwise, show which items can be edited
            // Show the cards if we're looking for items to edit
           return MainBrowseItems(state, emit);
        }
        
      } else {
          // default to playlists as the edit 
        return html`
          <section class="w-100 flex flex-row flex-wrap mt4">
            ${state.edit.playlists.map( playlist => {
            return MainBrowseItem(playlist, state, emit)
            })}
          </section>
          `
      }
  
    }
  
  
    return html`
        <section class="w-100 h-auto overflow-y-scroll flex flex-column pl4 pr4 pt2 pb4 mt2">
          <!-- FILTER MENU -->
          ${MainFilterMenu("MainFilterMenu", state, emit)}
    
          <!-- SELECTED ITEMS TO BROWSE OR EDIT -->
          ${RenderItems()}

        </section>
        `
  } // END MainContent()