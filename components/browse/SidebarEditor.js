const html = require('choo/html');
const css = require('sheetify');
const SidebarHeader = require('../../components/SidebarHeader');

module.exports = function(id, state, emit) {

    let selected = state.browse.selected;

    // function submitInputEditor(e) {
    //     e.preventDefault();
    //     let form = document.querySelector("#inputEditor");
    //     let formData = new FormData(form);
    //     let id = state.browse.selected._id;
    //     let db = state.browse.selected.featureType;
    //     emit("browse:updateSelectedFeature", id, db, formData);
    // }


      return html `
    <section class="bw2 flex flex-column ba w-100 mt2 h-auto flex-1 justify-between">
        <div>
      <!-- SIDEBAR EDIT AREA -->
      <div class="tc w-100 tc f7 mt2">Selected:</div>
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
      </div>
      <button onclick=${() => console.log("hello")} class="pa2 ba f6 bw2 b--near-black white bg-near-black hover-washed-blue">COPY TO
        YOUR LIBRARY</button>
    </section>
    `

}
