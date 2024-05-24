# Task management  (Vue 3)

Developed via **TailwindCSS, Pinia state management, Axios & Vue-Router**.
## Folder structure:

- **Assets** (Including main style file & Images directory)
- **Components** (Including **TaskModal.vue** & navigation component  used in dashboard page)
- **Helpers** (Including email validator utility function to use in different places)
- **Layouts** (To put different layout components containing **ProfileLayout.vue**)
- **Router** (Routes configuration, linking to components)
- **Services** (Axios configurations, in future could contain more configs + services separated)
- **Stores** (Pinia stores including user & task store for implementing different actions & sharing states)
- **Views** (Page components used to link each route to a component)

# How to run the project
>### Project Setup
```sh  
npm install
```
>### Compile and Hot-Reload for Development
```sh  
npm run dev
```
>### Compile and Minify for Production
```sh  
npm run build
```
<br>
> In the **vite.config.js** file located in the root of the project you can config the **app port**

    server: {  
      port: 3000  
    },
> consider if you wanted to config laravel backend put related configurations there.

<br>

## Brief Info about project structure & design system
There are two main stores:
**userStore**  which handles almost everything related to user (**Login, Register, Saving user data, getting user info, Logout**)

**taskStore** which handles (**Getting tasks list**, **filtering tasks based on status**, **Creating new task**, **updating a task**, **Deleting a task** as well as handling loading states for deleting, and modal update and create task loadings)

There is an axios error interceptor to handle 401 errors to signout user and redirect to login page as well.

Each task can have a subtask, but subtasks can't have another subtask based on this UI design.

I could implement drag and drop functionality for changing status of each task & much more better features and functionalities but currently as a simple task for testing my skills I think it has a good state to be showen for now.

You can see the way of transfering data & handling errors in the components as well which can have improvements a lot.
# Router config details
> Every route has a meta key, containing page title & auth type (for example guest type routes is only for unauhrized users)

    {  
        meta: {  
            type: 'guest',  
            title: "Task management | Login page"  
      },  
    },

> Auhrized routes have type of user like below:

    {  
        path: "/profile/dashboard",  
        component: Dashboard,  
        name: "dashboard",  
        meta: {  
            type: 'user',  
            title: "Task management | Dashboard page"  
      },  
    },

> in the router config with **router.beforeEach** function hook we check these parameters alongside user token to decide user can see requested page or needs to get's redirected.

    router.beforeEach((to, from, next) => {  
        let user = localStorage.getItem('user')  
        if (to.meta.type === 'user') {  
            if (!user) router.push({name: 'login'})  
        } else if (to.meta.type === 'guest') {  
            if (user) router.push({name: 'dashboard'})  
        }  
        next()  
    })

> Also with **router.afterEach** hook we set page title of each route

    const DEFAULT_TITLE = 'Task management app';  
    router.afterEach((to, from) => {  
            document.title = to.meta.title || DEFAULT_TITLE;  
    });
