<!-- components/Cita/AtencionModal/DiagnosticosTab.vue -->
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
            class="w-full h-20 px-3 py-2 rounded-lg focus:outline-none rounded-lg border border-gray-300 bg-white text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            rows="4"
            placeholder="Describa el motivo de consulta"
            maxlength="1000"
            @input="emitUpdate"
          />

          <div class="flex justify-end text-[0.6rem]">
            <span :class="getCounterClass(localConsulta.motivoConsulta?.length || 0)">
              {{ localConsulta.motivoConsulta?.length || 0 }}/1000
            </span>
          </div>
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
            class="w-full h-20 px-3 py-2 rounded-lg focus:outline-none rounded-lg border border-gray-300 bg-white text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            rows="4"
            placeholder="Registre los hallazgos"
            maxlength="1000"
            @input="emitUpdate"
          />
          <div class="flex justify-end text-[0.6rem]">
            <span :class="getCounterClass(localConsulta.examenClinico?.length || 0)">
              {{ localConsulta.examenClinico?.length || 0 }}/1000
            </span>
          </div>
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
            class="w-full h-20 px-3 py-2 rounded-lg focus:outline-none rounded-lg border border-gray-300 bg-white text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            rows="4"
            placeholder="Indique el tratamiento"
            maxlength="1000"
            @input="emitUpdate"
          />
          <div class="flex justify-end text-[0.6rem]">
            <span :class="getCounterClass(localTratamiento?.length || 0)">
              {{ localTratamiento?.length || 0 }}/1000
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Diagnósticos -->
    <div class="border border-gray-200 rounded-lg mb-4">
      <div
        class="bg-gray-50 px-3 py-2 border-b border-gray-100 rounded-t-lg font-medium text-gray-700 text-sm flex justify-between items-center"
      >
        <div class="flex items-center">
          <i class="fas fa-tag text-blue-500 mr-2" />
          Diagnósticos
        </div>
        <button
          class="px-2 py-1 border border-blue-400 bg-blue-50 text-blue-600 rounded-md text-xs hover:bg-blue-100 cursor-pointer"
          :disabled="localDiagnosticos.length >= 10"
          :class="{'opacity-50 cursor-not-allowed': localDiagnosticos.length >= 10}"
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
                <td
                  class="px-2 py-1.5 whitespace-nowrap text-xs relative"
                  colspan="2"
                >
                  <div class="relative">
                    <div class="flex items-center search-container">
                      <input
                        v-model="diag.searchTerm"
                        type="text"
                        class="w-full px-2 py-1 text-xs border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500 search-input"
                        placeholder="Buscar por código o descripción"
                        @input="(e) => handleSearchInput(index, e)"
                        @focus="(e) => handleSearchFocus(index, e)"
                        @blur="handleInputBlur"
                        @keydown.down.prevent="handleAutocompleteNavigation(1)"
                        @keydown.up.prevent="handleAutocompleteNavigation(-1)"
                        @keydown.enter.prevent="handleAutocompleteSelection"
                        @keydown.esc="showAutocomplete = false"
                        @click="(e) => handleSearchClick(index, e)"
                      >
                      <button
                        class="py-1 px-1.5 bg-blue-50 text-blue-600 rounded-r border border-gray-300 border-l-0 hover:bg-blue-100 transition-colors search-button"
                        @click.stop="buscarDiagnostico(index, $event)"
                      >
                        <i class="fas fa-search" />
                      </button>
                    </div>

                    <!-- Dropdown de autocompletado unificado -->
                    <teleport to="body">
                      <div
                        v-if="showAutocomplete && selectedDiagnosticoIndex === index"
                        class="fixed bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto dropdown-autocomplete"
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
                              {{ parseCodigo(result) }}
                            </div>
                            <div class="text-gray-600 truncate text-xs">
                              {{ parseDescripcion(result) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </teleport>
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
                    class="py-1 px-1.5 border border-red-300 text-red-500 rounded-md hover:bg-red-50 transition-colors"
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
              <tr v-else-if="localDiagnosticos.length >= 10">
                <td
                  colspan="5"
                  class="px-3 py-2 text-center text-xs text-orange-500"
                >
                  <i class="fas fa-info-circle mr-1"/>
                  Máximo 10 diagnósticos permitidos
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- CPTs/Procedimientos -->
    <div class="border border-gray-200 rounded-lg">
      <div
        class="bg-gray-50 px-3 py-2 border-b border-gray-100 rounded-t-lg font-medium text-gray-700 text-sm flex justify-between items-center"
      >
        <div class="flex items-center">
          <i class="fas fa-procedures text-blue-500 mr-2" />
          Procedimientos (CPT)
        </div>
        <button
          v-if="diagnosticosValidos.length > 0"
          class="px-2 py-1 border border-blue-400 bg-blue-50 text-blue-600 rounded-md text-xs hover:bg-blue-100 cursor-pointer"
          :disabled="localCPTs.length >= 10"
          :class="{'opacity-50 cursor-not-allowed': localCPTs.length >= 10}"
          @click="agregarCPT"
        >
          <i class="fas fa-plus-circle mr-0.5" /> Agregar
        </button>
        <div v-else class="text-[0.65rem] text-amber-600 bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
        <i class="fas fa-exclamation-triangle mr-1" />
        Debe agregar diagnósticos primero
      </div>
      </div>
      <div class="overflow-hidden">
        <div class="overflow-x-auto overflow-y-visible">
          <table class="min-w-full divide-y divide-gray-200 table-fixed">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-96">
                  Procedimiento
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Diagnóstico
                </th>
                <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Tipo
                </th>
                <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  LAB
                </th>
                <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(cpt, index) in localCPTs"
                :key="'cpt-' + index"
                :class="{
                  'bg-blue-50/50': selectedCPTIndex === index,
                }"
              >
                <td class="px-2 py-1.5 whitespace-nowrap text-xs relative">
                  <div class="relative">
                    <div class="flex items-center search-container">
                      <input
                        v-model="cpt.searchTerm"
                        type="text"
                        class="w-full px-2 py-1 text-xs border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500 search-input"
                        placeholder="Buscar procedimiento por código o descripción"
                        @input="(e) => handleCPTSearchInput(index, e)"
                        @focus="(e) => handleCPTSearchFocus(index, e)"
                        @blur="handleCPTInputBlur"
                        @keydown.down.prevent="handleCPTAutocompleteNavigation(1)"
                        @keydown.up.prevent="handleCPTAutocompleteNavigation(-1)"
                        @keydown.enter.prevent="handleCPTAutocompleteSelection"
                        @keydown.esc="showCPTAutocomplete = false"
                        @click="(e) => handleCPTSearchClick(index, e)"
                      >
                      <button
                        class="py-1 px-1.5 bg-blue-50 text-blue-600 rounded-r border border-gray-300 border-l-0 hover:bg-blue-100 transition-colors search-button"
                        @click.stop="buscarCPT(index, $event)"
                      >
                        <i class="fas fa-search" />
                      </button>
                    </div>

                    <!-- Dropdown de autocompletado para CPT -->
                    <teleport to="body">
                      <div
                        v-if="showCPTAutocomplete && selectedCPTIndex === index"
                        class="fixed bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto dropdown-autocomplete"
                        :style="cptAutocompletePosition"
                      >
                        <div
                          v-if="cptAutocompleteLoading"
                          class="px-3 py-2 text-xs text-center text-gray-500"
                        >
                          <i class="fas fa-circle-notch fa-spin mr-1" />
                          Buscando procedimientos...
                        </div>
                        <div
                          v-else-if="cptAutocompleteResults.length === 0"
                          class="px-3 py-2 text-xs text-center text-gray-500"
                        >
                          No se encontraron procedimientos
                        </div>
                        <div v-else>
                          <div
                            v-for="(result, i) in cptAutocompleteResults"
                            :key="'cpt-result-' + i"
                            class="px-3 py-2 text-xs hover:bg-blue-50 cursor-pointer autocomplete-item"
                            :class="{
                              'bg-blue-100 selected':
                                i === selectedCPTAutocompleteIndex,
                            }"
                            @click="seleccionarCPTResultado(result, index)"
                            @mouseenter="selectedCPTAutocompleteIndex = i"
                          >
                            <div class="font-medium text-blue-800">
                              {{ result.Codigo }}
                            </div>
                            <div class="text-gray-600 truncate text-xs">
                              {{ result.Nombre }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </teleport>
                  </div>
                </td>
                <td class="px-2 py-1.5 whitespace-nowrap text-xs">
                  <select
                    v-model="cpt.idDiagnostico"
                    class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    @change="emitUpdate"
                  >
                    <option value="">Seleccionar</option>
                    <option
                      v-for="diag in diagnosticosValidos"
                      :key="diag.idDiagnostico"
                      :value="diag.idDiagnostico"
                    >
                      {{ diag.codigo }}
                    </option>
                  </select>
                </td>
                <td class="px-2 py-1.5 whitespace-nowrap text-xs text-center">
                  <select
                    v-model="cpt.PDR"
                    class="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50 text-blue-800"
                    @change="emitUpdate"
                  >
                    <option value="D">D</option>
                    <option value="P">P</option>
                    <option value="R">R</option>
                  </select>
                </td>
                <td class="px-2 py-1.5 whitespace-nowrap text-xs">
                  <div class="flex space-x-1">
                    <input
                      v-model="cpt.labConfHIS"
                      type="text"
                      maxlength="3"
                      placeholder="Lab 1"
                      class="w-12 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      @input="validarInputLabCPT($event, cpt, 'labConfHIS')"
                    >
                    <input
                      v-model="cpt.labConfHIS2"
                      type="text"
                      maxlength="3"
                      placeholder="Lab 2"
                      class="w-12 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      @input="validarInputLabCPT($event, cpt, 'labConfHIS2')"
                    >
                    <input
                      v-model="cpt.labConfHIS3"
                      type="text"
                      maxlength="3"
                      placeholder="Lab 3"
                      class="w-12 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      @input="validarInputLabCPT($event, cpt, 'labConfHIS3')"
                    >
                  </div>
                </td>
                <td class="px-2 py-1.5 whitespace-nowrap text-xs text-center">
                  <button
                    class="py-1 px-1.5 border border-red-300 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                    :title="cpt.idOrden ? 'Eliminar CPT registrado' : 'Quitar CPT'"
                    @click.stop="eliminarCPT(index)"
                  >
                    <i class="fas fa-trash-alt" />
                  </button>
                </td>
              </tr>
              <tr v-if="localCPTs.length === 0">
                <td
                  colspan="5"
                  class="px-3 py-4 text-center text-sm text-gray-500"
                >
                  No hay procedimientos agregados
                </td>
              </tr>
              <tr v-else-if="localCPTs.length >= 10">
                <td
                  colspan="5"
                  class="px-3 py-2 text-center text-xs text-orange-500"
                >
                  <i class="fas fa-info-circle mr-1"/>
                  Máximo 10 procedimientos permitidos
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
import { ref, watch, nextTick, onMounted, onBeforeUnmount, computed } from "vue";
import { atencionesService } from "~/services/AtencionesService";
import { cptService } from "~/services/CPTService";
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
  cpts: {
    type: Array,
    default: () => [],
  },
  cita: {  // Agregamos cita para obtener idServicio
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits([
  "update:consulta",
  "update:diagnosticos",
  "update:tratamiento",
  "update",
  "update:cpts",
]);

// Notificaciones
const notification = useNotification();

// Copia local de los datos con el nuevo campo searchTerm
const localConsulta = ref({ ...props.consulta });
const localDiagnosticos = ref([
  ...props.diagnosticos.map((d) => ({
    ...d,
    // Añadir campo searchTerm con el formato actual en el componente
    searchTerm: d.codigo && d.descripcion ? `${d.codigo} - ${d.descripcion}` : "",
  })),
]);
const localTratamiento = ref(props.tratamiento);

// Estado para autocompletado de diagnósticos
const showAutocomplete = ref(false);
const autocompleteResults = ref([]);
const autocompleteLoading = ref(false);
const selectedDiagnosticoIndex = ref(null);
const selectedAutocompleteIndex = ref(0);
const autocompletePosition = ref({});
const activeInputRef = ref(null);
// Delay ID para cargas automáticas
const autocompleteDelayId = ref(null);
const cptAutocompleteDelayId = ref(null);

// Funciones para parsear el nuevo formato de resultados
const parseCodigo = (result) => {
  // Verificar si el objeto tiene el nuevo formato (Diagnostico) o el antiguo formato (Codigo)
  if (result.Diagnostico) {
    // Obtener solo el código de la cadena "A01.0 - Fiebre tifoidea"
    const codigoParts = result.Diagnostico.split('-');
    return codigoParts[0].trim();
  } else if (result.Codigo) {
    // Formato antiguo, eliminar espacios en blanco al final
    return result.Codigo.trim();
  }
  return '';
};

const getCounterClass = (length) => {
  if (length > 900) {
    return 'text-red-500 font-medium'; // > 90% del límite
  } else if (length > 750) {
    return 'text-amber-500'; // > 75% del límite
  } else {
    return 'text-gray-500'; // Normal
  }
};

const parseDescripcion = (result) => {
  // Verificar si el objeto tiene el nuevo formato (Diagnostico) o el antiguo formato (Descripcion)
  if (result.Diagnostico) {
    // Obtener solo la descripción de la cadena "A01.0 - Fiebre tifoidea"
    const descParts = result.Diagnostico.split('-');
    return descParts.length > 1 ? descParts.slice(1).join('-').trim() : '';
  } else if (result.Descripcion) {
    // Formato antiguo, usar la descripción directamente
    return result.Descripcion;
  }
  return '';
};

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
    localDiagnosticos.value = [
      ...newVal.map((d) => ({
        ...d,
        // Mantener el formato correcto para cada diagnóstico
        searchTerm: d.codigo && d.descripcion ? `${d.codigo.trim()} - ${d.descripcion}` : "",
      })),
    ];
  },
  { deep: true }
);

