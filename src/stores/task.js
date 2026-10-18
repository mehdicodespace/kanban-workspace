import { ref } from 'vue'
import { defineStore } from 'pinia'
import { taskService } from '@/services/tasks'

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
    return tasks.value.filter((task) => task.status === status)
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
    deleteTask,
    filterTasks,
    resetStore
  }
})
