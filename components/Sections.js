const html = require("choo/html");
const Section = require("./Section");

module.exports = function(sections, state, emit){

    return html `
      <section class="w-100 h-auto mt4">
      ${ 
        sections.map( (section, sectionIndex) => {
          return Section(section, sectionIndex, state, emit)
        })
      }
    </section>
    `
}