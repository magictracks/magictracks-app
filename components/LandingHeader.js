var Component = require('choo/component')
var html = require('choo/html')

module.exports = function(id, state, emit){

  const triggerLogin = function(e){
    e.preventDefault();
    console.log("clicked");
    emit("db:users:login")
  }

  return html`
  <header class="flex h-60px flex-column justify-center pa2">
  <nav class="w-100 h-100 ma0 flex flex-row justify-between">
    <ul class="flex flex-row list pl0 justify-start h-100 ma0 items-center">
      <li class="mr4 f4 b"> <a class="link black" href="/">✨ Magic Tracks ✨</a></li>  
      <li> <a class="link black" href="/browse">Browse</a> </li>
    </ul>
    <ul class="flex flex-row list pl0 justify-end ma0 h-100 items-center">
      <li class="pa2" onclick=${triggerLogin}>Log In</li>
    </ul>
  </nav>
</header>
  `
}