<template>
  <v-container class="pa-10" fluid>
    <v-row no-gutters>
      <v-col cols="2" class="text-center pa-10">
        <h1 class="text-h4">Participations</h1>
      </v-col>

      <v-col cols="auto" class="pa-0 d-flex align-center">
        <v-divider :thickness="5" color="var(--theme-primary)" vertical class="my-4 border-opacity-100" style="height: 100%;"></v-divider>
      </v-col>
      
      <v-col class="pa-10">
        <div class="d-flex justify-end mb-4">
          <v-btn color="var(--theme-secondary)" @click="openForm" style="min-width: 200px; display: flex; justify-content: center; align-items: center">
            <span style="flex: 1; text-align: center">New Player</span>
          </v-btn>
        </div>
        
        <v-card class="mb-0" variant="outlined">
          <v-card-text class="text-center">
            <h2 class="text-h5">Details</h2>
          </v-card-text>
        </v-card>
        
        <v-list class="players-list" bg-color="var(--theme-background)" style="max-height: 400px; overflow-y: auto;">
          <v-list-item
            v-for="player in store.playersState.players"
            :key="player.playerId"
            @click="trackPlayer(player)"
            class="game-item"
            :style="{ minHeight: '72px', height: '72px' }"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-basketball"></v-icon>
            </template>
            
            <v-list-item-title>
              {{ player.playerName }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTransactionStore } from '@/stores/Transaction'

const store = useTransactionStore()
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  await store.loadGames();
  await store.loadPlayers({gameId: route.params.gameId as string})

  const currentGame = store.gamesState.games.find(game => game.id === route.params.gameId)
  if (currentGame) {
    store.setCurrentGame(currentGame);
  }
})

function trackPlayer(player: any) {  
  store.setCurrentPlayer(player)
  if (store.gamesState.currentGame) {
    router.push(`/record/${store.gamesState.currentGame.id}/participations/${player.playerId}/tracking`)
  } else {
    console.error('Current game is null');
  }
}

function openForm() {
  console.log('Selected Game:', null)
}

</script>

<style scoped>
.players-list {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
}

/* Custom scrollbar styling */
.players-list::-webkit-scrollbar {
  width: 8px;
}

.players-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.players-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.players-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.game-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.game-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateX(4px);
}

.game-item:active {
  transform: scale(0.98);
}

.v-divider--vertical {
  height: 90%;
  margin-top: auto;
  margin-bottom: auto;
}
</style>