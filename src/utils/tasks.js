export const TASK_STATUSES = ['todo', 'in progress', 'done']

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
