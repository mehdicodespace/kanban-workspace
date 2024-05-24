<script setup>
import {ref, reactive} from "vue";
import TaskModal from "@/components/TaskModal.vue";
import {useTaskStore} from "@/stores/task.js";
import {onBeforeMount} from "vue";
import {storeToRefs} from "pinia";

const taskStore = useTaskStore()

const {tasks} = storeToRefs(taskStore)

const taskModalType = ref(false)
const task = ref({
  title:'',
  status:'',
  description:''
})

onBeforeMount(async () => {
  await taskStore.getTasks()
})

const modalSubmitted = ({task,type}) => {
  if(type === 'create') taskStore.createTask(task)
  else if(type === 'update') taskStore.updateTask(task)

  taskModalType.value = false
  task.value = {
    title:'',
    status:'',
    description:''
  }
}

const createTaskModal = (status) =>{
  console.log('test')
  task.value = {
    title:'',
    status,
    description:''
  }
  taskModalType.value = 'create'
}
</script>

<template>
  <TaskModal v-if="taskModalType" v-model:task="task" @close="taskModalType=false" :type="taskModalType" @modalUpdate="modalSubmitted" />
  <div class="max-w-screen-xl mx-auto p-2 mt-4">
    <div class="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-5">
      <!-- To-do -->
      <div class="bg-white rounded px-2 py-2">
        <!-- board category header -->
        <div class="flex flex-row justify-between items-center mb-2 mx-1">
          <div class="flex items-center">
            <h2 class="bg-red-100 text-sm w-max px-1 rounded mr-2 text-gray-700">To-do</h2>
            <p class="text-gray-400 text-sm">{{ taskStore.filterTasks("todo")?.length }}</p>
          </div>

          <div class="flex items-center text-gray-300">
            <p class="mr-2 text-2xl">---</p>
            <p class="text-2xl cursor-pointer text-gray-300 transition duration-200 hover:text-gray-600" @click="createTaskModal('todo')">+</p>
          </div>
        </div>
        <!-- board card -->
        <div class="grid gap-2">
          <div class="relative p-4 rounded shadow-sm border-gray-100 border-2" v-for="todoTask in taskStore.filterTasks('todo')">
            <h3 class="text-sm mb-3 text-gray-700">{{ todoTask.title }}</h3>
            <p class="bg-red-100 text-xs w-max p-1 rounded mr-2 text-gray-700">To-do</p>
            <div class="absolute top-4 right-4 flex flex-col gap-2 text-sm">
              <span class="text-red-500 flex gap-2 items-center cursor-pointer" @click="taskStore.deleteTask(todoTask.id)">
                <i class="fa fa-trash text-red-400" aria-hidden="true"></i>
                Delete
              </span>
              <span class="text-gray-500 flex gap-2 items-center cursor-pointer" @click="task = todoTask;taskModalType='update'"><i class="fas fa-edit"></i>Edit</span>
            </div>
          </div>
        </div>
        <div class="inline-flex flex-row items-center text-gray-300 transition duration-200 hover:text-gray-600 mt-2 px-1 cursor-pointer" @click="createTaskModal('todo')">
          <p class="rounded mr-2 text-2xl">+</p>
          <p class="pt-1 rounded text-sm">New</p>
        </div>
      </div>

      <!-- In progress Kanban -->
      <div class="bg-white rounded px-2 py-2">
        <!-- board category header -->
        <div class="flex flex-row justify-between items-center mb-2 mx-1">
          <div class="flex items-center">
            <h2 class="bg-yellow-100 text-sm w-max px-1 rounded mr-2 text-gray-700">In progress</h2>
            <p class="text-gray-400 text-sm">{{ taskStore.filterTasks('in progress')?.length }}</p>
          </div>
          <div class="flex items-center text-gray-300">
            <p class="mr-2 text-2xl">---</p>
            <p class="text-2xl cursor-pointer text-gray-300 transition duration-200 hover:text-gray-600" @click="createTaskModal('in progress')">+</p>
          </div>
        </div>
        <!-- board card -->
        <div class="grid gap-2">
          <div class="relative p-4 rounded shadow-sm border-gray-100 border-2" v-for="inProgressTask in taskStore.filterTasks('in progress')">
            <h3 class="text-sm mb-3 text-gray-700">{{ inProgressTask.title }}</h3>
            <p class="bg-yellow-100 text-xs w-max p-1 rounded mr-2 text-gray-700">In progress</p>

            <div class="absolute top-4 right-4 flex flex-col gap-2 text-sm">
              <span class="text-red-500 flex gap-2 items-center cursor-pointer" @click="taskStore.deleteTask(inProgressTask.id)">
                <i class="fa fa-trash text-red-400" aria-hidden="true"></i>
                Delete
              </span>
              <span class="text-gray-500 flex gap-2 items-center cursor-pointer" @click="task = inProgressTask;taskModalType='update'"><i class="fas fa-edit"></i>Edit</span>
            </div>
          </div>
        </div>
        <div class="inline-flex flex-row items-center text-gray-300 transition duration-200 hover:text-gray-600 mt-2 px-1 cursor-pointer"
             @click="createTaskModal('in progress')">
          <p class="rounded mr-2 text-2xl">+</p>
          <p class="pt-1 rounded text-sm">New</p>
        </div>
      </div>

      <!-- Complete Kanban -->
      <div class="bg-white rounded px-2 py-2">
        <!-- board category header -->
        <div class="flex flex-row justify-between items-center mb-2 mx-1">
          <div class="flex items-center">
            <h2 class="bg-green-100 text-sm w-max px-1 rounded mr-2 text-gray-700">Complete</h2>
            <p class="text-gray-400 text-sm">{{ taskStore.filterTasks('done')?.length }}</p>
          </div>
          <div class="flex items-center">
            <p class="text-gray-300 mr-2 text-2xl">---</p>
            <p class="text-2xl text-gray-300 transition duration-200 hover:text-gray-600 cursor-pointer" @click="createTaskModal('done')">+</p>
          </div>
        </div>
        <!-- board card -->
        <div class="grid gap-2">
          <div class="relative p-4 rounded shadow-sm border-gray-100 border-2" v-for="doneTask in taskStore.filterTasks('done')">
            <h3 class="text-sm mb-3 text-gray-700">{{ doneTask.title }}</h3>
            <p class="bg-green-100 text-xs w-max p-1 rounded mr-2 text-gray-700">Complete</p>
            <div class="absolute top-4 right-4 flex flex-col gap-2 text-sm">
              <span class="text-red-500 flex gap-2 items-center cursor-pointer" @click="taskStore.deleteTask(doneTask.id)">
                <i class="fa fa-trash text-red-400" aria-hidden="true"></i>
                Delete
              </span>
              <span class="text-gray-500 flex gap-2 items-center cursor-pointer" @click="task = doneTask;taskModalType='update'"><i class="fas fa-edit"></i>Edit</span>
            </div>
          </div>
        </div>
        <div class="flex flex-row items-center text-gray-300 transition duration-200 hover:text-gray-600 mt-2 px-1 cursor-pointer"
             @click="createTaskModal('done')">
          <p class="rounded mr-2 text-2xl">+</p>
          <p class="pt-1 rounded text-sm">New</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>