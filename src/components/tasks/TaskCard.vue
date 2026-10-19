<script setup>
import { computed, ref } from 'vue'
import { movedSubtasksCount, subtasksInSameColumn } from '@/utils/tasks'

const props = defineProps({
  task: { type: Object, required: true },
  isSubtask: { type: Boolean, default: false },
  showParentContext: { type: Boolean, default: false },
  draggingId: { type: String, default: '' },
  movingId: { type: String, default: '' }
})

const emit = defineEmits(['edit', 'delete', 'subtask', 'drag-start'])

const expanded = ref(false)
const descriptionExpanded = ref(false)
const subtasks = computed(() => subtasksInSameColumn(props.task))
const movedSubtaskCount = computed(() => movedSubtasksCount(props.task))
const isDragging = computed(() => props.draggingId === props.task.id)
const isMoving = computed(() => props.movingId === props.task.id)
const statusVisuals = {
  todo: {
    label: 'To-do',
    parent: 'border-rose-200 border-l-[3px] border-l-rose-500 bg-gradient-to-r from-rose-50/70 to-white shadow-sm shadow-slate-900/[0.04] dark:border-slate-700 dark:border-l-rose-400 dark:from-rose-950/20 dark:to-slate-800',
    subtask: 'border-rose-200 border-l-[3px] border-l-rose-500 bg-rose-50/80 dark:border-slate-700 dark:border-l-rose-400 dark:bg-rose-950/20',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
  },
  'in progress': {
    label: 'In progress',
    parent: 'border-amber-200 border-l-[3px] border-l-amber-500 bg-gradient-to-r from-amber-50/70 to-white shadow-sm shadow-slate-900/[0.04] dark:border-slate-700 dark:border-l-amber-400 dark:from-amber-950/20 dark:to-slate-800',
    subtask: 'border-amber-200 border-l-[3px] border-l-amber-500 bg-amber-50/80 dark:border-slate-700 dark:border-l-amber-400 dark:bg-amber-950/20',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
  },
  done: {
    label: 'Done',
    parent: 'border-emerald-200 border-l-[3px] border-l-emerald-500 bg-gradient-to-r from-emerald-50/70 to-white shadow-sm shadow-slate-900/[0.04] dark:border-slate-700 dark:border-l-emerald-400 dark:from-emerald-950/20 dark:to-slate-800',
    subtask: 'border-emerald-200 border-l-[3px] border-l-emerald-500 bg-emerald-50/80 dark:border-slate-700 dark:border-l-emerald-400 dark:bg-emerald-950/20',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
  }
}
const statusVisual = computed(() => statusVisuals[props.task.status] || statusVisuals.todo)

function startDrag(event) {
  if (isMoving.value || event.button !== 0) return
  if (event.target.closest('button, a, input, textarea, select, option, [role="button"]')) return
  if (event.pointerType === 'mouse') event.preventDefault()
  const bounds = event.currentTarget.getBoundingClientRect()
  event.currentTarget.setPointerCapture?.(event.pointerId)
  emit('drag-start', {
    task: props.task,
    event,
    rect: { width: bounds.width, height: bounds.height, offsetX: event.clientX - bounds.left, offsetY: event.clientY - bounds.top }
  })
}

function addSubtask() {
  expanded.value = true
  emit('subtask', props.task)
}
</script>

