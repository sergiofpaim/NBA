<template>
  <v-card
    :width="boxWidth || 'auto'"
    class="d-flex flex-column justify-center align-center text-center pa-2"
    :style="{
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      fontSize: '20px',
      gap: '8px',
      ...sx
    }"
  >
    <div class="text-grey-lighten-1">
      {{ label }}:
    </div>
    <div :style="{ color: 'var(--theme-primary)' }">
      {{ value }}
    </div>
  </v-card>
</template>

<script setup lang="ts">

interface StatBoxProps {
  label: string
  value: string | number
  boxWidth?: string | number
  position?: string
  sx?: Record<string, any>
}

const props = defineProps<StatBoxProps>()
</script>