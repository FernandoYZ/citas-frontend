<!-- components/common/Button.vue -->
<template>
  <component
    :is="as"
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center focus:outline-none transition-colors duration-150',
      sizeClass,
      variantClass,
      { 'opacity-60 cursor-not-allowed': disabled || loading },
      { 'pl-3 pr-3.5': iconRight && !loading },
      { 'pl-3.5 pr-3': iconLeft && !loading && !iconRight },
      { 'pl-2.5 pr-3.5': loading && !iconRight },
      rounded ? 'rounded-full' : 'rounded-md',
      fullWidth ? 'w-full' : '',
      className,
    ]"
    @click="onClick"
  >
    <!-- Loading spinner -->
    <div v-if="loading" class="mr-2 flex items-center justify-center">
      <svg
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>

    <!-- Left icon -->
    <i v-if="iconLeft && !loading" :class="`fas ${iconLeft} mr-2`"/>

    <!-- Button content -->
    <slot>{{ label }}</slot>

    <!-- Right icon -->
    <i v-if="iconRight" :class="`fas ${iconRight} ml-2`"/>
  </component>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      [
        "primary",
        "secondary",
        "tertiary",
        "success",
        "danger",
        "warning",
        "info",
        "ghost",
        "link",
      ].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },
  type: {
    type: String,
    default: "button",
    validator: (value) => ["button", "submit", "reset"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  as: {
    type: String,
    default: "button",
    validator: (value) => ["button", "a"].includes(value),
  },
  iconLeft: {
    type: String,
    default: "",
  },
  iconRight: {
    type: String,
    default: "",
  },
  className: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["click"]);

// Handle click
const onClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};

// Size classes
const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-2.5 py-1.5 text-xs";
    case "md":
      return "px-3 py-2 text-sm";
    case "lg":
      return "px-4 py-2 text-base";
    case "xl":
      return "px-5 py-3 text-lg";
    default:
      return "px-3 py-2 text-sm";
  }
});

// Variant classes
const variantClass = computed(() => {
  switch (props.variant) {
    case "primary":
      return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-1 focus:ring-blue-500 shadow-sm";
    case "secondary":
      return "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400";
    case "tertiary":
      return "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-1 focus:ring-blue-500";
    case "success":
      return "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 shadow-sm";
    case "danger":
      return "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 shadow-sm";
    case "warning":
      return "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 shadow-sm";
    case "info":
      return "bg-blue-100 text-blue-600 hover:bg-blue-200 focus:ring-1 focus:ring-blue-500";
    case "ghost":
      return "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500";
    case "link":
      return "bg-transparent text-blue-600 hover:text-blue-800 underline focus:ring-0 py-0";
    case "medical-primary":
      return "bg-blue-600 text-white hover:bg-blue-700 shadow-md";
    case "medical-secondary":
      return "bg-teal-600 text-white hover:bg-teal-700";
    case "medical-danger":
      return "bg-rose-600 text-white hover:bg-rose-700";
    default:
      return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-1 focus:ring-blue-500 shadow-sm";
  }
});
</script>