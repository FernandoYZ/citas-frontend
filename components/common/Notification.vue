<!-- components/common/Notification -->
<template>
  <div
    class="bg-white border-l-4 shadow-md rounded-md p-3 flex items-center justify-between transform transition-all duration-300 ease-in-out z-50"
    :class="[borderColorClass]"
  >
    <div class="flex items-center">
      <div :class="iconColorClass">
        <i :class="`fas ${icon} text-lg`"/>
      </div>
      <div>
        <h4 class="text-sm font-medium text-gray-900">{{ title }}</h4>
        <p class="text-xs text-gray-500">{{ message }}</p>
      </div>
    </div>
    <button
      v-if="closable"
      class="text-gray-400 hover:text-gray-600 focus:outline-none"
      @click="$emit('close')"
    >
      <i class="fas fa-times"/>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "info",
    validator: (val) => ["success", "error", "warning", "info"].includes(val),
  },
  closable: {
    type: Boolean,
    default: true,
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Number,
    default: 5000, // 5 segundos
  },
});

const emit = defineEmits(["close"]);

// Computar el icono según el tipo
const icon = computed(() => {
  switch (props.type) {
    case "success":
      return "fa-check-circle";
    case "error":
      return "fa-exclamation-circle";
    case "warning":
      return "fa-exclamation-triangle";
    case "info":
      return "fa-info-circle";
    default:
      return "fa-bell";
  }
});

// Computar la clase de color del borde
const borderColorClass = computed(() => {
  switch (props.type) {
    case "success":
      return "border-green-500";
    case "error":
      return "border-red-500";
    case "warning":
      return "border-yellow-500";
    case "info":
      return "border-blue-500";
    default:
      return "border-gray-500";
  }
});

// Computar la clase de color del icono
const iconColorClass = computed(() => {
  switch (props.type) {
    case "success":
      return "text-green-500 mr-3";
    case "error":
      return "text-red-500 mr-3";
    case "warning":
      return "text-yellow-500 mr-3";
    case "info":
      return "text-blue-500 mr-3";
    default:
      return "text-gray-500 mr-3";
  }
});

// Configurar auto-cierre si está habilitado
if (props.autoClose && props.duration > 0) {
  setTimeout(() => {
    emit("close");
  }, props.duration);
}
</script>