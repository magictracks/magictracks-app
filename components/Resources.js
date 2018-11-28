const html = require("choo/html");
const Resource = require("./Resource");

module.exports = function(resources, state, emit){
    return html `
        <div class="overflow-auto">
          <table class="f6 w-100 center" cellspacing="0">
            <thead>
              <tr class="stripe-dark">
                <th class="fw6 tl pa3 bg-white">#</th>
                <th class="fw6 tl pa3 bg-white">☑️</th>
                <th class="fw6 tl pa3 bg-white">Title</th>
                <th class="fw6 tl pa3 bg-white">Details</th>
                <th class="fw6 tl pa3 bg-white">▾</th>
              </tr>
            </thead>
            <tbody class="lh-copy">
              ${resources.map( (resource, resourceIndex) => {
                return Resource(resource,resourceIndex, state, emit)
              })}
            </tbody>
          </table>
        </div>
      `
}