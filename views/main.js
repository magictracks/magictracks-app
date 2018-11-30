var html = require('choo/html')
var css = require('sheetify');
var SignupForm = require('../components/SignupForm')

var TITLE = 'app - main'

module.exports = view


function view(state, emit) {

  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  const triggerLogin = function(e){
    e.preventDefault();
    console.log("clicked");
    emit("db:users:login")
  }

  return html `

<body class="w-100 h-100 code lh-copy bg-washed-blue ma0 flex flex-column">
  <header class="flex h-60px flex-column justify-center pa2">
    <nav class="w-100 h-100 ma0 flex flex-row justify-between">
      <ul class="flex flex-row list pl0 justify-start h-100 ma0 items-center">
        <li> ✨ Magic Tracks ✨</li>

      </ul>
      <ul class="flex flex-row list pl0 justify-end ma0 h-100 items-center">
        <li class="pa2" onclick=${triggerLogin}>Log In</li>
        <li> <a class="link black" href="/browse">browse</a> </li>
      </ul>
    </nav>
  </header>
  <main class="flex flex-column justify-center items-center pa2 flex-1">
    <!-- row1 -->
    <section class="flex-m flex-l flex-ns flex-row items-center justify-center flex-wrap-l flex-wrap-m">
        <!-- left -->
        <section class="pa4 flex flex-column bg-washed-blue w-60-l w-100-m w-100-ns justify-center">
          <h1 class="pa0 ma0 f1 lh-solid">Welcome to the Magic Tracks Project!</h1>
          <p> This is a community and webspace of creatives and curious makers dedicated to curating playlists for learning. </p>
        </section>
        <!-- right -->
        <section class="pa4 flex flex-column bg-washed-blue w-40-l w-100-m w-100-ns justify-center">
          <div class="flex flex-column w-100 pa4 br2 bg-washed-red dark-pink">
            <p class="f4 lh-copy">Join the community and start building!</p>
            ${state.cache(SignupForm, "SignupForm", state, emit)}
          </div>
        </section>
      </section> <!-- row1 -->
  </main>
  <footer class="w-100 h4 flex flex-column bg-navy pa2 dark-pink">
      <div class="w-100 flex flex-row pa2 pl4">
        <div class="w-40 flex flex-column">
            <small>An open education initiative by ITP.</small>
            <small>Made with ♡ using Choo.js & Feathers.js.</small>
        </div>
        <div class="w-60 pl2 pr4 flex flex-row justify-between">
          <div>
            <ul class="list ma0 pl0">
              <li>about</li>
              <li>contact</li>
            </ul>
          </div>
          <div>
            <ul class="list ma0 pl0">
              <li>report issue</li>
              <li>contribute</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
</body>
`
}