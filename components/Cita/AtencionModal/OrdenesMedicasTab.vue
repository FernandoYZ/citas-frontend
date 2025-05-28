<template>
  <div class="p-4">
    <!-- Selector de categoría (similar a DiagnosticosTab) -->
    <div class="">
      <div class="flex flex-wrap gap-2">
        <!-- <button
          v-for="categoria in categoriasOrdenes"
          :key="categoria.id"
          class="px-3 py-1.5 text-sm rounded-md transition-colors flex items-center"
          :class="getButtonClass(categoria)"
          :disabled="categoria.disabled"
          @click="seleccionarCategoria(categoria.id)"
        >
          <i :class="categoria.icono + ' mr-1.5'"/>
          {{ categoria.nombre }}
          <span
            v-if="categoria.id === 'farmacia' && contarRecetas() > 0"
            class="ml-1.5 px-1.5 py-0.5 bg-white text-blue-600 text-xs rounded-full"
          >
            {{ contarRecetas() }}
          </span>
          <span
            v-if="categoria.disabled"
            class="ml-1.5 px-1.5 py-0.5 bg-gray-200 text-gray-500 text-xs rounded-full"
          >
            Próximamente
          </span>
        </button> -->
      </div>
    </div>

    <!-- Contenido según la categoría seleccionada -->
    <div>
      <!-- Farmacia (activa) -->
      <div v-if="categoriaSeleccionada === 'farmacia'">
        <FarmaciaTab
          v-model:recetas="localRecetas"
          v-model:observaciones="localObservaciones"
          :diagnosticos-validos="diagnosticosValidos"
          :cita="cita"
          @update="emitUpdate"
        />
      </div>

      <!-- Otras categorías (deshabilitadas) -->
      <div v-else class="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <i :class="categoriaActual.icono + ' text-4xl mb-4 text-gray-300'" />
        <h3 class="text-lg font-medium mb-2 text-gray-600">{{ categoriaActual.nombre }}</h3>
        <p class="text-sm text-gray-500 mb-4">Esta funcionalidad estará disponible próximamente</p>
        <div class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
          <i class="fas fa-clock mr-1" />
          En desarrollo
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import FarmaciaTab from "./FarmaciaTab.vue";

const props = defineProps({
  procedimientos: {
    type: Array,
    default: () => [],
  },
  observaciones: {
    type: String,
    default: "",
  },
  recetas: {
    type: Array,
    default: () => [],
  },
  diagnosticosValidos: {
    type: Array,
    default: () => [],
  },
  cita: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits([
  "update:procedimientos",
  "update:observaciones",
  "update:recetas",
  "update",
]);

// Estado local
const categoriaSeleccionada = ref("farmacia"); // Farmacia por defecto
const localRecetas = ref([...props.recetas]);
const localObservaciones = ref(props.observaciones);

// Categorías de órdenes médicas
const categoriasOrdenes = [
  { 
    id: "farmacia", 
    nombre: "Farmacia", 
    icono: "fas fa-pills",
    disabled: false
  },
  { 
    id: "rayosX", 
    nombre: "Rayos X", 
    icono: "fas fa-radiation",
    disabled: true
  },
  { 
    id: "patologia", 
    nombre: "Patología Clínica", 
    icono: "fas fa-vial",
    disabled: true
  },
  { 
    id: "ecografiaObs", 
    nombre: "Ecografía Obstétrica", 
    icono: "fas fa-baby",
    disabled: true
  },
  { 
    id: "anatomia", 
    nombre: "Anatomía Patológica", 
    icono: "fas fa-microscope",
    disabled: true
  },
  { 
    id: "ecografiaGen", 
    nombre: "Ecografía General", 
    icono: "fas fa-wave-square",
    disabled: true
  },
  { 
    id: "bancoSangre", 
    nombre: "Banco de Sangre", 
    icono: "fas fa-tint",
    disabled: true
  },
  { 
    id: "tomografia", 
    nombre: "Tomografía", 
    icono: "fas fa-x-ray",
    disabled: true
  },
];

// Computed para categoria actual
const categoriaActual = computed(() => {
  return categoriasOrdenes.find(cat => cat.id === categoriaSeleccionada.value) || categoriasOrdenes[0];
});

// Función para obtener las clases CSS del botón
const getButtonClass = (categoria) => {
  if (categoria.disabled) {
    return 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed';
  } else if (categoriaSeleccionada.value === categoria.id) {
    return 'bg-blue-100 text-blue-700 border border-blue-300';
  } else {
    return 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 cursor-pointer';
  }
};

// Seleccionar categoría
const seleccionarCategoria = (categoriaId) => {
  const categoria = categoriasOrdenes.find(cat => cat.id === categoriaId);
  if (!categoria?.disabled) {
    categoriaSeleccionada.value = categoriaId;
  }
};

// Contar recetas
const contarRecetas = () => {
  return localRecetas.value.length;
};

// Actualizar cuando cambian los props
watch(
  () => props.recetas,
  (newVal) => {
    localRecetas.value = [...newVal];
  },
  { deep: true }
);

watch(
  () => props.observaciones,
  (newVal) => {
    localObservaciones.value = newVal;
  }
);

// Emitir actualizaciones
const emitUpdate = () => {
  emit("update:recetas", [...localRecetas.value]);
  emit("update:observaciones", localObservaciones.value);
  emit("update");
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>