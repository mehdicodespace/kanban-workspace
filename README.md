# Kanban Workspace

A Vue 3 task board with Firebase Authentication and Cloud Firestore. Organize work into To-do, In progress, and Done, with descriptions and one level of subtasks.

## Features

- Email and password registration, sign-in, and sign-out.
- A private board for every account, with Firebase-managed sessions.
- Create, edit, and delete tasks; deleting a parent also deletes its subtasks.
- Responsive board columns, keyboard-accessible task dialogs, and visible error/loading states.
- Persistent cloud storage with ownership and field validation enforced by Firestore rules.

## Run locally

Requires Node.js 22.12 or newer.

```sh
npm ci
cp .env.example .env
npm run dev
```

Fill `.env` with your Firebase web app configuration before starting. The development server runs at `http://localhost:3000`.

```sh
npm run lint
npm test
npm run build
npm run preview
```

## Firebase configuration

1. Register a web app in your Firebase project and copy its configuration into `.env` using the variable names in `.env.example`.
2. Enable the Email/Password provider in Firebase Authentication.
3. Create a Cloud Firestore **Standard edition** database in production mode.
4. Publish the included `firestore.rules`. Default production rules deny all access until these rules are published.
5. Add your deployment domain to Authentication's authorized domains when required by the chosen sign-in flow.

The web app uses the modular Firebase SDK directly. Firebase supplies the authentication API and database API, so no custom backend, Laravel installation, Axios client, or separate REST server is needed.

Firebase client configuration is included in the browser build; `.env` separates environments rather than making these values secret. Never put service-account credentials or admin keys in `VITE_*` variables. Firestore rules enforce access to data.

### Data model and access

Tasks are stored at `users/{uid}/tasks/{taskId}`. Documents contain `title`, `description`, `status`, `parent_id`, `createdAt`, and `updatedAt`.

Rules restrict every read and write to the signed-in owner. Writes validate allowed fields, text lengths, statuses, timestamps, and parent references. A task can have one parent, and a parent cannot itself be a subtask. The parent reference is fixed after creation to prevent cycles or nesting. Parent deletion removes its direct subtasks in an atomic batch (up to 500 documents).

## Project structure

```text
src/
  assets/                 Global styles and bundled images
  components/
    layout/               Shared navigation
    tasks/                BoardColumn, TaskCard, TaskModal
  layouts/                Shared page shell
  router/                 Lazy-loaded routes and session-aware guards
  services/               Firebase setup, authentication, and task persistence
  stores/                 Pinia session and task state
  utils/                  Validation and readable error messages
  views/
    auth/                 Login and registration pages
    profile/              Board pages
    HomeView.vue           Landing page

tests/                    Task validation and hierarchy checks
firestore.rules           Server-enforced database access and schema
firebase.json             Rules and optional Firebase Hosting configuration
```

Pages coordinate user interactions, reusable components render the board, stores manage shared state, and services own Firebase operations. Route guards wait for Firebase to restore the session rather than trusting a localStorage flag. The task editor works on a draft so cancelling never changes the board.

## Deployment

Build command: `npm run build`. Publish directory: `dist`.

Set all variables from `.env.example` in your hosting provider before building. Vite embeds these values at build time. Netlify's SPA fallback is included in `public/_redirects`; Firebase Hosting rewrites are included in `firebase.json`.

To publish rules with the Firebase CLI after signing in:

```sh
npx firebase-tools deploy --only firestore:rules --project YOUR_PROJECT_ID
```

## Original backend

The original frontend required an external Laravel Sanctum server, which was not part of this repository. It called `/sanctum/csrf-cookie`, `/login`, `/register`, `/logout`, `/api/user`, and `/api/tasks`. Those calls and the old `VITE_BASE_URL` configuration have been replaced with Firebase services.

## Scope

This is a personal task workspace. Status changes happen in the task editor; drag-and-drop, shared team boards, invitations, and password recovery are not implemented.
