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
        component: HomeView,
        meta: {
            title: "Task management | Home page"
        }
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {
            type: 'guest',
            title: "Task management | Login page"
        },

    },
    {
        path: '/signup',
        name: 'signup',
        component: RegisterView,
        meta: {
            type: 'guest',
            title: "Task management | Signup page"
        },

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
                meta: {
                    type: 'user',
                    title: "Task management | Dashboard page"
                },

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

const DEFAULT_TITLE = 'Task management app';
router.afterEach((to, from) => {
    // Use next tick to handle router history correctly
    // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
        document.title = to.meta.title || DEFAULT_TITLE;
});

export default router
