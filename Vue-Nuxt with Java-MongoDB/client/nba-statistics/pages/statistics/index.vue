<template>
<v-container fluid class="pa-0" style="height: 100vh;">
    <v-row class="fill-height" no-gutters>
      <v-divider :thickness="10" vertical></v-divider>
      <StatBox value ="hi" label ="hi"/>
    </v-row>
  </v-container>
  </template>

<style scoped>

.fancy-button {
  height: 120px;
  width: 240px;
  padding: 0 24px;
  overflow: hidden;
  border-width: 2px;
  color: var(--v-theme-secondary);
  transition: all 0.3s ease;
}

.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
}

.main-text {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.description {
  font-size: 0.6rem;
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  line-height: 1;
  max-width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  padding-top: 4px;
  height: 0;
  text-align: center;
}

.fancy-button:hover .main-text {
  transform: translateY(-6px);
  color: var(--theme-secondary);
}

.fancy-button:hover .description {
  opacity: 1;
  height: auto;
  transform: translateY(0);
}
</style>
