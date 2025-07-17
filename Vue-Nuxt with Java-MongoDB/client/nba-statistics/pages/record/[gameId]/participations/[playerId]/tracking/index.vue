<template>
  <v-container class="pa-10" fluid>
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
        </div>

        <v-card class="mt-4" variant="outlined" style="width: 100%;" color="var(--theme-primary)">
          <v-card-text>
              <v-row align-content="center" justify="center" class="pa-4">
                <v-btn @click="addPlay('FreeThrowHit')" class="mx-2 black-text-btn" style="background-color: greenyellow;">FT</v-btn>
                <v-btn @click="addPlay('TwoPointerHit')" class="mx-2 black-text-btn" style="background-color: greenyellow;">2PT</v-btn>
                <v-btn @click="addPlay('ThreePointerHit')" class="mx-2 black-text-btn" style="background-color: greenyellow;">3PT</v-btn>
                <v-btn @click="addPlay('FreeThrowMiss')" class="mx-2 black-text-btn" style="background-color:var(--theme-secondary);">FT</v-btn>
                <v-btn @click="addPlay('TwoPointerMiss')" class="mx-2 black-text-btn" style="background-color:var(--theme-secondary);">2PT</v-btn>
                <v-btn @click="addPlay('ThreePointerMiss')" class="mx-2 black-text-btn" style="background-color:var(--theme-secondary);">3PT</v-btn>
                <v-btn @click="addPlay('Rebound')" class="mx-2 black-text-btn">REB</v-btn>
                <v-btn @click="addPlay('Assist')" class="mx-2 black-text-btn">AST</v-btn>
                <v-btn @click="addPlay('Block')" class="mx-2 black-text-btn">BLK</v-btn>
                <v-btn @click="addPlay('Foul')" class="mx-2 black-text-btn">FL</v-btn>
                <v-btn @click="addPlay('Turnover')" class="mx-2 black-text-btn">TNV</v-btn>
            </v-row>
          </v-card-text>
        </v-card>
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

  quarter.value = store.participationState.participation?.plays.findLast(play => play.quarter)?.quarter || '';
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

.content-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; 
  align-items: stretch;
  padding: 0; 
  margin: 0;
}

.black-text-btn {
  color: black !important;
}
</style>