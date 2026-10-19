/* global globalThis */
import assert from 'node:assert/strict'
import test from 'node:test'

const values = new Map()
const classes = new Set()
const root = {
  classList: {
    toggle(name, enabled) {
      if (enabled) classes.add(name)
      else classes.delete(name)
    }
  },
  style: {}
}

globalThis.window = {
  localStorage: {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  },
  matchMedia: () => ({ matches: false })
}
const { initializeTheme, useTheme } = await import('../src/composables/useTheme.js')
globalThis.document = { documentElement: root }

test('theme switch updates the document, control state, and saved preference', () => {
  initializeTheme()
  const { isDark, toggleTheme } = useTheme()

  assert.equal(isDark.value, false)
  assert.equal(classes.has('dark'), false)
  assert.equal(root.style.colorScheme, 'light')

  toggleTheme()

  assert.equal(isDark.value, true)
  assert.equal(classes.has('dark'), true)
  assert.equal(root.style.colorScheme, 'dark')
  assert.equal(values.get('kanban-workspace-theme'), 'dark')

  toggleTheme()

  assert.equal(isDark.value, false)
  assert.equal(classes.has('dark'), false)
  assert.equal(root.style.colorScheme, 'light')
  assert.equal(values.get('kanban-workspace-theme'), 'light')
})
