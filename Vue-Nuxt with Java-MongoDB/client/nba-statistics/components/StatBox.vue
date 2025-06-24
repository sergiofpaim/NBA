<template>
    <v-sheet
      :style="computedStyles"
      class="d-flex flex-column align-center justify-center text-center pa-4"
      :width="boxWidth || 'auto'"
    >
      <div :style="{ fontSize: '20px', color: greyColor }">
        {{ label }}:
      </div>
      <div :style="{ fontSize: '20px', color: primaryColor, fontWeight: 'bold' }">
        {{ value }}
      </div>
    </v-sheet>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useTheme } from 'vuetify'
  
  interface Props {
    label: string
    value: string | number
    boxWidth?: string | number
    position?: string
    sx?: Record<string, any>
  }
  
  const props = defineProps<Props>()
  const theme = useTheme()
  
  const primaryColor = computed(() => theme.current.value.colors.primary)
  const greyColor = computed(() => theme.current.value.colors['grey-400'])
  
  const computedStyles = computed(() => ({
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...props.sx
  }))
  </script>
  
  <style scoped>
  </style>
  