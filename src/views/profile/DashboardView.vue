<script setup>
import { ref, onMounted } from 'vue'

import { storeToRefs } from 'pinia'

import TaskModal from '@/components/tasks/TaskModal.vue'
import ConfirmDeleteModal from '@/components/tasks/ConfirmDeleteModal.vue'

import BoardColumn from '@/components/tasks/BoardColumn.vue'

import { useTaskStore } from '@/stores/task'
import { useTaskDrag } from '@/composables/useTaskDrag'
import { errorMessage } from '@/utils/errors'

const store = useTaskStore()

const { modalLoading, deleting } = storeToRefs(store)

const modalType = ref(false)
const deleteConfirmation = ref(null)
const deleteError = ref('')

const task = ref({})

const error = ref('')
const modalError = ref('')
const moveError = ref('')
const initialLoadComplete = ref(false)
const movingTaskId = ref('')

const columns = [
  {
    status: 'todo',
    label: 'To-do',
    dot: 'bg-rose-500'
  },

  {
    status: 'in progress',
    label: 'In progress',
    dot: 'bg-amber-500'
  },

  {
    status: 'done',
    label: 'Done',
    dot: 'bg-emerald-500'
  }
]

async function load() {
  error.value = ''

  try {
    await store.getTasks()
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    initialLoadComplete.value = true
  }
}

onMounted(load)

function create(status, parentId = null) {
  task.value = { title: '', description: '', status, parent_id: parentId }
  modalError.value = ''
  modalType.value = 'create'
}

function edit(item) {
  task.value = { ...item }
  modalError.value = ''
  modalType.value = 'update'
}

