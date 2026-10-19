<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/task'
const props = defineProps({
  type: { type: String, required: true },
  error: { type: String, default: '' }
})
const task = defineModel('task', { required: true })
const emit = defineEmits(['close', 'modalUpdate'])
const { tasks, modalLoading } = storeToRefs(useTaskStore())
const dialog = ref(null)
const parentTasks = computed(() =>
  tasks.value.filter((item) => !item.parent_id && item.id !== task.value.id)
)
let previousFocus
onMounted(() => {
  previousFocus = document.activeElement
  dialog.value.showModal()
})
onBeforeUnmount(() => {
  if (previousFocus?.isConnected) previousFocus.focus()
  else document.getElementById('task-board-title')?.focus()
})
function close() {
  if (!modalLoading.value) emit('close')
}
function submit() {
  if (!modalLoading.value) emit('modalUpdate', { task: { ...task.value }, type: props.type })
}
</script>
<template>
  <dialog
    ref="dialog"
    aria-labelledby="task-modal-title"
    class="max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    @cancel.prevent="close"
    @click.self="close"
  >
    <header
      class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5 dark:border-slate-700"
    >
      <div class="flex min-w-0 items-start gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
          <svg v-if="type === 'create'" aria-hidden="true" viewBox="0 0 20 20" fill="none" class="h-5 w-5">
            <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <svg v-else aria-hidden="true" viewBox="0 0 20 20" fill="none" class="h-5 w-5">
            <path d="m12.8 3.2 4 4M4 16l3.2-.7L16 6.5a1.4 1.4 0 0 0-2-2l-8.8 8.8L4 16Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <div class="min-w-0">
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">
            {{ task.parent_id ? 'Subtask' : 'Task' }} details
          </p>
          <h2 id="task-modal-title" class="mt-0.5 text-lg font-semibold tracking-tight sm:text-xl">
            {{ type === 'create' ? (task.parent_id ? 'Add a subtask' : 'Create a task') : 'Edit task' }}
          </h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {{ type === 'create' ? 'Add a clear title and the details you need.' : 'Update the details and status for this task.' }}
          </p>
        </div>
      </div>
      <button
        type="button"
        aria-label="Close modal"
        :disabled="modalLoading"
        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        @click="close"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" class="h-5 w-5">
          <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        </svg>
      </button>
    </header>
    <form class="space-y-5 px-5 py-5 sm:px-6 sm:py-6" @submit.prevent="submit">
      <p v-if="error" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">
        {{ error }}
      </p>
      <fieldset :disabled="modalLoading" class="space-y-5">
        <div>
          <label for="task-title" class="form-label">Title</label>
          <input
            id="task-title"
            v-model="task.title"
            autofocus
            required
            maxlength="160"
            class="form-input"
            placeholder="What needs to be done?"
          />
          <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Use a short, action-oriented title.</p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="task-status" class="form-label">Status</label>
            <select id="task-status" v-model="task.status" required class="form-input">
              <option value="todo">To-do</option>
              <option value="in progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label for="parent-task" class="form-label">Parent task</label>
            <select
              id="parent-task"
              v-model="task.parent_id"
              :disabled="type === 'update'"
              class="form-input disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option :value="null">No parent task</option>
              <option v-for="parent in parentTasks" :key="parent.id" :value="parent.id">
                {{ parent.title }}
              </option>
            </select>
            <p v-if="type === 'update'" class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              The parent is set when a task is created.
            </p>
          </div>
        </div>
        <div>
          <label for="task-description" class="form-label">Description <span class="font-normal text-slate-400">(optional)</span></label>
          <textarea
            id="task-description"
            v-model="task.description"
            rows="4"
            maxlength="5000"
            class="form-input resize-y"
            placeholder="Add context, notes, or a definition of done…"
          />
          <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{{ task.description?.length || 0 }} / 5,000 characters</p>
        </div>
      </fieldset>
      <footer class="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end dark:border-slate-700">
        <button
          type="button"
          :disabled="modalLoading"
          class="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="close"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="modalLoading"
          class="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-70"
        >
          <span v-if="modalLoading" class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          {{ modalLoading ? 'Saving…' : type === 'create' ? 'Create task' : 'Save changes' }}
        </button>
      </footer>
    </form>
  </dialog>
</template>
<style scoped>
dialog::backdrop {
  background: rgb(15 23 42 / 55%);
}
</style>
