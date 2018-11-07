var html = require('choo/html');

module.exports = view

function view (state, emit) {

  if(state.authenticated === true){
    return html`
    <body>
      <h1>WOW!</h1>
    </body>
  `
  } else {
    
    const redirect = function(){
      console.log(state);
      emit("db:users:redirect")
    }

    return html`
    <body>
      <h1>You're not authorized! </h1>
      <button onclick=${redirect}>go to login</button>
    </body>
    `
  }

}