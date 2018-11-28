const html = require("choo/html");
const Resources = require('./Resources');

module.exports = function(section, sectionIndex, state, emit){

    function setSelected(e) {
        e.preventDefault();
        let id = e.currentTarget.dataset.id;
        let db = e.currentTarget.dataset.db;
        // emit("db:getSelectedFeature", id, db);
      }

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
            ${Resources(section.resources, state, emit)}
            </section>
        </section>
        `
}