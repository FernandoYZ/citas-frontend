<!-- components/cita/SearchForm.vue -->
<template>
  <CommonSearch
    title="Citas Médicas"
    :show-search-button="false"
    :show-clear-button="true"
    @clear="clearFilters"
  >    
    <template #header-actions>
      <div class="flex space-x-2">
        <CommonButton
          variant="tertiary"
          size="md"
          icon-left="fa-sync-alt"
          title="Actualizar datos"
          @click="$emit('refresh')"
        />
        <CommonButton
          variant="primary"
          size="md"
          icon-left="fa-plus"
          label="Reservar cita"
          @click="$emit('new-appointment')"
        />
      </div>
    </template>
    
    <!-- Filtro de fecha -->
    <div>
      <input
        v-model="formFilters.fecha"
        type="date"
        class="w-full pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        @change="applyFiltersAutomatically"
      >
    </div>

    <!-- Filtro de estado -->
    <div>
      <select
        v-model="formFilters.estado"
        class="w-full pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        @change="applyFiltersAutomatically"
      >
        <option value="">Todos los estados</option>
        <option value="separado">Separada</option>
        <option value="atendido">Atendido</option>
        <option value="ausente">Ausente</option>
      </select>
    </div>

    <!-- Buscador -->
    <div>
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <i class="fas fa-search text-gray-400 text-sm"/>
        </div>
        <input
          v-model="formFilters.terminoBusqueda"
          type="text"
          class="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Buscar"
          @input="debounceSearch"
        >
      </div>
    </div>
  </CommonSearch>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      fecha: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
      estado: '',
      terminoBusqueda: ''
    }),
  }
});

const emit = defineEmits(["search", "update:filters", "clear", "new-appointment", "refresh"]);

// Estado de formulario local
const formFilters = ref({ ...props.filters });

// Sincronizar con cambios externos
watch(
  () => props.filters,
  (newFilters) => {
    formFilters.value = { ...newFilters };
  },
  { deep: true }
);

// Variable para almacenar el temporizador del debounce
let debounceTimer = null;

// Método para debounce en la búsqueda por texto
const debounceSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    applyFiltersAutomatically();
  }, 300); // Esperar 300ms después de que el usuario deje de escribir
};

// Aplicar filtros automáticamente
const applyFiltersAutomatically = () => {
  emit("update:filters", formFilters.value);
  emit("search", formFilters.value);
};

// Limpiar filtros
const clearFilters = () => {
  // Reiniciar a valores por defecto
  formFilters.value = {
    fecha: new Date().toISOString().split('T')[0],
    estado: '',
    terminoBusqueda: ''
  };
  emit("update:filters", formFilters.value);
  emit("clear");
};
</script>