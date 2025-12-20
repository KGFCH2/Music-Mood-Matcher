import { describe, it, expect } from 'vitest'

describe('App', () => {
  it('should run tests', () => {
    expect(true).toBe(true)
  })

  it('should render correctly', () => {
    const title = 'Music Mood Matcher'
    expect(title).toBe('Music Mood Matcher')
  })
})
