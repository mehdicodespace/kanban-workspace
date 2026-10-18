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
const user = reactive({ name: '', email: '', password: '', password_confirmation: '' })
async function signup() {
  if (loading.value) return
  error.value = ''
  if (user.name.trim().length < 3) {
    error.value = 'Enter a name with at least 3 characters.'
    return
  }
  if (user.password !== user.password_confirmation) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    await store.register(user)
    await router.push({ name: 'dashboard' })
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <AuthLayout title="Create your workspace" description="A fresh start for your tasks and ideas.">
    <p v-if="error" role="alert" class="mb-4 text-sm text-red-700">{{ error }}</p>
    <form @submit.prevent="signup">
      <fieldset :disabled="loading" class="space-y-5">
        <div>
          <label for="name" class="form-label">Name</label>
          <input
            id="name"
            v-model="user.name"
            class="form-input"
            autocomplete="name"
            minlength="3"
            maxlength="80"
            required
          />
        </div>
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
            autocomplete="new-password"
            minlength="8"
            aria-describedby="password-hint"
            required
          />
          <p id="password-hint" class="mt-1 text-xs text-slate-500">Use at least 8 characters.</p>
        </div>
        <div>
          <label for="password-confirmation" class="form-label">Confirm password</label>
          <input
            id="password-confirmation"
            v-model="user.password_confirmation"
            class="form-input"
            type="password"
            autocomplete="new-password"
            minlength="8"
            required
          />
        </div>
        <button class="primary-button w-full" type="submit">
          {{ loading ? 'Creating account…' : 'Create account' }}
        </button>
      </fieldset>
    </form>
    <p class="mt-6 text-sm text-slate-500">
      Already have an account?
      <RouterLink to="/login" class="text-blue-700 font-medium">Sign in</RouterLink>
    </p>
  </AuthLayout>
</template>
