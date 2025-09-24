import { fetchQuote } from './api.js'

const NIFTY_50_SYMBOL = '^NSEI'
// If this symbol doesn't resolve for you, try alternatives like '^NSEIJR' or check Yahoo Finance
const NIFTY_NEXT_50_SYMBOL = '^NSMIDCP'

function formatNumber(value) {
  if (value == null || Number.isNaN(Number(value))) return '-'
  return Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

export async function setupIndices(targetElement) {
  if (!targetElement) return
  const container = document.createElement('div')
  container.className = 'indices-container'

  const header = document.createElement('h2')
  header.textContent = 'Indices'

  const list = document.createElement('div')
  list.className = 'indices-list'

  const nifty50Row = document.createElement('div')
  nifty50Row.className = 'index-row'
  const nn50Row = document.createElement('div')
  nn50Row.className = 'index-row'

  nifty50Row.innerHTML = `<strong>Nifty 50</strong>: <span class="idx-nifty50">Loading...</span>`
  nn50Row.innerHTML = `<strong>Nifty Next 50</strong>: <span class="idx-nn50">Loading...</span>`

  list.appendChild(nifty50Row)
  list.appendChild(nn50Row)
  container.appendChild(header)
  container.appendChild(list)
  targetElement.appendChild(container)

  try {
    const [nifty50, nn50] = await Promise.all([
      fetchQuote(NIFTY_50_SYMBOL),
      fetchQuote(NIFTY_NEXT_50_SYMBOL),
    ])
    const n50El = container.querySelector('.idx-nifty50')
    const nn50El = container.querySelector('.idx-nn50')
    if (n50El) n50El.textContent = formatNumber(nifty50.price)
    if (nn50El) nn50El.textContent = formatNumber(nn50.price)
  } catch (err) {
    const n50El = container.querySelector('.idx-nifty50')
    const nn50El = container.querySelector('.idx-nn50')
    if (n50El) n50El.textContent = 'Error'
    if (nn50El) nn50El.textContent = 'Error'
    // eslint-disable-next-line no-console
    console.error('Failed to load indices', err)
  }
}


