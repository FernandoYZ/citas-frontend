<!-- components/common/Table/Export.vue -->
<template>
  <div class="relative">
    <button
      ref="exportButtonRef"
      class="inline-flex items-center px-3 py-2 text-sm rounded-md shadow-sm"
      :class="buttonClass"
      @click="toggleDropdown"
    >
      <i v-if="iconLeft" :class="`fas ${iconLeft} mr-2`" />
      {{ label }}
      <i
        v-if="showDropdownIcon"
        :class="`fas fa-chevron-down ml-2 ${
          showMenu ? 'transform rotate-180' : ''
        }`"
      />
    </button>

    <!-- Menú desplegable de opciones de exportación -->
    <div
      v-if="showMenu"
      class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10"
      :class="positionClass"
    >
      <a
        v-for="option in exportOptions"
        :key="option.format"
        href="#"
        class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        @click.prevent="exportData(option.format)"
      >
        <i :class="`fas ${option.icon} mr-2 text-gray-600`" />
        {{ option.label }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  // Opciones de apariencia
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "tertiary", "outline"].includes(value),
  },
  label: {
    type: String,
    default: "Exportar",
  },
  iconLeft: {
    type: String,
    default: "fa-download",
  },
  showDropdownIcon: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },

  // Opciones de funcionalidad
  exportOptions: {
    type: Array,
    default: () => [
      { format: "excel", label: "Excel", icon: "fa-file-excel" },
      { format: "pdf", label: "PDF", icon: "fa-file-pdf" },
      { format: "csv", label: "CSV", icon: "fa-file-csv" },
    ],
  },
  position: {
    type: String,
    default: "bottom-right",
    validator: (value) =>
      ["bottom-right", "bottom-left", "top-right", "top-left"].includes(value),
  },

  // Datos a exportar
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  fileName: {
    type: String,
    default: "exported-data",
  },
});

const emit = defineEmits(["export"]);

// Estado local
const showMenu = ref(false);
const exportButtonRef = ref(null);

// Clases computadas para estilos
const buttonClass = computed(() => {
  // Variantes de botón
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    tertiary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    outline:
      "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50",
  };

  // Tamaños de botón
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2.5 text-base",
  };

  return `${variants[props.variant]} ${sizes[props.size]}`;
});

// Determinar la posición del menú desplegable
const positionClass = computed(() => {
  switch (props.position) {
    case "bottom-right":
      return "right-0 mt-1";
    case "bottom-left":
      return "left-0 mt-1";
    case "top-right":
      return "right-0 bottom-full mb-1";
    case "top-left":
      return "left-0 bottom-full mb-1";
    default:
      return "right-0 mt-1";
  }
});

// Alternar visibilidad del menú desplegable
const toggleDropdown = () => {
  showMenu.value = !showMenu.value;
};

// Manejar la exportación de datos
const exportData = (format) => {
  showMenu.value = false;

  // Preparar datos para el evento
  const eventData = {
    format,
    data: props.data,
    columns: props.columns,
    fileName: props.fileName,
  };

  // Emitir evento de exportación
  emit("export", eventData);
};

// Cerrar menú al hacer clic fuera
const handleClickOutside = (event) => {
  if (exportButtonRef.value && !exportButtonRef.value.contains(event.target)) {
    showMenu.value = false;
  }
};

// Añadir/remover event listener
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
