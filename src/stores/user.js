import {ref} from 'vue'
import {defineStore} from 'pinia'
import axios from "axios";
import router from '@/router'

export const useUserStore = defineStore('user', () => {
    const userInfo = ref()

    async function getUser() {
        const {data} = await axios.get('/api/user');
        userInfo.value = data
        return data
    }

    async function login(userDetails) {
        await axios.get('/sanctum/csrf-cookie');
        await axios.post('/login', userDetails);
        await getUser()
        router.push('/profile/dashboard')
    }

    async function register(userDetails) {
        await axios.get('/sanctum/csrf-cookie')
        await axios.post('/register', userDetails)
        await getUser()
        router.push('/profile/dashboard')
    }

    return {userInfo, login, register}
})
