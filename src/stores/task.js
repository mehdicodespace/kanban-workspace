import {ref} from 'vue'
import {defineStore} from 'pinia'
import axios from "axios";

export const useTaskStore = defineStore('task', () => {
    const tasks = ref()

    async function getTasks() {
        const {data} = await axios.get('/api/tasks');
        tasks.value = data?.data
        return data
    }

    async function createTask(task) {
        await axios.post('/api/tasks/',task);
        tasks.value?.push(task)
    }

    async function deleteTask(taskId) {
        const taskIndex = tasks.value?.findIndex(task=> task.id = taskId)
        console.log(taskId)
        tasks.value.splice(taskIndex,1)
        await axios.delete('/api/tasks/'+taskId);
    }

    async function updateTask(task) {
        await axios.put('/api/tasks/'+task.id, task)
    }

    function filterTasks(status){
        return tasks.value?.filter(task=> task.status === status)
    }
    return {tasks, filterTasks, getTasks, createTask, deleteTask, updateTask}
})
