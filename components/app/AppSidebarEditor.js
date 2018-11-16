var Component = require('choo/component')
var html = require('choo/html')

class AppSidebarEditor extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id;
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {}

    this.submitInputEditor = this.submitInputEditor.bind(this);
  }

  submitInputEditor(e){
    e.preventDefault();
    let form = document.querySelector("#inputEditor");
    let formData = new FormData(form);
    emit("db:patch", this.state.selectedItem._id, formData);
  }

  createElement () {
    return html`
      <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto flex-1 justify-between">
      <div class="w-100 tc"><small class="f7">Edit Selected | <span onclick=${(e) => this.emit("db:delete")}>🗑 delete </delete> </small></div>
      <div class="w-100 pa2 overflow-y-scroll">
        <form id="inputEditor" name="inputEditor" class="w-100 flex flex-column f7">
          <label class="">Title</label> <input type="text" name="title" value=${this.state.selectedItem.title}/>
          <label class="">Description</label> <textarea form="inputEditor" name="description" class="h4">${this.state.selectedItem.description}</textarea>
          <label class="">Tags</label> <input type="text" name="tags" />
          <label class="">Collaborators</label><input type="text" name="collaborators" />
          <label class="">URL</label> <input type="text" name="url" value=${this.state.selectedItem.url}/>
        </form>
      </div>
      <button onclick=${this.submitInputEditor} class="pa2 ba bw2 b--near-black white bg-near-black hover-washed-blue">SAVE</button>
    </section>
    `
  }

  update () {
    return true
  }
}

module.exports = AppSidebarEditor