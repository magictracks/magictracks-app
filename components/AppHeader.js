var Component = require('choo/component')
var html = require('choo/html')


class AppHeader extends Component {
  constructor(id, state, emit) {
    super(id)
    this.id = id;
    this.state = state;
    this.emit = emit;
    // this.local = state.components[id] = {}
    this.toggleUserSettings = this.toggleUserSettings.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggleUserSettings(e){
    e.preventDefault();
    document.querySelector("#userSettings").classList.toggle("dn");
  }

  logout(e){
    e.preventDefault();
    this.emit("db:users:logout");
  }


  createElement() {
    return html `
    <header class="flex h-60px flex-column justify-center pa2">
    
    <nav class="w-100 h-100 ma0 flex flex-row justify-between dark-pink">
      <ul class="w5 flex flex-row list pl0 justify-start h-100 ma0 items-center">
        <li><img id="logo" class="pr2" src="../assets/magic-tracks-logo-nobg.png" alt="magic tracks logo"></li>
        <li class="f6"> ✨ Magic Tracks ✨</li>
      </ul>
      <ul class="w-auto flex flex-row list pl0 justify-end ma0 h-100 items-center">
        <ul class="flex flex-row list pl0 justify-end ma0 h-100 items-center" onclick=${this.toggleUserSettings}>
          <li><img class="br-100 ba h2 w2 mr2 dib" src="http://tachyons.io/img/logo.jpg" alt="user avatar"></li>
          <li class="mr2 f7">username</li>
          <li><img style="width:20px; height:10px" class="mr2" src="../assets/down-arrow.png" alt="open settings arrow"></li>
        </ul>
        <ul id="userSettings" class=" dn f7 list bg-pink absolute mt6 pa2" style="width:150px; height:150px margin-top:80px;">
          <li>settings</li>  
          <li onclick=${this.logout}>logout</li>
        </ul>
      </ul>
    </nav>
    
    </header>
    `
  }

  update() {
    return true
  }
}

module.exports = AppHeader