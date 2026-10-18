<script setup>
import { RouterView } from 'vue-router'
import { isFirebaseConfigured } from '@/services/firebase'
</script>
<template>
  <div v-if="!isFirebaseConfigured" role="alert" class="bg-amber-50 text-amber-900 p-4 text-center">
    Firebase setup is required. Add your project configuration to .env and restart the app.
  </div>
  <RouterView />
</template>
