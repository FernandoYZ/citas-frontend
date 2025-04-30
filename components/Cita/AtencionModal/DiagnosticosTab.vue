<template>
  <div class="p-4">
    <!-- Motivo - Examen Medico - Tratamiento-->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <!-- Motivo de Consulta -->
      <div class="border border-gray-200 rounded-lg">
        <div
          class="bg-gray-50 px-3 py-2 border-b border-gray-100 rounded-t-lg font-medium text-gray-700 text-sm flex items-center"
        >
          <i class="fas fa-clipboard-list text-blue-500 mr-2" />
          Motivo de Consulta
        </div>
        <div class="p-3">
          <textarea
            v-model="localConsulta.motivoConsulta"
            class="w-full h-16 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Describa el motivo de consulta"
            @input="emitUpdate"
          />
        </div>
      </div>

      <!-- Examen Clínico -->
      <div class="border border-gray-200 rounded-lg">
        <div
          class="bg-gray-50 px-3 py-2 border-b border-gray-100 rounded-t-lg font-medium text-gray-700 text-sm flex items-center"
        >
          <i class="fas fa-stethoscope text-blue-500 mr-2" />
          Examen Clínico
        </div>
        <div class="p-3">
          <textarea
            v-model="localConsulta.examenClinico"
            class="w-full h-16 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Registre los hallazgos"
            @input="emitUpdate"
          />
        </div>
      </div>

      <!-- Tratamiento -->
      <div class="border border-gray-200 rounded-lg">
        <div
          class="bg-gray-50 px-3 py-2 border-b border-gray-100 rounded-t-lg font-medium text-gray-700 text-sm flex items-center"
        >
          <i class="fas fa-pills text-blue-500 mr-2" />
          Tratamiento
        </div>
        <div class="p-3">
          <textarea
            v-model="localTratamiento"
            class="w-full h-16 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Indique el tratamiento"
            @input="emitUpdate"
          />
        </div>
      </div>
    </div>

    <!-- Diagnósticos -->
    <div class="border border-gray-200 rounded-lg">
      <div
        class="bg-gray-50 px-3 py-2 border-b border-gray-100 rounded-t-lg font-medium text-gray-700 text-sm flex justify-between items-center"
      >
        <div class="flex items-center">
          <i class="fas fa-tag text-blue-500 mr-2" />
          Diagnósticos
        </div>
        <button
          class="px-2 py-1 border border-blue-400 bg-blue-50 text-blue-600 rounded-md text-xs hover:bg-blue-100 cursor-pointer"
          @click="agregarCIEX"
        >
          <i class="fas fa-plus-circle mr-0.5" /> Agregar
        </button>
      </div>
      <div class="overflow-hidden">
        <div class="overflow-x-auto overflow-y-visible">
          <table class="min-w-full divide-y divide-gray-200 table-fixed">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                >
                  Código
                </th>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64"
                >
                  Descripción
                </th>
                <th
                  class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                >
                  Tipo
                </th>
                <th
                  class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                >
                  LAB
                </th>
                <th
                  class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
                >
                  Acción
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(diag, index) in localDiagnosticos"
                :key="'ciex-' + index"
                :class="{
                  'bg-blue-50/50': selectedDiagnosticoIndex === index,
                }"
                @click="seleccionarDiagnostico(index)"
              >
                <td class="px-2 py-1.5 whitespace-nowrap text-xs relative">
                  <div class="relative">
                    <div class="flex items-center">
                      <input
                        v-model="diag.codigo"
                        type="text"
                        class="w-full px-2 py-1 text-xs border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
                        @input="(e) => handleCodigoInput(index, e)"
                        @focus="(e) => handleCodigoFocus(index, e)"
                        @blur="handleInputBlur"
                        @keydown.down.prevent="handleAutocompleteNavigation(1)"
                        @keydown.up.prevent="handleAutocompleteNavigation(-1)"
                        @keydown.enter.prevent="handleAutocompleteSelection"
                        @keydown.esc="showAutocomplete = false"
                      >
                      <button
                        class="py-1 px-1.5 bg-blue-50 text-blue-600 rounded-r border border-gray-300 border-l-0 hover:bg-blue-100 transition-colors"
                        @click.stop="buscarDiagnostico(index, $event)"
                      >
                        <i class="fas fa-search" />
                      </button>
                    </div>

                    <!-- Dropdown de autocompletado para código -->
                    <div
                      v-if="
                        showAutocomplete &&
                        selectedDiagnosticoIndex === index &&
                        autocompleteMode === 'codigo'
                      "
                      class="fixed z-50 bg-white border border-gray-300 rounded-md shadow-lg w-72 max-h-48 overflow-y-auto -translate-x-64 -translate-y-8"
                      :style="autocompletePosition"
                    >
                      <div
                        v-if="autocompleteLoading"
                        class="px-3 py-2 text-xs text-center text-gray-500"
                      >
                        <i class="fas fa-circle-notch fa-spin mr-1" />
                        Buscando...
                      </div>
                      <div
                        v-else-if="autocompleteResults.length === 0"
                        class="px-3 py-2 text-xs text-center text-gray-500"
                      >
                        No se encontraron resultados
                      </div>
                      <div v-else>
                        <div
                          v-for="(result, i) in autocompleteResults"
                          :key="'result-' + i"
                          class="px-3 py-2 text-xs hover:bg-blue-50 cursor-pointer autocomplete-item"
                          :class="{
                            'bg-blue-100 selected':
                              i === selectedAutocompleteIndex,
                          }"
                          @click="seleccionarResultado(result, index)"
                          @mouseenter="selectedAutocompleteIndex = i"
                        >
                          <div class="font-medium text-blue-800">
                            {{ result.Codigo }}
                          </div>
                          <div class="text-gray-600 truncate text-xs">
                            {{ result.Descripcion }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-2 py-1.5 text-xs">
                  <div class="relative">
                    <input
                      v-model="diag.descripcion"
                      type="text"
                      class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
                      @input="(e) => handleDescripcionInput(index, e)"
                      @focus="(e) => handleDescripcionFocus(index, e)"
                      @blur="handleInputBlur"
                      @keydown.down.prevent="handleAutocompleteNavigation(1)"
                      @keydown.up.prevent="handleAutocompleteNavigation(-1)"
                      @keydown.enter.prevent="handleAutocompleteSelection"
                      @keydown.esc="showAutocomplete = false"
                    >
                    <!-- Dropdown de autocompletado para descripción -->
                    <div
                      v-if="
                        showAutocomplete &&
                        selectedDiagnosticoIndex === index &&
                        autocompleteMode === 'descripcion'
                      "
                      class="fixed z-50 bg-white border border-gray-300 rounded-md shadow-lg w-96 max-h-48 overflow-y-auto -translate-x-64 -translate-y-8"
                      :style="autocompletePosition"
                    >
                      <div
                        v-if="autocompleteLoading"
                        class="px-3 py-2 text-xs text-center text-gray-500"
                      >
                        <i class="fas fa-circle-notch fa-spin mr-1" />
                        Buscando...
                      </div>
                      <div
                        v-else-if="autocompleteResults.length === 0"
                        class="px-3 py-2 text-xs text-center text-gray-500"
                      >
                        No se encontraron resultados
                      </div>
                      <div v-else>
                        <div
                          v-for="(result, i) in autocompleteResults"
                          :key="'result-' + i"
                          class="px-3 py-2 text-xs hover:bg-blue-50 cursor-pointer autocomplete-item"
                          :class="{
                            'bg-blue-100 selected':
                              i === selectedAutocompleteIndex,
                          }"
                          @click="seleccionarResultado(result, index)"
                          @mouseenter="selectedAutocompleteIndex = i"
                        >
                          <div class="font-medium truncate">
                            {{ result.Descripcion }}
                          </div>
                          <div class="text-blue-800 text-xs">
                            {{ result.Codigo }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-2 py-1.5 whitespace-nowrap text-xs text-center">
                  <select
                    v-model="diag.tipo"
                    class="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50 text-blue-800"
                  >
                    <option
                      v-for="clasificacion in clasificacionesDx"
                      :key="clasificacion.IdSubclasificacionDx"
                      :value="clasificacion.IdSubclasificacionDx"
                    >
                      {{ clasificacion.Codigo }}
                    </option>
                  </select>
                </td>
                <td class="px-2 py-1.5 whitespace-nowrap text-xs">
                  <div class="flex space-x-1">
                    <input
                      v-model="diag.labConfHIS"
                      type="text"
                      maxlength="3"
                      placeholder="Lab 1"
                      class="w-12 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      @input="validarInputLab($event, diag, 'labConfHIS')"
                    >

                    <input
                      v-model="diag.labConfHIS2"
                      type="text"
                      maxlength="3"
                      placeholder="Lab 2"
                      class="w-12 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      @input="validarInputLab($event, diag, 'labConfHIS2')"
                    >

                    <input
                      v-model="diag.labConfHIS3"
                      type="text"
                      maxlength="3"
                      placeholder="Lab 3"
                      class="w-12 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      @input="validarInputLab($event, diag, 'labConfHIS3')"
                    >
                  </div>
                </td>
                <td class="px-2 py-1.5 whitespace-nowrap text-xs text-center">
                  <button
                    class="py-1 px-1.5 border border-blue-300 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                    @click.stop="eliminarCIEX(index)"
                  >
                    <i class="fas fa-trash-alt" />
                  </button>
                </td>
              </tr>
              <tr v-if="localDiagnosticos.length === 0">
                <td
                  colspan="5"
                  class="px-3 py-4 text-center text-sm text-gray-500"
                >
                  No hay diagnósticos.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { atencionesService } from "~/services/AtencionesService";
import { useNotification } from "~/composables/useNotification";
import _ from "lodash";

const props = defineProps({
  consulta: {
    type: Object,
    default: () => ({
      motivoConsulta: "",
      examenClinico: "",
    }),
  },
  diagnosticos: {
    type: Array,
    default: () => [],
  },
  tratamiento: {
    type: String,
    default: "",
  },
  clasificacionesDx: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "update:consulta",
  "update:diagnosticos",
  "update:tratamiento",
  "update",
]);

// Notificaciones
const notification = useNotification();

// Copia local de los datos
const localConsulta = ref({ ...props.consulta });
const localDiagnosticos = ref([...props.diagnosticos]);
const localTratamiento = ref(props.tratamiento);

// Estado para autocompletado de diagnósticos
const showAutocomplete = ref(false);
const autocompleteResults = ref([]);
const autocompleteLoading = ref(false);
const selectedDiagnosticoIndex = ref(null);
const selectedAutocompleteIndex = ref(0);
const autocompleteMode = ref("codigo");
const autocompletePosition = ref({});
const activeInputRef = ref(null);

// Actualizar cuando cambian los props
watch(
  () => props.consulta,
  (newVal) => {
    localConsulta.value = { ...newVal };
  },
  { deep: true }
);

watch(
  () => props.diagnosticos,
  (newVal) => {
    localDiagnosticos.value = [...newVal];
  },
  { deep: true }
);

watch(
  () => props.tratamiento,
  (newVal) => {
    localTratamiento.value = newVal;
  }
);

// Emitir cambios al componente padre
const emitUpdate = () => {
  emit("update:consulta", { ...localConsulta.value });
  emit("update:diagnosticos", [...localDiagnosticos.value]);
  emit("update:tratamiento", localTratamiento.value);
  emit("update");
};

// Funciones para manejar diagnósticos
const agregarCIEX = () => {
  localDiagnosticos.value.push({
    codigo: "",
    descripcion: "",
    tipo:
      props.clasificacionesDx.length > 0
        ? props.clasificacionesDx[0].IdSubclasificacionDx
        : 102, // 102 = Definitivo por defecto
    labConfHIS: null,
    labConfHIS2: null,
    labConfHIS3: null,
  });
  emitUpdate();

  // Seleccionar el nuevo diagnóstico
  nextTick(() => {
    selectedDiagnosticoIndex.value = localDiagnosticos.value.length - 1;
  });
};

const validarInputLab = (event, objeto, propiedad) => {
  const valor = event.target.value;

  // Solo permitir letras y números (sin acentos ni signos)
  const valorLimpio = valor.replace(/[^a-zA-Z0-9]/g, "");

  // Asignar de nuevo al objeto (porque v-model ya está atado)
  objeto[propiedad] = valorLimpio;
  emitUpdate();
};

// Eliminar diagnóstico
const eliminarCIEX = async (index) => {
  // Si tiene ID, eliminarlo de la base de datos
  const diagnostico = localDiagnosticos.value[index];
  if (diagnostico.id) {
    try {
      await atencionesService.eliminarDiagnostico(diagnostico.id);
      notification.show({
        title: "Éxito",
        message: "Diagnóstico eliminado correctamente",
        type: "success",
      });
    } catch (error) {
      console.error("Error al eliminar diagnóstico:", error);
      notification.show({
        title: "Error",
        message: "Error al eliminar el diagnóstico",
        type: "error",
      });
      return;
    }
  }

  // Eliminar de la lista local
  localDiagnosticos.value.splice(index, 1);
  emitUpdate();

  // Resetear el índice seleccionado si es necesario
  if (selectedDiagnosticoIndex.value === index) {
    selectedDiagnosticoIndex.value =
      localDiagnosticos.value.length > 0 ? 0 : null;
  } else if (selectedDiagnosticoIndex.value > index) {
    selectedDiagnosticoIndex.value--;
  }
};

// Seleccionar diagnóstico para mostrar sus labs
const seleccionarDiagnostico = (index) => {
  selectedDiagnosticoIndex.value = index;
  showAutocomplete.value = false;
};

// Funciones para búsqueda de diagnósticos
const buscarDiagnostico = (index, event) => {
  seleccionarDiagnostico(index);
  if (event) {
    setAutocompletePosition(event.target);
  }
  autocompleteMode.value = "codigo";
  cargarDiagnosticosFrecuentes();
};

// Autocompletado de diagnósticos
const buscarDiagnosticosDebounced = _.debounce(async (termino, tipo) => {
  if (!termino || termino.length < 2) {
    if (termino.length === 0) {
      // Si el término está vacío, mostrar diagnósticos frecuentes
      cargarDiagnosticosFrecuentes();
    } else {
      // Si el término es muy corto, ocultar resultados
      autocompleteResults.value = [];
      showAutocomplete.value = false;
    }
    return;
  }

  autocompleteLoading.value = true;
  try {
    const resultados = await atencionesService.buscarDiagnosticos(
      tipo === "codigo" ? termino : "",
      tipo === "descripcion" ? termino : "",
      100 // Límite
    );

    autocompleteResults.value = resultados;
    showAutocomplete.value = true;
    selectedAutocompleteIndex.value = 0; // Resetear índice de selección
  } catch (error) {
    console.error("Error al buscar diagnósticos:", error);
    autocompleteResults.value = [];
  } finally {
    autocompleteLoading.value = false;
  }
}, 300);

// Cargar diagnósticos frecuentes (usado cuando el campo está vacío)
const cargarDiagnosticosFrecuentes = async () => {
  autocompleteLoading.value = true;
  try {
    const resultados = await atencionesService.buscarDiagnosticos("", "", 40); // Obtener top 40 más frecuentes
    autocompleteResults.value = resultados;
    showAutocomplete.value = true;
    selectedAutocompleteIndex.value = 0;
  } catch (error) {
    console.error("Error al cargar diagnósticos frecuentes:", error);
    autocompleteResults.value = [];
  } finally {
    autocompleteLoading.value = false;
  }
};

const handleCodigoInput = (index, event) => {
  seleccionarDiagnostico(index);
  autocompleteMode.value = "codigo";
  const termino = localDiagnosticos.value[index].codigo;
  setAutocompletePosition(event.target);
  buscarDiagnosticosDebounced(termino, "codigo");
  emitUpdate();
};

const handleDescripcionInput = (index, event) => {
  seleccionarDiagnostico(index);
  autocompleteMode.value = "descripcion";
  const termino = localDiagnosticos.value[index].descripcion;
  setAutocompletePosition(event.target);
  buscarDiagnosticosDebounced(termino, "descripcion");
  emitUpdate();
};

const handleCodigoFocus = (index, event) => {
  seleccionarDiagnostico(index);
  autocompleteMode.value = "codigo";
  const termino = localDiagnosticos.value[index].codigo;
  setAutocompletePosition(event.target);

  if (termino && termino.length >= 2) {
    buscarDiagnosticosDebounced(termino, "codigo");
  } else if (termino.length === 0) {
    // Si el campo está vacío, mostrar diagnósticos frecuentes
    cargarDiagnosticosFrecuentes();
  }
};

const handleDescripcionFocus = (index, event) => {
  seleccionarDiagnostico(index);
  autocompleteMode.value = "descripcion";
  const termino = localDiagnosticos.value[index].descripcion;
  setAutocompletePosition(event.target);

  if (termino && termino.length >= 2) {
    buscarDiagnosticosDebounced(termino, "descripcion");
  } else if (termino.length === 0) {
    // Si el campo está vacío, mostrar diagnósticos frecuentes
    cargarDiagnosticosFrecuentes();
  }
};

// Función para posicionar el dropdown de autocompletado
const setAutocompletePosition = (inputElement) => {
  if (!inputElement) return;

  activeInputRef.value = inputElement;
  const rect = inputElement.getBoundingClientRect();

  // Posicionar el dropdown justo debajo del input
  autocompletePosition.value = {
    top: `${rect.bottom + window.scrollY + 2}px`,
    left: `${rect.left + window.scrollX}px`,
    width: autocompleteMode.value === "codigo" ? "18rem" : "24rem",
  };
};

const handleInputBlur = () => {
  // Retrasar el cierre para permitir clics en los resultados
  setTimeout(() => {
    // Solo cerrar si no hay un elemento de autocompletado que tenga foco
    const activeElement = document.activeElement;
    if (!activeElement || !activeElement.closest(".autocomplete-item")) {
      showAutocomplete.value = false;
    }
  }, 200);
};

// Navegar por los resultados con teclado
const handleAutocompleteNavigation = (direction) => {
  if (!showAutocomplete.value || autocompleteResults.value.length === 0) return;

  const maxIndex = autocompleteResults.value.length - 1;
  let newIndex = selectedAutocompleteIndex.value + direction;

  // Manejar límites
  if (newIndex < 0) newIndex = maxIndex;
  if (newIndex > maxIndex) newIndex = 0;

  selectedAutocompleteIndex.value = newIndex;

  // Asegurar que el elemento seleccionado sea visible
  nextTick(() => {
    const selectedElement = document.querySelector(
      ".autocomplete-item.selected"
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: "nearest" });
    }
  });
};

