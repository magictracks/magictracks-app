var Component = require('choo/component')
var html = require('choo/html')

class AddModal extends Component {
  constructor(id, state, emit) {
    super(id)
    this.id = id;
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      currentStep: 0,
    }
    this.isToggled = this.isToggled.bind(this);
    this.toggleModal = this.toggleModal.bind(this);

    this.addURL = this.addURL.bind(this);
    this.editDetails = this.editDetails.bind(this);
    this.organize = this.organize.bind(this);

    this.showCurrentStep = this.showCurrentStep.bind(this);

    this.stepForward = this.stepForward.bind(this);
    this.stepBackward = this.stepBackward.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.markSelected = this.markSelected.bind(this);

    this.quickSave = this.quickSave.bind(this);
  }


  isToggled() {
    if (this.state.addModal.toggled == false) {
      return 'dn'
    } else {
      return ''
    }
  }

  toggleModal(e) {
    e.preventDefault();
    this.emit("db:AddModal:toggle");
    this.local.currentStep = 0;
    this.emit("db:AddModal:currentStep", this.local.currentStep);
  }

  stepForward(e) {
    e.preventDefault();

    if (this.local.currentStep >= 2) {
      this.local.currentStep = 2;
    } else {
      this.local.currentStep++;
    }
    this.emit("db:AddModal:currentStep", this.local.currentStep);
  }

  stepBackward(e) {
    e.preventDefault();

    if (this.local.currentStep <= 0) {
      this.local.currentStep = 0;
    } else {
      this.local.currentStep--;
    }
    this.emit("db:AddModal:currentStep", this.local.currentStep);
  }

  handleChange(e) {
    e.preventDefault();
    let form = new FormData(e.target.form);
    let selectedPlaylist = form.get("playlistSelect")
    if (selectedPlaylist !== "") {
      this.emit("db:AddModal:selectedPlaylist", selectedPlaylist)
    }
  }

  handleSectionChange(e) {
    e.preventDefault();
    let form = new FormData(e.target.form);
    let selectedSection = form.get("sectionSelect")
    if (selectedSection !== "") {
      this.emit("db:AddModal:selectedSection", selectedSection)
    }
  }

  quickSave(e) {
    e.preventDefault();
    let form = document.querySelector("#addModalEditor");
    let formData = new FormData(form);
    let resourceData = {
      url: formData.get("url")
    }
    this.emit("db:resources:create", resourceData);
    this.emit("db:AddModal:toggle");
  }




  addURL() {
    console.log("addUrl!")
    return html `
      <section class="flex flex-column flex-1 w-100 pa4">
        <!-- FORM Editing: Step 1 
        Add the URL of the resource
        -->
        <p class="f7">Step 1: Add the URL link to the resource you would like to add.</p>
        <fieldset class="ba bw2 b--purple">
          <legend class="pl2 pr2">Add URL</legend>
          <form id="addModalEditor" name="addModalEditor" class="w-100 flex flex-column f7">
            <input class="h3 w-100 f3 pl2 pr2" type="text" name="url" />
          </form>
        </fieldset>
      </section>
    `
  }

  editDetails() {
    console.log("edit details!")
    return html `
      <section class="flex flex-column flex-1 w-100 pa4">
        
        <!-- FORM Editing: Step 2 
    Add or update any details of the resource that have been auto generated
    -->
        <p class="f7">Step 2: Edit the details, if you'd like. Details will be auto-filled if/when possible. Specific details are always helpful!</p>
        <fieldset class="ba bw2 b--purple">
          <legend class="pl2 pr2">Organize</legend>
          <form id="addModalEditor" name="addModalEditor" class="w-100 flex flex-column f7">
            <label class="f7">Title
              <input class="h2 b--blue w-100 f5 pl2 pr2 ba bw1" type="text" name="title" placeholder="title" />
            </label>
            <label class="f7 mt2">Description
              <textarea class="h3 b--pink w-100 f5 pl2 pr2 ba bw1" type="text" name="url" placeholder="description"></textarea>
            </label>
            <label class="f7 mt2">Tags
              <input class="h2 b--yellow w-100 f5 pl2 pr2 ba bw1" type="text" name="url" placeholder="tags" />
            </label>
          </form>
        </fieldset>
      </section>
    `
  }

  showPlaylistSections() {
    if (Object.keys(this.state.addModal.selectedPlaylist).length > 0 && this.state.addModal.selectedPlaylist.sections.length > 0) {
      return html `
      <select class="w-100 pa2" onchange=${this.handleSectionChange} name="sectionsSelect">
        <option value=""></option>
        ${this.state.addModal.selectedPlaylist.sections.map( section => {
          return html`
          <option data-id="${section._id}" value="${section._id}" 
          selected=${this.markSelected(section, this.state.addModal.selectedSection)}>${section.title}</option>
          `
        })}
      </select>
      `
    } else {
      return html `<div>no sections</div>`
    }

  }

  markSelected(selected, _selectedObject) {
    if (Object.keys(_selectedObject).length > 0 && selected._id == _selectedObject._id) {
      return "selected"
    } else {
      return ""
    }
  }

  organize() {
    console.log("organize")
    return html `
    <section class="flex flex-column flex-1 w-100 pa4">
    <!-- FORM Editing: Step 3 
        Add it to any of the playlists or sections of interest
        -->
    <p class="f7">Step 3: Sort your resource into a playlist or section or just keep choo chooing along! You can find your unsorted resources in Your Library.</p>
    <fieldset class="ba bw2 b--purple">
      <legend class="pl2 pr2">Organize</legend>
      <form id="addModalEditor" name="addModalEditor" class="w-100 flex flex-column f7">
        <label class="f7">Add to Existing Playlist</label>
        <select class="w-100 pa2" onchange=${this.handleChange} name="playlistSelect">
          <option value=""></option>
          ${this.state.playlists.all.map(playlist => {
            return html`
              <option value="${playlist._id}" data-id=${playlist._id} data-db="playlists" 
              selected=${this.markSelected(playlist, this.state.addModal.selectedPlaylist)}>${playlist.title}</option>  
            `
          })}
        </select> 
        <!-- Select Sections -->
          ${this.showPlaylistSections()}
      </form>
      <div>create new playlist</div>
      <div>create new section</div>
    </fieldset>
  </section>
    `
  }

  showCurrentStep(step) {
    console.log(step);
    if (step == 0) {
      return this.addURL();
    } else if (step == 1) {
      return this.editDetails();
    } else if (step == 2) {
      return this.organize();
    } else {
      return this.addURL();
    }
  }



  createElement() {
    return html `
<div class="${this.isToggled()} w-100 h-100 pa2 fixed z-max">
  <div class="w-100 h-100 flex flex-column justify-center items-center ba bw2 bg-white">
    <div class="w-100 mw6 h-auto flex flex-column ba bw2 pa2">
      <!-- Close button -->
      <div class="flex flex-row justify-end">
        <button class="pa2 ba bw2" onclick=${this.toggleModal}>✕</button>
      </div>

      <!-- FORM Editing -->
      <div>
      ${this.showCurrentStep(this.local.currentStep)}
      </div>

      <!-- Bottom buttons -->
      <div class="flex flex-row justify-between">
        <div>
          <button class="pa2 ba bw2" onclick=${this.quickSave}>Quick Save</button>
        </div>
        <div>
          <button class="pa2 ba bw2" onclick=${this.stepBackward}>Back</button>
          <button class="pa2 ba bw2" onclick=${this.stepForward}>Next</button>
        </div>
      </div>
    </div>

  </div>
</div>
`
  }

  update() {
    return true
  }
}

module.exports = AddModal