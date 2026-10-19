import test from 'node:test'
import assert from 'node:assert/strict'
import { applyTaskStatusChanges, boardTasksForStatus, movedSubtasksCount, shouldMoveSubtaskWithParent, subtasksInSameColumn, taskStatusChangesForMove, validateTask } from '../src/utils/tasks.js'

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

test('shows matching-status children under their parent and moved children in their own column', () => {
  const tasks = [
    { id: 'todo-parent', parent_id: null, status: 'todo' },
    { id: 'todo-child', parent_id: 'todo-parent', status: 'todo' },
    { id: 'done-parent', parent_id: null, status: 'done' },
    { id: 'moved-child', parent_id: 'todo-parent', status: 'done' },
    { id: 'done-child', parent_id: 'done-parent', status: 'done' },
  ]

  assert.deepEqual(boardTasksForStatus(tasks, 'todo').map((task) => task.id), ['todo-parent'])
  assert.deepEqual(boardTasksForStatus(tasks, 'done').map((task) => task.id), ['done-parent', 'moved-child'])
  const parent = {
    status: 'todo',
    subtasks: [tasks[1], tasks[3]],
  }
  assert.deepEqual(subtasksInSameColumn(parent).map((task) => task.id), ['todo-child'])
  assert.equal(movedSubtasksCount(parent), 1)
})

test('moving a parent carries only subtasks that have not moved independently', () => {
  assert.equal(shouldMoveSubtaskWithParent({ status: 'todo' }, 'todo'), true)
  assert.equal(shouldMoveSubtaskWithParent({ status: 'in progress' }, 'todo'), false)
})

test('optimistic parent moves update colocated subtasks and can be rolled back', () => {
  const tasks = [
    {
      id: 'parent', parent_id: null, status: 'todo',
      subtasks: [
        { id: 'together', parent_id: 'parent', status: 'todo' },
        { id: 'independent', parent_id: 'parent', status: 'done' },
      ],
    },
    { id: 'together', parent_id: 'parent', status: 'todo' },
    { id: 'independent', parent_id: 'parent', status: 'done' },
  ]
  const changes = taskStatusChangesForMove(tasks, 'parent', 'in progress')
  assert.deepEqual([...changes], [['parent', 'in progress'], ['together', 'in progress']])

  const moved = applyTaskStatusChanges(tasks, changes)
  assert.equal(moved[0].status, 'in progress')
  assert.equal(moved[0].subtasks[0].status, 'in progress')
  assert.equal(moved[0].subtasks[1].status, 'done')
  assert.equal(moved[2].status, 'done')

  const originalStatuses = new Map([...changes.keys()].map((id) => [id, tasks.find((task) => task.id === id).status]))
  const restored = applyTaskStatusChanges(moved, originalStatuses)
  assert.equal(restored[0].status, 'todo')
  assert.equal(restored[0].subtasks[0].status, 'todo')
})
