<!-- Common/Dropdown.vue -->
<template>
  <div ref="dropdownRef" class="relative inline-block text-left">
    <!-- Dropdown Trigger Button -->
    <div @click="toggle">
      <slot name="trigger">
        <button
          type="button"
          class="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          {{ label }}
          <i
            class="fas fa-chevron-down ml-2"
            :class="{ 'transform rotate-180': isOpen }"
          />
        </button>
      </slot>
    </div>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        class="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
        :class="[widthClass, positionClass]"
      >
        <div class="py-1" :class="{ 'divide-y divide-gray-100': hasDividers }">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "Options",
  },
  width: {
    type: String,
    default: "md", // sm, md, lg, xl, full
    validator: (value) => ["sm", "md", "lg", "xl", "full"].includes(value),
  },
  position: {
    type: String,
    default: "right", // right, left, center
    validator: (value) => ["right", "left", "center"].includes(value),
  },
  hasDividers: {
    type: Boolean,
    default: false,
  },
  closeOnClick: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "open", "close"]);

// Estado local
const isOpen = ref(props.modelValue);
const dropdownRef = ref(null);

// Sincronizar con modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue;
  }
);

watch(isOpen, (newValue) => {
  emit("update:modelValue", newValue);
  if (newValue) {
    emit("open");
  } else {
    emit("close");
  }
});

// Clases de ancho
const widthClass = computed(() => {
  const classes = {
    sm: "w-32",
    md: "w-48",
    lg: "w-56",
    xl: "w-72",
    full: "w-full",
  };

  return classes[props.width];
});

// Clases de posición
const positionClass = computed(() => {
  const classes = {
    right: "right-0",
    left: "left-0",
    center: "left-1/2 -translate-x-1/2",
  };

  return classes[props.position];
});

// Método para alternar el estado del dropdown
const toggle = () => {
  isOpen.value = !isOpen.value;
};

// Método para cerrar el dropdown cuando se hace clic fuera
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

// Método para cerrar el dropdown cuando se presiona Escape
const handleKeyDown = (event) => {
  if (event.key === "Escape") {
    isOpen.value = false;
  }
};

// Método para cerrar el dropdown cuando se hace clic en un elemento dentro
const handleClickInside = (event) => {
  if (props.closeOnClick && event.target.closest("[data-dropdown-item]")) {
    isOpen.value = false;
  }
};

// Agregar event listeners
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);
  if (dropdownRef.value && props.closeOnClick) {
    dropdownRef.value.addEventListener("click", handleClickInside);
  }
});

// Limpiar event listeners al desmontar
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleKeyDown);
  if (dropdownRef.value && props.closeOnClick) {
    dropdownRef.value.removeEventListener("click", handleClickInside);
  }
});
</script>