watch(
  () => props.tratamiento,
  (newVal) => {
    localTratamiento.value = newVal;
  }
);

// Estado adicional para CPTs
const localCPTs = ref([]);
const showCPTAutocomplete = ref(false);
const cptAutocompleteResults = ref([]);
const cptAutocompleteLoading = ref(false);
const selectedCPTIndex = ref(null);
const selectedCPTAutocompleteIndex = ref(0);
const cptAutocompletePosition = ref({});
const activeCPTInputRef = ref(null);

// Computed para diagnósticos válidos
const diagnosticosValidos = computed(() => {
  return localDiagnosticos.value.filter(
    (diag) => diag.idDiagnostico && diag.codigo
  );
});

// Nueva función para verificar si un diagnóstico ya existe
const existeDiagnostico = (idDiagnostico) => {
  return localDiagnosticos.value.some(
    (diag) => diag.idDiagnostico === idDiagnostico
  );
};

// Nueva función para verificar si un CPT ya existe
const existeCPT = (idProducto) => {
  return localCPTs.value.some(
    (cpt) => cpt.idProducto === idProducto
  );
};

// Agregar CPT - con verificación de límite y duplicados
const agregarCPT = () => {
  // Verificar límite máximo
  if (localCPTs.value.length >= 10) {
    notification.show({
      title: "Límite alcanzado",
      message: "Solo se permite un máximo de 10 procedimientos",
      type: "warning",
    });
    return;
  }
  
  localCPTs.value.push({
    idProducto: null,
    codigo: "",
    nombre: "",
    searchTerm: "",
    cantidad: 1,
    precio: 0,
    total: 0,
    idDiagnostico: diagnosticosValidos.value[0]?.idDiagnostico || null,
    PDR: "D",
    labConfHIS: "",
    labConfHIS2: "",
    labConfHIS3: ""
  });
  
  // Importante: emitir los cambios
  emitUpdate();
  
  // Seleccionar el nuevo CPT para facilitar su edición
  nextTick(() => {
    selectedCPTIndex.value = localCPTs.value.length - 1;
  });
};

