<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  task: { type: Object, required: true },
  subtaskCount: { type: Number, required: true },
  deleting: { type: Boolean, default: false },
  error: { type: String, default: '' }
})

const emit = defineEmits(['cancel', 'confirm'])
const dialog = ref(null)
let previousFocus

onMounted(() => {
  previousFocus = document.activeElement
  dialog.value.showModal()
})

onBeforeUnmount(() => {
  if (previousFocus?.isConnected) previousFocus.focus()
  else document.getElementById('task-board-title')?.focus()
})

function cancel() {
  if (!dialog.value?.open) return
  emit('cancel')
}
</script>

<template>
  <dialog
    ref="dialog"
    aria-labelledby="delete-task-title"
    aria-describedby="delete-task-description"
    class="max-h-[90vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl bg-white p-0 text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-slate-100"
    @cancel.prevent="cancel"
  >
    <div class="p-5 sm:p-6">
      <div class="flex items-start gap-4">
        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="h-5 w-5">
            <path d="M4 7h16m-14 0 .8 13h10.4L18 7M9 7V4h6v3m-4 4v5m2-5v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="min-w-0 pt-0.5">
          <h2 id="delete-task-title" class="text-lg font-semibold tracking-tight">
            Delete this task and its subtasks?
          </h2>
          <p class="mt-1 break-words text-sm font-medium text-slate-700 dark:text-slate-300">
            {{ task.title }}
          </p>
        </div>
      </div>

      <p id="delete-task-description" class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
        This task has {{ subtaskCount }} subtask{{ subtaskCount === 1 ? '' : 's' }}. Deleting it will also permanently delete {{ subtaskCount === 1 ? 'that subtask' : 'all of its subtasks' }}.
      </p>

      <p v-if="error" role="alert" class="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
        {{ error }}
      </p>

      <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          :disabled="deleting"
          class="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="cancel"
        >
          Keep task
        </button>
        <button
          type="button"
          :disabled="deleting"
          class="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-wait disabled:opacity-70"
          @click="emit('confirm')"
        >
          <span v-if="deleting" class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          {{ deleting ? 'Deleting…' : 'Delete task and subtasks' }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
dialog::backdrop {
  background: rgb(15 23 42 / 58%);
  backdrop-filter: blur(2px);
}
</style>
