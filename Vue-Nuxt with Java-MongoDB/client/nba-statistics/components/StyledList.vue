<template>
<v-list class="items-list" bg-color="var(--theme-background)" style="max-height: 400px; overflow-y: auto;">
    <v-list-item
      v-for="item in items"
      :key="item.id"
      @click="onClick(item)"
      class="list-item"
      :style="{ minHeight: '72px', height: '72px' }"
    >
      <template v-if="singleParameterMode">
      <v-list-item-title style="color:var(--theme-primary)" class="text-h6">
        {{ item[parameter1] }}
      </v-list-item-title>
      </template>
      <template v-else>
      <v-list-item-title style="color:var(--theme-primary)">
        {{ item[parameter1] }} <strong> vs </strong>{{ item[parameter2] }}
      </v-list-item-title>
      
      <v-list-item-subtitle style="color:var(--theme-primary)">
        {{ formatDate(item[parameter3]) }}
      </v-list-item-subtitle>
      </template>

      <template v-slot:append v-if="!singleParameterMode">
        <v-chip color="green" variant="outlined" class="text-center" v-if="isGameRunning(item[parameter3])">
        Running
        </v-chip>
        <v-chip color="red" variant="outlined" class="text-center" v-else>
        Not Running
        </v-chip>
      </template>
    </v-list-item>
  </v-list>
  </template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    parameter1: {
      type: String,
      required: false
    },
    parameter2: {
      type: String,
      required: false
    },
    parameter3: {
      type: String,
      required: false
    },
    onClick: {
      type: Function,
      required: true
    },
    singleParameterMode: { 
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
    isGameRunning(gameTime) {
    const now = new Date();
    const gameDate = new Date(gameTime);
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    const result = gameDate >= now || gameDate <= twoHoursLater;

    return result; 
    }
}}
</script>

<style>
.items-list {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
}

.items-list::-webkit-scrollbar {
  width: 8px;
}

.items-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.items-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.items-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.list-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.list-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateX(4px);
}

.list-item:active {
  transform: scale(0.98);
}
</style>