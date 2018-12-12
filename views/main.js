var html = require('choo/html')
var css = require('sheetify');
var SignupForm = require('../components/SignupForm')
var LandingFooter = require('../components/LandingFooter')
var LandingHeader = require('../components/LandingHeader')

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
  ${state.cache(LandingHeader, "LandingHeader", state, emit)}
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
  ${state.cache(LandingFooter,"LandingFooter", state, emit)}
</body>
`
}