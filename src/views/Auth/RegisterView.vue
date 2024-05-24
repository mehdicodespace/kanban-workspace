<script setup>
import {reactive, ref} from "vue";
import {RouterLink} from "vue-router";
import {validateEmail} from '@/helpers/validatiors.js'
import {useUserStore} from "@/stores/user.js";

const store = useUserStore()

const user = reactive({
  name: null,
  email: null,
  password: null,
  password_confirmation: null,
})

const errors = ref({
  name: [],
  email: [],
  password: [],
  password_confirmation: []
})

const loading = ref(false)

const signup = async () => {
  errors.value = {
    name: [],
    email: [],
    password: [],
    password_confirmation: []
  }
  if (user.name && user.name.length > 2) {
    if (validateEmail(user.email)) {
      if (user.password && user.password.length >= 8) {
        if (user.password === user.password_confirmation) {
          loading.value = true
          await store.register(user)
          loading.value = false
        } else errors.value.password_confirmation.push("Password & password confirmation doesn't match")
      } else errors.value.password.push("The password field must be at least 8 characters.")
    } else errors.value.email.push("Email is not correct")
  } else errors.value.name.push("Name must be more than 2 characters")
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
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create an account
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="signup" autocomplete="off">
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
              <input type="text" v-model="user.name" name="name" id="name"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder="name">
              <template v-if="errors.name.length">
                <p class="text-red-600" v-for="nameError in errors.name">{{ nameError }}</p>
              </template>
            </div>
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input type="email" v-model="user.email" name="email" id="email"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder="name@company.com">
              <template v-if="errors.email.length">
                <p class="text-red-600" v-for="emailError in errors.email">{{ emailError }}</p>
              </template>
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input type="password" v-model="user.password" name="password" autocomplete="off" id="password" placeholder="••••••••"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <template v-if="errors.password.length">
                <p class="text-red-600" v-for="passwordError in errors.password">{{ passwordError }}</p>
              </template>
            </div>
            <div>
              <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
              <input type="password" v-model="user.password_confirmation" name="confirm-password" id="confirm-password" placeholder="••••••••"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <template v-if="errors.password_confirmation.length">
                <p class="text-red-600" v-for="password_confirmationError in errors.password_confirmation">{{ password_confirmationError }}</p>
              </template>
            </div>

            <button type="submit"
                    class="flex outline-none items-center gap-4 justify-center w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <span class="loader" v-if="loading"></span>
              Create an account
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?
              <RouterLink to="/login" class="font-medium text-blue-600 hover:underline dark:text-blue-500">Login here</RouterLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>