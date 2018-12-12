var Component = require('choo/component')
var html = require('choo/html')
var css = require('sheetify');

module.exports = function(id, state, emit){
  css`
  .mh-200px{
    min-height:160px;
  }
  `

  return html`
  <footer class="w-100 h4 mh-200px flex flex-column bg-navy pa2 dark-pink mt4">
    <div class="w-100 flex flex-row pa2 pl4">
      <div class="w-40 flex flex-column">
          <small>An open education initiative by ITP.</small>
          <small>Made with ♡ using Choo.js & Feathers.js.</small>
      </div>
      <div class="w-60 pl2 pr4 flex flex-row justify-between">
        <div>
          <ul class="list ma0 pl0">
            <li><a class="link dark-pink" href="/about">about</a></li>
            <li>contact</li>
          </ul>
        </div>
        <div>
          <ul class="list ma0 pl0">
            <li><a class="link dark-pink" href="https://github.com/magictracks/magictracks-docs/issues" target="_blank">report issue</a></li>
            <li><a class="link dark-pink" href="https://github.com/magictracks" target="_blank">contribute</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
  `
}