import {createRouter, createWebHistory} from 'vue-router'
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
        component: LoginView,
        meta: {type: 'guest'}
    },
    {
        path: '/signup',
        name: 'signup',
        component: RegisterView,
        meta: {type: 'guest'}
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
                meta: {type: 'user'}
            },
        ],
        meta: {type: 'user'}
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    let user = localStorage.getItem('user')
    if (to.meta.type === 'user') {
        if (!user) router.push({name: 'login'})
    } else if (to.meta.type === 'guest') {
        if (user) router.push({name: 'dashboard'})
    }
    next()
})

export default router
