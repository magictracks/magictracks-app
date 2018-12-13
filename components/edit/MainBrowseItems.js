const html = require('choo/html');
const css = require('sheetify');
const MainBrowseItem = require('./MainBrowseItem');

module.exports = function(state, emit){

    let currentDbSelection;

    function addToCurrentDb(e){
        if(state.params.db == "playlists"){
            emit("edit:addPlaylist");
        } else if(state.params.db == "sections"){
            console.log("TODO: addSection");
            // return emit("edit:addSection");
        } else if(state.params.db == "resources"){
            console.log("TODO: addResources");
            // return emit("edit:addSection");
        }
    }
    

    if (state.params.db == "playlists") {
        currentDbSelection = state.edit["playlists"];
    } else if (state.params.db == "sections") {
        currentDbSelection = state.edit["sections"];
    } else if (state.params.db == "resources") {
        currentDbSelection = state.edit["resources"];
    }

    

    return html`
        <section class="w-100 flex flex-row flex-wrap mt4">
            <div class="overflow-auto w-100 w-50-m w-33-l h5 ba b--near-white bw1 pa2 grow" data-db=${state.params.db} onclick=${addToCurrentDb}>
                <div class="w-100 h-100 flex flex-column justify-center items-center outline"><p class="tc">+<br>ADD</p></div>
            </div>

            ${currentDbSelection.map( item => {
                return MainBrowseItem(item, state, emit)
            })}
        </section>
    `
}