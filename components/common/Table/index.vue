<!-- components/common/Table/index.vue -->
<template>
  <div
    class="bg-white rounded-lg border-gray-200 overflow-hidden transition-shadow duration-200"
  >
    <!-- Cabecera de la tabla con acciones -->
    <TableHeader
      :title="title"
      :icon="icon"
      :show-count="showCount"
      :count-label="countLabel"
      :total-items="items.length"
      :enable-search="enableSearch"
      :search-placeholder="searchPlaceholder"
      :search-value="searchValue"
      :enable-export="enableExport"
      :export-options="exportOptions"
      :enable-refresh="enableRefresh"
      @search="handleSearch"
      @refresh="$emit('refresh')"
      @export="handleExport"
    >
      <template v-if="$slots.headerActions" #actions>
        <slot name="headerActions" />
      </template>
    </TableHeader>

    <!-- Cuerpo de la tabla -->
    <TableBody
      :items="paginatedItems"
      :columns="columns"
      :item-key="itemKey"
      :enable-sort="enableSort"
      :sort-key="sortKey"
      :sort-direction="sortDirection"
      :empty-message="emptyMessage"
      :empty-description="emptyDescription"
      @sort="handleSort"
    >
      <!-- Pasar hacia arriba los slots para filas y acciones -->
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </TableBody>

    <!-- Paginación -->
    <TablePagination
      v-if="enablePagination"
      :enabled="enablePagination"
      :total-items="items.length"
      :current-page="currentPage"
      :rows-per-page="rowsPerPage"
      :rows-per-page-options="rowsPerPageOptions"
      @update:current-page="updateCurrentPage"
      @update:rows-per-page="updateRowsPerPage"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import TableHeader from "./Header.vue";
import TableBody from "./Body.vue";
import TablePagination from "./Pagination.vue";
import { useExport } from '../../../composables/useExport'

const props = defineProps({
  // Datos
  items: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  itemKey: {
    type: String,
    default: "id",
  },

  // Cabecera
  title: {
    type: String,
    default: "Lista de ítems",
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

  // Búsqueda
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

  // Ordenamiento
  enableSort: {
    type: Boolean,
    default: true,
  },
  sortKey: {
    type: String,
    default: "",
  },
  sortDirection: {
    type: String,
    default: "asc",
  },

  // Paginación
  enablePagination: {
    type: Boolean,
    default: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  rowsPerPage: {
    type: Number,
    default: 10,
  },
  rowsPerPageOptions: {
    type: Array,
    default: () => [5, 10, 25, 50, 100],
  },

  // Exportación
  enableExport: {
    type: Boolean,
    default: false,
  },
  exportFilename: {
    type: String,
    default: "data-export",
  },
  exportOptions: {
    type: Array,
    default: () => [
      { format: "excel", label: "Excel", icon: "fa-file-excel" },
      { format: "pdf", label: "PDF", icon: "fa-file-pdf" },
      { format: "csv", label: "CSV", icon: "fa-file-csv" },
    ],
  },

  // Otras opciones
  enableRefresh: {
    type: Boolean,
    default: false,
  },
  emptyMessage: {
    type: String,
    default: "No se encontraron registros",
  },
  emptyDescription: {
    type: String,
    default: "Intenta ajustar los filtros de búsqueda",
  },
});

const emit = defineEmits([
  "update:searchValue",
  "update:sortKey",
  "update:sortDirection",
  "update:currentPage",
  "update:rowsPerPage",
  "refresh",
  "sort",
  "search",
  "export",
]);

// Hook de exportación
const { exportData } = useExport();

// Manejar la búsqueda
const handleSearch = (value) => {
  emit("update:searchValue", value);
  emit("search", value);
};

// Manejar el ordenamiento
const handleSort = ({ key, direction }) => {
  emit("update:sortKey", key);
  emit("update:sortDirection", direction);
  emit("sort", { key, direction });
};

// Manejar la exportación
const handleExport = async ({ format }) => {
  // Preparar datos para exportación
  const exportOptions = {
    data: props.items,
    columns: props.columns,
    format,
    fileName: props.exportFilename,
  };

  // Realizar exportación
  const success = await exportData(exportOptions);

  // Emitir resultado de la exportación
  emit("export", {
    format,
    success,
    data: props.items,
  });
};

// Actualizar paginación
const updateCurrentPage = (page) => {
  emit("update:currentPage", page);
};

const updateRowsPerPage = (size) => {
  emit("update:rowsPerPage", size);
  // Resetear a la primera página cuando se cambia el tamaño
  emit("update:currentPage", 1);
};

// Calcular los ítems paginados
const paginatedItems = computed(() => {
  if (!props.enablePagination) return props.items;

  const start = (props.currentPage - 1) * props.rowsPerPage;
  const end = start + props.rowsPerPage;
  return props.items.slice(start, end);
});
</script>
