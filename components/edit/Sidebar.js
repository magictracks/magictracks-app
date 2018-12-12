const html = require('choo/html');
const css = require('sheetify');
const Sortable = require('sortablejs');
const Choices = require('choices.js');
const SidebarHeader = require('../../components/SidebarHeader');

css('./../../node_modules/choices.js/public/assets/styles/choices.min.css');


module.exports = Sidebar;

function Sidebar(id, state, emit){
    return html`
      <section class="flex flex-column h-100 w5-ns w-100 flex-1">
        <!-- HEADER -->
        ${SidebarHeader("SidebarHeader", state, emit)}
  
        <!-- SIDEBAR EDIT AREA --> 
        ${SidebarEdit("SidebarEdit", state, emit)}
  
        <!-- USER NAV -->
        
      </section>
    `
    //${SidebarNav("SidebarNav", state, emit)}
  }
  
  function SidebarEdit(id, state, emit){
      
      let selected = state.edit.selected;
  
      function submitInputEditor(e){
        e.preventDefault();
        let form = document.querySelector("#inputEditor");
        let formData = new FormData(form);
        let id = state.edit.selected._id;
        let db = state.edit.selected.featureType;
        emit("edit:updateSelectedFeature", id, db, formData);
      }
    
      function deleteSelected(e){
        let id = state.edit.selected._id;
        let db = state.edit.selected.featureType;
        emit("edit:deleteSelectedFeature", id, db);
      }
  
      // TODO: add in toggle visibility - need to add into DB prop for show or hide 
      function makeSortableList(selected, state, emit){
        // create a new element 
        var newUl = document.createElement("ol"); 
        // and give it some content 
        // var newContent = document.createTextNode("Hi there and greetings!"); 
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
                  emit("edit:selectedFeature:reorder", evt.clone.dataset.parentid, evt.clone.dataset.parentdb,  evt.clone.dataset.featureid, evt.newIndex)
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
                  emit("edit:selectedFeature:reorder", evt.clone.dataset.parentid, evt.clone.dataset.parentdb,  evt.clone.dataset.featureid, evt.newIndex)
                }
              });
  
          return sortable.el;
        }
        
      }
  
  
    function showAddOptions(selected, state, emit){
      function addResourceToSection(e){
        emit("edit:sections:addResource", selected._id, selected.featureType)
      }
      function addSectionToPlaylist(e){
        emit("edit:playlists:addSection", selected._id, selected.featureType)
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
  
    function makeTagsChoices(tags, state, emit){
      let p = document.createElement("div");
      let newInput = document.createElement("INPUT"); 
      p.appendChild(newInput);
      console.log("----------", newInput);
      newInput.setAttribute("type", "text");
      // newInput.setAttribute("value", "hello,world");
      
      newInput.id = "tagsSelector"
      console.log(tags)
      tags = tags.map( (tag) => {return {"value":tag._id,"label":tag.tag,"id":tag._id} }) 
      // let tags = [{value:"hello", label:"hello", id:1, selected:true},{value:"world", label:"world",id:2, selected: true}, {value:"rock", label:"rock",id:3,selected: false}];
      let textRemove = new Choices(newInput, {
        delimiter: ',',
        editItems: true,
        searchEnabled: true,
        items:tags,
        addItems:true,
        removeItemButton: true
      });
  
      // newInput.parentNode.parentNode.classList.add("h3");
      newInput.parentNode.classList.add("h3", "overflow-y-scroll");
      newInput.parentNode.style = "max-height:60px;"
  
      newInput.addEventListener('addItem', function(event) {
        // do something creative here...
        console.log("adding tag")
        console.log(event.detail);
        console.log(newInput.value);
      }, false);
  
      newInput.addEventListener('removeItem', function(event) {
        // do something creative here...
        console.log("removing tag")
        console.log(event.detail);
        console.log(newInput.value);
      }, false);
  
      return p;
  
    }
  
    function makeCollaboratorChoices(collaborators, state, emit){
      let p = document.createElement("div");
      let newInput = document.createElement("INPUT"); 
      p.appendChild(newInput);
      console.log("----------", newInput);
      newInput.setAttribute("type", "text");
      
      newInput.id = "collaboratorSelector"
      collaborators = collaborators.map( (collaborator) => {return {"value":collaborator._id,"label":collaborator.username,"id":collaborator._id} }) 
      let textRemove = new Choices(newInput, {
        delimiter: ',',
        editItems: true,
        searchEnabled: true,
        items:collaborators,
        addItems:true,
        removeItemButton: true
      });
  
      newInput.parentNode.classList.add("h3", "overflow-y-scroll");
      newInput.parentNode.style = "max-height:60px;"
  
      newInput.addEventListener('addItem', function(event) {
        // do something creative here...
        console.log("adding tag")
        console.log(event.detail);
        console.log(newInput.value);
      }, false);
  
      newInput.addEventListener('removeItem', function(event) {
        // do something creative here...
        console.log("removing tag")
        console.log(event.detail);
        console.log(newInput.value);
      }, false);
  
      return p;
      
    }
  
  
  
      return html`
      <section class="bw2 flex flex-column ba w5-ns w-100 mt2 h-auto flex-1 justify-between">
        <div class="w-100 pa2 overflow-y-scroll mb2" style="max-height: 532px;">
          <div class="w-100 tc"><small class="f7">Edit Selected | <span class="pointer hover-bg-purple" onclick=${deleteSelected}>🗑 delete </delete> </small></div>
          <div class="">
            <form id="inputEditor" name="inputEditor" class="w-100 flex flex-column f7">
              <label class="">URL</label> <input type="text" name="url" value=${selected.url || "url"}/>
              <label class="">Title</label> <input class="pa2 ba bw1" type="text" name="title" value=${selected.title || "title"}/>
              <label class="">Description</label> <textarea form="inputEditor" name="description" class="h4 pa2 ba bw1">${ selected.description ||"description"}</textarea>
              <label class="">Add Tags</label> 
              ${makeTagsChoices(selected.tags, state, emit)}
              <label class="">Add Collaborators</label>
              ${makeCollaboratorChoices(selected.collaborators, state, emit)}
            </form>
            <label class="mt2 f7"> Drag to Reorder 
            ${makeSortableList(selected, state, emit)}
            </label>
            ${showAddOptions(selected, state, emit)}
          </div>
        </div>
        <button onclick=${submitInputEditor} class="pa2 ba bw2 b--near-black white bg-near-black hover-washed-blue">SAVE</button>
      </section>
      `
  
  }
  