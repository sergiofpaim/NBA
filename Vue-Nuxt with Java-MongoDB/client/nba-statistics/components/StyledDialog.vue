<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600"> 
    <v-card color="var(--theme-background)" class="card-dialog">
      <v-card-title class="text-center pt-5" style="color:var(--theme-primary)">{{dialogTitle}}</v-card-title>
      <v-card-text>
        <v-select
          v-model="formData[fieldValue1]"
          :items="items"
          :item-title="title"
          :item-value="property"
          :label="label1"
          outlined
          class="mb-4 white-label"
        ></v-select>
        
        <v-select
          v-if="label2 && fieldValue2"
          v-model="formData[fieldValue2]"
          :items="items"
          :item-title="title"
          :item-value="property"
          :label="label2"
          outlined
          class="mb-4 white-label"
        ></v-select>
        
        <v-text-field
          v-if="label2 && fieldValue3"
          v-model="formData[fieldValue3]"
          type="datetime-local"
          label="Date & Time"
          class="mb-4 white-label"
          outlined
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('update:modelValue', false)" color="var(--theme-secondary)">Cancel</v-btn>
        <v-btn color="var(--theme-primary)" :disabled="!isFilled" @click="$emit('submit', formData)">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">  
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  dialogTitle: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  property: {
    type: String,
    required: true
  },
  fieldValue1: {
    type: String,
    required: true
  },
  fieldValue2: {
    type: String,
    required: false
  },
  fieldValue3: {
    type: String,
    required: false
  },
  label1: {
    type: String,
    required: true
  },
  label2: {
    type: String,
    required: false
  },
  formData: { 
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const isFilled = computed(() => {
  // Checks if field items are filled

  if (!props.formData[props.fieldValue1]) return false
  if (props.fieldValue2 && !props.formData[props.fieldValue2]) return false
  if (props.fieldValue3 && !props.formData[props.fieldValue3]?.trim()) return false

  return true
})

  // Prevents the same team from being selected for both fields

watch(() => props.formData[props.fieldValue1],
            (newVal) => { if (props.fieldValue2
                              && newVal
                              && props.formData[props.fieldValue2] === newVal)
              { props.formData[props.fieldValue1] = null}
})

watch(() => (props.fieldValue2 ? props.formData[props.fieldValue2] : undefined),
            (newVal) => { if (props.fieldValue2 
                              && newVal
                              && props.formData[props.fieldValue1] === newVal)
              { props.formData[props.fieldValue1] = null }
  }
)

</script>

<style scoped>
.card-dialog {
  border-radius: 24px !important;
}

:deep(.white-label) {
  .v-label,
  .v-field__input,
  input,
  .v-select__selection-text {
    color: white !important;
  }
  
  .v-field__outline {
    color: rgba(255, 255, 255, 0.24) !important;
  }

  input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: invert(1); 
    opacity: 1;
  }
}
</style>