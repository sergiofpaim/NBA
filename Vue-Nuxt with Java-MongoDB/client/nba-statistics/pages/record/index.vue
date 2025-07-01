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
          <v-btn color="var(--theme-secondary)" @click="createGame" style="min-width: 200px; display: flex; justify-content: center; align-items: center">
            <span style="flex: 1; text-align: center; color:var(--theme-primary)">Create</span>
          </v-btn>
        </div>

        <!-- Dialog -->

        <v-dialog v-model="createGameDialog" max-width="600">
          <v-card color="var(--theme-background)">
            <v-card-title class="text-center" style="color:var(--theme-primary)">Create New Game</v-card-title>
            <v-card-text>
              <v-select
                v-model="newGame.homeTeamId"
                :items="teamsFromStore"
                item-title="teamName"
                item-value="teamId"
                label="Home Team"
                outlined
                class="mb-4"
              ></v-select>
              
              <v-select
                v-model="newGame.visitorTeamId"
                :items="teamsFromStore"
                item-title="teamName"
                item-value="teamId"
                label="Visitor Team"
                outlined
                class="mb-4"
              ></v-select>
              
              <v-text-field
                v-model="newGame.at"
                type="datetime-local"
                label="Game Date & Time"
                outlined
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="createGameDialog = false">Cancel</v-btn>
              <v-btn color="var(--theme-background)" @click="submitNewGame">Create</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- End of dialog -->
        
        <v-card class="mb-0" variant="outlined">
          <v-card-text class="text-center">
            <h2 class="text-h5">Details</h2>
          </v-card-text>
        </v-card>
        
        <v-list class="games-list" bg-color="var(--theme-background)" style="max-height: 400px; overflow-y: auto;">
          <v-list-item
            v-for="game in store.gamesState.games"
            :key="game.id"
            @click="viewGameParticipations(game)"
            class="game-item"
            :style="{ minHeight: '72px', height: '72px' }"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-basketball"></v-icon>
            </template>
            
            <v-list-item-title style="color:var(--theme-primary)">
              {{ game.homeTeamName }} <strong> vs </strong>{{ game.visitorTeamName }}
            </v-list-item-title>
            
            <v-list-item-subtitle style="color:var(--theme-primary)">
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

const teamsFromStore = computed(() => store.teamsState.teams)

const createGameDialog = ref(false)


onMounted(async () => {
  await store.loadGames()
  await store.loadTeams()
})

function createGame() {
  createGameDialog.value = true
}

const newGame = ref({
  homeTeamId: '',
  visitorTeamId: '',
  at: new Date(),
})

function submitNewGame() {
  createGameDialog.value = false
  store.createGame({
    homeTeamId: newGame.value.homeTeamId,
    visitorTeamId: newGame.value.visitorTeamId,
    at: new Date(newGame.value.at),
  })
}

function viewGameParticipations(game: Game) {
  store.setCurrentGame(game)
  router.push(`/record/${game.id}/participations`)
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