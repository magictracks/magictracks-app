const html = require('choo/html');
const css = require('sheetify');
const Choices = require('choices.js');
css('./../../node_modules/choices.js/public/assets/styles/choices.min.css');

module.exports = function (collaborators, state, emit) {
        let p = document.createElement("div");
        let newInput = document.createElement("INPUT");
        p.appendChild(newInput);
        console.log("----------", newInput);
        newInput.setAttribute("type", "text");

        newInput.id = "collaboratorSelector"
        collaborators = collaborators.map((collaborator) => {
            return {
                "value": collaborator._id,
                "label": collaborator.username,
                "id": collaborator._id
            }
        })
        let textRemove = new Choices(newInput, {
            delimiter: ',',
            editItems: true,
            searchEnabled: true,
            items: collaborators,
            addItems: true,
            removeItemButton: true
        });

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