var Component = require('choo/component')
var html = require('choo/html')
const Sortable = require('sortablejs');

class AppSidebarEditor extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id;
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {}

    this.submitInputEditor = this.submitInputEditor.bind(this);
    this.deleteSelected = this.deleteSelected.bind(this);
  }

  submitInputEditor(e){
    e.preventDefault();
    let form = document.querySelector("#inputEditor");
    let formData = new FormData(form);
    let id = this.state.selected.data._id;
    let db = this.state.selected.data.featureType;
    this.emit("db:updateSelectedFeature", id, db, formData);
  }

  deleteSelected(e){
    let id = this.state.selected.data._id;
    let db = this.state.selected.data.featureType;
    this.emit("db:deleteSelectedFeature", id, db);
    
  }

  createElement () {
    let selected = this.state.selected.data;

    return html`
      <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto flex-1 justify-between mh-440px">
      <div class="w-100 tc"><small class="f7">Edit Selected | <span class="pointer hover-bg-purple" onclick=${this.deleteSelected}>🗑 delete </delete> </small></div>
      <div class="w-100 pa2 overflow-y-scroll mb2">
        <form id="inputEditor" name="inputEditor" class="w-100 flex flex-column f7">
          <label class="">Title</label> <input type="text" name="title" value=${selected.title || "title"}/>
          <label class="">Description</label> <textarea form="inputEditor" name="description" class="h4">${ selected.description ||"description"}</textarea>
          <label class="">Tags</label> <input type="text" name="tags" value=${"tags"}/>
          <label class="">Collaborators</label><input type="text" name="collaborators" value=${"collaborators"}/>
          <label class="">URL</label> <input type="text" name="url" value=${selected.url || "url"}/>
        </form>
        <label class="mt2 f7"> Drag to Reorder 
        ${makeSortableList(selected, this.state, this.emit)}
        </label>
        ${showAddOptions(selected, this.state, this.emit)}
      </div>
      <button onclick=${this.submitInputEditor} class="pa2 ba bw2 b--near-black white bg-near-black hover-washed-blue">SAVE</button>
    </section>
    `
    
  }

  update () {
    return true
  }
}


// TODO: add in toggle visibility - need to add into DB prop for show or hide 
function makeSortableList(selected, state, emit){
  // create a new element 
  var newUl = document.createElement("ol"); 
  // and give it some content 
  // var newContent = document.createTextNode("Hi there and greetings!"); 
  console.log(selected);
  if(selected.sections){
    selected.sections.forEach( section => {
      let newLi = document.createElement("li");
      newLi.className += " pointer "
      let newContent = document.createTextNode(`${section.title}`)
      newLi.dataset.featureid = section._id;
      newLi.dataset.parentid = selected._id;
      newLi.dataset.parentdb = selected.featureType;
      newLi.appendChild(newContent);
      newUl.appendChild(newLi);  
    })

    let sortable = Sortable.create(newUl, {
          onEnd: function(evt){
            console.log("sortable", evt.newIndex);
            // console.log("🌮🌮🌮",evt);
            emit("db:selectedFeature:reorder", evt.clone.dataset.parentid, evt.clone.dataset.parentdb,  evt.clone.dataset.featureid, evt.newIndex)
          }
        });

    return sortable.el;
  } else if (selected.resources){
    selected.resources.forEach( resource => {
      let newLi = document.createElement("li");
      newLi.className += " pointer ";
      let newContent = document.createTextNode(resource.title)
      newLi.dataset.featureid = resource._id;
      newLi.dataset.parentid = selected._id;
      newLi.dataset.parentdb = selected.featureType;
      newLi.appendChild( newContent);
      newUl.appendChild(newLi);  
    })
    let sortable = Sortable.create(newUl, {
          onEnd: function(evt){
            console.log(evt.newIndex);
            console.log("🌮🌮🌮",evt);
            emit("db:selectedFeature:reorder", evt.clone.dataset.parentid, evt.clone.dataset.parentdb,  evt.clone.dataset.featureid, evt.newIndex)
          }
        });

    return sortable.el;
  }
  
}


function showAddOptions(selected, state, emit){
  function addResourceToSection(e){
    emit("user:sections:addResource", selected._id, selected.featureType)
  }
  function addSectionToPlaylist(e){
    emit("user:playlists:addSection", selected._id, selected.featureType)
  }

  if(selected.featureType == "playlists"){
    console.log("this is a playlist")
    return html`
      <button class="ba bw0 f7" onclick=${addSectionToPlaylist}>⊕ Add Section to Playlist</button>
    `
  } else if ( selected.featureType == "sections"){
    console.log("this is a section")
    return html`
      <button class="ba bw0 f7" onclick=${addResourceToSection}>⊕ Add Resource to Section</button>
    `
  } else if (selected.featureType == "resources"){
    console.log("this is a resource")
  }
}

module.exports = AppSidebarEditor

