<!-- components/cita/List -->
<template>
  <div>
    <CommonTable
      :items="sortedCitas"
      :columns="filteredColumns"
      title="Lista de Citas"
      :count-label="getCountLabel(sortedCitas.length)"
      :rows-per-page="rowsPerPage"
      :current-page="currentPage"
      :enable-pagination="true"
      :enable-sort="true"
      :enable-search="true"
      :search-value="searchTerm"
      :search-placeholder="'Buscar por paciente...'"
      :enable-export="true"
      :export-filename="'citas-medicas-' + formatFechaForFilename()"
      :export-options="exportOptions"
      :sort-key="sortConfig.key"
      :sort-direction="sortConfig.direction"
      :empty-message="'No hay citas disponibles'"
      :empty-description="
        isLoading
          ? 'Cargando información...'
          : 'No se han registrado citas para la fecha seleccionada'
      "
      @sort="handleSort"
      @search="searchTerm = $event"
      @update:current-page="(page) => emit('update:currentPage', page)"
      @update:rows-per-page="(size) => emit('update:rowsPerPage', size)"
      @export="handleExport"
      @refresh="refrescarDatos"
    >
      <template #headerActions>
        <div class="flex flex-wrap items-center gap-3">
          <!-- Contenedor de filtros con estilo moderno -->
          <!-- Filtro de Estado -->
          <div class="relative">
            <select
              v-model="filtroEstado"
              class="appearance-none pl-8 pr-8 py-2 rounded-md border border-gray-200 bg-white text-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
              @change="aplicarFiltros"
            >
              <option value="">Estado: Todos</option>
              <option value="Separada">Estado: Separada</option>
              <option value="Atendido">Estado: Atendido</option>
            </select>
            <div
              class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-500"
            >
              <i class="fas fa-filter text-sm" />
            </div>
            <div
              class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400"
            >
              <i class="fas fa-chevron-down text-xs" />
            </div>
          </div>

          <!-- Filtro de Triaje -->
          <div class="relative">
            <select
              v-model="filtroTriaje"
              class="appearance-none pl-8 pr-8 py-2 rounded-md border border-gray-200 bg-white text-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
              @change="aplicarFiltros"
            >
              <option value="">Triaje: Todos</option>
              <option value="Pendiente">Triaje: Pendiente</option>
              <option value="Completado">Triaje: Completado</option>
              <option value="No aplica">Triaje: No aplica</option>
            </select>
            <div
              class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-500"
            >
              <i class="fas fa-notes-medical text-sm" />
            </div>
            <div
              class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400"
            >
              <i class="fas fa-chevron-down text-xs" />
            </div>
          </div>

          <!-- Selector de fecha con controles -->
          <div class="flex items-center gap-1.5">
            <div class="relative">
              <input
                :value="fechaSeleccionada"
                type="date"
                class="pl-9 pr-3 py-2 rounded-md border border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                @blur="onDateInputBlur"
                @keyup.enter="onDateInputBlur"
              >
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-500 cursor-pointer"
                @click="focusDateInput"
              >
                <i class="fas fa-calendar-alt" />
              </div>
            </div>

            <button
              class="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              title="Ver citas de hoy"
              @click="cambiarFecha(null, 'hoy')"
            >
              <i class="fas fa-calendar-day" />
            </button>

            <!-- <button
              class="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              title="Refrescar datos"
              @click="refrescarDatos"
            >
              <i class="fas fa-sync-alt" />
            </button> -->
          </div>

          <!-- Acciones de exportación -->
          <!-- <div class="flex items-center ml-auto">
            <div ref="exportMenuRef" class="relative">
              <button
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                @click="toggleExportMenu"
              >
                <i class="fas fa-download text-white" />
                <span>Exportar</span>
                <i class="fas fa-chevron-down text-xs opacity-70" />
              </button>

              <div
                v-if="showExportMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100 transform transition-all duration-200 ease-in-out"
              >
                <button
                  v-for="option in exportOptions"
                  :key="option.format"
                  class="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  @click="exportarDatos(option.format)"
                >
                  <i :class="`fas ${option.icon} mr-2 text-gray-500`" />
                  <span>{{ option.label }}</span>
                </button>
              </div>
            </div>
          </div> -->
        </div>
      </template>

      <!-- Personalización de filas -->
      <template #row="{ item }">
          <template v-if="isLoading">
          <!-- Skeleton loader para filas -->
          <CommonTableRowSkeleton v-for="i in 5" :key="i" :show-actions="isUserDoctor" />
        </template>
        <template v-else>
        <tr class="hover:bg-gray-50 capitalize">
          <td class="px-4 py-3 whitespace-nowrap">
            <div class="flex items-center space-x-4">
              <div
                class="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-500"
              >
                <i class="far fa-clock" />
              </div>
              <div class="flex flex-col items-start text-sm text-gray-900">
                <div>
                  {{ item.HoraInicio }} -
                  {{ item.HoraFin || calcularHoraFin(item.HoraInicio) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatearFecha(item.FechaCita) }}
                </div>
              </div>
            </div>
          </td>

          <td class="px-4 py-3 whitespace-nowrap">
            <div class="text-sm font-semibold text-blue-600">
              {{ item.IdAtencion || "-" }}
            </div>
          </td>

          <td class="px-4 py-3">
            <div class="flex items-center">
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ item.ApellidosPaciente }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ item.NombresPaciente }}
                </div>
              </div>
            </div>
          </td>

          <td class="px-4 py-3 whitespace-nowrap">
            <div class="text-sm font-semibold text-gray-700">
              {{ item.NroDocumento }}
            </div>
          </td>

          <td class="px-4 py-3 whitespace-nowrap hidden md:table-cell">
            <div class="text-sm text-gray-800 break-words whitespace-normal">
              {{ item.Servicio }}
            </div>
          </td>

          <td class="px-4 py-3 whitespace-nowrap hidden md:table-cell">
            <div class="text-sm font-medium text-gray-800">
              {{ item.NombreDoctor }}
            </div>
            <div class="text-xs text-gray-500">{{ item.ApellidoDoctor }}</div>
          </td>

          <!-- Nueva columna de Triaje -->
          <td class="px-4 py-3 whitespace-nowrap">
            <div class="text-sm">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getTriajeClass(item.Triaje)"
              >
                <i
                  class="mr-1"
                  :class="getTriajeClass(item.Triaje, 'icono')"
                />{{ item.Triaje }}
              </span>
            </div>
          </td>

          <td class="px-4 py-3 whitespace-nowrap">
            <div class="text-sm">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getEstadoClass(item.Estado, item.Triaje)"
              >
                {{ item.Estado }}
              </span>
            </div>
          </td>

          <td
            v-if="isUserDoctor"
            class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium"
          >
            <div class="flex space-x-2 justify-end">
              <!-- Botón Ver Detalles
            <button
              class="w-8 h-8 flex items-center justify-center border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              title="Ver detalles"
              @click="$emit('view', item)"
            >
              <i class="fas fa-eye"/>
            </button> -->

              <!-- Botón Registrar Triaje -->
              <button
                class="w-8 h-8 flex items-center justify-center border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                title="Registrar Triaje"
                :class="
                  item.Triaje === 'No aplica'
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : ''
                "
                :disabled="item.Triaje === 'No aplica'"
                @click="$emit('triaje', item)"
              >
                <i
                  :class="
                    item.Triaje === 'Completado'
                      ? 'fas fa-edit'
                      : 'fa-solid fa-file-medical'
                  "
                />
              </button>

              <!-- Botón Atender Cita -->
              <button
                class="w-8 h-8 flex items-center justify-center border rounded-md transition-colors"
                title="Atender Cita"
                :disabled="item.Triaje === 'Pendiente'"
                :class="
                  item.Triaje !== 'Pendiente'
                    ? 'border-blue-500 text-blue-600 hover:bg-blue-50'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                "
                @click="$emit('atencion', item)"
              >
                <i class="fa-solid fa-stethoscope" />
              </button>
            </div>
          </td>
        </tr>
        </template>
      </template>
    </CommonTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useExport } from "~/composables/useExport";
