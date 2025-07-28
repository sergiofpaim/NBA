<template>
  <v-btn 
    color="var(--theme-secondary)" 
    @click="onClick" 
    style="min-width: 200px; display: flex; justify-content: center; align-items: center"
    :disabled="disabled"
    :class="{ 'disabled-btn': disabled }"
  >
    <div style="display: flex; align-items: center; width: 100%">
      <v-icon v-if="icon" left :style="{ color: disabled ? 'black' : 'var(--theme-primary)' }">
        {{ icon }}
      </v-icon>
      <span style="flex: 1; text-align: center" :style="{ color: disabled ? 'black' : 'var(--theme-primary)' }">
        {{ parameter }}
      </span>
    </div>
  </v-btn>
</template>

<script>
export default {
  props: {
    parameter: {
      type: String,
      default: 'homeTeamName', 
      required: false
    },
    onClick: {
      type: Function,
      required: true
    },
    icon: {
      type: String,
      default: '',
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.disabled-btn {
  background-color: gray !important;
}
.disabled-btn::before {
  background-color: transparent !important;
}
</style>