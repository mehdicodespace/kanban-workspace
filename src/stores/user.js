import {ref} from 'vue'
import {defineStore} from 'pinia'
import axios from "axios";
import router from '@/router'
import {useTaskStore} from "@/stores/task.js";

export const useUserStore = defineStore('user', () => {
    const userInfo = ref()
    async function getUser() {
        const {data} = await axios.get('/api/user');
        userInfo.value = data
        localStorage.setItem('user',JSON.stringify(data))
        return data
    }

    async function login(userDetails) {
        await axios.get('/sanctum/csrf-cookie');
        const {data} = await axios.post('/login', userDetails);
        useTaskStore().resetStore()
        await getUser()
        router.push({name:'dashboard'})
    }

    async function register(userDetails) {
        await axios.get('/sanctum/csrf-cookie')
        const {data} =await axios.post('/register', userDetails)
        useTaskStore().resetStore()
        await getUser()
        router.push({name:'dashboard'})
    }

    async function logout() {
        await axios.post('/logout')
        localStorage.removeItem('user')
        userInfo.value = ''
        useTaskStore().resetStore()
        router.push({name:'login'})
    }

    return {userInfo, getUser, login, register, logout}
})
