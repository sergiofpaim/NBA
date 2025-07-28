<template>
  <div style="height: 400px; overflow-y: auto">
    <v-list class="items-list" bg-color="var(--theme-background)">
      <v-list-item
        v-for="item in items"
        :key="item.id"
        @click="function1(item)"
        class="list-item"
        :style="{ minHeight: isMobile ? '56px' : '72px', height: isMobile ? '56px' : '72px' }"
        :disabled="!singleParameterMode && !function2(item[parameter1])"
      >
        <template v-if="singleParameterMode">
          <v-list-item-title
            style="color:var(--theme-primary)"
            :class="isMobile ? 'mobile-title' : 'desktop-title'"
          >
            {{ item[desktopTitle1] }}
          </v-list-item-title>
        </template>

        <template v-else>
          <v-list-item-title
            style="color:var(--theme-primary)"
            :class="isMobile ? 'mobile-title' : 'desktop-title'"
          >
            {{ getTitleText(item) }}
          </v-list-item-title>

          <v-list-item-subtitle
            style="color:var(--theme-primary)"
            :class="isMobile ? 'mobile-subtitle' : 'desktop-subtitle'"
          >
          {{ formatDate(item[parameter1]) }}
          </v-list-item-subtitle>
        </template>

        <template v-slot:append v-if="!singleParameterMode">
          <v-chip
            color="green"
            variant="outlined"
            class="text-center"
            size="small"
            v-if="function2(item[parameter1])"
          >
            {{ parameter2 }}
          </v-chip>
          <v-chip
            color="red"
            variant="outlined"
            class="text-center"
            size="small"
            v-else
          >
            {{ parameter3 }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  desktopTitle1: {
    type: String,
    required: true
  },
  desktopTitle2: {
    type: String,
    required: false
  },
  mobileTitle1: {
    type: String,
    required: true
  },
  mobileTitle2: {
    type: String,
    required: false
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
  function1: {
    type: Function,
    required: false
  },
  function2: {
    type: Function,
    required: false
  },
  singleParameterMode: {
    type: Boolean,
    default: false
  }
})

const getTitleText = (item) => {
  if (!isMobile.value) {
    return `${item[props.desktopTitle1]} vs ${item[props.desktopTitle2]}`;
  }
  if (isMobile.value) {
    return `${item[props.mobileTitle1]} vs ${item[props.mobileTitle2]}`;
  }
  return '';
};

const formatDate = (date)=> {
  return new Date(date).toLocaleString()
}

const { mobile: isMobile } = useDisplay()
</script>

<style scoped>
.items-list {
  overflow: hidden;
}

/* Scrollbar styling for the container */
div::-webkit-scrollbar {
  width: 8px;
}
div::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
div::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
div::-webkit-scrollbar-thumb:hover {
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

/* Responsive font sizes */
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