// Agregar función para validar inputs de LAB para CPTs
const validarInputLabCPT = (event, objeto, propiedad) => {
  const valor = event.target.value;

  // Solo permitir letras y números (sin acentos ni signos)
  const valorLimpio = valor.replace(/[^a-zA-Z0-9]/g, "");

  // Asignar de nuevo al objeto
  objeto[propiedad] = valorLimpio;
  
  // Emitir cambios para que se actualice en el componente padre
  emitUpdate();
};

// Eliminar CPT
const eliminarCPT = async (index) => {
  const cpt = localCPTs.value[index];
  
  // Si el CPT tiene idOrden, significa que ya está guardado en la BD
  if (cpt.idOrden && cpt.idProducto) {
    try {
      await cptService.eliminarCPT(cpt.idOrden, cpt.idProducto);
      notification.show({
        title: "Éxito",
        message: "CPT eliminado correctamente",
        type: "success",
      });
    } catch (error) {
      console.error("Error al eliminar CPT:", error);
      notification.show({
        title: "Error",
        message: "Error al eliminar el CPT",
        type: "error",
      });
      return;
    }
  }
  
  // Eliminar de la lista local
  localCPTs.value.splice(index, 1);
  emitUpdate();
};

// Nueva función para manejar click directo en el campo de búsqueda de CPT
const handleCPTSearchClick = (index, event) => {
  // Evitar múltiples cargas si ya está en progreso
  if (cptAutocompleteLoading.value) return;
  
  // Limpiar cualquier delay previo
  if (cptAutocompleteDelayId.value) {
    clearTimeout(cptAutocompleteDelayId.value);
  }
  
  // Usar un pequeño delay para evitar múltiples llamadas
  cptAutocompleteDelayId.value = setTimeout(() => {
    selectedCPTIndex.value = index;
    setCPTAutocompletePosition(event.target);
    
    // Si no hay texto, cargar directamente los CPTs frecuentes
    if (!localCPTs.value[index].searchTerm?.trim()) {
      cargarCPTsFrecuentes();
    }
  }, 100);
};

