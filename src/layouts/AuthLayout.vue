<script setup>
import ThemeToggle from '@/components/layout/ThemeToggle.vue'

defineProps({ title: { type: String, required: true }, description: { type: String, default: '' } })
</script>
<template>
  <main
    class="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100"
  >
    <div class="mx-auto w-full max-w-md">
      <header class="flex items-center justify-between gap-3">
        <RouterLink to="/" class="text-sm font-medium text-blue-700 dark:text-blue-300"
          >← Kanban Workspace</RouterLink
        >
        <ThemeToggle />
      </header>
      <section
        class="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">{{ title }}</h1>
        <p v-if="description" class="mb-6 mt-2 text-sm text-slate-500 dark:text-slate-400">
          {{ description }}
        </p>
        <slot />
      </section>
    </div>
  </main>
</template>
