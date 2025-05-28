<!-- components/Cita/AtencionModal/FarmaciaTab.vue -->
<template>
  <div>
    <!-- Header con botón agregar -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <i class="fas fa-pills text-blue-500 mr-2" />
        <div>
          <h3 class="text-md font-medium text-gray-700">Recetas Médicas</h3>
        </div>
      </div>
      <button
        v-if="diagnosticosValidos.length > 0"
        class="px-3 py-1.5 border border-blue-400 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 cursor-pointer transition-colors"
        :disabled="localRecetas.length >= 20"
        :class="{'opacity-50 cursor-not-allowed hover:bg-blue-50': localRecetas.length >= 20}"
        @click="agregarReceta"
      >
        <i class="fas fa-plus-circle mr-1.5" />
        Agregar
      </button>
      <div v-else class="text-[0.65rem] text-amber-600 bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
        <i class="fas fa-exclamation-triangle mr-1" />
        Debe agregar diagnósticos primero
      </div>
    </div>

    <!-- Tabla de medicamentos -->
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 35%;">
                Medicamento
              </th>
              <th class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 12%;">
                Diagnóstico
              </th>
              <th class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 8%;">
                Cant.
              </th>
              <th class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 8%;">
                Dosis
              </th>
              <th class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 15%;">
                Vía Admin.
              </th>
              <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 15%;">
                Observaciones
              </th>
              <th class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 7%;">
                Acción
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(receta, index) in localRecetas"
              :key="'receta-' + index"
              :class="{
                'bg-blue-50/50': selectedRecetaIndex === index,
              }"
            >
              <!-- Medicamento -->
              <td class="px-2 py-2 text-xs relative">
                <div class="relative">
                  <div class="flex items-center">
                    <input
                      v-model="receta.searchTerm"
                      type="text"
                      class="w-full px-2 py-1 text-xs border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Buscar medicamento..."
                      @input="(e) => handleMedicamentoSearchInput(index, e)"
                      @focus="(e) => handleMedicamentoSearchFocus(index, e)"
                      @blur="handleMedicamentoInputBlur"
                      @keydown.down.prevent="handleMedicamentoAutocompleteNavigation(1)"
                      @keydown.up.prevent="handleMedicamentoAutocompleteNavigation(-1)"
                      @keydown.enter.prevent="handleMedicamentoAutocompleteSelection"
                      @keydown.esc="showMedicamentoAutocomplete = false"
                      @click="(e) => handleMedicamentoSearchClick(index, e)"
                    >
                    <button
                      class="py-1 px-1.5 bg-blue-50 text-blue-600 rounded-r border border-gray-300 border-l-0 hover:bg-blue-100 transition-colors"
                      @click.stop="buscarMedicamento(index, $event)"
                    >
                      <i class="fas fa-search text-xs" />
                    </button>
                  </div>

                  <!-- Dropdown de autocompletado para medicamentos -->
                  <teleport to="body">
                    <div
                      v-if="showMedicamentoAutocomplete && selectedRecetaIndex === index"
                      class="fixed bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto dropdown-autocomplete"
                      :style="medicamentoAutocompletePosition"
                    >
                      <div
                        v-if="medicamentoAutocompleteLoading"
                        class="px-3 py-2 text-xs text-center text-gray-500"
                      >
                        <i class="fas fa-circle-notch fa-spin mr-1" />
                        Buscando...
                      </div>
                      <div
                        v-else-if="medicamentoAutocompleteResults.length === 0"
                        class="px-3 py-2 text-xs text-center text-gray-500"
                      >
                        No se encontraron medicamentos
                      </div>
                      <div v-else>
                        <div
                          v-for="(resultado, i) in medicamentoAutocompleteResults"
                          :key="'medicamento-result-' + i"
                          class="px-3 py-2 text-xs hover:bg-blue-50 cursor-pointer autocomplete-item"
                          :class="{
                            'bg-blue-100 selected':
                              i === selectedMedicamentoAutocompleteIndex,
                          }"
                          @click="seleccionarMedicamentoResultado(resultado, index)"
                          @mouseenter="selectedMedicamentoAutocompleteIndex = i"
                        >
                          <div class="font-medium text-blue-800 text-xs">
                            {{ resultado.Codigo }}
                          </div>
                          <div class="text-gray-600 truncate text-xs">
                            {{ resultado.Nombre }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </teleport>
                </div>
              </td>

              <!-- Diagnóstico -->
              <td class="px-2 py-2 text-xs">
                <select
                  v-model="receta.idDiagnostico"
                  class="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  @change="emitUpdate"
                >
                  <option value="">Sel.</option>
                  <option
                    v-for="diag in diagnosticosValidos"
                    :key="diag.idDiagnostico"
                    :value="diag.idDiagnostico"
                    :title="diag.descripcion"
                  >
                    {{ diag.codigo }}
                  </option>
                </select>
              </td>

              <!-- Cantidad -->
              <td class="px-2 py-2 text-xs text-center">
                <input
                  v-model="receta.cantidadPedida"
                  type="number"
                  min="1"
                  class="w-14 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                  @input="actualizarTotal(receta); emitUpdate()"
                >
              </td>

              <!-- Dosis -->
              <td class="px-2 py-2 text-xs text-center">
                <select
                  v-model="receta.idDosisRecetadas"
                  class="w-14 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  @change="emitUpdate"
                >
                  <option v-for="n in 6" :key="n" :value="n">{{ n }}</option>
                </select>
              </td>

              <!-- Vía de Administración -->
              <td class="px-2 py-2 text-xs">
                <select
                  v-model="receta.idViaAdministracion"
                  class="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  @change="emitUpdate"
                >
                  <option v-for="via in viasAdministracion" :key="via.valor" :value="via.valor">
                    {{ via.nombre }}
                  </option>
                </select>
              </td>

              <!-- Observaciones -->
              <td class="px-2 py-2 text-xs">
                <input
                  v-model="receta.observaciones"
                  type="text"
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Obs..."
                  maxlength="100"
                  @input="emitUpdate"
                >
              </td>

              <!-- Acción -->
              <td class="px-2 py-2 text-xs text-center">
                <button
                  class="py-1 px-1.5 border border-red-300 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                  :title="receta.idReceta ? 'Eliminar medicamento de receta' : 'Quitar medicamento'"
                  @click.stop="eliminarReceta(index)"
                >
                  <i class="fas fa-trash-alt text-xs" />
                </button>
              </td>
            </tr>
            <tr v-if="localRecetas.length === 0">
              <td
                colspan="7"
                class="px-3 py-8 text-center text-sm text-gray-500"
              >
                <div class="flex flex-col items-center">
                  <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <i class="fas fa-pills text-2xl text-blue-300" />
                  </div>
                  <h4 class="font-medium text-gray-700 mb-1">No hay medicamentos en la receta</h4>
                  <p class="text-xs text-gray-500 mb-4">Agregue medicamentos para el tratamiento del paciente</p>
                  <button
                    v-if="diagnosticosValidos.length > 0"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    @click="agregarReceta"
                  >
                    <i class="fas fa-plus mr-1" />
                    Agregar primer medicamento
                  </button>
                  <div v-else class="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    Primero agregue diagnósticos en la pestaña anterior
                  </div>
                </div>
              </td>
            </tr>
            <tr v-else-if="localRecetas.length >= 20">
              <td
                colspan="7"
                class="px-3 py-2 text-center text-xs text-orange-500"
              >
                <i class="fas fa-info-circle mr-1"/>
                Máximo 20 medicamentos permitidos
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { farmaciaService } from "~/services/FarmaciaService";
import { useNotification } from "~/composables/useNotification";
import _ from "lodash";

const props = defineProps({
  recetas: {
    type: Array,
    default: () => [],
  },
  observaciones: {
    type: String,
    default: "",
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
  "update:recetas",
  "update:observaciones",
  "update",
]);

// Notificaciones
const notification = useNotification();

// Estado local
const localRecetas = ref([]);

// Estado para autocompletado de medicamentos
const showMedicamentoAutocomplete = ref(false);
const medicamentoAutocompleteResults = ref([]);
const medicamentoAutocompleteLoading = ref(false);
const selectedRecetaIndex = ref(null);
const selectedMedicamentoAutocompleteIndex = ref(0);
const medicamentoAutocompletePosition = ref({});
const activeMedicamentoInputRef = ref(null);
const medicamentoAutocompleteDelayId = ref(null);

// Vías de administración
const viasAdministracion = [
  { valor: null, nombre: "--" },
  { valor: 1, nombre: "Oral" },
  { valor: 2, nombre: "Sublingual" },
  { valor: 3, nombre: "Rectal" },
  { valor: 4, nombre: "Intravenosa" },
  { valor: 5, nombre: "Intramuscular" },
  { valor: 6, nombre: "Subcutánea" },
  { valor: 7, nombre: "Dérmica" },
  { valor: 8, nombre: "Nasal" },
  { valor: 9, nombre: "Oftalmológica" },
  { valor: 10, nombre: "Inhalatoria" },
  { valor: 11, nombre: "Epidural" },
  { valor: 12, nombre: "Intratecal" },
  { valor: 13, nombre: "Vaginal" },
];

// Función para verificar si un medicamento ya existe
const existeMedicamento = (idProducto) => {
  return localRecetas.value.some(
    (receta) => receta.idProducto === idProducto
  );
};

// Agregar receta
const agregarReceta = () => {
  if (localRecetas.value.length >= 20) {
    notification.show({
      title: "Límite alcanzado",
      message: "Solo se permite un máximo de 20 medicamentos",
      type: "warning",
    });
    return;
  }
  
  localRecetas.value.push({
    idProducto: null,
    codigo: "",
    nombre: "",
    searchTerm: "",
    cantidadPedida: 1,
    precio: 0,
    total: 0,
    idDiagnostico: props.diagnosticosValidos[0]?.idDiagnostico || null,
    idDosisRecetadas: 1,
    idViaAdministracion: null, // Cambiado a null por defecto
    observaciones: ""
  });
  
  emitUpdate();
  
  nextTick(() => {
    selectedRecetaIndex.value = localRecetas.value.length - 1;
  });
};

// Actualizar total
const actualizarTotal = (receta) => {
  if (receta.precio && receta.cantidadPedida) {
    receta.total = Math.round((receta.precio * receta.cantidadPedida) * 100) / 100;
  }
};

// Eliminar receta
const eliminarReceta = async (index) => {
  const receta = localRecetas.value[index];
  
  if (receta.idReceta && receta.idProducto) {
    try {
      await farmaciaService.eliminarMedicamento(receta.idReceta, receta.idProducto);
      notification.show({
        title: "Éxito",
        message: "Medicamento eliminado correctamente",
        type: "success",
      });
    } catch (error) {
      console.error("Error al eliminar medicamento:", error);
      notification.show({
        title: "Error",
        message: "Error al eliminar el medicamento",
        type: "error",
      });
      return;
    }
  }
  
  localRecetas.value.splice(index, 1);
  emitUpdate();
};

// Manejar click directo en el campo de búsqueda de medicamentos
const handleMedicamentoSearchClick = (index, event) => {
  if (medicamentoAutocompleteLoading.value) return;
  
  if (medicamentoAutocompleteDelayId.value) {
    clearTimeout(medicamentoAutocompleteDelayId.value);
  }
  
  medicamentoAutocompleteDelayId.value = setTimeout(() => {
    selectedRecetaIndex.value = index;
    setMedicamentoAutocompletePosition(event.target);
    
    if (!localRecetas.value[index].searchTerm?.trim()) {
      cargarMedicamentosFrecuentes();
    }
  }, 100);
};

// Buscar medicamento
const buscarMedicamento = (index, event) => {
  selectedRecetaIndex.value = index;
  if (event) {
    setMedicamentoAutocompletePosition(event.target.previousElementSibling);
  }
  cargarMedicamentosFrecuentes();
};

// Debounce para buscar medicamentos
const buscarMedicamentosDebounced = _.debounce(async (termino) => {
  if (!termino || termino.length < 1) {
    cargarMedicamentosFrecuentes();
    return;
  }

  medicamentoAutocompleteLoading.value = true;
  try {
    const resultados = await farmaciaService.buscarMedicamentos(termino, 30);
    medicamentoAutocompleteResults.value = resultados;
    showMedicamentoAutocomplete.value = true;
    selectedMedicamentoAutocompleteIndex.value = 0;
  } catch (error) {
    console.error("Error al buscar medicamentos:", error);
    medicamentoAutocompleteResults.value = [];
  } finally {
    medicamentoAutocompleteLoading.value = false;
  }
}, 300);

// Cargar medicamentos frecuentes
const cargarMedicamentosFrecuentes = async () => {
  medicamentoAutocompleteLoading.value = true;
  try {
    const resultados = await farmaciaService.buscarMedicamentos("", 30);
    medicamentoAutocompleteResults.value = resultados;
    showMedicamentoAutocomplete.value = true;
    selectedMedicamentoAutocompleteIndex.value = 0;
  } catch (error) {
    console.error("Error al cargar medicamentos frecuentes:", error);
    medicamentoAutocompleteResults.value = [];
  } finally {
    medicamentoAutocompleteLoading.value = false;
  }
};

// Handlers para medicamento autocomplete
const handleMedicamentoSearchInput = (index, event) => {
  selectedRecetaIndex.value = index;
  const termino = event.target.value;
  localRecetas.value[index].searchTerm = termino;
  setMedicamentoAutocompletePosition(event.target);
  buscarMedicamentosDebounced(termino);
};

const handleMedicamentoSearchFocus = (index, event) => {
  selectedRecetaIndex.value = index;
  setMedicamentoAutocompletePosition(event.target);
  
  const termino = localRecetas.value[index].searchTerm || "";
  if (termino.trim().length > 0) {
    buscarMedicamentosDebounced(termino);
  } else {
    cargarMedicamentosFrecuentes();
  }
};

const handleMedicamentoInputBlur = () => {
  setTimeout(() => {
    const activeElement = document.activeElement;
    if (!activeElement || !activeElement.closest(".autocomplete-item")) {
      showMedicamentoAutocomplete.value = false;
    }
  }, 200);
};

// Posicionar dropdown de medicamentos
const setMedicamentoAutocompletePosition = (inputElement) => {
  if (!inputElement) return;

  activeMedicamentoInputRef.value = inputElement;
  const rect = inputElement.getBoundingClientRect();
  
  const parentContainer = inputElement.closest('.search-container');
  const containerWidth = parentContainer ? parentContainer.offsetWidth : rect.width;
  
  medicamentoAutocompletePosition.value = {
    position: 'fixed',
    top: `${rect.bottom}px`,
    left: `${rect.left}px`,
    width: `${Math.max(containerWidth, 340)}px`,
    zIndex: 10000,
  };
};

// Navegación en medicamento autocomplete
const handleMedicamentoAutocompleteNavigation = (direction) => {
  if (!showMedicamentoAutocomplete.value || medicamentoAutocompleteResults.value.length === 0) return;

  const maxIndex = medicamentoAutocompleteResults.value.length - 1;
  let newIndex = selectedMedicamentoAutocompleteIndex.value + direction;

  if (newIndex < 0) newIndex = maxIndex;
  if (newIndex > maxIndex) newIndex = 0;

  selectedMedicamentoAutocompleteIndex.value = newIndex;

  nextTick(() => {
    const selectedElement = document.querySelector(
      ".autocomplete-item.selected"
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: "nearest" });
    }
  });
};

