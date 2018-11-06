var html = require('choo/html')

var TITLE = 'app - main'

module.exports = view


// const resources = feathersConnection.service('resources');
// console.log(resources)

function view (state, emit) {
  
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="code lh-copy">
      <main class="pa3 cf center">
        <h1>Hello</h1>
      </main>
    </body>
  `

}
