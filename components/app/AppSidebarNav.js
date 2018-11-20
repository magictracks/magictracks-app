var Component = require('choo/component')
var html = require('choo/html')

class AppSidebarNav extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id;
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {}

    this.submitInputEditor = this.submitInputEditor.bind(this);
    this.switchSelected = this.switchSelected.bind(this);
  }

  switchSelected(e) {
    console.log(e.target.dataset.id);
    this.emit('db:feature:select', e.target.dataset.id, e.target.dataset.db)
  };

  submitInputEditor(e) {
    e.preventDefault();
    let form = document.querySelector("#inputEditor");
    let formData = new FormData(form);
    this.emit("db:patch", state.selectedItem._id, formData);
  }

  createElement () {
    return html`
    <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto mh-400px overflow-y-scroll f7">
    <div class="w-100 pa2">
      <p>YOUR LIBRARY</p>
      <ul class="list pl1">
        <li>Starred Playlists</li>
        <li>Your Resources</li>
      </ul>

      <p>COLLABORATIONS</p>
      <ul class="list pl1">
        <li>None yet!</li>
      </ul>

      <p>PLAYLISTS <span class="hover-bg-purple cursor" onclick=${(e) => { this.emit("db:playlists:addJSON")}}>⊕</span> </p>
      <ul class="list pl1">
        ${
          this.state.user.db.playlists.all.map( (playlist) => {
          return html`
            <li class="hover-bg-purple hover-white black" onclick=${this.switchSelected} data-id=${playlist._id} data-db="${playlist.featureType}">${playlist.title}</li>
            `
          })
        }
      </ul>
    </div>
  </section>
    `
  }

  update () {
    return true
  }
}

module.exports = AppSidebarNav