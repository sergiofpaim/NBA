<template>
  <v-container class="pa-10" fluid>
    <v-row no-gutters>
      <v-col cols="2" class="text-center pa-10">
        <h1 class="text-h4">Details</h1>

        <!-- Select Season -->
        <v-select
          class="mt-10"
          label="Season"
          :items="selectionStore.seasons"
          item-title="id"
          item-value="id"
          v-model="selectedSeason"
          @update:modelValue="onSeasonSelect"
        ></v-select>

        <!-- Select Game -->
        <v-select
          class="mt-10"
          label="Game"
          :items="selectionStore.games"
          :item-title="gameTitle"
          item-value="id"
          v-model="selectedGame"
          @update:modelValue="onGameSelect"
        ></v-select>

        <!-- Select Player -->
        <v-select
          class="mt-10"
          label="Player Name"
          :items="selectionStore.players"
          item-title="playerName"
          item-value="id"
          v-model="selectedPlayer"
          @update:modelValue="onPlayerSelect"
        ></v-select>
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
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectionStore = useSelectionStore()
const statisticsStore = useStatisticsStore()

const selectedSeason = ref<string | null>(null)
const selectedGame = ref<string | null>(null)
const selectedPlayer = ref<string | null>(null)

function onSeasonSelect(seasonId: string) {
  selectionStore.fetchSelectionGames(seasonId)
}

function onGameSelect(gameId: string) {
  selectionStore.fetchPlayers(gameId)
}

function onPlayerSelect() {
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
