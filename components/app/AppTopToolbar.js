var Component = require('choo/component')
var html = require('choo/html')

class AppTopToolbar extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id;
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {}

    this.toggleAddModal = this.toggleAddModal.bind(this);
  }

  toggleAddModal(e){
    e.preventDefault();
    this.emit("db:AddModal:toggle");
  }

  createElement () {
    return html`
    <section class="main flex flex-row ba bw2 items-end w-100 pa2 h4">
    <div onclick=${this.toggleAddModal} class="flex flex-column bg-near-white h3 w3 justify-center items-center ba bw2">
      <div>+</div>
      <div>ADD</div>
    </div>
    <div class="flex flex-column w-100 ml2-ns">
      <label class="ma0 pa0 f7">Recently Added</label>
      <div class="w-100 bg-near-white ba bw2 h3"></div>
    </div>
  </section>
    `
  }

  update () {
    return true
  }
}

module.exports = AppTopToolbar