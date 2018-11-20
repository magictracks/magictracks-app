var Component = require('choo/component')
var html = require('choo/html')

class AppSidebarNav extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id;
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {}

    this.switchSelected = this.switchSelected.bind(this);
    this.addPlaylist = this.addPlaylist.bind(this);
  }

  switchSelected(e) {
    e.preventDefault();
    let id = e.currentTarget.dataset.id;
    let db = e.currentTarget.dataset.db;
    this.emit("user:playlists:select", id, db);
  };

  addPlaylist(e){
    e.preventDefault();
    console.log("addPlaylist");
    this.emit("user:playlists:addJSON");
  }

  createElement () {
    return html`
    <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto mh-400px overflow-y-scroll f7">
    <div class="w-100 pa2">

      <!--
      <p>YOUR LIBRARY</p>
      <ul class="list pl1">
        <li>Starred Playlists</li>
        <li>Your Resources</li>
      </ul>
      -->

      <!--
      <p>COLLABORATIONS</p>
      <ul class="list pl1">
        <li>None yet!</li>
      </ul>
      --> 

      <p>PLAYLISTS <span class="hover-bg-purple cursor fr" onclick=${this.addPlaylist}>⊕ Add</span> </p>
      <ul class="list pl1">
      ${
          this.state.user.playlists.all.map( (playlist) => {
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
