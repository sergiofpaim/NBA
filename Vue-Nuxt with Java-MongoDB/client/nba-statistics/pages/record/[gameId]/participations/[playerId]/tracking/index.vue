<template>
  <v-container fluid class="main-container">
    <v-row no-gutters>
      <v-col class="pa-10">
        <div class="d-flex justify-end mb-4">
          <h5 class="text-h6 mr-2">Quarter: {{ quarter }}</h5>
          <v-btn
            color="var(--theme-secondary)"
            @click="changeQuarter">
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </div>

        <v-card class="mb-0" variant="outlined" style="width: 100%">
          <v-card-text class="text-center">
            <h2 class="text-h5">Details</h2>
          </v-card-text>
        </v-card>
        
        <div style="height: 400px; overflow-y: auto; border: 1px solid rgba(0, 0, 0, 0.12); border-radius: 0 0 8px 8px;">
          <v-list 
            class="items-list" 
            bg-color="var(--theme-background)" 
            style="width: 100%;"
          >
            <v-list-item
              v-for="play in store.participationState.participation?.plays"
              class="list-item"
              :style="{ 
                minHeight: isMobile ? '35' : '72px', 
                height: isMobile ? '35' : '72px',
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
        </div>

          <!-- Desktop buttons -->
          <v-row align-content="center" justify="center" class="pa-4 d-none d-sm-flex">
            <v-card variant="outlined" class="pa-2" style="border-radius: 8px;">
              <div class="d-flex flex-wrap justify-center" style="gap: 8px;">
                <v-btn @click="addPlay('FreeThrowHit')" class="black-text-btn" style="background-color: greenyellow;">FT</v-btn>
                <v-btn @click="addPlay('TwoPointerHit')" class="black-text-btn" style="background-color: greenyellow;">2PT</v-btn>
                <v-btn @click="addPlay('ThreePointerHit')" class="black-text-btn" style="background-color: greenyellow;">3PT</v-btn>
                <v-btn @click="addPlay('FreeThrowMiss')" class="black-text-btn" style="background-color:var(--theme-secondary);">FT</v-btn>
                <v-btn @click="addPlay('TwoPointerMiss')" class="black-text-btn" style="background-color:var(--theme-secondary);">2PT</v-btn>
                <v-btn @click="addPlay('ThreePointerMiss')" class="black-text-btn" style="background-color:var(--theme-secondary);">3PT</v-btn>
                <v-btn @click="addPlay('Rebound')" class="black-text-btn">REB</v-btn>
                <v-btn @click="addPlay('Assist')" class="black-text-btn">AST</v-btn>
                <v-btn @click="addPlay('Block')" class="black-text-btn">BLK</v-btn>
                <v-btn @click="addPlay('Foul')" class="black-text-btn">FL</v-btn>
                <v-btn @click="addPlay('Turnover')" class="black-text-btn">TNV</v-btn>
              </div>
            </v-card>
          </v-row>

          <!-- Mobile buttons   -->
          <div class="d-flex d-sm-none flex-column align-center pa-0">
            <v-card variant="outlined" class="pa-2" style="border-radius: 8px; width: 100%;">
              <div class="d-flex justify-center my-1" style="gap: 4px;">
                <v-btn @click="addPlay('FreeThrowHit')" size="x-small" class="black-text-btn" style="background-color: greenyellow; min-width: 32px; height: 28px; font-size: 12px;">FT</v-btn>
                <v-btn @click="addPlay('TwoPointerHit')" size="x-small" class="black-text-btn" style="background-color: greenyellow; min-width: 32px; height: 28px; font-size: 12px;">2PT</v-btn>
                <v-btn @click="addPlay('ThreePointerHit')" size="x-small" class="black-text-btn" style="background-color: greenyellow; min-width: 32px; height: 28px; font-size: 12px;">3PT</v-btn>
                <v-btn @click="addPlay('FreeThrowMiss')" size="x-small" class="black-text-btn" style="background-color:var(--theme-secondary); min-width: 32px; height: 28px; font-size: 12px;">FT</v-btn>
                <v-btn @click="addPlay('TwoPointerMiss')" size="x-small" class="black-text-btn" style="background-color:var(--theme-secondary); min-width: 32px; height: 28px; font-size: 12px;">2PT</v-btn>
              </div>

              <div class="d-flex justify-center my-1" style="gap: 4px;">
                <v-btn @click="addPlay('ThreePointerMiss')" size="x-small" class="black-text-btn" style="background-color:var(--theme-secondary); min-width: 32px; height: 28px; font-size: 12px;">3PT</v-btn>
                <v-btn @click="addPlay('Rebound')" size="x-small" class="black-text-btn" style="min-width: 32px; height: 28px; font-size: 12px;">REB</v-btn>
                <v-btn @click="addPlay('Assist')" size="x-small" class="black-text-btn" style="min-width: 32px; height: 28px; font-size: 12px;">AST</v-btn>
                <v-btn @click="addPlay('Block')" size="x-small" class="black-text-btn" style="min-width: 32px; height: 28px; font-size: 12px;">BLK</v-btn>
                <v-btn @click="addPlay('Foul')" size="x-small" class="black-text-btn" style="min-width: 32px; height: 28px; font-size: 12px;">FL</v-btn>
              </div>
              <div class="d-flex justify-center my-1">
                <v-btn @click="addPlay('Turnover')" size="x-small" class="black-text-btn" style="min-width: 32px; height: 28px; font-size: 12px;">TNV</v-btn>
              </div>
            </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="showQuarterChangeDialog" max-width="500">
    <v-card :style="{ backgroundColor: 'var(--theme-background)', borderRadius: '16px' }">
      <v-card-title 
        class="text-h5 text-center py-4"
        :style="{ color: 'var(--theme-primary)', width: '100%' }"
      >
        Confirm Quarter Change
      </v-card-title>
      <v-card-text class="text-center py-4">
        <div :style="{ color: 'var(--theme-primary)' }">
          Are you sure you want to advance to quarter {{ Number(quarter) + 1 }}?
        </div>
        <div :style="{ color: 'var(--theme-primary)' }">
          This action is irreversible.
        </div>
      </v-card-text>
      <v-card-actions class="justify-center pb-4">
        <v-btn 
          color="black" 
          @click="showQuarterChangeDialog = false"
          :style="{ margin: '0 8px', backgroundColor: 'var(--theme-secondary)'}"
        >
          Cancel
        </v-btn>
        <v-btn 
          color="black" 
          @click="confirmQuarterChange"
          :style="{ 
            backgroundColor: 'var(--theme-primary)',
            color: 'white',
            margin: '0 8px'
          }"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useTransactionStore } from '@/stores/Transaction'
import { ref, onMounted } from 'vue'

const store = useTransactionStore()

const showQuarterChangeDialog = ref(false)
const quarter = ref<number | string>('');

const isMobile = ref(false)
onMounted(() => {
  isMobile.value = window.innerWidth <= 600
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 600
  })

  quarter.value = store.participationState.participation?.plays.findLast(play => play.quarter)?.quarter || 1;
})

function addPlay(playType: string) {
  store.addPlay({quarter: Number(quarter.value), type: playType})
}

function deletePlay(at : Date) {
  store.deletePlay(at);
}

function changeQuarter() {
  showQuarterChangeDialog.value = true
}

function confirmQuarterChange() {
  quarter.value = Number(quarter.value) + 1
  showQuarterChangeDialog.value = false
}
</script>

<style scoped>

.black-text-btn {
  color: black !important;
}


@media (max-width: 1279px) {
  .main-container {
    overflow-y: auto;
  }
}

.v-menu__content {
  position: absolute !important;
  max-height: 400px !important;
  overflow-y: auto !important;
}
</style>