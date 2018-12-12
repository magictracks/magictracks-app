var html = require('choo/html')
var css = require('sheetify');
var SignupForm = require('../components/SignupForm')
var LandingFooter = require('../components/LandingFooter')
var LandingHeader = require('../components/LandingHeader')

var TITLE = 'app - about'

module.exports = view


function view(state, emit) {

  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html `

  <body class="w-100 h-100 code lh-copy bg-washed-blue ma0 flex flex-column">
    ${state.cache(LandingHeader, "LandingHeader", state, emit)}
    <main class="flex flex-column justify-start items-start pa2 flex-1">
      <!-- row1 -->
      <section class="flex-m flex-l flex-ns flex-column items-start justify-center flex-wrap-l flex-wrap-m pt4 pl4">
          <!-- left -->
          <section class="pb2 pt2 flex flex-column bg-washed-blue w-50-l w-100-m w-100-ns justify-center">
            <h1 class="pa0 ma0 f1 lh-solid">What makes your idea magical?</h1>
          </section>
          <!-- right -->
          <section class="pa0 flex flex-row bg-washed-blue w-100-l w-100-m w-100-ns justify-center pt4">
            <div class="w-50-l w-100-m w-100-ns pr2">
              <p>The Magic Tracks project is a community and webspace of creatives and curious makers dedicated to curating playlists for learning.</p>
              <p>This open educational experiment aims to help people understand what it means to turn an idea into reality and to uncover the magic behind those ideas.</p>
              <p>Whether you're new to a topic or an expert, sometimes it's hard to know how to puzzle together all of the pieces that make up an idea. It's also hard to know what you need to know when approaching a new idea.</p>
              <p>The Magic Tracks project is a web application and methodology for you and your collaborators to reuse and organize existing web references - e.g. tutorials, videos, etc - into playlists that help you to learn all the things you need to make your unique idea come true.</p>
            </div>
            <div class="w-50-l w-100-m w-100-ns pl2">
              
              <p>Why do we need another app for this? The reality is that we don't. However, here at ITP, we're looking at new ways to enhance sharing and reuse of the learning materials that our students, faculty, residents, and staff are producing and/or have found useful from our friends across the web.</p>
              <p>We're excited to see how Magic Tracks can help you learn!</p>
              <p>- Joey, Dan, Shawn, and friends</p>
            </div>
            
            
          </section>
          
      </section> <!-- row1 -->
    </main>
    ${state.cache(LandingFooter,"LandingFooter", state, emit)}
  </body>
`
}