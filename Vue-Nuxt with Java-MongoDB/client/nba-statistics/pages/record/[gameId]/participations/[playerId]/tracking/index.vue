<template>
    <div>
      <v-list class="items-list" bg-color="var(--theme-background)" style="max-height: 400px; overflow-y: auto;">
          <v-list-item
            v-for="play in store.participationState.participation?.plays"
            class="list-item"
            :style="{ minHeight: isMobile ? '56px' : '72px', height: isMobile ? '56px' : '72px' }"
          >
              <v-list-item-title
                style="color:var(--theme-primary)"
                :class="isMobile ? 'mobile-title' : 'desktop-title'"
              >
                {{ play.type }}
              </v-list-item-title>
            
              <v-list-item-subtitle
                style="color:var(--theme-primary)"
                :class="isMobile ? 'mobile-subtitle' : 'desktop-subtitle'"
              >
              {{ play.at }}
              </v-list-item-subtitle>
                </v-list-item>
          </v-list>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useTransactionStore } from '@/stores/Transaction'
  import { ref, onMounted } from 'vue'

  const store = useTransactionStore()

  const isMobile = ref(false)
  onMounted(() => {
    isMobile.value = window.innerWidth <= 600
    window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth <= 600
    })
  })
  
  </script>