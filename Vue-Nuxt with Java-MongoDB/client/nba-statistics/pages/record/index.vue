<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="store.gamesState.games"
      class="elevation-1"
      item-class="hover-row"
      @click:row="viewGame"
      hide-default-footer
    />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTransactionStore } from '@/stores/Transaction'
import { Game } from '@/models/Game'

const store = useTransactionStore()

// Define headers for the table
const headers = ref([
  { title: 'Game ID', key: 'id' },
  { title: 'Home Team', key: 'homeTeamName' },
  { title: 'Visitor Team', key: 'visitorTeamName' },
  { title: 'Date', key: 'at' }
])

// Load data on mount
onMounted(async () => {
  await store.loadGames()
})

function viewGame(game: Game) {
  store.setCurrentGame(game)
  console.log('Selected Game:', game)
}
</script>

<style scoped>
.hover-row {
  cursor: pointer;
  transition: background-color 0.2s;
}
.hover-row:hover {
  background-color: #f5f5f53f;
}
</style>
