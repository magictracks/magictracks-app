var html = require('choo/html')

function test(e){
  console.log(e);
}

function MainNav(id, state, emit){
  
  function checkRoute(_route){
    if(state.route == _route || state.route.split('/')[0] === _route  ){
      return " bg-near-white near-black"
    } else {
      return " near-white bg-near-black "
    }
  }

  return html`
  <nav class="w-100 b--near-black bg-near-black h2 flex flex-row items-center">
    <!-- NAV -->
    <ul class="list flex flex-row ma0 pa0 h-100 z-max">
      <li class="mainNavTab h-100 ${checkRoute("edit")} pr2 pl2">
        <span onclick=${test}> <a class="link ${checkRoute("edit")}" href="/edit">Edit</a> </span> <span onclick=${test}>▾</span>
        <ul class="dn ba bw1 pa2 bg-pink list black">
          <li>new playlist</li>
          <li>new section</li>
          <li>new resource</li>
        </ul>
      </li>
      <li class="mainNavTab h-100 ${checkRoute("browse")} pr2 pl2"><span onclick=${test}> <a class="link ${checkRoute("browse")}" href="/browse">Browse</a> </span></li>
      <li class="mainNavTab h-100 bg-near-black near-white pr2 pl2"><span onclick=${test}><input class="bn" type="text" placeholder="🔎 search"></span></li>
    </ul>
  </nav>
  `
}
module.exports = MainNav

/** 
 <li onclick=${test} class="mainNavTab h-100 ${checkRoute("export")} pr2 pl2">
          <span onclick=${test}> <a class="link ${checkRoute("export")}" href="/export">Export</a></span> <span onclick=${test}>▾</span>
        <ul class="dn ba bw1 pa2 bg-pink list black">
          <li>as HTML</li>
          <li>as Markdown</li>
          <li>as PDF</li>
        </ul>
      </li>
*/