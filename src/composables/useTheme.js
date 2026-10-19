import { computed, ref } from 'vue'

const STORAGE_KEY = 'kanban-workspace-theme'

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem(STORAGE_KEY)

  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref(getInitialTheme())

function applyTheme() {
  const isDark = theme.value === 'dark'

  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.style.colorScheme = theme.value
}

export function initializeTheme() {
  applyTheme()
}

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme() {
    theme.value = isDark.value ? 'light' : 'dark'
    window.localStorage.setItem(STORAGE_KEY, theme.value)
    applyTheme()
  }

  return { isDark, toggleTheme }
}