// Buscar CPT
const buscarCPT = (index, event) => {
  selectedCPTIndex.value = index;
  if (event) {
    setCPTAutocompletePosition(event.target.previousElementSibling);
  }
  cargarCPTsFrecuentes();
};

// Debounce para buscar CPTs
const buscarCPTsDebounced = _.debounce(async (termino) => {
  if (!termino || termino.length < 1) {
    cargarCPTsFrecuentes();
    return;
  }

  cptAutocompleteLoading.value = true;
  try {
    const resultados = await cptService.buscarCPT(
      termino,
      props.cita?.IdServicio || 0,  // Usar el servicio de la cita
      props.cita?.idTipoFinanciamiento || 16,
      30
    );

    cptAutocompleteResults.value = resultados;
    showCPTAutocomplete.value = true;
    selectedCPTAutocompleteIndex.value = 0;
  } catch (error) {
    console.error("Error al buscar CPTs:", error);
    cptAutocompleteResults.value = [];
  } finally {
    cptAutocompleteLoading.value = false;
  }
}, 300);

// Cargar CPTs frecuentes
const cargarCPTsFrecuentes = async () => {
  cptAutocompleteLoading.value = true;
  try {
    const resultados = await cptService.buscarCPT(
      "",
      props.cita?.IdServicio || 0,
      props.cita?.idTipoFinanciamiento || 16,
      30
    );
    cptAutocompleteResults.value = resultados;
    showCPTAutocomplete.value = true;
    selectedCPTAutocompleteIndex.value = 0;
  } catch (error) {
    console.error("Error al cargar CPTs frecuentes:", error);
    cptAutocompleteResults.value = [];
  } finally {
    cptAutocompleteLoading.value = false;
  }
};

