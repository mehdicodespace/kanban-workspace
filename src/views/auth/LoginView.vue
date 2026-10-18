<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { errorMessage } from '@/utils/errors'
const router = useRouter()
const store = useUserStore()
const error = ref('')
const loading = ref(false)
const user = reactive({ email: '', password: '' })
async function login() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    await store.login(user)
    await router.push({ name: 'dashboard' })
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <AuthLayout title="Welcome back" description="Sign in to pick up where you left off.">
    <p v-if="error" role="alert" class="mb-4 text-sm text-red-700">{{ error }}</p>
    <form @submit.prevent="login">
      <fieldset :disabled="loading" class="space-y-5">
        <div>
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="user.email"
            class="form-input"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="user.password"
            class="form-input"
            type="password"
            autocomplete="current-password"
            required
          />
        </div>
        <button class="primary-button w-full" type="submit">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </fieldset>
    </form>
    <p class="mt-6 text-sm text-slate-500">
      New here?
      <RouterLink to="/signup" class="text-blue-700 font-medium">Create an account</RouterLink>
    </p>
  </AuthLayout>
</template>
