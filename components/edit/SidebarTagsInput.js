const html = require('choo/html');
const css = require('sheetify');
const Choices = require('choices.js');
css('./../../node_modules/choices.js/public/assets/styles/choices.min.css');


module.exports = function(tags, state, emit) {
    let p = document.createElement("div");
    let newInput = document.createElement("INPUT");
    p.appendChild(newInput);
    console.log("----------", newInput);
    newInput.setAttribute("type", "text");
    // newInput.setAttribute("value", "hello,world");

    newInput.id = "tagsSelector"
    console.log(tags)
    if(tags){
        tags = tags.map((tag) => {
            return {
                "value": tag._id,
                "label": tag.tag,
                "id": tag._id
            }
        })
    } else{
        tags = []
    }
    
    // let tags = [{value:"hello", label:"hello", id:1, selected:true},{value:"world", label:"world",id:2, selected: true}, {value:"rock", label:"rock",id:3,selected: false}];
    let textRemove = new Choices(newInput, {
        delimiter: ',',
        editItems: true,
        searchEnabled: true,
        items: tags,
        addItems: true,
        removeItemButton: true
    });

    // newInput.parentNode.parentNode.classList.add("h3");
    newInput.parentNode.classList.add("h3", "overflow-y-scroll");
    newInput.parentNode.style = "max-height:60px;"

    newInput.addEventListener('addItem', function (event) {
        // do something creative here...
        console.log("adding tag")
        console.log(event.detail);
        console.log(newInput.value);
    }, false);

    newInput.addEventListener('removeItem', function (event) {
        // do something creative here...
        console.log("removing tag")
        console.log(event.detail);
        console.log(newInput.value);
    }, false);

    return p;

}