// Seleccionar resultado con Enter
const handleAutocompleteSelection = () => {
  if (!showAutocomplete.value || autocompleteResults.value.length === 0) return;

  const selectedResult =
    autocompleteResults.value[selectedAutocompleteIndex.value];
  if (selectedResult) {
    seleccionarResultado(selectedResult, selectedDiagnosticoIndex.value);
  }
};

const seleccionarResultado = (resultado, index) => {
  // Asegurarse de que estemos guardando el IdDiagnostico correctamente
  localDiagnosticos.value[index] = {
    ...localDiagnosticos.value[index],
    idDiagnostico: resultado.IdDiagnostico,
    codigo: resultado.Codigo,
    descripcion: resultado.Descripcion,
  };

  showAutocomplete.value = false;
  emitUpdate();
};

// Función para manejar clicks fuera de los autocompletados
const handleClickOutside = (event) => {
  const isAutocompleteItem = event.target.closest(".autocomplete-item");
  const isInput = event.target === activeInputRef.value;

  if (!isAutocompleteItem && !isInput && showAutocomplete.value) {
    showAutocomplete.value = false;
  }
};

// Al montar el componente
onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  // Si no hay diagnósticos, agregar uno vacío
  if (localDiagnosticos.value.length === 0) {
    agregarCIEX();
  }
});

// Limpiar eventos al desmontar el componente
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
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

.autocomplete-item {
  transition: background-color 0.2s ease;
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

/* Asegurar que los dropdowns de autocompletado estén por encima de todo */
[v-if*="showAutocomplete"] {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: fadeIn 0.2s ease-in-out;
  z-index: 1000;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