import { getCurrentDate } from "~/composables/getCurrentDate";

// Usar el composable de autenticación
const { authModel } = useAuth();
const { exportData } = useExport();

const dateInput = ref(null);

function focusDateInput() {
  if (dateInput.value) {
    dateInput.value.focus();
    dateInput.value.showPicker(); // En navegadores modernos
  }
}

function onDateInputBlur(event) {
  if (event.target.value && event.target.value !== fechaSeleccionada.value) {
    fechaSeleccionada.value = event.target.value;
    emit('filter-date', fechaSeleccionada.value);
  }
}

// const citasComposable = inject('citasComposable', null);

// Obtener la fecha actual en formato YYYY-MM-DD
function obtenerFechaActual() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Variable para controlar el estado de carga
// const isLoading = ref(false);
const showExportMenu = ref(false);
const exportMenuRef = ref(null);

const isUserDoctor = computed(() => authModel.user.isMedico);

// Props
const props = defineProps({
  citas: {
    type: Array,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  rowsPerPage: {
    type: Number,
    default: 10,
  },
  selectedDate: {
    type: String,
    default: getCurrentDate(),
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const fechaSeleccionada = ref(props.selectedDate || obtenerFechaActual());

watch(
  () => props.selectedDate,
  (newDate, oldDate) => {
    console.log(
      "Watch en CitaList - selectedDate cambió:",
      oldDate,
      "->",
      newDate
    );
    // Solo actualizar si realmente cambió para evitar bucles
    if (newDate && newDate !== fechaSeleccionada.value) {
      console.log("Actualizando fechaSeleccionada en CitaList a:", newDate);
      fechaSeleccionada.value = newDate;
    }
  },
  { immediate: true }
);

const emit = defineEmits([
  "view",
  "triaje",
  "atencion",
  "search",
  "sort",
  "update:currentPage",
  "update:rowsPerPage",
  "filter-date",
  "reload-data",
  "update:selectedDate",
]);

// Estado local
const searchTerm = ref("");
const sortConfig = ref({
  key: "IdAtencion",
  direction: "desc",
});

// Filtros adicionales
const filtroTriaje = ref("");
const filtroEstado = ref("");

async function refrescarDatos() {
  await cargarCitasPorFecha(fechaSeleccionada.value);
}

function toggleExportMenu() {
  showExportMenu.value = !showExportMenu.value;
}

// Función para cargar los datos según la fecha seleccionada
async function cargarCitasPorFecha(fecha) {
  try {
    isLoading.value = true;

    // Asegurarnos que fecha es un string en formato YYYY-MM-DD
    let fechaFormateada = fecha;
    if (fecha instanceof Date) {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, "0");
      const day = String(fecha.getDate()).padStart(2, "0");
      fechaFormateada = `${year}-${month}-${day}`;
    }

    // Validar que la fecha tenga el formato correcto
    if (
      typeof fechaFormateada !== "string" ||
      !fechaFormateada.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      console.error("Formato de fecha inválido:", fechaFormateada);
      throw new Error("La fecha debe tener el formato YYYY-MM-DD");
    }

    console.log("Cargando citas para fecha:", fechaFormateada);

    // IMPORTANTE: SOLO emitimos la fecha como string, nunca un objeto o array
    emit("filter-date", fechaFormateada);

    return [];
  } catch (error) {
    console.error("Error al cargar citas por fecha:", error);
  } finally {
    isLoading.value = false;
  }
}

// Definición de columnas
const columns = [
  { key: "FechaCita", label: "Fecha y Hora", sortable: true },
  { key: "IdAtencion", label: "N° Cuenta", sortable: true },
  { key: "ApellidosPaciente", label: "Paciente", sortable: true },
  { key: "NroDocumento", label: "DNI", sortable: true },
  { key: "Servicio", label: "Servicio", responsive: true, sortable: true },
  { key: "NombreDoctor", label: "Médico", responsive: true, sortable: true },
  { key: "Triaje", label: "Triaje", sortable: true },
  { key: "Estado", label: "Estado", sortable: false },
  // { key: "acciones", label: "", sortable: false },
];

// Opciones de exportación
const exportOptions = [
  { format: "excel", label: "Excel", icon: "fa-file-excel" },
  { format: "pdf", label: "PDF", icon: "fa-file-pdf" },
  { format: "json", label: "JSON", icon: "fa-file-code" },
];

// Formatear fecha para nombre de archivo
function formatFechaForFilename() {
  return fechaSeleccionada.value.replace(/-/g, "");
}

// Cambiar fecha y emitir evento para recargar datos
async function cambiarFecha(event, preset = null) {
  // Establecer la fecha actual si se presiona el botón "Hoy"
  if (preset === "hoy") {
    fechaSeleccionada.value = obtenerFechaActual();
  }

  console.log(
    "Fecha seleccionada (en componente hijo):",
    fechaSeleccionada.value
  );

  // Emitir el evento para actualizar la fecha en el padre INMEDIATAMENTE
  emit("update:selectedDate", fechaSeleccionada.value);

  // Emitir el evento de filtrado INMEDIATAMENTE también
  emit("filter-date", fechaSeleccionada.value);

  // Eliminar el debounce para simplificar el flujo
  // if (window.dateFilterTimeout) {
  //   clearTimeout(window.dateFilterTimeout);
  // }
  //
  // window.dateFilterTimeout = setTimeout(() => {
  //   emit('filter-date', fechaSeleccionada.value);
  // }, 300);
}

onMounted(() => {
  document.addEventListener("click", (e) => {
    if (exportMenuRef.value && !exportMenuRef.value.contains(e.target)) {
      showExportMenu.value = false;
    }
  });
});

onUnmounted(() => {
  document.removeEventListener("click", (e) => {
    if (exportMenuRef.value && !exportMenuRef.value.contains(e.target)) {
      showExportMenu.value = false;
    }
  });
});

// Inicializar al montar el componente
onMounted(async () => {
  // Establecer fecha actual y cargar datos iniciales
  // fechaSeleccionada.value = obtenerFechaActual();
  // await cargarCitasPorFecha(fechaSeleccionada.value);
});

// Aplicar filtros de Triaje y Estado
function aplicarFiltros() {
  // Los filtros ya se aplican automáticamente a través de la propiedad computada
  // Pero podemos hacer algo aquí si necesitamos, como emitir un evento
  console.log("Filtros aplicados:", {
    estado: filtroEstado.value,
    triaje: filtroTriaje.value,
  });
}
// Exportar datos filtrados
function exportarDatos(formato) {
  const dataToExport = {
    data: filteredCitas.value,
    columns: filteredColumns.value,
    format: formato,
    fileName: `citas-medicas-${formatFechaForFilename()}`,
  };

  exportData(dataToExport);
}

// Manejar exportación
function handleExport(data) {
  console.log("Exportando en formato:", data.format);
  // El manejo actual en el CommonTable ya lo procesa
}

// Filtrar columnas si el usuario no es médico
const filteredColumns = computed(() => {
  // Mantenemos todas las columnas, pero el contenido de "acciones" se controla en la plantilla
  return columns;
});

// Citas filtradas por todos los criterios
const filteredCitas = computed(() => {
  let result = [...props.citas];

  // Aplicar búsqueda si hay término
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter((cita) => {
      return Object.values(cita).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(term)
      );
    });
  }

  // Aplicar filtro de Triaje
  if (filtroTriaje.value) {
    result = result.filter((cita) => cita.Triaje === filtroTriaje.value);
  }

  // Aplicar filtro de Estado
  if (filtroEstado.value) {
    result = result.filter((cita) => cita.Estado === filtroEstado.value);
  }

  // Aplicar ordenamiento
  if (sortConfig.value.key) {
    result.sort((a, b) => {
      let valueA = a[sortConfig.value.key];
      let valueB = b[sortConfig.value.key];

      // Manejar valores nulos o undefined
      if (valueA === null || valueA === undefined) valueA = "";
      if (valueB === null || valueB === undefined) valueB = "";

      // Convertir a números para fechas en formato DD/MM/YYYY
      if (sortConfig.value.key === "FechaCita") {
        // Convertir fechas a objetos Date para comparación correcta
        try {
          if (typeof valueA === "string" && typeof valueB === "string") {
            if (valueA.includes("-") && valueB.includes("-")) {
              // Formato YYYY-MM-DD
              const dateA = new Date(valueA);
              const dateB = new Date(valueB);
              valueA = dateA.getTime();
              valueB = dateB.getTime();
            } else {
              // Formato MM/DD/YYYY
              const partsA = valueA.split("/");
              const partsB = valueB.split("/");
              const dateA = new Date(partsA[2], partsA[0] - 1, partsA[1]);
              const dateB = new Date(partsB[2], partsB[0] - 1, partsB[1]);
              valueA = dateA.getTime();
              valueB = dateB.getTime();
            }
          }
        } catch (error) {
          console.error("Error al comparar fechas:", error);
          // Continuar con comparación de strings si hay error
        }
      }

      // Comparar según tipo de datos
      let comparison = 0;
      if (typeof valueA === "number" && typeof valueB === "number") {
        comparison = valueA - valueB;
      } else {
        comparison = String(valueA).localeCompare(String(valueB));
      }

      // Aplicar dirección de ordenamiento
      return sortConfig.value.direction === "asc" ? comparison : -comparison;
    });
  }

  return result;
});

// Calcular hora de fin basado en hora de inicio (si no está disponible)
const calcularHoraFin = (horaInicio) => {
  if (!horaInicio) return "";

  try {
    const [horas, minutos] = horaInicio.split(":").map(Number);
    let nuevasHoras = horas;
    let nuevosMinutos = minutos + 30; // Duración estándar de 30 minutos

    if (nuevosMinutos >= 60) {
      nuevosMinutos -= 60;
      nuevasHoras += 1;
    }

    if (nuevasHoras >= 24) {
      nuevasHoras -= 24;
    }

    return `${nuevasHoras.toString().padStart(2, "0")}:${nuevosMinutos
      .toString()
      .padStart(2, "0")}`;
  } catch (error) {
    console.error("Error al calcular hora de fin:", error);
    return "";
  }
};

// Formatear fecha a formato local de Perú
const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "";

  try {
    // Asumiendo formato YYYY-MM-DD
    if (fechaStr.includes("-")) {
      const [year, month, day] = fechaStr.split("-");
      return `${day}/${month}/${year}`;
    }

    // Para formato MM/DD/YYYY
    const partes = fechaStr.split("/");
    if (partes.length === 3) {
      // Convertir a formato DD/MM/YYYY (Perú)
      return `${partes[1]}/${partes[0]}/${partes[2]}`;
    }

    // Si ya está en otro formato, devolver como está
    return fechaStr;
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return fechaStr;
  }
};

