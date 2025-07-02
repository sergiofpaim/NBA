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
          <StyledButton
          parameter="Create"
          @click="createGame"/>
        </div>

        <!-- Dialog -->
        <v-dialog v-model="createGameDialog" max-width="600">
          <v-card color="var(--theme-background)" class="card-dialog">
            <v-card-title class="text-center pt-5" style="color:var(--theme-primary)">New Game</v-card-title>
            <v-card-text>
              <v-select
                v-model="newGame.homeTeamId"
                :items="teamsFromStore"
                item-title="teamName"
                item-value="teamId"
                label="Home Team"
                outlined
                class="mb-4 white-label"
              ></v-select>
              
              <v-select
                v-model="newGame.visitorTeamId"
                :items="teamsFromStore"
                item-title="teamName"
                item-value="teamId"
                label="Visitor Team"
                outlined
                class="mb-4 white-label"
              ></v-select>
              
              <v-text-field
                v-model="newGame.at"
                type="datetime-local"
                label="Date & Time"
                class="mb-4 white-label"
                outlined
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="createGameDialog = false" color="var(--theme-secondary)">Cancel</v-btn>
              <v-btn color="var(--theme-primary)" @click="submitNewGame" >Create</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- /Dialog -->
        
        <v-card class="mb-0" variant="outlined">
          <v-card-text class="text-center">
            <h2 class="text-h5">Details</h2>
          </v-card-text>
        </v-card>
        <StyledList
        :items="store.gamesState.games"
        parameter1="homeTeamName"
        parameter2="visitorTeamName"
        parameter3="at"
        :onClick="viewGameParticipations"
        />
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

const createGameDialog = ref(false)

const teamsFromStore = computed(() => store.teamsState.teams)

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
</script>

<style scoped>
.v-divider--vertical {
  height: 90%;
  margin-top: auto;
  margin-bottom: auto;
}

.card-dialog{
  border-radius: 24px !important;
}

::v-deep(.white-label .v-label) {
  color: white !important;
}
</style>