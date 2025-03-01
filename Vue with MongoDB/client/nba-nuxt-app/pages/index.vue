<script setup>
import { useStatisticsStore } from "@/stores/Statistics";
import { ref } from "vue";

// Store reference
const statisticsStore = useStatisticsStore();

// Reactive data for the inputs
const seasonId = ref("");
const gameId = ref("");
const playerId = ref("");

// Function to handle form submission
const fetchStats = () => {
  if (seasonId.value && gameId.value && playerId.value) {
    statisticsStore.fetchStatistics({
      seasonId: seasonId.value,
      gameId: gameId.value,
      playerId: playerId.value,
    });
  } else {
    statisticsStore.error = "Please provide valid seasonId, gameId, and playerId.";
  }
};
</script>

<template>
  <div>
    <h1>Player Statistics</h1>

    <!-- Input fields for seasonId, gameId, and playerId -->
    <div>
      <label for="seasonId">Season ID:</label>
      <input id="seasonId" v-model="seasonId" type="text" placeholder="Enter Season ID" />
    </div>

    <div>
      <label for="gameId">Game ID:</label>
      <input id="gameId" v-model="gameId" type="text" placeholder="Enter Game ID" />
    </div>

    <div>
      <label for="playerId">Player ID:</label>
      <input id="playerId" v-model="playerId" type="text" placeholder="Enter Player ID" />
    </div>

    <!-- Submit button -->
    <button @click="fetchStats">Fetch Statistics</button>

    <!-- Loading, Error, or Displaying Stats -->
    <div v-if="statisticsStore.loading">Loading...</div>
    <div v-else-if="statisticsStore.error">{{ statisticsStore.error }}</div>
    <div v-else>
      <h2>Season Stats</h2>
      <pre>{{ statisticsStore.formattedSeasonStats }}</pre>

      <h2>Game Stats</h2>
      <pre>{{ statisticsStore.formattedGameStats }}</pre>
    </div>
  </div>
</template>
