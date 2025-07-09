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
          <StyledButton
            parameter="Add Player"
            @click="addPlayer"/>
        </div>

        <StyledDialog
            v-model="addPlayerDialog"
            :items="store.playersState.players"
            :form-data="newPlayer"
            dialogTitle="New Participation"
            title="playerName"
            property="playerId"
            fieldValue1="playerId"
            label1="Players"
            @submit="trackNewPlayer"
        />
        
        <v-card class="mb-0" variant="outlined">
          <v-card-text class="text-center">
            <h2 class="text-h5">Details</h2>
          </v-card-text>
        </v-card>
        <StyledList
        :items="store.playersState.participations"
        desktopTitle1="playerName"
        :function1="trackPlayer"
        :singleParameterMode="true"
      />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTransactionStore } from '@/stores/Transaction'
import { PlayerSelection } from '~/models/PlayerSelection';

const store = useTransactionStore()
const router = useRouter();
const route = useRoute();

const addPlayerDialog = ref(false)

onMounted(async () => {
  await store.loadParticipations({gameId: route.params.gameId as string})
  await store.loadPlayers({ gameId: route.params.gameId as string })
  await store.loadGames();

  const currentGame = store.gamesState.games.find(game => game.id === route.params.gameId)

  if (currentGame) {
    store.setCurrentGame(currentGame);
  }
})

const newPlayer = ref<PlayerSelection>(new PlayerSelection('', ''));


function trackPlayer(player: any) {  
  store.setCurrentParticipation(player)
  if (store.gamesState.currentGame) {
    router.push(`/record/${store.gamesState.currentGame.id}/participations/${player.playerId}/tracking`)
  } else {
    console.error('Current game is null');
  }
}

function trackNewPlayer(playerSelection: PlayerSelection) {
  addPlayerDialog.value = false

  const selectedPlayer = store.playersState.players.find( p => p.playerId === playerSelection.playerId);
        if (selectedPlayer) {
          playerSelection.playerName = selectedPlayer.playerName;
  }

  store.setCurrentPlayer(newPlayer.value)

  if (store.gamesState.currentGame) {
    router.push(`/record/${store.gamesState.currentGame.id}/participations/${store.playersState.currentPlayer?.playerId}/tracking`)
  } else {
    console.error('Current game is null');
  }
}

function addPlayer() {
  addPlayerDialog.value = true
}
</script>

<style scoped>

.v-divider--vertical {
  height: 90%;
  margin-top: auto;
  margin-bottom: auto;
}
</style>