// Seleccionar con Enter
const handleMedicamentoAutocompleteSelection = () => {
  if (!showMedicamentoAutocomplete.value || medicamentoAutocompleteResults.value.length === 0) return;

  const selectedResult = medicamentoAutocompleteResults.value[selectedMedicamentoAutocompleteIndex.value];
  if (selectedResult) {
    seleccionarMedicamentoResultado(selectedResult, selectedRecetaIndex.value);
  }
};

// Seleccionar resultado de medicamento
const seleccionarMedicamentoResultado = (resultado, index) => {
  // Verificar si el medicamento ya existe en la lista
  if (existeMedicamento(resultado.IdProducto)) {
    notification.show({
      title: "Medicamento duplicado",
      message: "Este medicamento ya ha sido agregado",
      type: "warning",
    });
    showMedicamentoAutocomplete.value = false;
    return;
  }

  // Crear searchTerm formateado
  const searchTermValue = `${resultado.Codigo} - ${resultado.Nombre}`;

  // Conservar los valores existentes
  const existingReceta = localRecetas.value[index];
  
  localRecetas.value[index] = {
    ...existingReceta,
    idProducto: resultado.IdProducto,
    codigo: resultado.Codigo,
    nombre: resultado.Nombre,
    searchTerm: searchTermValue,
    precio: resultado.Precio || 0,
    total: existingReceta.cantidadPedida * (resultado.Precio || 0),
    // Mantener valores existentes
    idReceta: existingReceta.idReceta || null,
    cantidadPedida: existingReceta.cantidadPedida || 1,
    idDosisRecetadas: existingReceta.idDosisRecetadas || 1,
    idViaAdministracion: existingReceta.idViaAdministracion || null, // Cambiado a null
    observaciones: existingReceta.observaciones || ""
  };

  showMedicamentoAutocomplete.value = false;
  emitUpdate();
};

