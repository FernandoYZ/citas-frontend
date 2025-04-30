<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-md font-semibold text-blue-600">Órdenes Médicas</h3>
      <div>
        <button
          class="px-3 py-1.5 border border-blue-400 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors flex items-center"
          @click="agregarOrdenMedica"
        >
          <i class="fas fa-plus-circle mr-1.5"/>
          Agregar Orden
        </button>
      </div>
    </div>

    <!-- Selector de categoría -->
    <div class="mb-4">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(categoria, index) in categoriasProcedimientos"
          :key="index"
          class="px-3 py-1.5 text-sm rounded-md transition-colors flex items-center"
          :class="
            categoriaSelecionada === categoria.id
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
          "
          @click="seleccionarCategoria(categoria.id)"
        >
          <i :class="categoria.icono + ' mr-1.5'"/>
          {{ categoria.nombre }}
          <span
            v-if="contarProcedimientosPorCategoria(categoria.id) > 0"
            class="ml-1.5 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {{ contarProcedimientosPorCategoria(categoria.id) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Tabla de procedimientos -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div
        class="bg-gray-50 px-3 py-2 border-b border-gray-200 font-medium text-gray-700 text-sm flex justify-between items-center"
      >
        <div class="flex items-center">
          <i :class="categoriaActual.icono + ' text-blue-500 mr-2'"/>
          {{ categoriaActual.nombre }}
        </div>
        <div class="flex items-center">
          <div class="relative">
            <input
              v-model="busquedaProcedimiento"
              type="text"
              class="w-64 px-3 py-1.5 pr-8 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 search-input"
              placeholder="Buscar procedimiento..."
              @input="buscarProcedimientosDebounced"
              @focus="mostrarBusquedaResultados = true"
            >
            <i class="fas fa-search absolute right-3 top-2 text-gray-400"/>

            <!-- Dropdown de resultados de búsqueda -->
            <div
              v-if="mostrarBusquedaResultados && resultadosBusqueda.length > 0"
              class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto search-results"
            >
              <div
                v-for="(resultado, i) in resultadosBusqueda"
                :key="i"
                class="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                @click="seleccionarProcedimiento(resultado)"
              >
                <div class="font-medium">{{ resultado.procedimiento }}</div>
                <div class="text-xs text-gray-500">{{ resultado.codigo }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-6"
              >
                #
              </th>
              <th
                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Procedimiento
              </th>
              <th
                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
              >
                Código
              </th>
              <th
                class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
              >
                Cant.
              </th>
              <th
                class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
              >
                Hay
              </th>
              <th
                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64"
              >
                Observaciones
              </th>
              <th
                class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
              >
                Acción
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(proc, index) in procedimientosFiltrados" :key="index">
              <td class="px-3 py-2 whitespace-nowrap text-xs">
                {{ index + 1 }}
              </td>
              <td class="px-3 py-2 text-xs">
                {{ proc.procedimiento }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-xs">
                {{ proc.codigo }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-xs text-center">
                <input
                  v-model="proc.cantidad"
                  type="number"
                  min="1"
                  class="w-12 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                  @input="emitUpdate"
                >
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-xs text-center">
                <input
                  v-model="proc.hay"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  @change="emitUpdate"
                >
              </td>
              <td class="px-3 py-2 text-xs">
                <input
                  v-model="proc.observaciones"
                  type="text"
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Observaciones"
                  @input="emitUpdate"
                >
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-xs text-center">
                <button
                  class="py-1 px-1.5 border border-red-300 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                  @click="eliminarProcedimiento(index, proc.categoria)"
                >
                  <i class="fas fa-trash-alt"/>
                </button>
              </td>
            </tr>
            <tr v-if="procedimientosFiltrados.length === 0">
              <td
                colspan="7"
                class="px-3 py-4 text-center text-sm text-gray-500"
              >
                <div
                  v-if="
                    categoriaSelecionada === 'todos' &&
                    totalProcedimientos === 0
                  "
                >
                  No hay procedimientos registrados.
                  <button
                    class="text-blue-600 hover:text-blue-800 underline ml-2"
                    @click="agregarOrdenMedica"
                  >
                    Agregar una orden
                  </button>
                </div>
                <div v-else-if="categoriaSelecionada === 'todos'">
                  Seleccione una categoría para ver los procedimientos.
                </div>
                <div v-else>
                  No hay procedimientos en esta categoría.
                  <button
                      class="text-blue-600 hover:text-blue-800 underline ml-2"
                    @click="agregarOrdenMedica"
                  >
                    Agregar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <!-- Modal de búsqueda de procedimientos -->
    <CommonModal
      v-model="modalBusquedaVisible"
      title="Agregar Procedimiento"
      icon="fa-plus-circle"
      :secondary-button="'Cancelar'"
      secondary-button-icon="fa-times"
      :primary-button="'Agregar'"
      primary-button-icon="fa-check"
      size="sm:max-w-2xl"
      :content-class="'p-5 space-y-4'"
      :footer-class="'bg-gray-50'"
      :show-header-border="true"
      @secondary-click="modalBusquedaVisible = false"
      @primary-click="agregarProcedimientoSeleccionado"
      @close="modalBusquedaVisible = false"
    >
      <div class="space-y-4">
        <!-- Selector de categoría -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Categoría</label
          >
          <select
            v-model="nuevoProcedimiento.categoria"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option
              v-for="categoria in categoriasProcedimientos.filter(
                (cat) => cat.id !== 'todos'
              )"
              :key="categoria.id"
              :value="categoria.id"
            >
              {{ categoria.nombre }}
            </option>
          </select>
        </div>

        <!-- Búsqueda de procedimiento -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Procedimiento</label
          >
          <div class="relative">
            <input
              v-model="busquedaModal"
              type="text"
              class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar procedimiento..."
              @input="buscarProcedimientosModalDebounced"
            >
            <i class="fas fa-search absolute right-3 top-2.5 text-gray-400"/>
          </div>

          <!-- Resultados de búsqueda -->
          <div
            v-if="resultadosBusquedaModal.length > 0"
            class="mt-2 border border-gray-200 rounded-lg max-h-60 overflow-y-auto"
          >
            <div
              v-for="(resultado, i) in resultadosBusquedaModal"
              :key="i"
              class="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              :class="{
                'bg-blue-50':
                  procedimientoSeleccionado &&
                  procedimientoSeleccionado.codigo === resultado.codigo,
              }"
              @click="seleccionarProcedimientoModal(resultado)"
            >
              <div class="flex justify-between">
                <div class="font-medium text-sm">
                  {{ resultado.procedimiento }}
                </div>
                <div class="text-sm text-blue-600">{{ resultado.codigo }}</div>
              </div>
            </div>
          </div>
          <div
            v-else-if="busquedaModal.length > 2 && !cargandoBusqueda"
            class="mt-2 text-sm text-gray-500 italic"
          >
            No se encontraron resultados
          </div>
          <div
            v-else-if="cargandoBusqueda"
            class="mt-2 text-sm text-gray-500 italic"
          >
            Buscando...
          </div>
        </div>

        <!-- Detalles del procedimiento -->
        <div
          v-if="procedimientoSeleccionado"
          class="bg-blue-50 p-3 rounded-lg border border-blue-100"
        >
          <div class="text-sm font-medium">Procedimiento seleccionado:</div>
          <div class="text-sm mt-1 flex justify-between">
            <span>{{ procedimientoSeleccionado.procedimiento }}</span>
            <span class="text-blue-700">{{
              procedimientoSeleccionado.codigo
            }}</span>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Cantidad</label
              >
              <input
                v-model="nuevoProcedimiento.cantidad"
                type="number"
                min="1"
                class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
            <div class="flex items-end mb-1.5">
              <label class="inline-flex items-center">
                <input
                  v-model="nuevoProcedimiento.hay"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700"
                  >Hay disponibilidad</span
                >
              </label>
            </div>
          </div>

          <div class="mt-3">
            <label class="block text-xs font-medium text-gray-700 mb-1"
              >Observaciones</label
            >
            <input
              v-model="nuevoProcedimiento.observaciones"
              type="text"
              class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Observaciones sobre el procedimiento"
            >
          </div>
        </div>
      </div>
    </CommonModal>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { atencionesService } from "~/services/AtencionesService";
import { useNotification } from "~/composables/useNotification";
import _ from "lodash";

const props = defineProps({
  procedimientos: {
    type: Array,
    default: () => [],
  },
  observaciones: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "update:procedimientos",
  "update:observaciones",
  "update",
]);

// Notificaciones
const notification = useNotification();

// Copia local de los datos
const localProcedimientos = ref([...props.procedimientos]);
const localObservaciones = ref(props.observaciones);

// Actualizar cuando cambian los props
watch(
  () => props.procedimientos,
  (newVal) => {
    localProcedimientos.value = [...newVal];
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
  emit("update:procedimientos", [...localProcedimientos.value]);
  emit("update");
};


// Categorías para órdenes médicas
const categoriasProcedimientos = [
  { id: "todos", nombre: "Todos", icono: "fas fa-list-ul" },
  { id: "rayosX", nombre: "Rayos X", icono: "fas fa-radiation" },
  { id: "patologia", nombre: "Patología Clínica", icono: "fas fa-vial" },
  { id: "ecografiaObs", nombre: "Ecografía Obstétrica", icono: "fas fa-baby" },
  { id: "anatomia", nombre: "Anatomía Patológica", icono: "fas fa-microscope" },
  {
    id: "ecografiaGen",
    nombre: "Ecografía General",
    icono: "fas fa-wave-square",
  },
  { id: "bancoSangre", nombre: "Banco de Sangre", icono: "fas fa-tint" },
  { id: "tomografia", nombre: "Tomografía", icono: "fas fa-x-ray" },
  {
    id: "otros",
    nombre: "Otros Procedimientos",
    icono: "fas fa-clipboard-list",
  },
  { id: "farmacia", nombre: "Farmacia", icono: "fas fa-pills" },
];

// Categoría seleccionada actualmente para órdenes médicas
const categoriaSelecionada = ref("todos");

// Búsqueda de procedimientos
const busquedaProcedimiento = ref("");
const resultadosBusqueda = ref([]);
const mostrarBusquedaResultados = ref(false);
const cargandoBusqueda = ref(false);

// Modal de búsqueda de procedimientos
const modalBusquedaVisible = ref(false);
const busquedaModal = ref("");
const resultadosBusquedaModal = ref([]);
const procedimientoSeleccionado = ref(null);
const nuevoProcedimiento = ref({
  categoria: "rayosX",
  procedimiento: "",
  codigo: "",
  cantidad: 1,
  hay: false,
  observaciones: "",
});

// Computed properties
const categoriaActual = computed(() => {
  return (
    categoriasProcedimientos.find(
      (cat) => cat.id === categoriaSelecionada.value
    ) || categoriasProcedimientos[0]
  );
});

const procedimientosFiltrados = computed(() => {
  if (categoriaSelecionada.value === "todos") {
    return localProcedimientos.value;
  } else {
    return localProcedimientos.value.filter(
      (proc) => proc.categoria === categoriaSelecionada.value
    );
  }
});

const totalProcedimientos = computed(() => {
  return localProcedimientos.value.length;
});

// Seleccionar categoría de órdenes médicas
const seleccionarCategoria = (categoriaId) => {
  categoriaSelecionada.value = categoriaId;
  mostrarBusquedaResultados.value = false;
};

// Contar procedimientos por categoría
const contarProcedimientosPorCategoria = (categoriaId) => {
  if (categoriaId === "todos") {
    return localProcedimientos.value.length;
  }
  return localProcedimientos.value.filter(
    (proc) => proc.categoria === categoriaId
  ).length;
};

// Búsqueda de procedimientos con debounce
const buscarProcedimientosDebounced = _.debounce(() => {
  if (busquedaProcedimiento.value.length < 2) {
    resultadosBusqueda.value = [];
    mostrarBusquedaResultados.value = false;
    return;
  }

  cargandoBusqueda.value = true;

  // Simulación de búsqueda - esto debe reemplazarse con una llamada a la API real
  setTimeout(() => {
    // Aquí vendría la llamada al servicio
    const resultados = buscarProcedimientosEnAPI(busquedaProcedimiento.value);
    resultadosBusqueda.value = resultados;
    mostrarBusquedaResultados.value = true;
    cargandoBusqueda.value = false;
  }, 300);
}, 300);

// Búsqueda en el modal
const buscarProcedimientosModalDebounced = _.debounce(() => {
  if (busquedaModal.value.length < 2) {
    resultadosBusquedaModal.value = [];
    return;
  }

  cargandoBusqueda.value = true;

  // Simulación de búsqueda - esto debe reemplazarse con una llamada a la API real
  setTimeout(() => {
    // Aquí vendría la llamada al servicio
    const resultados = buscarProcedimientosEnAPI(busquedaModal.value);
    resultadosBusquedaModal.value = resultados;
    cargandoBusqueda.value = false;
  }, 300);
}, 300);

// Función para buscar procedimientos (simulada)
const buscarProcedimientosEnAPI = (termino) => {
  try {
    // En un caso real, esto sería una llamada a un endpoint
    return atencionesService.buscarProcedimientos(termino).catch((error) => {
      console.error("Error al buscar procedimientos:", error);
      return mockProcedimientosBusqueda(termino); // Fallback a mock en caso de error
    });
  } catch (error) {
    console.error("Error al buscar procedimientos:", error);
    return mockProcedimientosBusqueda(termino); // Fallback a mock
  }
};

// Mock de procedimientos para desarrollo (reemplazar con llamada a API real)
const mockProcedimientosBusqueda = (termino) => {
  // Esta es una lista de ejemplo que debe reemplazarse con datos reales de la API
  const procedimientosEjemplo = [
    { procedimiento: "COLANGIOGRAFÍA Y PANCREATOGRAFÍA", codigo: "Z31.82" },
    { procedimiento: "ECOGRAFÍA OBSTÉTRICA", codigo: "Z31.83" },
    { procedimiento: "RADIOGRAFÍA DE TÓRAX", codigo: "Z01.84" },
    { procedimiento: "HEMOGRAMA COMPLETO", codigo: "B01.14" },
    { procedimiento: "ECOGRAFÍA ABDOMINAL", codigo: "R93.5" },
    { procedimiento: "TOMOGRAFÍA DE CEREBRO", codigo: "Z01.83" },
    { procedimiento: "GRUPO SANGUÍNEO Y FACTOR RH", codigo: "Z01.83" },
    { procedimiento: "ECOCARDIOGRAMA", codigo: "Z01.81" },
    { procedimiento: "BIOPSIA DE PIEL", codigo: "Z01.82" },
    { procedimiento: "UROANÁLISIS", codigo: "Z13.89" },
  ];

  return procedimientosEjemplo.filter(
    (p) =>
      p.procedimiento.toLowerCase().includes(termino.toLowerCase()) ||
      p.codigo.toLowerCase().includes(termino.toLowerCase())
  );
};

// Seleccionar procedimiento desde la búsqueda rápida
const seleccionarProcedimiento = (procedimiento) => {
  // Verificar si ya existe este procedimiento
  const existente = localProcedimientos.value.find(
    (p) =>
      p.codigo === procedimiento.codigo &&
      p.categoria === categoriaSelecionada.value
  );

  if (existente) {
    // Aumentar cantidad si ya existe
    existente.cantidad++;
    notification.show({
      title: "Procedimiento actualizado",
      message: `Se incrementó la cantidad de ${procedimiento.procedimiento}`,
      type: "info",
    });
  } else {
    // Agregar nuevo
    localProcedimientos.value.push({
      categoria:
        categoriaSelecionada.value === "todos"
          ? "otros"
          : categoriaSelecionada.value,
      procedimiento: procedimiento.procedimiento,
      codigo: procedimiento.codigo,
      cantidad: 1,
      hay: false,
      observaciones: "",
    });

    notification.show({
      title: "Procedimiento agregado",
      message: `${procedimiento.procedimiento} agregado correctamente`,
      type: "success",
    });
  }

  mostrarBusquedaResultados.value = false;
  busquedaProcedimiento.value = "";
  emitUpdate();
};

// Seleccionar procedimiento desde el modal
const seleccionarProcedimientoModal = (procedimiento) => {
  procedimientoSeleccionado.value = procedimiento;
  nuevoProcedimiento.value = {
    ...nuevoProcedimiento.value,
    procedimiento: procedimiento.procedimiento,
    codigo: procedimiento.codigo,
  };
};

// Agregar el procedimiento seleccionado desde el modal
const agregarProcedimientoSeleccionado = () => {
  if (!procedimientoSeleccionado.value) {
    notification.show({
      title: "Advertencia",
      message: "Debe seleccionar un procedimiento",
      type: "warning",
    });
    return;
  }

  // Verificar si ya existe este procedimiento
  const existente = localProcedimientos.value.find(
    (p) =>
      p.codigo === nuevoProcedimiento.value.codigo &&
      p.categoria === nuevoProcedimiento.value.categoria
  );

  if (existente) {
    // Aumentar cantidad si ya existe
    existente.cantidad += nuevoProcedimiento.value.cantidad;
    existente.observaciones =
      nuevoProcedimiento.value.observaciones || existente.observaciones;
    existente.hay = nuevoProcedimiento.value.hay;

    notification.show({
      title: "Procedimiento actualizado",
      message: `Se actualizó ${procedimientoSeleccionado.value.procedimiento}`,
      type: "info",
    });
  } else {
    // Agregar nuevo
    localProcedimientos.value.push({
      categoria: nuevoProcedimiento.value.categoria,
      procedimiento: procedimientoSeleccionado.value.procedimiento,
      codigo: procedimientoSeleccionado.value.codigo,
      cantidad: nuevoProcedimiento.value.cantidad || 1,
      hay: nuevoProcedimiento.value.hay || false,
      observaciones: nuevoProcedimiento.value.observaciones || "",
    });

    notification.show({
      title: "Procedimiento agregado",
      message: `${procedimientoSeleccionado.value.procedimiento} agregado correctamente`,
      type: "success",
    });
  }

  // Actualizar la categoria seleccionada para mostrar el procedimiento recién agregado
  categoriaSelecionada.value = nuevoProcedimiento.value.categoria;

  // Limpiar y cerrar modal
  modalBusquedaVisible.value = false;
  procedimientoSeleccionado.value = null;
  busquedaModal.value = "";
  nuevoProcedimiento.value = {
    categoria: "rayosX",
    procedimiento: "",
    codigo: "",
    cantidad: 1,
    hay: false,
    observaciones: "",
  };

  emitUpdate();
};

// Eliminar procedimiento
const eliminarProcedimiento = (index, categoria) => {
  const procedimientos = procedimientosFiltrados.value;
  if (
    confirm(
      `¿Está seguro de eliminar "${procedimientos[index].procedimiento}"?`
    )
  ) {
    // Encontrar el índice real en el array completo
    const indiceReal = localProcedimientos.value.findIndex(
      (p) =>
        p.codigo === procedimientos[index].codigo && p.categoria === categoria
    );

    if (indiceReal !== -1) {
      // Si el procedimiento tiene ID, eliminarlo de la base de datos
      if (localProcedimientos.value[indiceReal].id) {
        try {
          // Esta sería la llamada real al servicio
          atencionesService
            .eliminarOrdenMedica(localProcedimientos.value[indiceReal].id)
            .catch((error) => {
              console.error("Error al eliminar procedimiento:", error);
              notification.show({
                title: "Error",
                message: "Error al eliminar el procedimiento",
                type: "error",
              });
            });
        } catch (error) {
          console.error("Error al eliminar procedimiento:", error);
        }
      }

      localProcedimientos.value.splice(indiceReal, 1);
      notification.show({
        title: "Procedimiento eliminado",
        message: "El procedimiento ha sido eliminado",
        type: "success",
      });
      emitUpdate();
    }
  }
};

// Abrir el modal para agregar una orden médica
const agregarOrdenMedica = () => {
  modalBusquedaVisible.value = true;
  // Si hay una categoría seleccionada, usarla en el modal
  if (categoriaSelecionada.value !== "todos") {
    nuevoProcedimiento.value.categoria = categoriaSelecionada.value;
  }
};

// Función para manejar clicks fuera de los resultados de búsqueda
const handleClickOutside = (event) => {
  if (
    !event.target.closest(".search-results") &&
    !event.target.closest(".search-input")
  ) {
    mostrarBusquedaResultados.value = false;
  }
};

// Al montar el componente
onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  // Inicialmente mostrar la categoría Farmacia si hay medicamentos
  if (localProcedimientos.value.some((p) => p.categoria === "farmacia")) {
    categoriaSelecionada.value = "farmacia";
  }
});

// Limpiar eventos al desmontar el componente
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
