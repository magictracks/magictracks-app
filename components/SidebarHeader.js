var html = require('choo/html')


function toggleDropdown(e){
  e.target.nextElementSibling.classList.toggle('dn');
}

module.exports = function(id, state, emit){
  return html`
  <section class="flex flex-column ba bw2 w5-ns w-100 items-center justify-center pa2 h4">
  <div class="ma0">
    <a class="link" href="/">
    <img class="mw4" src="/assets/magic-tracks-logo.png" />
    </a>
  </div>
  <div>
    <p class="ma0 f7 w-100">Hi @${state.user.username}! | <span class="cursor hover-bg-purple hover-white" onclick=${toggleDropdown}>Account ▾</span>  
    <ul class="list ma0 pa2 ba bw1 bg-pink absolute mt1 ml4 w4 dn tr">
      <li class="cursor hover-bg-purple hover-white" onclick=${(e) => {emit("db:users:logout")}}>logout</li>
    </ul>
    </p>
  </div>
</section>
  `
}