async function submit({ task: draft, type }) {
  modalLoading.value = true

  modalError.value = ''

  try {
    if (type === 'create') await store.createTask(draft)
    else await store.updateTask(draft)

    modalType.value = false
  } catch (e) {
    modalError.value = errorMessage(e)
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

function requestDelete(item) {
  if (item.subtasks?.length) {
    deleteConfirmation.value = item
    deleteError.value = ''
    return
  }
  void remove(item.id)
}

async function confirmDelete() {
  if (!deleteConfirmation.value || deleting.value) return
  deleteError.value = ''
  try {
    await store.deleteTask(deleteConfirmation.value.id)
    deleteConfirmation.value = null
  } catch (e) {
    deleteError.value = errorMessage(e)
  }
}

function cancelDelete() {
  if (!deleting.value) deleteConfirmation.value = null
}

async function moveTask({ task: item, status }) {
  if (!item || item.status === status || movingTaskId.value) return

  movingTaskId.value = item.id
  error.value = ''
  moveError.value = ''

  try {
    await store.moveTask(item, status)
  } catch (e) {
    moveError.value = `${errorMessage(e)} The task was returned to its previous column.`
  } finally {
    movingTaskId.value = ''
  }
}

const { draggingTask, dragPreview, dropTargetStatus, startDrag: onDragStart } = useTaskDrag(
  ({ task: item, status }) => void moveTask({ task: item, status })
)
</script>

<template>
  <main class="mx-auto mt-5 max-w-screen-xl px-4 pb-8 sm:mt-7 sm:px-6">
    <div
      v-if="draggingTask && dragPreview"
      aria-hidden="true"
      class="pointer-events-none fixed z-[80] overflow-hidden rounded-xl border border-blue-400 bg-white p-3 shadow-2xl shadow-slate-950/25 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-slate-800"
      :style="{
        width: `${dragPreview.width}px`,
        minHeight: `${Math.min(dragPreview.height, 112)}px`,
        left: `${dragPreview.x - dragPreview.offsetX}px`,
        top: `${dragPreview.y - dragPreview.offsetY}px`
      }"
    >
      <p v-if="draggingTask.parent_id" class="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-700 dark:text-violet-300">
        Subtask<span v-if="draggingTask.parentTitle" class="font-medium normal-case tracking-normal text-slate-500 dark:text-slate-400"> · of {{ draggingTask.parentTitle }}</span>
      </p>
      <p class="truncate text-sm font-semibold text-slate-900 dark:text-white">{{ draggingTask.title }}</p>
      <p class="mt-2 text-xs text-blue-700 dark:text-blue-300">
        Move to {{ columns.find((column) => column.status === dropTargetStatus)?.label || 'a column' }}
      </p>
    </div>

    <div class="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">Workspace</p>
        <h1 id="task-board-title" tabindex="-1" class="mt-1 text-2xl font-semibold tracking-tight text-slate-950 focus:outline-none dark:text-white sm:text-3xl">Your task board</h1>
      </div>
      <p class="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">Drag a card to change its status.</p>
    </div>

    <div
      v-if="error"
      role="alert"
      class="relative z-[60] mb-4 rounded bg-red-50 p-3 text-red-700 dark:bg-red-950 dark:text-red-200"
    >
      {{ error }} <button class="underline ml-3" @click="load">Reload tasks</button>
    </div>

    <Transition name="modal" appear>
      <TaskModal
        v-if="modalType"
        v-model:task="task"
        :type="modalType"
        :error="modalError"
        @close="!modalLoading && (modalType = false)"
        @modal-update="submit"
      />
    </Transition>

    <Transition name="modal" appear>
      <ConfirmDeleteModal
        v-if="deleteConfirmation"
        :task="deleteConfirmation"
        :subtask-count="deleteConfirmation.subtasks?.length || 0"
        :deleting="deleting"
        :error="deleteError"
        @cancel="cancelDelete"
        @confirm="confirmDelete"
      />
    </Transition>

    <div
      v-if="deleting && !deleteConfirmation"
      class="fixed inset-0 z-[60] bg-gray-500/40 flex items-center justify-center"
      role="status"
      aria-label="Deleting task"
    >
      <span class="loader" />
    </div>

    <div
      v-if="!initialLoadComplete"
      role="status"
      aria-live="polite"
      aria-label="Loading your task board"
      aria-busy="true"
      class="grid gap-4 md:grid-cols-3 md:gap-5"
    >
      <section
        v-for="column in columns"
        :key="column.status"
        class="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/80 sm:p-4"
      >
        <div class="mb-4 flex items-center gap-2.5">
          <span class="h-2.5 w-2.5 rounded-full" :class="column.dot" />
          <h2 class="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {{ column.label }}
          </h2>
          <span aria-hidden="true" class="h-5 w-7 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <span class="sr-only">Loading {{ column.label }} tasks…</span>
        <div class="grid gap-3">
          <div
            v-for="placeholder in 2"
            :key="placeholder"
            class="h-28 animate-pulse rounded-xl border border-slate-200 border-l-[3px] border-l-slate-300 bg-white p-3 dark:border-slate-700 dark:border-l-slate-600 dark:bg-slate-800"
          >
            <div class="h-4 w-3/5 rounded bg-slate-200 dark:bg-slate-700" />
            <div class="mt-3 h-3 w-2/5 rounded bg-slate-100 dark:bg-slate-700/70" />
            <div class="mt-7 flex justify-end gap-2">
              <div class="h-5 w-10 rounded bg-slate-100 dark:bg-slate-700/70" />
              <div class="h-5 w-12 rounded bg-slate-100 dark:bg-slate-700/70" />
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-3 md:gap-5">
      <BoardColumn
        v-for="column in columns"
        :key="column.status"
        :column="column"
        :tasks="store.filterTasks(column.status)"
        :drop-target="dropTargetStatus === column.status"
        :dragging-id="draggingTask?.id || ''"
        :moving-id="movingTaskId"
        @create="create"
        @edit="edit"
        @delete="requestDelete"
        @subtask="create($event.status, $event.id)"
        @move="moveTask"
        @drag-start="onDragStart"
      />
    </div>

    <div
      v-if="moveError"
      role="alert"
      aria-live="assertive"
      class="fixed bottom-4 right-4 z-[90] flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm text-rose-800 shadow-xl shadow-slate-950/10 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-200"
    >
      <span class="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-rose-500" />
      <p class="max-w-sm">{{ moveError }}</p>
      <button
        type="button"
        aria-label="Dismiss task move error"
        class="ml-1 rounded px-1 text-lg leading-none text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/50"
        @click="moveError = ''"
      >
        ×
      </button>
    </div>
  </main>
</template>
