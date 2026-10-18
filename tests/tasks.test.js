import test from 'node:test'
import assert from 'node:assert/strict'
import { validateTask } from '../src/utils/tasks.js'

const draft = { title: ' Plan release ', description: ' Details ', status: 'todo' }
test('normalizes a task and strips fields clients must not control', () => {
  assert.deepEqual(validateTask({ ...draft, id: 'spoofed', createdAt: 0 }), {
    title: 'Plan release', description: 'Details', status: 'todo', parent_id: null,
  })
})
test('rejects empty titles, oversized content, and invalid statuses', () => {
  for (const change of [{ title: ' ' }, { title: 'a'.repeat(161) }, { description: 'a'.repeat(5001) }, { status: 'unknown' }]) {
    assert.throws(() => validateTask({ ...draft, ...change }))
  }
})
test('allows one subtask level and rejects missing parents, cycles, and nesting', () => {
  const tasks = [{ id: 'root', parent_id: null }, { id: 'child', parent_id: 'root' }]
  assert.equal(validateTask({ ...draft, parent_id: 'root' }, tasks).parent_id, 'root')
  for (const change of [{ parent_id: 'missing' }, { parent_id: 'child' }, { id: 'root', parent_id: 'root' }, { id: 'root', parent_id: 'child' }]) {
    assert.throws(() => validateTask({ ...draft, ...change }, tasks))
  }
})
