import { ref } from 'vue'
import { defineStore } from 'pinia'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { authService } from '@/services/auth'
import { useTaskStore } from './task'

function profile(user) {
  return user
    ? { id: user.uid, name: user.displayName || 'Your workspace', email: user.email }
    : null
}
export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  let initialized
  function initialize() {
    if (!initialized) {
      initialized = new Promise((resolve, reject) => {
        if (!auth) {
          resolve()
          return
        }
        onAuthStateChanged(
          auth,
          (user) => {
            if (userInfo.value?.id !== user?.uid) useTaskStore().resetStore()
            userInfo.value = profile(user)
            resolve()
          },
          reject
        )
      })
    }
    return initialized
  }
  async function login(details) {
    userInfo.value = profile(await authService.login(details))
  }
  async function register(details) {
    userInfo.value = profile(await authService.register(details))
  }
  async function logout() {
    await authService.logout()
    userInfo.value = null
    useTaskStore().resetStore()
  }
  return { userInfo, initialize, login, register, logout }
})