// Función para manejar clicks fuera del autocomplete
const handleMedicamentoClickOutside = (event) => {
  const isAutocompleteItem = event.target.closest(".autocomplete-item");
  const isInput = event.target === activeMedicamentoInputRef.value;

  if (!isAutocompleteItem && !isInput && showMedicamentoAutocomplete.value) {
    showMedicamentoAutocomplete.value = false;
  }
};

// Actualizar los watches
watch(
  () => props.recetas,
  (newVal) => {
    localRecetas.value = newVal.map(receta => ({
      ...receta,
      searchTerm: receta.codigo && receta.nombre ? `${receta.codigo} - ${receta.nombre}` : "",
      idDosisRecetadas: receta.idDosisRecetadas || 1,
      idViaAdministracion: receta.idViaAdministracion || null, // Cambiado a null
      observaciones: receta.observaciones || ""
    }));
  },
  { deep: true }
);

// Emitir cambios al componente padre
const emitUpdate = () => {
  // Filtrar los datos para no enviar campos temporales como searchTerm
  const cleanedRecetas = localRecetas.value.map((receta) => {
    const { searchTerm, ...rest } = receta;
    return {
      ...rest,
      // Asegurar que estos campos existan con sus valores actuales
      idProducto: receta.idProducto,
      codigo: receta.codigo || "",
      nombre: receta.nombre || "",
      cantidadPedida: receta.cantidadPedida || 1,
      precio: receta.precio || 0,
      total: receta.total || 0,
      idDiagnostico: receta.idDiagnostico,
      idDosisRecetadas: receta.idDosisRecetadas || 1,
      idViaAdministracion: receta.idViaAdministracion || null, // Cambiado a null
      observaciones: receta.observaciones || ""
    };
  });

  emit("update:recetas", cleanedRecetas);
  emit("update");
};

