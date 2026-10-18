<script setup>
defineProps({ title: { type: String, required: true }, description: { type: String, default: '' } })
</script>
<template>
  <main class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
    <div class="w-full max-w-md">
      <RouterLink to="/" class="text-sm text-blue-700 font-medium">← Kanban Task Board</RouterLink>
      <section class="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h1 class="text-2xl font-semibold text-slate-900">{{ title }}</h1>
        <p v-if="description" class="mt-2 mb-6 text-sm text-slate-500">{{ description }}</p>
        <slot />
      </section>
    </div>
  </main>
</template>
