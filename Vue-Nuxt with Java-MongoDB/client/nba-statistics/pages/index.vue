<template>
  <v-container fluid class="pa-0" style="height: 100vh;">
    <v-row class="fill-height" no-gutters>
      <v-col cols="12" sm="6" class="d-flex justify-center align-center">
        <v-btn
          class="fancy-button left-button"
          variant="outlined"
          elevation="4"
          @click="$router.push('/statistics')"
        >
          <div class="button-content">
            <div class="main-text">Statistics</div>
            <div class="description">Access game and player statistics from the database</div>
          </div>
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6" class="d-flex justify-center align-center">
        <v-btn
          class="fancy-button right-button"
          variant="outlined"
          elevation="4"
          @click="$router.push('/record')"
        >
          <div class="button-content">
            <div class="main-text">Record</div>
            <div class="description">Add, delete, and edit data from the database</div>
          </div>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.fancy-button {
  width: 100%;
  max-width: 240px;
  min-height: 120px;
  padding: 0 24px;
  overflow: hidden;
  border-width: 2px;
  color: var(--v-theme-secondary);
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  width: 100%;
}

.main-text {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.description {
  font-size: 0.6rem;
  line-height: 1.2;
  max-width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  padding-top: 4px;
  text-align: center;
  opacity: 1; 
  height: auto; 
  transform: translateY(0);
}

@media (min-width: 600px) {
  .description {
    opacity: 0;
    height: 0;
    transform: translateY(-4px);
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
}

@media (max-width: 599px) {
  .fancy-button {
    min-height: 140px; 
    margin: 8px 0; 
  }
  
  .v-col {
    padding: 4px 0; 
  }
}
</style>