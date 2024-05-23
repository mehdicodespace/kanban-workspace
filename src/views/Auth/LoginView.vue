<script setup>
import {reactive, ref} from "vue";
import {RouterLink} from "vue-router";
import axios from "axios";

const user = reactive({
  email: null,
  password: null
})
const userData = ref()

const login = async() => {
  await axios.get('/sanctum/csrf-cookie')
  const token = await axios.post('/login',user)
  console.log(token)
  // const {data} = await axios.get('/api/user')
  // userData.value = data
  // console.log(userData.value)
}

</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <router-link to="/"><i class="fa fa-home text-blue-700 mb-2 text-4xl" aria-hidden="true"></i></router-link>
      <h1 class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        Task management app
      </h1>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h2 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Login to your account
          </h2>
          <form class="space-y-4 md:space-y-6" @submit.prevent="login" autocomplete="off">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input type="email" v-model="user.email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="">
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input type="password" v-model="user.password" name="password" autocomplete="off" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
            </div>

            <button type="submit"
                    class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign In</button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              You don't have an account?  <RouterLink to="/signup" class="font-medium text-blue-600 hover:underline dark:text-blue-500">Create Account here</RouterLink>
            </p>
          </form>
        </div>
      </div>



    </div>
  </section>
</template>
