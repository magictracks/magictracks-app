var Component = require('choo/component');
var html = require('choo/html');

class EditorMain extends Component {
  constructor(id, state, emit) {
    super(id);
    this.id = id;
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {};
  }

  createElement() {
    if (Object.keys(this.state.playlists.selected).length > 0) {
      return html`
        <div class="bt bb bw2 w-100 h-auto mb6">
          <!-- Meta Details -->
          <section class="flex flex-row w-100 h5 mt2">
            <section class="h5 w5">
              <div class="bg-near-white w-100 h-100"></div>
            </section>
            <section class="flex flex-column justify-end pl4 pr2 w-100">
              <p class="ma0 f7">Playlist</p>
              <h1 class="ma0 f4">${state.playlists.selected.title}</h1>
              <p class="ma0 f7">
                Created by ${state.playlists.selected.submittedBy || 'username'}
              </p>
              <p class="ma0 f7">
                Description:
                ${state.playlists.selected.description || 'description'}
              </p>
              <p class="ma0 f7">Tags: ${'tags'}</p>
              <p class="ma0 f7">⚙️ Edit Details</p>
              <div>
                <p>Export 🚀</p>
                <ul class="list pl0">
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </div>
            </section>
          </section>
          <!-- TODO: Playlist Tools for filtering sections -->

          <!-- Sections -->
          <section class="flex flex-column w-100 mt4">
            ${
              this.state.playlists.selected.sections.map(
                section =>
                  html`
                    <section class="flex flex-row w-100 mt2 mb4 pb4">
                      <section class="h5 w5 ba bw1 pa2">
                        <p class="ma0 f7">section</p>
                        <p class="ma0 f6 b">${section.title}</p>
                        <p class="ma0 f7">
                          Created by ${section.submittedBy || 'username'}
                        </p>
                        <p class="ma0 f7">
                          Description: ${section.description || 'description'}
                        </p>
                        <p class="ma0 f7">⚙️ Edit Details</p>
                      </section>
                      <section class="flex flex-column justify-end pl4 w-100">
                        <div class="overflow-auto">
                          <table class="f6 w-100 mw8 center" cellspacing="0">
                            <thead>
                              <tr>
                                <th
                                  class="fw6 bb b--black-20 tl pb2 pr3 bg-white"
                                >
                                  Track
                                </th>
                                <th
                                  class="fw6 bb b--black-20 tl pb2 pr3 bg-white"
                                >
                                  Title
                                </th>
                                <th
                                  class="fw6 bb b--black-20 tl pb2 pr3 bg-white"
                                >
                                  Details
                                </th>
                                <th
                                  class="fw6 bb b--black-20 tl pb2 pr3 bg-white"
                                >
                                  Edit
                                </th>
                              </tr>
                            </thead>
                            <tbody class="lh-copy">
                              ${
                                section.resources.map(
                                  (resource, idx) =>
                                    html`
                                      <tr>
                                        <td class="pv2 pr3 bb b--black-20">
                                          ${idx}
                                        </td>
                                        <td class="pv2 pr3 bb b--black-20">
                                          <a href="${resource.url}"
                                            >${resource.title}</a
                                          >
                                        </td>
                                        <td class="pv2 pr3 bb b--black-20">
                                          ${
                                            resource.description ||
                                              'dropdown to details'
                                          }
                                        </td>
                                        <td class="pv2 pr3 bb b--black-20">
                                          ⚙️
                                        </td>
                                      </tr>
                                    `
                                )
                              }
                            </tbody>
                          </table>
                        </div>
                      </section>
                    </section>
                  `
              )
            }
          </section>
        </div>
      `;
    } else {
      return html`
        <div class="bt bb bw2 w-100 h-auto mb6">hello!</div>
      `;
    }
  }

  update() {
    return true;
  }
}

module.exports = EditorMain;
