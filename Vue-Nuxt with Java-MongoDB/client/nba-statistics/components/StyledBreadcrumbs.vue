<template>
  <nav v-if="breadcrumbItems.length" class="breadcrumbs">
      <template v-for="(item, index) in breadcrumbItems" :key="index">
          <template v-if="item.route">
              <a @click.prevent="navigate(item.route)" class="breadcrumb-link">{{ item.title }}</a>
          </template>
          <template v-else>
              <span class="breadcrumb-current">{{ item.title }}</span>
          </template>
          <span v-if="index < breadcrumbItems.length - 1" class="breadcrumb-separator">›</span>
      </template>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTransactionStore } from '@/stores/Transaction';

const router = useRouter();
const route = useRoute();
const transactionStore = useTransactionStore();
const statisticsStore = useStatisticsStore();

const navigate = (path) => {
  if (path === '/' || path === '/record') {
    transactionStore.setCurrentGame(null);
    transactionStore.setCurrentParticipation(null);
    transactionStore.setCurrentPlayer(null);
    statisticsStore.resetStatistics();
  }

  if (path.includes('/participations') && !path.includes('/tracking/')) {
    transactionStore.setCurrentParticipation(null);
    transactionStore.setCurrentPlayer(null);
    transactionStore.setParticipation(null);
  }
  router.push(path);
};

const breadcrumbItems = computed(() => {
  const items = [];
  const currentRoute = route.path;
  
  items.push({ title: 'Home', route: '/' });
  
  if (currentRoute.startsWith('/record')) {
    items.push({ title: 'Record', route: '/record' });
    
    if (transactionStore.gamesState.currentGame?.homeTeamId && transactionStore.gamesState.currentGame?.visitorTeamId) {
      items.push({ 
        title: `${transactionStore.gamesState.currentGame.homeTeamId} vs ${transactionStore.gamesState.currentGame.visitorTeamId}`, 
        route: `/record/${transactionStore.gamesState.currentGame.id}/participations`
      });
      
      if (transactionStore.playersState.currentPlayer?.playerName) {
        items.push({ 
          title: transactionStore.playersState.currentPlayer.playerName, 
          route: ''
        });
      }
      if (transactionStore.playersState.currentParticipation?.playerName) {
        items.push({ 
          title: transactionStore.playersState.currentParticipation.playerName, 
          route: ''
        });
      }
    }
  else if (currentRoute.includes('/record/')) return [];
  }
  
  if (currentRoute.startsWith('/statistics')) {
    items.push({ title: 'Statistics', route: '' });
  }
  
  return items;
});
</script>

<style>
.breadcrumbs {
  margin-top: 5px;
  font-weight: 700;
  color: #ffffff;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.breadcrumb-link {
  cursor: pointer;
  color: #ffffff;
  text-decoration: none;
  margin-right: 5px;
}

.breadcrumb-current {
  color: #ffffff;
  margin-right: 5px;
}

.breadcrumb-separator {
  margin-right: 5px;
  color: #ffffff;
}
</style>