<!-- common/StatusBadge -->
<template>
  <span
    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
    :class="computedClasses"
  >
    <i v-if="icon" :class="`fas ${icon} mr-1`"/>
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "default",
    validator: (value) =>
      [
        "success",
        "error",
        "warning",
        "info",
        "default",
        "blue",
        "green",
        "yellow",
        "red",
        "purple",
        "gray",
        "indigo",
        "pink",
      ].includes(value),
  },
  icon: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "default",
    validator: (value) => ["small", "default", "large"].includes(value),
  },
  outlined: {
    type: Boolean,
    default: false,
  },
});

// Mapeo de estados a colores
const statusToColor = {
  success: "green",
  error: "red",
  warning: "yellow",
  info: "blue",
  default: "gray",
};

// Computar clases basadas en propiedades
const computedClasses = computed(() => {
  // Determinar el color base
  const color = statusToColor[props.status] || props.status;

  // Determinar las clases de tamaño
  let sizeClasses = "";
  switch (props.size) {
    case "small":
      sizeClasses = "px-1.5 py-0.5 text-xs";
      break;
    case "large":
      sizeClasses = "px-3 py-1.5 text-sm";
      break;
    default:
      sizeClasses = "px-2 py-1 text-xs";
  }

  // Determinar estilos visuales (sólido u outline)
  if (props.outlined) {
    return `bg-${color}-50 text-${color}-700 border border-${color}-300 ${sizeClasses}`;
  } else {
    return `bg-${color}-100 text-${color}-800 ${sizeClasses}`;
  }
});
</script>
