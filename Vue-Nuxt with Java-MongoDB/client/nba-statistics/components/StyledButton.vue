<template>

<v-btn color="var(--theme-secondary)" @click="onClick" style="min-width: 200px; display: flex; justify-content: center; align-items: center">
<span style="flex: 1; text-align: center; color:var(--theme-primary)">{{parameter}}</span>
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
    }
  }
}
</script>