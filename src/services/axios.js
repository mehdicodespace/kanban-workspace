import axios from "axios";

axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
import router from '@/router'
import {useUserStore} from "@/stores/user.js";

axios.interceptors.response.use(function (response) {
    return response
}, function (error) {
    console.log(error)
    const user = localStorage.getItem('user')
    if (error.response.status === 401 && user) {
        localStorage.removeItem('user')
        router.push({name:'login'})
    }
    return Promise.reject(error)
})