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
    await store.loadPlayers({ gameId: route.params.gameId as string })
  
    const currentGame = store.gamesState.games.find(game => game.id === route.params.gameId)
    const currentPlayer = store.playersState.players.find(player => player.playerId === route.params.playerId)
  
    if (currentGame) {
      store.setCurrentGame(currentGame);
    } else {
      console.error('Game not found for id:', route.params.gameId);
    }
  
    if (currentPlayer) {
    //   store.setCurrentPlayer(currentPlayer);
      playerExists.value = true;
    } else {
      console.error('No players found for game:', route.params.gameId);
      playerExists.value = false;
    }
  })
  </script>