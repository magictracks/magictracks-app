var html = require('choo/html')
var LoginForm = require('../components/LoginForm')

module.exports = view

function view (state, emit) {
  return html`
    <body>
    <h2>login</h2>
    ${state.cache(LoginForm, "LoginForm", state, emit)}
    </body>
  `
}