<script setup>
import { ref } from 'vue'

import { storeToRefs } from 'pinia'

import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user'

import { errorMessage } from '@/utils/errors'

import avatarUrl from '@/assets/images/user.png'

const store = useUserStore()

const { userInfo: user } = storeToRefs(store)

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
  <header class="bg-white border-b border-gray-200">
    <nav
      aria-label="Main navigation"
      class="max-w-screen-xl mx-auto p-4 flex flex-wrap items-center justify-between gap-4"
    >
      <RouterLink to="/" class="text-xl font-semibold text-slate-900">Kanban Task Board</RouterLink>

      <div class="flex items-center flex-wrap gap-3">
        <img :src="avatarUrl" alt="" class="w-9 h-9 rounded-full" />

        <div class="text-sm">
          <p class="font-medium">{{ user?.name }}</p>
          <p class="text-gray-500 break-all">{{ user?.email }}</p>
        </div>

        <button :disabled="loading" class="text-red-600 text-sm px-3 py-2" @click="logout">
          {{ loading ? 'Signing out…' : 'Log out' }}
        </button>
      </div>
    </nav>

    <p v-if="error" role="alert" class="text-red-700 max-w-screen-xl mx-auto px-4 pb-3">
      {{ error }}
    </p>
  </header>
</template>
