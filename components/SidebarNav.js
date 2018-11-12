var Component = require('choo/component');
var html = require('choo/html');

class SidebarNav extends Component {
  constructor(id, state, emit) {
    super(id);
    this.id = id;
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {};
  }

  createElement() {
    return html`
      <section class="w-20 flex flex-column h-auto ma0 bt bb bw2">
        <!-- Browse -->
        <section class="mt2">
          <!-- <h6 class="f6 ma0">BROWSE</h6> -->
          <ul class="list pl0">
            <li class="f7">Browse</li>
          </ul>
        </section>
        <!-- YOUR LIBRARY -->
        <section class="ma0">
          <h6 class="f6 ma0">YOUR LIBRARY</h6>
          <ul class="list pl0">
            <li class="f7">Starred</li>
            <li class="f7">Resources</li>
            <li class="f7">Sections</li>
          </ul>
        </section>
        <!-- YOUR COLLABORATIONS -->
        <section>
          <h6 class="f6 ma0">COLLABORATIONS</h6>
          <ul class="list pl0">
            <li class="f7">No Collaborations yet!</li>
          </ul>
        </section>
        <!-- YOUR PLAYLISTS / TODO: if no playlists show "no playlists" -->
        <section>
          <h6 class="f6 ma0">PLAYLISTS <span>⊕</span></h6>
          <ul class="list pl0">
            ${
              this.state.playlists.all.map(playlist => {
                return html`
                  <li
                    class="f7 truncate"
                    data-id="${playlist._id}"
                    onclick="${switchSelected}"
                  >
                    ${playlist.title}
                  </li>
                `;
              })
            }
          </ul>
        </section>
      </section>
    `;
  }

  update() {
    return true;
  }
}

module.exports = SidebarNav;
