// var Component = require('choo/component')
var html = require('choo/html')

module.exports = function (id, state, emit) {

  const onSubmit = function(e){
    e.preventDefault();
    console.log("submitted signup!")
    let formData = new FormData(e.target);
    emit("db:users:login", formData);
  }

  return html `
  <form class="w-100 mt1" onsubmit=${onSubmit}>
    <input class="w-100 pa2 br2 ba b--dark-pink dark-pink mt2" name="email" type="email" placeholder="youremail@email.com">
    <input class="w-100 mt1 pa2 br2 ba b--dark-pink dark-pink" name="password" type="password" placeholder="supersecretpassword">
    <input class="pa2 mt2 br2 ba b--dark-pink dark-pink" type="submit" value="Log In!">
  </form>  
  `
}

