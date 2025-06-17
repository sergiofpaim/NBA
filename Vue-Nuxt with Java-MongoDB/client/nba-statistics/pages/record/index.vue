<script setup lang="ts">
import { useTransactionStore } from '@/stores/Transaction'

const store = useTransactionStore()

await store.loadTeams()
</script>

<template>
  <div>
    <ul>
      <li v-for="team in store.teamsState.teams" :key="team.teamId">{{ team.teamName }}</li>
    </ul>
  </div>
</template>
