var html = require('choo/html')
var SignupForm = require('../components/SignupForm')

module.exports = view

function view (state, emit) {
  return html`
    <body>
    <section class="pa4 flex flex-column bg-washed-blue w-40-l w-100-m w-100-ns justify-center">
    <div class="flex flex-column w-100 pa4 br2 bg-washed-red dark-pink">
      <p class="f4 lh-copy">Join the community and start building!</p>
      ${state.cache(SignupForm, "SignupForm", state, emit)}
    </div>
  </section>
    </body>
  `
}