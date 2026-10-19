export const TASK_STATUSES = ['todo', 'in progress', 'done']

export function boardTasksForStatus(tasks, status) {
  const tasksById = new Map(tasks.map((task) => [task.id, task]))
  return tasks.filter((task) => {
    if (task.status !== status) return false
    if (!task.parent_id) return true

    const parent = tasksById.get(task.parent_id)
    return !parent || parent.status !== status
  })
}

export function subtasksInSameColumn(task) {
  return (task.subtasks || []).filter((subtask) => subtask.status === task.status)
}

export function movedSubtasksCount(task) {
  return (task.subtasks || []).length - subtasksInSameColumn(task).length
}

export function shouldMoveSubtaskWithParent(subtask, parentStatus) {
  return subtask.status === parentStatus
}

export function taskStatusChangesForMove(tasks, taskId, nextStatus) {
  const task = tasks.find((item) => item.id === taskId)
  if (!task) throw new Error('Task no longer exists in the board.')

  const changes = new Map([[task.id, nextStatus]])
  if (!task.parent_id && task.status !== nextStatus) {
    for (const child of tasks) {
      if (child.parent_id === task.id && shouldMoveSubtaskWithParent(child, task.status)) {
        changes.set(child.id, nextStatus)
      }
    }
  }

  return changes
}

export function applyTaskStatusChanges(tasks, changes) {
  return tasks.map((task) => {
    const status = changes.get(task.id)
    const hasNestedChanges = task.subtasks?.some((subtask) => changes.has(subtask.id))

    if (status === undefined && !hasNestedChanges) return task

    return {
      ...task,
      ...(status === undefined ? {} : { status }),
      ...(hasNestedChanges
        ? { subtasks: task.subtasks.map((subtask) => ({ ...subtask, status: changes.get(subtask.id) ?? subtask.status })) }
        : {})
    }
  })
}

export function validateTask(task, tasks = []) {
  const title = task.title?.trim()
  const description = task.description?.trim() || ''
  if (!title || title.length > 160) throw new Error('Enter a title between 1 and 160 characters.')
  if (description.length > 5000) throw new Error('Keep the description under 5,000 characters.')
  if (!TASK_STATUSES.includes(task.status)) throw new Error('Choose a valid task status.')
  const parentId = task.parent_id || null
  if (parentId) {
    const parent = tasks.find((item) => item.id === parentId)
    if (
      !parent ||
      parent.parent_id ||
      parent.id === task.id ||
      tasks.some((item) => item.parent_id === task.id)
    ) {
      throw new Error('Subtasks must belong to a top-level task and cannot have children.')
    }
  }
  return { title, description, status: task.status, parent_id: parentId }
}
