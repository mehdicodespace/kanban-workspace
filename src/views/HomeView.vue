<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
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
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <nav
      aria-label="Main navigation"
      class="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center gap-4"
    >
      <span class="text-xl font-semibold">Kanban Task Board</span>
      <RouterLink
        :to="user ? '/profile/dashboard' : '/login'"
        class="text-sm font-medium text-blue-700"
        >{{ user ? 'Open board' : 'Sign in' }} →</RouterLink
      >
    </nav>
    <section class="max-w-6xl mx-auto px-6 pt-20 pb-24">
      <p class="text-sm uppercase tracking-widest font-semibold text-blue-700 mb-6">
        Less clutter. More progress.
      </p>
      <h1 class="text-5xl sm:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
        Make room for your best work.
      </h1>
      <p class="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
        A focused task board for turning ideas into progress. Plan your work, break it down, and
        follow it through.
      </p>
      <RouterLink
        :to="user ? '/profile/dashboard' : '/signup'"
        class="inline-flex mt-9 bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-6 py-3 font-medium"
        >{{ user ? 'Go to your board' : 'Create your workspace' }}</RouterLink
      >
    </section>
    <section aria-label="Features" class="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-6">
      <article
        v-for="(feature, index) in features"
        :key="feature.title"
        class="bg-white rounded-xl p-7 border border-slate-200"
      >
        <span class="text-blue-700 font-semibold text-sm">0{{ index + 1 }}</span>
        <h2 class="text-lg font-semibold mt-5 mb-3">{{ feature.title }}</h2>
        <p class="text-slate-600 leading-relaxed">{{ feature.text }}</p>
      </article>
    </section>
    <footer class="border-t border-slate-200 p-6 text-center text-sm text-slate-500">
      Built for a calmer, more organized day.
    </footer>
  </main>
</template>
