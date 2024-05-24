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

    async function deleteTask(taskId) {
        await axios.post('/api/task/'+taskId);
    }

    async function updateTask(task) {
        await axios.post('/api/task/'+task.id, task)
    }

    function filterTasks(status){
        return tasks.value?.filter(task=> task.status === status)
    }
    return {tasks, filterTasks, getTasks, deleteTask, updateTask}
})
