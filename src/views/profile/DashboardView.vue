<script setup>
import { ref, onMounted } from 'vue'

import { storeToRefs } from 'pinia'

import TaskModal from '@/components/tasks/TaskModal.vue'

import BoardColumn from '@/components/tasks/BoardColumn.vue'

import { useTaskStore } from '@/stores/task'
import { errorMessage } from '@/utils/errors'

const store = useTaskStore()

const { modalLoading, deleting, loading } = storeToRefs(store)

const modalType = ref(false)

const task = ref({})

const error = ref('')

const columns = [
  { status: 'todo', label: 'To-do', color: 'bg-red-100 text-gray-700' },

  { status: 'in progress', label: 'In progress', color: 'bg-yellow-100 text-gray-700' },

  { status: 'done', label: 'Done', color: 'bg-green-100 text-gray-700' }
]

async function load() {
  error.value = ''

  try {
    await store.getTasks()
  } catch (e) {
    error.value = errorMessage(e)
  }
}

onMounted(load)

function create(status, parentId = null) {
  task.value = { title: '', description: '', status, parent_id: parentId }

  modalType.value = 'create'
}

function edit(item) {
  task.value = { ...item }
  modalType.value = 'update'
}

async function submit({ task: draft, type }) {
  modalLoading.value = true

  error.value = ''

  try {
    if (type === 'create') await store.createTask(draft)
    else await store.updateTask(draft)

    modalType.value = false
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    modalLoading.value = false
  }
}

async function remove(id) {
  error.value = ''

  try {
    await store.deleteTask(id)
  } catch (e) {
    error.value = errorMessage(e)
  }
}
</script>

<template>
  <main class="max-w-screen-xl mx-auto p-4 mt-4">
    <h1 class="text-2xl font-semibold mb-5">Your task board</h1>

    <div v-if="error" role="alert" class="relative z-[60] bg-red-50 text-red-700 p-3 mb-4 rounded">
      {{ error }} <button class="underline ml-3" @click="load">Reload tasks</button>
    </div>

    <p v-if="loading" role="status" class="mb-4 text-gray-500">Loading tasks…</p>

    <TaskModal
      v-if="modalType"
      v-model:task="task"
      :type="modalType"
      :error="error"
      @close="!modalLoading && (modalType = false)"
      @modal-update="submit"
    />

    <div
      v-if="deleting"
      class="fixed inset-0 z-[60] bg-gray-500/40 flex items-center justify-center"
      role="status"
      aria-label="Deleting task"
    >
      <span class="loader" />
    </div>

    <div class="grid md:grid-cols-3 gap-5">
      <BoardColumn
        v-for="column in columns"
        :key="column.status"
        :column="column"
        :tasks="store.filterTasks(column.status)"
        @create="create"
        @edit="edit"
        @delete="remove"
        @subtask="create($event.status, $event.id)"
      />
    </div>
  </main>
</template>
