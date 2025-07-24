<template>
  <v-container fluid class="main-container">
    <v-row justify="center" class="justify-sm-start">
      <v-col cols="10" sm="2" class="text-center pa-10" >
        <h1 class="text-h4 mt-10">Details</h1>

        <v-select
          class="mt-10"
          label="Season"
          :items="selectionStore.seasons"
          item-title="id"
          item-value="id"
          v-model="selectedSeason"
          @update:modelValue="onSeasonSelect"
        ></v-select>

        <v-select
          class="mt-10"
          label="Game"
          :items="selectionStore.games"
          :item-title="gameTitle"
          item-value="id"
          v-model="selectedGame"
          @update:modelValue="onGameSelect"
        ></v-select>

        <v-select
          class="mt-10"
          label="Player Name"
          :items="selectionStore.players"
          item-title="playerName"
          item-value="playerId"
          v-model="selectedPlayer"
        ></v-select>

        <v-row justify="center">
          <StyledButton 
            class="mt-10"
            parameter="Filter"
            icon="mdi-filter"
            :disabled="!selectedSeason || !selectedGame || !selectedPlayer"
            @click="filter"
            />
        </v-row>
      </v-col>

      <v-col cols="auto" class="d-none d-md-flex pa-0 align-center">
        <v-divider
          :thickness="5"
          color="var(--theme-primary)"
          vertical
          class="my-1 border-opacity-100"
          style="height: 100%;"
        ></v-divider>
      </v-col>

      <v-row justify="center">
         <v-col cols="12" sm="9" md="10" class="pa-4">
          <template v-if="statisticsStore.ofGame && statisticsStore.ofSeason">
            <v-card class="mb-3 mt-8" variant="outlined" style="width: 100%">
              <v-card-text class="text-center">
                <h2 class="text-h5">Season Stats</h2>
              </v-card-text>

              <v-row no-gutters class="align-center">
                <v-col v-for="(stat, index) in seasonStats" :key="index" class="pa-2">
                  <StatBox 
                    :label="stat.label" 
                    :value="stat.value" 
                    boxWidth="100%"
                  />
                </v-col>
              </v-row>
            </v-card>

            <v-card class="mb-3 mt-8" variant="outlined" style="width: 100%">
              <v-card-text class="text-center">
                <h2 class="text-h5">Game Stats</h2>
              </v-card-text>

             <v-row no-gutters class="align-center">
                <template v-for="(stat, index) in gameStats.filter(s => s.label !== 'Total Points')" :key="'game-'+index">
                  <v-col cols="4" sm="4" md="3" class="pa-2">
                    <StatBox :label="stat.label" :value="stat.value" boxWidth="100%" />
                  </v-col>
                </template>
                <v-col cols="4" sm="4" md="12" class="pa-2">
                  <StatBox 
                    :label="$vuetify.display.mobile ? 'TP' : 'Total Points'" 
                    :value="gameStats.find(s => s.label === 'Total Points')?.value || 0" 
                    boxWidth="100%"
                    position="center"
                  />
                </v-col>
              </v-row>
            </v-card>
          </template>
          <v-alert
            v-else
            type="info"
            variant="tonal"
            class="ma-4 text-center"
          >
            Select a season, game, and player to view statistics
          </v-alert>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectionStore = useSelectionStore()
const statisticsStore = useStatisticsStore()

const selectedSeason = ref<string | null>(null)
const selectedGame = ref<string | null>(null)
const selectedPlayer = ref<string | null>(null)

const seasonStats = computed(() => [
  { label: 'PPG', value: statisticsStore.ofSeason?.ppg?.toFixed(1) || '' },
  { label: 'APG', value: statisticsStore.ofSeason?.apg?.toFixed(1) || '' },
  { label: 'RPG', value: statisticsStore.ofSeason?.rpg?.toFixed(1) || '' },
  { label: 'BPG', value: statisticsStore.ofSeason?.bpg?.toFixed(1) || '' },
  { label: 'FT%', value: statisticsStore.ofSeason?.ftConversion?.toFixed(1) || '--' },
  { label: 'Total Points', value: statisticsStore.ofSeason?.totalPoints || '' }
])

const gameStats = computed(() => {
  const stats = statisticsStore.ofGame || []
  
  const ftHit = stats.find(t => t.type === 'FreeThrowHit')?.count ?? 0
  const ftTotal = stats.filter(t => t.type === 'FreeThrowMiss' || t.type === 'FreeThrowHit')
                      .reduce((sum, t) => sum + t.count, 0) ?? 0
                      
  const twoHit = stats.find(t => t.type === 'TwoPointerHit')?.count ?? 0
  const twoTotal = stats.filter(t => t.type === 'TwoPointerMiss' || t.type === 'TwoPointerHit')
                       .reduce((sum, t) => sum + t.count, 0) ?? 0
                       
  const threeHit = stats.find(t => t.type === 'ThreePointerHit')?.count ?? 0
  const threeTotal = stats.filter(t => t.type === 'ThreePointerMiss' || t.type === 'ThreePointerHit')
                         .reduce((sum, t) => sum + t.count, 0) ?? 0
                         
  const totalPoints = stats.reduce((total, t) => t.points ? total + t.points : total, 0) ?? 0

  return [
    { label: 'FT', value: `${ftHit}-${ftTotal}` },
    { label: '2PT', value: `${twoHit}-${twoTotal}` },
    { label: '3PT', value: `${threeHit}-${threeTotal}` },
    { label: 'Assist', value: stats.find(t => t.type === "Assist")?.count ?? 0 },
    { label: 'Rebound', value: stats.find(t => t.type === "Rebound")?.count ?? 0 },
    { label: 'Turnover', value: stats.find(t => t.type === "Turnover")?.count ?? 0 },
    { label: 'Block', value: stats.find(t => t.type === "Block")?.count ?? 0 },
    { label: 'Foul', value: stats.find(t => t.type === "Foul")?.count ?? 0 },
    { 
      label: 'Total Points', 
      value: totalPoints,
      isWide: true
    }
  ]
})

function onSeasonSelect(seasonId: string) {
  selectionStore.fetchSelectionGames(seasonId)
  selectedGame.value = null
  selectedPlayer.value = null
}

function onGameSelect(gameId: string) {
  selectionStore.fetchPlayers(gameId)
  selectedPlayer.value = null
}

function filter() {
  if (selectedSeason.value && selectedGame.value && selectedPlayer.value) {
    statisticsStore.fetchStatistics({
      seasonId: selectedSeason.value,
      gameId: selectedGame.value,
      playerId: selectedPlayer.value
    })
  }
}

function gameTitle(game: any): string {
  return `${game.homeTeamId} vs ${game.visitorTeamId}`
}
</script>

<style scoped>
@media (max-width: 1279px) {
  .main-container {
    overflow-y: auto;
    overflow-x: hidden !important;
  }
}

.v-menu__content {
  position: absolute !important;
  max-height: 400px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}
</style>