<script setup>
defineProps({ task: { type: Object, required: true } })
defineEmits(['edit', 'delete', 'subtask'])
</script>

<template>
  <article class="p-4 rounded border-2 border-gray-100 shadow-sm">
    <h3 class="font-medium mb-2 break-words">{{ task.title }}</h3>
    <p v-if="task.description" class="text-sm text-gray-500 mb-3 whitespace-pre-wrap break-words">
      {{ task.description }}
    </p>
    <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
      <span v-if="task.parent_id" class="bg-blue-100 text-blue-700 rounded px-2 py-1">Subtask</span>
      <div class="flex gap-4 ml-auto">
        <button class="text-red-600" @click="$emit('delete', task.id)">Delete</button>
        <button class="text-gray-600" @click="$emit('edit', task)">Edit</button>
      </div>
    </div>
    <div
      v-if="!task.parent_id"
      class="border-t mt-4 pt-3 flex flex-wrap justify-between gap-2 text-sm text-gray-600"
    >
      <span>Subtasks ({{ task.subtasks?.length || 0 }})</span>
      <button @click="$emit('subtask', task)">+ New subtask</button>
    </div>
  </article>
</template>
