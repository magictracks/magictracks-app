var Component = require('choo/component')
var html = require('choo/html')

class AppSidebarHeader extends Component {
  constructor (id, state, emit) {
    super(id);
    this.id = id;
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {}

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown(e){
    e.target.nextElementSibling.classList.toggle('dn');
  }

  createElement () {
    return html`
    <section class="flex flex-column ba bw2 w5-ns w-100 items-center justify-center pa2 h4">
    <div class="ma0">
      <img src="assets/magic-tracks-logo-nobg.png" id="logo" />
    </div>
    <div>
      <p class="ma0 f7">Magic Tracks ✨</p>
    </div>
    <div>
      <p class="ma0 f7 w-100">Hi @${this.state.user.username}! | <span class="cursor hover-bg-purple hover-white" onclick=${this.toggleDropdown}>Account ▾</span>  
      <ul class="list ma0 pa2 ba bw1 bg-pink absolute mt1 ml4 w4 dn tr">
        <li class="cursor hover-bg-purple hover-white" onclick=${(e) => { this.emit("db:users:logout")}}>logout</li>
      </ul>
      </p>
    </div>
  </section>
    `
  }

  update () {
    return true
  }
}

module.exports = AppSidebarHeader
