<script setup>
import TaskCard from './TaskCard.vue'
defineProps({ column: { type: Object, required: true }, tasks: { type: Array, required: true } })
defineEmits(['create', 'edit', 'delete', 'subtask'])
</script>

<template>
  <section class="bg-white rounded p-3">
    <header class="flex justify-between items-center mb-4">
      <h2 class="text-sm rounded px-2 py-1" :class="column.color">
        {{ column.label }} <span class="ml-2">{{ tasks.length }}</span>
      </h2>
      <button
        :aria-label="`Add ${column.label} task`"
        class="text-2xl px-2"
        @click="$emit('create', column.status)"
      >
        +
      </button>
    </header>
    <div class="grid gap-4">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @subtask="$emit('subtask', $event)"
      />
    </div>
    <p v-if="!tasks.length" class="text-sm text-gray-400 py-5 text-center">No tasks yet</p>
    <button class="text-sm text-gray-500 mt-4" @click="$emit('create', column.status)">
      + New task
    </button>
  </section>
</template>
