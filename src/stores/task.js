import {ref} from 'vue'
import {defineStore} from 'pinia'
import axios from "axios";

export const useTaskStore = defineStore('task', () => {
    const tasks = ref()
    const modalLoading = ref()
    const deleting = ref()

    async function getTasks() {
        const {data} = await axios.get('/api/tasks');
        tasks.value = data?.data
        return data
    }

    async function createTask(task) {
        await axios.post('/api/tasks/',task);
        await getTasks()
    }

    async function deleteTask(taskId) {
        deleting.value = true
        await axios.delete('/api/tasks/'+taskId);
        await getTasks()
        deleting.value = false
    }

    async function updateTask(task) {
        await axios.put('/api/tasks/'+task.id, task)
        await getTasks()
    }

    function filterTasks(status){
        return tasks.value?.filter(task=> task.status === status)
    }
    return {deleting, modalLoading, tasks, filterTasks, getTasks, createTask, deleteTask, updateTask}
})
