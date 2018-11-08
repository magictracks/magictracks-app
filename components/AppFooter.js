var Component = require('choo/component')
var html = require('choo/html')

class AppFooter extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
  }

  createElement () {
    return html`
    <footer class="w-100 h3 flex flex-column bg-navy pa2 dark-pink">
    </footer>
    `
  }

  update () {
    return true
  }
}

module.exports = AppFooter