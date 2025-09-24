import { describe, it, expect } from 'vitest'
import { setupCounter } from './counter.js'

describe('setupCounter', () => {
  it('initializes with count 0 and increments on click', () => {
    const btn = document.createElement('button')

    // mount behavior
    setupCounter(btn)

    // initial state
    expect(btn.innerHTML).toBe('count is 0')

    // simulate clicks
    btn.click()
    expect(btn.innerHTML).toBe('count is 1')

    btn.click()
    expect(btn.innerHTML).toBe('count is 2')
  })
})
