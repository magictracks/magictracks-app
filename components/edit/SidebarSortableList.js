
const html = require('choo/html');
const css = require('sheetify');
const Sortable = require('sortablejs');

module.exports = SidebarSortableList
// TODO: add in toggle visibility - need to add into DB prop for show or hide 
function SidebarSortableList(selected, state, emit) {
    // create a new element 
    var newUl = document.createElement("ol");
    // and give it some content 
    // var newContent = document.createTextNode("Hi there and greetings!"); 
    if (selected.sections) {
        selected.sections.forEach(section => {
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
            onEnd: function (evt) {
                console.log("sortable", evt.newIndex);
                // console.log("🌮🌮🌮",evt);
                emit("edit:selectedFeature:reorder", evt.clone.dataset.parentid, evt.clone.dataset.parentdb, evt.clone.dataset.featureid, evt.newIndex)
            }
        });

        return sortable.el;
    } else if (selected.resources) {
        selected.resources.forEach(resource => {

            let newLi = document.createElement("li");
            newLi.className += " pointer ";
            let newContent = document.createTextNode(resource.title)
            newLi.dataset.featureid = resource._id;
            newLi.dataset.parentid = selected._id;
            newLi.dataset.parentdb = selected.featureType;
            newLi.appendChild(newContent);
            newUl.appendChild(newLi);
        })
        let sortable = Sortable.create(newUl, {
            onEnd: function (evt) {
                console.log(evt.newIndex);
                console.log("🌮🌮🌮", evt);
                emit("edit:selectedFeature:reorder", evt.clone.dataset.parentid, evt.clone.dataset.parentdb, evt.clone.dataset.featureid, evt.newIndex)
            }
        });

        return sortable.el;
    }

}