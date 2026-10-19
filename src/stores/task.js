import { ref } from 'vue'
import { defineStore } from 'pinia'
import { taskService } from '@/services/tasks'
import { applyTaskStatusChanges, boardTasksForStatus, taskStatusChangesForMove } from '@/utils/tasks'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])
  let generation = 0
  const loading = ref(false)
  const modalLoading = ref(false)
  const deleting = ref(false)
  async function getTasks() {
    const requestGeneration = generation
    loading.value = true
    try {
      const result = await taskService.list()
      if (requestGeneration === generation) tasks.value = result
    } finally {
      if (requestGeneration === generation) loading.value = false
    }
  }
  async function createTask(task) {
    await taskService.create(task)
    await getTasks()
  }
  async function updateTask(task) {
    await taskService.update(task)
    await getTasks()
  }
  async function moveTask(task, status) {
    const changes = taskStatusChangesForMove(tasks.value, task.id, status)
    const previousStatuses = new Map(
      [...changes.keys()].map((id) => [id, tasks.value.find((item) => item.id === id)?.status])
    )
    tasks.value = applyTaskStatusChanges(tasks.value, changes)

    try {
      await taskService.update({ ...task, status })
    } catch (error) {
      tasks.value = applyTaskStatusChanges(tasks.value, previousStatuses)
      throw error
    }
  }
  async function deleteTask(id) {
    deleting.value = true
    try {
      await taskService.remove(id)
      await getTasks()
    } finally {
      deleting.value = false
    }
  }
  function filterTasks(status) {
    return boardTasksForStatus(tasks.value, status)
  }
  function resetStore() {
    generation++
    tasks.value = []
    loading.value = false
    modalLoading.value = false
    deleting.value = false
  }
  return {
    tasks,
    loading,
    modalLoading,
    deleting,
    getTasks,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
    filterTasks,
    resetStore
  }
})
