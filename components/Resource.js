const html = require("choo/html");

module.exports = function(resource, resourceIndex, state, emit){
    
    function toggleResourceDetails(e) {
        this.parentNode.querySelector('.hiddenDetails').classList.toggle('dn');
    }

    function setSelected(e) {
        e.preventDefault();
        let id = e.currentTarget.dataset.id;
        let db = e.currentTarget.dataset.db;

        // emit("db:getSelectedFeature", id, db);
    }

    function editSelected(e){
        console.log(emit);
        if(!e.target.classList.contains("dropdown")){
            let id = e.currentTarget.dataset.id;
            let db = e.currentTarget.dataset.db;

            console.log(id, db);

            if(state.params.db == "playlists"){
                let sectionId = state.query.sections;
                console.log(sectionId)
                emit("pushState", `?sections=${sectionId}&${db}=${id}`)
            } else if (state.params.db == "sections"){
                emit("pushState", `?${db}=${id}`)   
            }

            emit("edit:selectAndEdit", id, db)
        } 
        
      }

    return html`
        <tr class="bg-animate hover-bg-washed-blue" data-id=${resource._id} data-db="resources" onclick=${ editSelected }>
            <td class="pa3">${resourceIndex}</td>
            <td class="pa3">☑️</td>
            <td class="pa3"><a class="link black hover-bg-purple hover-white" href="${resource.url}" target="_blank">${resource.title}</a></td>
            <td class="pa3">
                ${resource.description}
                <p class="hiddenDetails dn"> ${resource.url}</p>
            </td>
            <td class="pa3 dropdown" onclick=${toggleResourceDetails}>▾</td>
        </tr>
        `
}