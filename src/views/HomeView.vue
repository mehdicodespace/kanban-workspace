<script setup>
import {onMounted, ref} from "vue";
import {RouterLink} from "vue-router";
import axios from "axios";

const user = ref()

onMounted(async ()=>{
  const {data} = await axios.get('api/user')
  user.value = data
  console.log(user.value)
})
</script>

<template>
  <section class="relative  bg-blueGray-50">
    <div class="relative pt-20 pb-40 flex content-center items-center justify-center min-h-screen-75">
      <div class="absolute top-0 w-full h-full bg-center bg-cover" style="
            background-image: url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1267&amp;q=80');
          ">
        <span id="blackOverlay" class="w-full h-full absolute opacity-75 bg-black"></span>
      </div>
      <div class="container relative mx-auto">
        <div class="items-center flex flex-wrap">
          <div class="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
            <div class="pr-12">
              <h1 class="text-white font-semibold text-5xl">
                Work smarter with with us.
              </h1>
              <p class="mt-4 text-lg text-blue-100">
                Plan, manage and track all your team's tasks in one flexible platform.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px" style="transform: translateZ(0px)">
        <svg class="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
          <polygon class="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>
    <section class="pb-10 bg-blueGray-200 -mt-24">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap">
          <div class="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
              <div class="px-4 py-5 flex-auto">
                <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                  <i class="fas fa-award"></i>
                </div>
                <h6 class="text-xl font-semibold">Effortless time tracking</h6>
                <p class="mt-2 mb-4 text-blueGray-500">
                  An intuitive, lightweight solution for tracking tasks, work hours, and projects that your team will actually use.
                </p>
              </div>
            </div>
          </div>
          <div class="w-full md:w-4/12 px-4 text-center">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
              <div class="px-4 py-5 flex-auto">
                <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400">
                  <i class="fas fa-retweet"></i>
                </div>
                <h6 class="text-xl font-semibold">Detailed task management</h6>
                <p class="mt-2 mb-4 text-blueGray-500">
                  Create and assign specific tasks to help organize, prioritize, and and track progress throughout your project.
                </p>
              </div>
            </div>
          </div>
          <div class="pt-6 w-full md:w-4/12 px-4 text-center">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
              <div class="px-4 py-5 flex-auto">
                <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400">
                  <i class="fas fa-fingerprint"></i>
                </div>
                <h6 class="text-xl font-semibold">Project management</h6>
                <p class="mt-2 mb-4 text-blueGray-500">
                  Keep tasks in order, deadlines on track, and team members aligned with us.
                </p>
              </div>
            </div>
          </div>
        </div>
        <footer class="relative  pt-8 pb-6 mt-1">
          <div class="container mx-auto px-4">
            <div class="flex flex-wrap items-center md:justify-between justify-center">
              <div class="w-full md:w-6/12 px-4 mx-auto text-center">
                <RouterLink to="/signup" class="block w-full py-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create your account</RouterLink>

                <p class="text-sm font-medium mt-4 text-blueGray-500 dark:text-gray-400">
                  Already have an account? <RouterLink to="/login" class="font-medium text-blue-600 hover:underline dark:text-blue-500">Login here</RouterLink>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  </section>
</template>
