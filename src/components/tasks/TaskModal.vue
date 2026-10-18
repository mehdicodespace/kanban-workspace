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
onBeforeUnmount(() => previousFocus?.focus())
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
    class="rounded-xl p-0 w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
    @cancel.prevent="close"
  >
    <header class="flex justify-between items-center p-5 border-b">
      <h2 id="task-modal-title" class="text-lg font-semibold">
        {{ type === 'create' ? 'Create new task' : 'Edit task' }}
      </h2>
      <button
        type="button"
        aria-label="Close modal"
        :disabled="modalLoading"
        class="px-2 text-xl"
        @click="close"
      >
        ×
      </button>
    </header>
    <form class="p-5 space-y-4" @submit.prevent="submit">
      <p v-if="error" role="alert" class="text-red-700">{{ error }}</p>
      <fieldset :disabled="modalLoading" class="space-y-4">
        <div>
          <label for="task-title" class="block text-sm font-medium mb-2">Title</label>
          <input
            id="task-title"
            v-model="task.title"
            autofocus
            required
            maxlength="160"
            class="w-full border rounded-lg p-2.5"
            placeholder="What needs to be done?"
          />
        </div>
        <div>
          <label for="parent-task" class="block text-sm font-medium mb-2">Parent task</label>
          <select
            id="parent-task"
            v-model="task.parent_id"
            :disabled="type === 'update'"
            class="w-full border rounded-lg p-2.5"
          >
            <option :value="null">No parent</option>
            <option v-for="parent in parentTasks" :key="parent.id" :value="parent.id">
              {{ parent.title }}
            </option>
          </select>
          <p v-if="type === 'update'" class="text-xs text-gray-500 mt-1">
            The parent is set when a task is created.
          </p>
        </div>
        <div>
          <label for="task-status" class="block text-sm font-medium mb-2">Status</label>
          <select
            id="task-status"
            v-model="task.status"
            required
            class="w-full border rounded-lg p-2.5"
          >
            <option value="todo">To-do</option>
            <option value="in progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label for="task-description" class="block text-sm font-medium mb-2">Description</label>
          <textarea
            id="task-description"
            v-model="task.description"
            rows="4"
            maxlength="5000"
            class="w-full border rounded-lg p-2.5"
            placeholder="Add some details…"
          />
        </div>
        <button
          type="submit"
          class="bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-5 py-2.5 font-medium"
        >
          {{ modalLoading ? 'Saving…' : type === 'create' ? 'Add new task' : 'Save changes' }}
        </button>
      </fieldset>
    </form>
  </dialog>
</template>
<style scoped>
dialog::backdrop {
  background: rgb(15 23 42 / 55%);
}
</style>
