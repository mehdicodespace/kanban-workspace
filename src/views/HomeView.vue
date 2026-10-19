<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
const { userInfo: user } = storeToRefs(useUserStore())
const features = [
  {
    title: 'A clear view of your work',
    text: 'Organize tasks across To-do, In progress, and Done. Keep the next step in sight.'
  },
  {
    title: 'Small steps, steady progress',
    text: 'Break larger tasks into subtasks and add the details you need to move forward.'
  },
  {
    title: 'Your own workspace',
    text: 'Sign in to access your private task board from any device.'
  }
]
</script>
<template>
  <main
    class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100"
  >
    <nav
      aria-label="Main navigation"
      class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6"
    >
      <span class="text-xl font-semibold">Kanban Workspace</span>
      <div class="flex items-center gap-3">
        <RouterLink
          :to="user ? '/profile/dashboard' : '/login'"
          class="text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >{{ user ? 'Open board' : 'Sign in' }} →</RouterLink
        >
        <ThemeToggle />
      </div>
    </nav>
    <section class="max-w-6xl mx-auto px-6 pt-20 pb-24">
      <p
        class="mb-6 text-sm font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300"
      >
        Less clutter. More progress.
      </p>
      <h1 class="text-5xl sm:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
        Make room for your best work.
      </h1>
      <p class="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        A focused task board for turning ideas into progress. Plan your work, break it down, and
        follow it through.
      </p>
      <RouterLink
        :to="user ? '/profile/dashboard' : '/signup'"
        class="mt-9 inline-flex rounded-lg bg-blue-700 px-6 py-3 font-medium text-white hover:bg-blue-800"
        >{{ user ? 'Go to your board' : 'Create your workspace' }}</RouterLink
      >
    </section>
    <section aria-label="Features" class="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-6">
      <article
        v-for="(feature, index) in features"
        :key="feature.title"
        class="rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"
      >
        <span class="text-sm font-semibold text-blue-700 dark:text-blue-300">0{{ index + 1 }}</span>
        <h2 class="text-lg font-semibold mt-5 mb-3">{{ feature.title }}</h2>
        <p class="leading-relaxed text-slate-600 dark:text-slate-300">{{ feature.text }}</p>
      </article>
    </section>
    <footer
      class="border-t border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400"
    >
      Built for a calmer, more organized day.
    </footer>
  </main>
</template>
