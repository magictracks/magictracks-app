const html = require('choo/html');
const css = require('sheetify');


module.exports = function(item, state, emit) {
  
    css `
      .shadow-strong{
        box-shadow: 2px 2px black;
      }

      .textOverflow{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 75ch;
      }
      `

    function changeRoute(e) {
      emit("pushState", `/edit/${item.featureType}/${item._id}`)
      emit("edit:select");
    }

    function checkDb() {
      switch (item.featureType) {
        case "playlists":
          return " bg-washed-red "
          break;
        case "sections":
          return " bg-washed-yellow ";
          break;
        case "resources":
          return " bg-washed-blue "
        default:
          return " bg-near-white "
      }
    }

    return html`
        <div class="overflow-auto w-100 w-50-m w-33-l h5 ba b--near-white bw1 pa2 f7 grow ${checkDb()}" data-id="${item._id}"
          data-db="${item.featureType}" onclick=${changeRoute}>
          <p class="ma0 f4 b">${item.title}</p>
          <p class="ma0 f7 mt2 textOverflow">${item.description}</p>
          <p class="ma0 f7 mt2">By: ${item.submittedBy}</p>
        </div>
    `
  }