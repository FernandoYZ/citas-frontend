<!-- components/common/Table/Header.vue -->
<template>
  <div
    class="px-4 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2"
  >
    <!-- Título y contador -->
    <h3 class="text-base font-medium text-gray-800 flex items-center">
      <i v-if="icon" :class="`fas ${icon} mr-2 text-blue-600`" />
      {{ title }}
      <span
        v-if="showCount"
        class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
        >{{ totalItems }} {{ countLabel }}</span
      >
    </h3>

    <div class="flex items-center space-x-2">
      <!-- Buscador -->
      <div v-if="enableSearch" class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <i class="fas fa-search text-gray-400 text-sm" />
        </div>
        <input
          :value="searchValue"
          type="text"
          class="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-64"
          :placeholder="searchPlaceholder"
          @input="$emit('search', $event.target.value)"
        >
      </div>

      <!-- Slot para acciones personalizadas -->
      <slot name="actions">
        <!-- Botón de exportación -->
        <button
          v-if="enableExport"
          ref="exportButtonRef"
          class="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors relative"
          @click="toggleExportMenu"
        >
          <i class="fas fa-download" />
        </button>

        <!-- Menú de exportación -->
        <div
          v-if="showExportMenu"
          class="absolute right-0 mt-12 w-48 bg-white rounded-md shadow-lg py-1 z-10"
          :style="exportMenuPosition"
        >
          <button
            v-for="option in exportOptions"
            :key="option.format"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="handleExport(option.format)"
          >
            <i :class="`fas ${option.icon} mr-2 text-gray-600`" />
            {{ option.label }}
          </button>
        </div>

        <!-- Botón de refrescar -->
        <button
          v-if="enableRefresh"
          class="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
          @click="$emit('refresh')"
        >
          <i class="fas fa-sync-alt" />
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

defineProps({
  title: {
    type: String,
    default: "Lista de elementos",
  },
  icon: {
    type: String,
    default: "fa-list",
  },
  showCount: {
    type: Boolean,
    default: true,
  },
  countLabel: {
    type: String,
    default: "registros",
  },
  totalItems: {
    type: Number,
    default: 0,
  },

  // Propiedades para búsqueda
  enableSearch: {
    type: Boolean,
    default: false,
  },
  searchPlaceholder: {
    type: String,
    default: "Buscar en resultados...",
  },
  searchValue: {
    type: String,
    default: "",
  },

  // Propiedades para exportación
  enableExport: {
    type: Boolean,
    default: false,
  },
  exportOptions: {
    type: Array,
    default: () => [
      { format: "excel", label: "Excel", icon: "fa-file-excel" },
      { format: "pdf", label: "PDF", icon: "fa-file-pdf" },
      { format: "csv", label: "CSV", icon: "fa-file-csv" },
    ],
  },

  // Propiedad para refresh
  enableRefresh: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["search", "refresh", "export"]);

// Estado del menú de exportación
const showExportMenu = ref(false);
const exportMenuPosition = ref({});
const exportButtonRef = ref(null);

// Manejar apertura/cierre del menú de exportación
const toggleExportMenu = () => {
  showExportMenu.value = !showExportMenu.value;
  if (showExportMenu.value && exportButtonRef.value) {
    const rect = exportButtonRef.value.getBoundingClientRect();
    exportMenuPosition.value = {
      top: `${rect.bottom + window.scrollY}px`,
      right: `${window.innerWidth - rect.right}px`,
    };
  }
};

// Manejar exportación
const handleExport = (format) => {
  showExportMenu.value = false;
  emit("export", { format });
};

// Cerrar menú al hacer clic fuera
const closeExportMenu = (event) => {
  if (exportButtonRef.value && !exportButtonRef.value.contains(event.target)) {
    showExportMenu.value = false;
  }
};

// Añadir/remover event listener para clic fuera
onMounted(() => {
  document.addEventListener("click", closeExportMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeExportMenu);
});
</script>
