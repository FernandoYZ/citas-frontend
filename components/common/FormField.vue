<!-- components/common/FormField.vue -->
<template>
  <div>
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700 mb-1"
      :for="fieldId"
      >{{ label }}</label
    >
    <div class="relative rounded-md">
      <div
        v-if="icon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <i :class="'fas ' + icon + ' text-gray-400'"/>
      </div>

      <!-- Text input -->
      <input
        v-if="isBasicInputType"
        :id="fieldId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        :class="[
          icon ? 'pl-10' : 'pl-3',
          'pr-3 py-2',
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
      >

      <!-- Select -->
      <select
        v-else-if="type === 'select'"
        :id="fieldId"
        :value="modelValue"
        class="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="[
          icon ? 'pl-10' : 'pl-3',
          'pr-3 py-2',
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
        ]"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>

      <!-- Textarea -->
      <textarea
        v-else-if="type === 'textarea'"
        :id="fieldId"
        :value="modelValue"
        :placeholder="placeholder"
        :rows="rows"
        class="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="[
          icon ? 'pl-10' : 'pl-3',
          'pr-3 py-2',
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <!-- Checkbox -->
      <div v-else-if="type === 'checkbox'" class="flex items-center">
        <input
          :id="fieldId"
          type="checkbox"
          :checked="modelValue"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          @change="$emit('update:modelValue', $event.target.checked)"
        >
        <label :for="fieldId" class="ml-2 block text-sm text-gray-900">
          {{ checkboxLabel || label }}
        </label>
      </div>

      <!-- Radio group -->
      <div v-else-if="type === 'radio'" class="space-y-2">
        <div
          v-for="option in options"
          :key="getOptionValue(option)"
          class="flex items-center"
        >
          <input
            :id="`${fieldId}-${getOptionValue(option)}`"
            name="group"
            type="radio"
            :value="getOptionValue(option)"
            :checked="modelValue === getOptionValue(option)"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            @change="$emit('update:modelValue', getOptionValue(option))"
          >
          <label
            :for="`${fieldId}-${getOptionValue(option)}`"
            class="ml-2 block text-sm text-gray-900"
          >
            {{ getOptionLabel(option) }}
          </label>
        </div>
      </div>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-if="help" class="mt-1 text-xs text-gray-500">{{ help }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
    validator: (value) =>
      [
        "text",
        "email",
        "password",
        "number",
        "date",
        "select",
        "textarea",
        "checkbox",
        "radio",
      ].includes(value),
  },
  placeholder: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  optionLabel: {
    type: String,
    default: "label",
  },
  optionValue: {
    type: String,
    default: "value",
  },
  error: {
    type: String,
    default: "",
  },
  help: {
    type: String,
    default: "",
  },
  rows: {
    type: Number,
    default: 3,
  },
  checkboxLabel: {
    type: String,
    default: "",
  },
});

defineEmits(["update:modelValue"]);

// Generate a unique ID if not provided
const fieldId = computed(() => {
  return props.id || `field-${Math.random().toString(36).substring(2, 9)}`;
});

// Check if the type is a basic input type
const isBasicInputType = computed(() => {
  return ["text", "email", "password", "number", "date"].includes(props.type);
});

// Functions to get value and label from options
const getOptionLabel = (option) => {
  if (typeof option === "object" && option !== null) {
    return option[props.optionLabel];
  }
  return option;
};

const getOptionValue = (option) => {
  if (typeof option === "object" && option !== null) {
    return option[props.optionValue];
  }
  return option;
};
</script>