// Al montar el componente
onMounted(() => {
  document.addEventListener("click", handleMedicamentoClickOutside);

  if (props.recetas && props.recetas.length > 0) {
    localRecetas.value = [...props.recetas.map(receta => ({
      ...receta,
      searchTerm: receta.codigo && receta.nombre ? `${receta.codigo} - ${receta.nombre}` : ""
    }))];
    console.log("Recetas inicializadas:", localRecetas.value);
  }
});

// Limpiar eventos al desmontar el componente
onBeforeUnmount(() => {
  document.removeEventListener("click", handleMedicamentoClickOutside);
  
  if (medicamentoAutocompleteDelayId.value) {
    clearTimeout(medicamentoAutocompleteDelayId.value);
  }
});
</script>

<style scoped>
/* Estilos para la fila seleccionada */
.row-selected {
  background-color: #f0f7ff;
}

/* Estilos para autocompletado */
.selected {
  background-color: #dbeafe;
}

/* Contenedor de búsqueda */
.search-container {
  position: relative;
}

/* Dropdown de autocompletado */
.dropdown-autocomplete {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: fadeIn 0.2s ease-in-out;
  z-index: 10000 !important;
}

/* Elementos del dropdown */
.autocomplete-item {
  transition: background-color 0.15s ease;
}

.autocomplete-item:hover {
  background-color: #eff6ff;
}

/* Asegurar que las tablas mantengan su ancho */
table.table-fixed {
  width: 100%;
  table-layout: fixed;
}

table.table-fixed th,
table.table-fixed td {
  overflow: visible;
  position: relative;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>