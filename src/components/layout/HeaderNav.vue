<script setup>
import { computed, ref } from 'vue'

import { storeToRefs } from 'pinia'

import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user'

import { errorMessage } from '@/utils/errors'

import ThemeToggle from '@/components/layout/ThemeToggle.vue'

const store = useUserStore()

const { userInfo: user } = storeToRefs(store)

const userInitials = computed(() => {
  const name = user.value?.name?.trim()

  if (!name) return user.value?.email?.slice(0, 1).toUpperCase() || 'U'

  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.slice(0, 1).toUpperCase())
    .join('')
})

const router = useRouter()

const error = ref('')

const loading = ref(false)

async function logout() {
  loading.value = true

  try {
    await store.logout()
    await router.push({ name: 'login' })
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <header
    class="border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-900/[0.03] backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-black/10"
  >
    <nav
      aria-label="Main navigation"
      class="mx-auto flex max-w-screen-xl flex-nowrap items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6"
    >
      <RouterLink
        to="/"
        class="group flex min-w-0 shrink items-center gap-2 text-slate-900 dark:text-white sm:gap-2.5"
      >
        <span
          aria-hidden="true"
          class="grid h-8 w-8 shrink-0 grid-cols-3 gap-0.5 rounded-lg bg-blue-700 p-[7px] shadow-sm shadow-blue-900/20 sm:h-9 sm:w-9 sm:rounded-xl sm:p-2"
        >
          <span class="rounded-sm bg-white/80" />
          <span class="rounded-sm bg-white" />
          <span class="rounded-sm bg-white/60" />
          <span class="rounded-sm bg-white" />
          <span class="rounded-sm bg-white/60" />
          <span class="rounded-sm bg-white" />
        </span>
        <span class="truncate text-base font-semibold tracking-tight sm:text-xl">
          Kanban<span class="hidden sm:inline"> Workspace</span>
        </span>
      </RouterLink>

      <div class="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <div class="flex min-w-0 items-center gap-1.5 sm:gap-3">
          <span
            aria-hidden="true"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold tracking-wide text-blue-800 ring-2 ring-white dark:bg-blue-950 dark:text-blue-200 dark:ring-slate-900 sm:h-9 sm:w-9 sm:text-xs"
          >
            {{ userInitials }}
          </span>

          <div class="min-w-0 max-w-[4.5rem] sm:max-w-[13rem]">
            <p class="truncate text-xs font-semibold leading-4 text-slate-800 dark:text-slate-100 sm:text-sm sm:leading-5">
              {{ user?.name || 'Your account' }}
            </p>
            <p class="hidden truncate text-xs leading-4 text-slate-500 dark:text-slate-400 md:block">
              {{ user?.email }}
            </p>
          </div>
        </div>

        <span aria-hidden="true" class="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

        <button
          :disabled="loading"
          :aria-label="loading ? 'Signing out' : 'Sign out'"
          class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:h-10 sm:w-auto sm:gap-2 sm:rounded-xl sm:px-3"
          @click="logout"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="h-[18px] w-[18px]">
            <path
              d="M10 17l5-5-5-5M15 12H3m9-8h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="sr-only sm:not-sr-only">{{ loading ? 'Signing out…' : 'Sign out' }}</span>
        </button>

        <ThemeToggle />
      </div>
    </nav>

    <p
      v-if="error"
      role="alert"
      class="mx-auto max-w-screen-xl px-4 pb-3 text-red-700 dark:text-red-300"
    >
      {{ error }}
    </p>
  </header>
</template>
