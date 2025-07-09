<template>
    <div>
      <h1 v-if="playerExists">Hello World!</h1>
      <h1 v-else>Player does not participate in the game yet</h1>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useTransactionStore } from '@/stores/Transaction'
  import { useRoute } from 'vue-router'
  
  const store = useTransactionStore()
  const route = useRoute()
  const playerExists = ref(false)
  
  onMounted(async () => {
    await store.loadGames()
    await store.loadParticipations({ gameId: route.params.gameId as string })
  
    const currentGame = store.gamesState.games.find(game => game.id === route.params.gameId)
    const currentPlayer = store.playersState.participations.find(player => player.playerId === route.params.playerId)

  })
  
  </script>