// Citas ordenadas y filtradas
const sortedCitas = computed(() => {
  let result = [...props.citas];

  // Aplicar búsqueda si hay término
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter((cita) => {
      return Object.values(cita).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(term)
      );
    });
  }

  // Aplicar filtro de Triaje
  if (filtroTriaje.value) {
    result = result.filter((cita) => cita.Triaje === filtroTriaje.value);
  }

  // Aplicar filtro de Estado
  if (filtroEstado.value) {
    result = result.filter((cita) => cita.Estado === filtroEstado.value);
  }

  // Aplicar ordenamiento
  if (sortConfig.value.key) {
    result.sort((a, b) => {
      let valueA = a[sortConfig.value.key];
      let valueB = b[sortConfig.value.key];

      // Manejar valores nulos o undefined
      if (valueA === null || valueA === undefined) valueA = "";
      if (valueB === null || valueB === undefined) valueB = "";

      // Convertir a números para fechas en formato DD/MM/YYYY
      if (sortConfig.value.key === "FechaCita") {
        // Convertir fechas a objetos Date para comparación correcta
        try {
          if (typeof valueA === "string" && typeof valueB === "string") {
            if (valueA.includes("-") && valueB.includes("-")) {
              // Formato YYYY-MM-DD
              const dateA = new Date(valueA);
              const dateB = new Date(valueB);
              valueA = dateA.getTime();
              valueB = dateB.getTime();
            } else {
              // Formato MM/DD/YYYY
              const partsA = valueA.split("/");
              const partsB = valueB.split("/");
              const dateA = new Date(partsA[2], partsA[0] - 1, partsA[1]);
              const dateB = new Date(partsB[2], partsB[0] - 1, partsB[1]);
              valueA = dateA.getTime();
              valueB = dateB.getTime();
            }
          }
        } catch (error) {
          console.error("Error al comparar fechas:", error);
          // Continuar con comparación de strings si hay error
        }
      }

      // Comparar según tipo de datos
      let comparison = 0;
      if (typeof valueA === "number" && typeof valueB === "number") {
        comparison = valueA - valueB;
      } else {
        comparison = String(valueA).localeCompare(String(valueB));
      }

      // Aplicar dirección de ordenamiento
      return sortConfig.value.direction === "asc" ? comparison : -comparison;
    });
  }

  return result;
});

