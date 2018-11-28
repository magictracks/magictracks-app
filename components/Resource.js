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

    return html`
        <tr class="stripe-dark" data-id=${resource._id} data-db="resources" onclick=${ (e)=> {
            if(!e.target.classList.contains("dropdown")) setSelected(e) }}>
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