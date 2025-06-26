<template>
  <v-container class="pa-10" fluid>
    <v-row no-gutters>
      <v-col cols="2" class="text-center pa-10">
        <h1 class="text-h4">Last Games</h1>
      </v-col>

      <v-col cols="auto" class="pa-0 d-flex align-center">
        <v-divider :thickness="5" color="var(--theme-primary)" vertical class="my-4 border-opacity-100" style="height: 100%;"></v-divider>
      </v-col>
      
      <v-col class="pa-10">
        <div class="d-flex justify-end mb-4">
          <v-btn color="var(--theme-secondary)" @click="openForm" style="min-width: 200px; display: flex; justify-content: center; align-items: center">
            <span style="flex: 1; text-align: center">Create</span>
          </v-btn>
        </div>
        
        <v-card class="mb-0" variant="outlined">
          <v-card-text class="text-center">
            <h2 class="text-h5">Details</h2>
          </v-card-text>
        </v-card>
        
        <v-list class="games-list" bg-color="var(--theme-background)" style="max-height: 400px; overflow-y: auto;">
          <v-list-item
            v-for="game in store.gamesState.games"
            :key="game.id"
            @click="viewGame(game)"
            class="game-item"
            :style="{ minHeight: '72px', height: '72px' }"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-basketball"></v-icon>
            </template>
            
            <v-list-item-title>
              <strong>{{ game.homeTeamName }}</strong> vs <strong>{{ game.visitorTeamName }}</strong>
            </v-list-item-title>
            
            <v-list-item-subtitle>
              {{ formatDate(game.at) }}
            </v-list-item-subtitle>
            
            <template v-slot:append>
              <v-chip color="primary" variant="outlined">
                Game ID: {{ game.id }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTransactionStore } from '@/stores/Transaction'
import { Game } from '@/models/Game'

const store = useTransactionStore()
const router = useRouter();

onMounted(async () => {
  await store.loadGames()
})

function viewGame(game: Game) {
  store.setCurrentGame(game)
  router.push(`/record/${game.id}`)
}

function openForm() {
  console.log('Selected Game:', null)
}

function formatDate(dateValue: string | Date) {
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.games-list {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
}

/* Custom scrollbar styling */
.games-list::-webkit-scrollbar {
  width: 8px;
}

.games-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.games-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.games-list::-webkit-scrollbar-thumb:hover {
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