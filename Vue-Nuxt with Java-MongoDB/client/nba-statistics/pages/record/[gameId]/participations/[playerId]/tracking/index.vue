<template>
  <v-col cols="7" class="content-container">
    <v-card class="mb-0" variant="outlined" style="width: 100%">
      <v-card-text class="text-center">
        <h2 class="text-h5">Details</h2>
      </v-card-text>
    </v-card>
    
    <v-list 
      class="items-list" 
      bg-color="var(--theme-background)" 
      style="width: 100%; max-height: 400px; overflow-y: auto;"
    >
      <v-list-item
        v-for="play in store.participationState.participation?.plays"
        class="list-item"
        :style="{ 
          minHeight: isMobile ? '56px' : '72px', 
          height: isMobile ? '56px' : '72px',
          paddingLeft: '16px',
          paddingRight: '16px'
        }"
      >
        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
          <div>
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
          </div>
          <v-btn @click="deletePlay(play.at)" variant="text" color="error" style="margin-left: 16px;">
            Delete
          </v-btn>
        </div>
      </v-list-item>
    </v-list>

  <v-btn @click="addPlay"> Hello </v-btn>

  </v-col>
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

function addPlay() {
  store.addPlay({quarter: 1, type: "FreeThrowHit"})
}

function deletePlay(at : Date) {
  store.deletePlay(at);
}
</script>

<style scoped>

.content-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; 
  align-items: stretch;
  padding: 0; 
  margin: 0;
}


.items-list {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.list-item {
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12); 
}

.list-item:last-child {
  border-bottom: none; 
}

.list-item:active {
  transform: scale(0.98);
}

.list-item:hover {
  background-color: rgba(0, 0, 0, 0.04); 
}

.mobile-title {
  font-size: 16px;
}

.desktop-title {
  font-size: 15px;
}

.mobile-subtitle {
  font-size: 12px;
}

.desktop-subtitle {
  font-size: 14px;
}
</style>