// Handlers para CPT autocomplete
const handleCPTSearchInput = (index, event) => {
  selectedCPTIndex.value = index;
  const termino = event.target.value;
  localCPTs.value[index].searchTerm = termino;
  setCPTAutocompletePosition(event.target);
  buscarCPTsDebounced(termino);
};

const handleCPTSearchFocus = (index, event) => {
  selectedCPTIndex.value = index;
  setCPTAutocompletePosition(event.target);
  
  seleccionarCPT(index);
  
  const termino = localCPTs.value[index].searchTerm || "";
  if (termino.trim().length > 0) {
    buscarCPTsDebounced(termino);
  } else {
    cargarCPTsFrecuentes();
  }
};

const handleCPTInputBlur = () => {
  setTimeout(() => {
    const activeElement = document.activeElement;
    if (!activeElement || !activeElement.closest(".autocomplete-item")) {
      showCPTAutocomplete.value = false;
    }
  }, 200);
};

// Posicionar dropdown de CPT
const setCPTAutocompletePosition = (inputElement) => {
  if (!inputElement) return;

  activeCPTInputRef.value = inputElement;
  const rect = inputElement.getBoundingClientRect();
  
  const parentContainer = inputElement.closest('.search-container');
  const containerWidth = parentContainer ? parentContainer.offsetWidth : rect.width;
  
  cptAutocompletePosition.value = {
    position: 'fixed',
    top: `${rect.bottom}px`,
    left: `${rect.left}px`,
    width: `${Math.max(containerWidth, 340)}px`,
    zIndex: 10000,
  };
};

