const html = require("choo/html");
const Sections = require("./Sections");

module.exports = function(playlist, state, emit){

    return html`
    <section>
      <!-- HEADER AREA -->
      <div>
        <div>
          <h3 class="f3 mt0 mb2">${playlist.title}</h3>
        </div>
        <div class="flex flex-row w-100">
          <div class="w-40 pr2 f7 flex flex-column">
            <p class="ma0">created by: ${playlist.submittedBy}</p>
            <p class="ma0">tags:</p>
            <p class="ma0">comments:</p>
            <p class="ma0">images:</p>
          </div>
          <div class="w-60 pl2 f7">
            ${playlist.description}
          </div>
        </div>
      </div>
      <!-- SECTIONS & RESOURCES -->
        ${Sections(playlist.sections, state, emit)}
      </section>
    `
}