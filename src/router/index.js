import { useUserStore } from '@/stores/user'
import { createRouter, createWebHistory } from 'vue-router'
const HomeView = () => import('@/views/HomeView.vue')
const LoginView = () => import('@/views/auth/LoginView.vue')
const RegisterView = () => import('@/views/auth/RegisterView.vue')
const ProfileView = () => import('@/views/profile/ProfileView.vue')
const DashboardView = () => import('@/views/profile/DashboardView.vue')

const routes = [
  { path: '/:pathMatch(.*)*', redirect: '/' },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Task management | Home page'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      type: 'guest',
      title: 'Task management | Login page'
    }
  },
  {
    path: '/signup',
    name: 'signup',
    component: RegisterView,
    meta: {
      type: 'guest',
      title: 'Task management | Signup page'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    redirect: { name: 'dashboard' },
    component: ProfileView,
    children: [
      {
        path: 'dashboard',
        component: DashboardView,
        name: 'dashboard',
        meta: {
          type: 'user',
          title: 'Task management | Dashboard page'
        }
      }
    ],
    meta: { type: 'user' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const store = useUserStore()
  await store.initialize()
  const user = store.userInfo
  if (to.meta.type === 'user' && !user) return { name: 'login' }
  if (to.meta.type === 'guest' && user) return { name: 'dashboard' }
})

const DEFAULT_TITLE = 'Task management app'
router.afterEach((to) => {
  document.title = to.meta.title || DEFAULT_TITLE
})

export default router
