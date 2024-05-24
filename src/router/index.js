import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import index from "@/views/Profile/index.vue";
import Dashboard from "@/views/Profile/Dashboard.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: RegisterView
  },
  {
    path: '/profile',
    name: "profile",
    redirect: {name: "dashboard"},
    component: index,
    children: [
      {
        path: "/profile/dashboard",
        component: Dashboard,
        name: "dashboard",
      },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