// Navegación en CPT autocomplete
const handleCPTAutocompleteNavigation = (direction) => {
  if (!showCPTAutocomplete.value || cptAutocompleteResults.value.length === 0) return;

  const maxIndex = cptAutocompleteResults.value.length - 1;
  let newIndex = selectedCPTAutocompleteIndex.value + direction;

  if (newIndex < 0) newIndex = maxIndex;
  if (newIndex > maxIndex) newIndex = 0;

  selectedCPTAutocompleteIndex.value = newIndex;

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
const handleCPTAutocompleteSelection = () => {
  if (!showCPTAutocomplete.value || cptAutocompleteResults.value.length === 0) return;

  const selectedResult = cptAutocompleteResults.value[selectedCPTAutocompleteIndex.value];
  if (selectedResult) {
    seleccionarCPTResultado(selectedResult, selectedCPTIndex.value);
  }
};

const seleccionarCPT = (index) => {
  selectedCPTIndex.value = index;
  showCPTAutocomplete.value = false;
  // Resaltar visualmente el CPT seleccionado para edición
};

// Seleccionar resultado de CPT - con verificación de duplicados
const seleccionarCPTResultado = (resultado, index) => {
  // Verificar si el CPT ya existe en la lista
  if (existeCPT(resultado.IdProducto)) {
    notification.show({
      title: "Procedimiento duplicado",
      message: "Este procedimiento ya ha sido agregado",
      type: "warning",
    });
    showCPTAutocomplete.value = false;
    return;
  }

  // Crear searchTerm formateado
  const searchTermValue = `${resultado.Codigo} - ${resultado.Nombre}`;

  // Conservar los valores existentes de idOrden, PDR y labConfHIS si ya están presentes
  const existingCPT = localCPTs.value[index];
  
  localCPTs.value[index] = {
    ...existingCPT,
    idProducto: resultado.IdProducto,
    codigo: resultado.Codigo,
    nombre: resultado.Nombre,
    searchTerm: searchTermValue,
    precio: resultado.PrecioUnitario || 0,
    total: existingCPT.cantidad * (resultado.PrecioUnitario || 0),
    // Mantener el idOrden si existe (importante para la actualización)
    idOrden: existingCPT.idOrden || null,
    // Mantener los valores existentes o usar valores por defecto
    PDR: existingCPT.PDR || "D",
    labConfHIS: existingCPT.labConfHIS || "",
    labConfHIS2: existingCPT.labConfHIS2 || "",
    labConfHIS3: existingCPT.labConfHIS3 || ""
  };

  showCPTAutocomplete.value = false;
  emitUpdate();
};

// Actualizar los watches
watch(
  () => props.cpts,
  (newVal) => {
    // Asegurarnos de que los CPTs tengan todos los campos necesarios incluyendo searchTerm
    localCPTs.value = newVal.map(cpt => ({
      ...cpt,
      searchTerm: cpt.codigo && cpt.nombre ? `${cpt.codigo} - ${cpt.nombre}` : "",
      PDR: cpt.PDR || "D",
      labConfHIS: cpt.labConfHIS || "",
      labConfHIS2: cpt.labConfHIS2 || "",
      labConfHIS3: cpt.labConfHIS3 || ""
    }));
  },
  { deep: true }
);

// Emitir cambios al componente padre
const emitUpdate = () => {
  // Filtrar los datos para no enviar campos temporales como searchTerm
  const cleanedDiagnosticos = localDiagnosticos.value.map((d) => {
    // Desestructurar para eliminar searchTerm y conservar las demás propiedades
    const { searchTerm, ...rest } = d;
    return rest;
  });

  // Asegurar que cada CPT tiene los campos requeridos
  const cleanedCPTs = localCPTs.value.map((cpt) => {
    // Extraer searchTerm y mantener el resto de propiedades
    const { searchTerm, ...rest } = cpt;
    
    return {
      ...rest,
      // Asegurar que estos campos existan con sus valores actuales
      idProducto: cpt.idProducto,
      codigo: cpt.codigo || "",
      nombre: cpt.nombre || "",
      cantidad: cpt.cantidad || 1,
      precio: cpt.precio || 0,
      total: cpt.total || 0,
      idDiagnostico: cpt.idDiagnostico,
      // Preservar explícitamente estos valores
      PDR: cpt.PDR || "D",
      labConfHIS: cpt.labConfHIS || "",
      labConfHIS2: cpt.labConfHIS2 || "",
      labConfHIS3: cpt.labConfHIS3 || ""
    };
  });

  emit("update:consulta", { ...localConsulta.value });
  emit("update:diagnosticos", cleanedDiagnosticos);
  emit("update:tratamiento", localTratamiento.value);
  emit("update:cpts", cleanedCPTs);
  emit("update");
};

// Nueva función para manejar click directo en el campo de búsqueda
const handleSearchClick = (index, event) => {
  // Evitar múltiples cargas si ya está en progreso
  if (autocompleteLoading.value) return;
  
  // Limpiar cualquier delay previo
  if (autocompleteDelayId.value) {
    clearTimeout(autocompleteDelayId.value);
  }
  
  // Usar un pequeño delay para evitar múltiples llamadas
  autocompleteDelayId.value = setTimeout(() => {
    seleccionarDiagnostico(index);
    setAutocompletePosition(event.target);
    
    // Si no hay texto, cargar directamente los diagnósticos frecuentes
    if (!localDiagnosticos.value[index].searchTerm?.trim()) {
      cargarDiagnosticosFrecuentes();
    }
  }, 100);
};

// Funciones para manejar diagnósticos - con verificación de límite
const agregarCIEX = () => {
  // Verificar límite máximo
  if (localDiagnosticos.value.length >= 10) {
    notification.show({
      title: "Límite alcanzado",
      message: "Solo se permite un máximo de 10 diagnósticos",
      type: "warning",
    });
    return;
  }

  localDiagnosticos.value.push({
    codigo: "",
    descripcion: "",
    searchTerm: "", // Campo para la búsqueda combinada
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

// Eliminar diagnóstico - con eliminación de CPTs asociados
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

  // Guardar el ID del diagnóstico para eliminar CPTs relacionados
  const idDiagnosticoEliminado = diagnostico.idDiagnostico;

  // Eliminar de la lista local
  localDiagnosticos.value.splice(index, 1);
  
  // Si el diagnóstico tiene ID y hay CPTs relacionados, eliminarlos también
  if (idDiagnosticoEliminado) {
    // Identificar qué CPTs están relacionados con este diagnóstico
    const cptsRelacionados = localCPTs.value.filter(
      cpt => cpt.idDiagnostico === idDiagnosticoEliminado
    );
    
    if (cptsRelacionados.length > 0) {
      // Eliminar los CPTs relacionados del servidor si es necesario
      for (const cpt of cptsRelacionados) {
        if (cpt.idOrden && cpt.idProducto) {
          try {
            await cptService.eliminarCPT(cpt.idOrden, cpt.idProducto);
          } catch (error) {
            console.error("Error al eliminar CPT relacionado:", error);
          }
        }
      }
      
      // Eliminar los CPTs relacionados de la lista local
      localCPTs.value = localCPTs.value.filter(
        cpt => cpt.idDiagnostico !== idDiagnosticoEliminado
      );
      
      notification.show({
        title: "CPTs eliminados",
        message: `Se eliminaron ${cptsRelacionados.length} procedimientos relacionados`,
        type: "info",
      });
    }
  }
  
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

// Buscar diagnóstico con el botón de búsqueda
const buscarDiagnostico = (index, event) => {
  seleccionarDiagnostico(index);
  if (event) {
    setAutocompletePosition(event.target.previousElementSibling); // Obtener el input
  }
  cargarDiagnosticosFrecuentes();
};

// Función para buscar diagnósticos con debounce
const buscarDiagnosticosDebounced = _.debounce(async (termino) => {
  if (!termino || termino.length < 1) {
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
    console.log(`Buscando diagnósticos con término: "${termino}"`);

    const resultados = await atencionesService.buscarDiagnosticos(termino, 30);

    console.log(`Resultados encontrados: ${resultados.length}`);

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
    // Pasar string vacío para obtener los diagnósticos frecuentes
    const resultados = await atencionesService.buscarDiagnosticos("", 30);
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

// Manejar entrada en el campo de búsqueda
const handleSearchInput = (index, event) => {
  seleccionarDiagnostico(index);
  const termino = event.target.value; // Usar el valor directamente del evento
  localDiagnosticos.value[index].searchTerm = termino; // Actualizar searchTerm
  setAutocompletePosition(event.target);
  buscarDiagnosticosDebounced(termino);
};

// Manejar foco en el campo de búsqueda
const handleSearchFocus = (index, event) => {
  seleccionarDiagnostico(index);
  setAutocompletePosition(event.target);

  // Si hay texto, buscar con ese texto
  // Si no hay texto, mostrar diagnósticos frecuentes
  const termino = localDiagnosticos.value[index].searchTerm || "";

  if (termino.trim().length > 0) {
    buscarDiagnosticosDebounced(termino);
  } else {
    cargarDiagnosticosFrecuentes();
  }
};

// Función para posicionar el dropdown de autocompletado
const setAutocompletePosition = (inputElement) => {
  if (!inputElement) return;

  activeInputRef.value = inputElement;
  const rect = inputElement.getBoundingClientRect();
  
  // Obtener el ancho combinado del input y su botón de búsqueda
  const parentContainer = inputElement.closest('.search-container');
  const containerWidth = parentContainer ? parentContainer.offsetWidth : rect.width;
  
  // Calcular la posición exacta para el dropdown
  autocompletePosition.value = {
    position: 'fixed',
    top: `${rect.bottom}px`, // Justo debajo del input sin espacio adicional
    left: `${rect.left}px`, // Alineado con el borde izquierdo del input
    width: `${Math.max(containerWidth, 340)}px`, // Al menos 340px o el ancho del contenedor
    zIndex: 10000, // Z-index muy alto para estar por encima de modales
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

// Seleccionar resultado de la lista de autocompletado - con verificación de duplicados
const seleccionarResultado = (resultado, index) => {
  // Extraer código y descripción del resultado (ya sea en formato antiguo o nuevo)
  const codigo = parseCodigo(resultado);
  const descripcion = parseDescripcion(resultado);
  
  if (!codigo) {
    console.error("Resultado inválido:", resultado);
    return;
  }

  // Verificar si el diagnóstico ya existe
  if (existeDiagnostico(resultado.IdDiagnostico)) {
    notification.show({
      title: "Diagnóstico duplicado",
      message: "Este diagnóstico ya ha sido agregado",
      type: "warning",
    });
    showAutocomplete.value = false;
    return;
  }

  // Formatear correctamente el searchTerm
  const searchTermValue = `${codigo} - ${descripcion}`;

  console.log(`Seleccionando diagnóstico: ${searchTermValue}`);

  // Actualizar los datos del diagnóstico
  localDiagnosticos.value[index] = {
    ...localDiagnosticos.value[index],
    idDiagnostico: resultado.IdDiagnostico,
    codigo: codigo,
    descripcion: descripcion,
    searchTerm: searchTermValue,
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
  document.addEventListener("click", handleCPTClickOutside);

  // Si no hay diagnósticos, agregar uno vacío
  if (localDiagnosticos.value.length === 0) {
    agregarCIEX();
  }
  if (props.cpts && props.cpts.length > 0) {
    localCPTs.value = [...props.cpts.map(cpt => ({
      ...cpt,
      searchTerm: cpt.codigo && cpt.nombre ? `${cpt.codigo} - ${cpt.nombre}` : ""
    }))];
    console.log("CPTs inicializados:", localCPTs.value);
  }
});

// Limpiar eventos al desmontar el componente
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("click", handleCPTClickOutside);
  
  // Limpiar los timeouts pendientes
  if (autocompleteDelayId.value) {
    clearTimeout(autocompleteDelayId.value);
  }
  if (cptAutocompleteDelayId.value) {
    clearTimeout(cptAutocompleteDelayId.value);
  }
});

// Handler para clicks fuera del CPT autocomplete
const handleCPTClickOutside = (event) => {
  const isAutocompleteItem = event.target.closest(".autocomplete-item");
  const isInput = event.target === activeCPTInputRef.value;

  if (!isAutocompleteItem && !isInput && showCPTAutocomplete.value) {
    showCPTAutocomplete.value = false;
  }
};
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
  z-index: 10000 !important; /* Asegurar que esté sobre cualquier modal */
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