/**
 * Función para determinar la clase CSS según el estado del triaje
 */
const getTriajeClass = (triaje, elemento = "badge") => {
  // Asegurar que triaje sea un string antes de llamar a toLowerCase
  const triajeStr =
    typeof triaje === "string"
      ? triaje.toLowerCase()
      : String(triaje).toLowerCase();

  switch (triajeStr) {
    case "completado":
      // Para el badge
      if (elemento === "badge") return "bg-green-100 text-green-700";
      // Para los íconos
      if (elemento === "icono") return "fa-solid fa-circle-check";
      return "bg-green-100 text-green-800";

    case "pendiente":
    default:
      // Para el badge
      if (elemento === "badge") return "bg-yellow-100 text-yellow-600";
      // Para los íconos
      if (elemento === "icono") return "fa-solid fa-hourglass-half";
      return "bg-yellow-100 text-yellow-800";

    case "no aplica":
      // Para el badge
      if (elemento === "badge") return "bg-gray-100 text-gray-600";
      // Para los íconos
      if (elemento === "icono") return "fa-solid fa-circle-minus  ";
      return "bg-blue-100 text-blue-800";
  }
};

/**
 * Función para determinar la clase CSS según el estado de la cita
 * Ahora también considera el estado del triaje
 */
const getEstadoClass = (estado, triaje) => {
  const estadoLower = estado?.toLowerCase();
  const triajeLower = triaje?.toLowerCase();

  if (estadoLower === "separada") {
    if (triajeLower === "completado") {
      return "bg-blue-100 text-blue-700";
    } else if (triajeLower === "no aplica") {
      return "bg-blue-100 text-blue-700";
    } else {
      return "bg-yellow-100 text-yellow-600";
    }
  }

  if (estadoLower === "atendido") {
    if (triajeLower === "completado") {
      return "bg-green-100 text-green-700";
    } else if (triajeLower === "pendiente") {
      return "bg-yellow-100 text-yellow-600";
    }
    if (triajeLower === "no aplica") {
      return "bg-green-100 text-green-700";
    }
  }

  return "bg-red-100 text-red-700";
};

/**
 * Obtener texto para el contador de resultados
 */
const getCountLabel = (count) => {
  return count === 1 ? "cita" : "citas";
};

/**
 * Manejar cambio de ordenamiento
 */
const handleSort = (sort) => {
  sortConfig.value = sort;
  emit("sort", sort);
};
</script>
