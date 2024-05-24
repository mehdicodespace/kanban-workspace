import {ref} from 'vue'
import {defineStore} from 'pinia'
import axios from "axios";

export const useTaskStore = defineStore('task', () => {
    const tasks = ref()

    async function getTasks() {
        const {data} = await axios.get('/api/tasks');
        tasks.value = data
        return data
    }

    async function deleteTask(taskId) {
        await axios.post('/api/task/'+taskId);
    }

    async function updateTask(task) {
        await axios.post('/api/task/'+task.id, task)
    }

    return {getTasks, deleteTask, updateTask}
})
