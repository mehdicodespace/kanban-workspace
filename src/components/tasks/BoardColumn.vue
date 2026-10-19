<script setup>
import TaskCard from './TaskCard.vue'

defineProps({
  column: { type: Object, required: true },
  tasks: { type: Array, required: true },
  dropTarget: { type: Boolean, default: false },
  draggingId: { type: String, default: '' },
  movingId: { type: String, default: '' }
})

defineEmits(['create', 'edit', 'delete', 'subtask', 'move', 'drag-start'])
</script>

<template>
  <section
    :data-drop-status="column.status"
    class="min-w-0 rounded-2xl border p-3 shadow-sm transition sm:p-4"
    :class="[
      dropTarget
        ? 'border-blue-400 bg-blue-50/80 ring-2 ring-blue-500/30 dark:border-blue-700 dark:bg-blue-950/30'
        : 'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/80'
    ]"
  >
    <header class="mb-4 flex items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-2.5">
        <span class="h-2.5 w-2.5 shrink-0 rounded-full" :class="column.dot" />
        <h2 class="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
          {{ column.label }}
        </h2>
        <span class="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
          {{ tasks.length }}
        </span>
      </div>
      <button
        type="button"
        :aria-label="`Add ${column.label} task`"
        class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-300"
        @click="$emit('create', column.status)"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" class="h-5 w-5">
          <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </header>

    <TransitionGroup name="task-list" tag="div" class="grid gap-3">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :is-subtask="Boolean(task.parent_id)"
        :show-parent-context="Boolean(task.parent_id)"
        :dragging-id="draggingId"
        :moving-id="movingId"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @subtask="$emit('subtask', $event)"
        @drag-start="$emit('drag-start', $event)"
      />
    </TransitionGroup>

    <div
      v-if="!tasks.length"
      class="mt-1 rounded-xl border border-dashed border-slate-300 px-3 py-6 text-center dark:border-slate-700"
    >
      <p class="text-sm font-medium text-slate-500 dark:text-slate-400">
        {{ dropTarget ? 'Drop task here' : 'No tasks in this column' }}
      </p>
      <p v-if="!dropTarget" class="mt-1 text-xs text-slate-400 dark:text-slate-500">
        Drag a task here or add one below.
      </p>
    </div>

    <button
      type="button"
      class="mt-3 inline-flex min-h-9 w-full items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-300"
      @click="$emit('create', column.status)"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" class="h-4 w-4">
        <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
      New task
    </button>
  </section>
</template>
