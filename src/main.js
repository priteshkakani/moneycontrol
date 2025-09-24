import './style.css'
import javascriptLogo from './javascript.svg'
const viteLogo = '/vite.svg'
import { setupCounter } from './counter.js'
import { setupNifty } from './nifty.js'
import { setupIndices } from './indices.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <div id="nifty"></div>
    <div id="indices"></div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
setupNifty(document.querySelector('#nifty'))
setupIndices(document.querySelector('#indices'))