<template>
  <article
    class="min-w-0 cursor-grab rounded-xl p-3 transition-[border-color,background-color,box-shadow,opacity] duration-150 active:cursor-grabbing sm:p-3.5"
    :class="[
      isSubtask
        ? statusVisual.subtask
        : statusVisual.parent,
      isDragging ? 'task-card-source pointer-events-none border-2 border-dashed border-blue-400 bg-blue-50/40 shadow-none dark:border-blue-500 dark:bg-blue-950/20' : '',
    ]"
    :data-dragging="isDragging"
    :aria-label="`${isSubtask ? 'Subtask' : 'Task'}: ${task.title}`"
    @pointerdown.stop="startDrag"
  >
    <div class="flex min-w-0 items-start justify-between gap-2">
      <div class="min-w-0 flex-1">
        <p
          v-if="isSubtask"
          class="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-700 dark:text-violet-300"
        >
          Subtask<span v-if="showParentContext && task.parentTitle" class="font-medium normal-case tracking-normal text-slate-500 dark:text-slate-400"> · of {{ task.parentTitle }}</span>
        </p>
        <h3 class="break-words text-sm font-semibold leading-5 text-slate-900 dark:text-white sm:text-base">
          {{ task.title }}
        </h3>
      </div>
      <span
        class="inline-flex shrink-0 items-center rounded-md px-1.5 py-1 text-[10px] font-semibold leading-none"
        :class="statusVisual.badge"
      >
        {{ statusVisual.label }}
      </span>
    </div>

    <div v-if="task.description" class="mt-1.5">
      <button
        type="button"
        :aria-expanded="descriptionExpanded"
        :aria-controls="`description-${task.id}`"
        class="inline-flex items-center gap-1.5 rounded-md py-1 text-xs font-medium text-slate-500 transition hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:text-blue-300"
        @click="descriptionExpanded = !descriptionExpanded"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          class="h-3.5 w-3.5 transition-transform"
          :class="descriptionExpanded ? 'rotate-90' : ''"
        >
          <path d="m7 4 6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ descriptionExpanded ? 'Hide description' : 'Show description' }}
      </button>
      <p
        v-if="descriptionExpanded"
        :id="`description-${task.id}`"
        class="mt-1 whitespace-pre-wrap break-words rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600 dark:bg-slate-900/70 dark:text-slate-300"
      >
        {{ task.description }}
      </p>
    </div>

    <div class="mt-2 flex flex-wrap items-center justify-end gap-2">
      <div class="flex shrink-0 items-center gap-1">
        <button
          type="button"
          :disabled="isMoving"
          :aria-label="`Edit ${isSubtask ? 'subtask' : 'task'}: ${task.title}`"
          title="Edit"
          class="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          @click="emit('edit', task)"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" class="h-4 w-4">
            <path d="m12.8 3.2 4 4M4 16l3.2-.7L16 6.5a1.4 1.4 0 0 0-2-2l-8.8 8.8L4 16Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="hidden sm:inline">Edit</span>
        </button>
        <button
          type="button"
          :disabled="isMoving"
          :aria-label="`Delete ${isSubtask ? 'subtask' : 'task'}: ${task.title}`"
          title="Delete"
          class="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/50 dark:hover:text-rose-200"
          @click="emit('delete', task)"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" class="h-4 w-4">
            <path d="M3.5 5.5h13m-11.5 0 .7 11h7.6l.7-11M8 5.5V3.8h4v1.7m-3 3v4.5m2-4.5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>

    <template v-if="!isSubtask">
      <div class="mt-2.5 flex items-center justify-between gap-2 border-t border-slate-200 pt-2.5 dark:border-slate-700">
        <button
          v-if="subtasks.length"
          type="button"
          :aria-expanded="expanded"
          :aria-controls="`subtasks-${task.id}`"
          class="inline-flex min-w-0 items-center gap-1.5 rounded-lg py-1 pr-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-300 dark:hover:text-white"
          @click="expanded = !expanded"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            class="h-4 w-4 shrink-0 transition-transform"
            :class="expanded ? 'rotate-90' : ''"
          >
            <path d="m7 4 6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Subtasks</span>
          <span class="rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">{{ subtasks.length }}</span>
        </button>
        <span v-else-if="movedSubtaskCount" class="min-w-0 text-xs text-slate-500 dark:text-slate-400">
          {{ movedSubtaskCount }} subtask{{ movedSubtaskCount === 1 ? '' : 's' }} in another column
        </span>
        <span v-else class="text-xs text-slate-400 dark:text-slate-500">No subtasks yet</span>

        <button
          type="button"
          class="inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-blue-300 dark:hover:bg-blue-950/50"
          @click="addSubtask"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" class="h-4 w-4">
            <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          Add subtask
        </button>
      </div>

      <p v-if="subtasks.length && movedSubtaskCount" class="mt-1 text-xs text-slate-400 dark:text-slate-500">
        {{ movedSubtaskCount }} more in another column
      </p>

      <div
        v-if="expanded && subtasks.length"
        :id="`subtasks-${task.id}`"
        class="mt-3 grid gap-2.5 border-l-2 border-violet-200 pl-3 dark:border-violet-900 sm:pl-4"
      >
        <TaskCard
          v-for="subtask in subtasks"
          :key="subtask.id"
          :task="subtask"
          is-subtask
          :dragging-id="draggingId"
          :moving-id="movingId"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
          @drag-start="emit('drag-start', $event)"
        />
      </div>
    </template>
  </article>
</template>
