var html = require('choo/html')
const css = require('sheetify');

function toggleDropdown(e){
  console.log(e.currentTarget);

  e.currentTarget.nextElementSibling.classList.toggle('dn');
}

function MainNav(id, state, emit){
  
  function checkRoute(_route){
    if(state.route == _route || state.route.split('/')[0] === _route  ){
      return " bg-near-white near-black"
    } else {
      return " near-white bg-near-black "
    }
  }

  css`
    .h-flip{
      -moz-transform: scale(-1, 1);
      -webkit-transform: scale(-1, 1);
      -o-transform: scale(-1, 1);
      -ms-transform: scale(-1, 1);
      transform: scale(-1, 1);
    }
  `

  function navBack(e){
    console.log("navBack")
    // console.log(state.route);
    window.history.back();
    emit(state.events.RENDER)
  }

  function navForward(e){
    console.log("navForward")
    window.history.forward();
    emit(state.events.RENDER)
  }

  function triggerExport(e){
    return ""
  }

  function triggerDownload(e){
    emit("edit:download")
  }

  return html`
  <nav class="w-100 b--near-black bg-near-black h2 flex flex-row items-center">
    <!-- NAV -->
    <ul class="w-50 list flex flex-row ma0 pa0 h-100 z-max">
      <li onclick=${navBack} class="hover-bg-purple pl2 pr2 f5 white pointer">⨞</li>
      <li onclick=${navForward} class="hover-bg-purple h-flip pl2 pr2 f5 white pointer">⨞</li>
      <li class="pointer mainNavTab h-100 ${checkRoute("edit")} pr2 pl2">
        <span> <a class="link ${checkRoute("edit")}" href="/edit">Edit</a> </span> <span onclick=${toggleDropdown}>▾</span>
        <ul class="dn ba bw1 pa2 bg-pink list black">
          <li onclick=${triggerExport}>export/share</li>
          <li onclick=${triggerDownload}>download</li>
        </ul>
      </li>
      <li class="mainNavTab h-100 ${checkRoute("browse")} pr2 pl2"><span> <a class="link ${checkRoute("browse")}" href="/browse">Browse</a> </span></li>
    </ul>
    <ul class="w-50 list flex flex-row ma0 pa0 h-100 z-max justify-end">
      <li class="mainNavTab h-100 bg-near-black near-white pr2 pl2"><span><input class="bn" type="text" placeholder="🔎 search"></span></li>
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