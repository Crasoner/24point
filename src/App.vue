<script setup>
import { onMounted } from 'vue'
import { useGameStore } from './stores/game'

const gameStore = useGameStore()

onMounted(() => {
  gameStore.loadHistory()
})
</script>

<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

#app {
  min-height: 100vh;
}
</style>
