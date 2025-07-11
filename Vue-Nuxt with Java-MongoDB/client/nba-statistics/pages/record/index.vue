<template>
  <v-container class="pa-10" fluid>
    <v-row no-gutters>
      <v-col cols="2" class="d-none d-md-flex text-center pa-10">
        <h1 class="text-h4">Games</h1>
      </v-col>

      <v-col cols="auto" class="d-none d-md-flex pa-0 align-center">
        <v-divider :thickness="5" color="var(--theme-primary)" vertical class="my-1 border-opacity-100" style="height: 100%;"></v-divider>
      </v-col>
      
      <v-col class="pa-10">
        <div class="d-md-none text-center mb-6">
          <h1 class="text-h4 mb-4">Games</h1>
          <StyledButton
            parameter="Create"
            @click="createGame"
            class="mx-auto"
          />
        </div>

        <div class="d-none d-md-flex justify-end mb-4">
          <StyledButton
            parameter="Create"
            @click="createGame"
          />
        </div>

        <StyledDialog
            v-model="createGameDialog"
            :items="teamsFromStore"
            :form-data="newGame"
            dialogTitle="New Game"
            title="teamName"
            property="teamId"
            fieldValue1="homeTeamId"
            fieldValue2="visitorTeamId"
            fieldValue3="at"
            label1="Home Team"
            label2="Visitor Team"
            @submit="submitNewGame"
        />
        
        <v-card class="mb-0" variant="outlined">
          <v-card-text class="text-center">
            <h2 class="text-h5">Details</h2>
          </v-card-text>
        </v-card>
        <StyledList
          :items="store.gamesState.games"
          desktop-title1="homeTeamName"
          desktop-title2="visitorTeamName"
          mobileTitle1="homeTeamId"
          mobileTitle2="visitorTeamId"
          parameter1="at"
          parameter2="Running"
          parameter3="Not Running"
          :singleParameterMode="false"
          :function1="viewGameParticipations"
          :function2="isGameRunning"
        ></StyledList>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup lang="ts">
import { useTransactionStore } from '@/stores/Transaction'
import { Game } from '@/models/Game'

const store = useTransactionStore()
const router = useRouter();

const teamsFromStore = computed(() => store.teamsState.teams)

const createGameDialog = ref(false)

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

function isGameRunning(gameTime: Date) {
    const now = new Date();
    const gameDate = new Date(gameTime);
    const twoHoursLater = new Date(gameDate.getTime() + 2 * 60 * 60 * 1000);
    
    return now >= gameDate && now <= twoHoursLater;
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

:deep(.white-label) {
  .v-label,
  .v-field__input,
  input,
  .v-select__selection-text {
    color: white !important;
  }
  
  .v-field__outline {
    color: rgba(255, 255, 255, 0.24) !important;
  }

  input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(1); 
  opacity: 1;
  }
}
</style>