<!-- components/Cita/List.vue -->
<template>
  <div class="w-full overflow-hidden">
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
      :search-placeholder="'Buscar por paciente, médico o DNI...'"
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
      class="w-full"
      @sort="handleSort"
      @search="searchTerm = $event"
      @update:current-page="(page) => emit('update:currentPage', page)"
      @update:rows-per-page="(size) => emit('update:rowsPerPage', size)"
      @export="handleExport"
      @refresh="refrescarDatos"
    >
      <!-- Acciones en la cabecera de la tabla -->
      <template #headerActions>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Filtro de fechas con diseño mejorado -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Toggle para modo rango con mejor diseño -->
            <div class="relative inline-flex items-center">
              <label class="inline-flex items-center cursor-pointer">
                <input
                  v-model="modoRango"
                  type="checkbox"
                  class="sr-only peer"
                  @change="toggleModoRango"
                >
                <div
                  class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                />
                <span class="ml-2 text-sm font-medium text-gray-600"
                  >Rango</span
                >
              </label>
            </div>

            <!-- Fecha inicio (visible solo si modo rango está activo) -->
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-calendar-alt text-blue-500"
                  :class="{ 'text-gray-400': !modoRango }"
                />
              </div>
              <input
                v-model="fechaSeleccionada"
                type="date"
                class="pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                :disabled="!modoRango"
                :class="{ 'bg-gray-100 text-gray-400': !modoRango }"
              >
            </div>

            <!-- Separador visual (solo visible en modo rango) -->
            <div class="text-gray-500 flex items-center">
              <span class="text-sm">a</span>
            </div>

            <!-- Fecha fin (siempre visible) -->
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-calendar-alt text-blue-500" />
              </div>
              <input
                v-model="fechaFin"
                type="date"
                class="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :min="fechaSeleccionada"
                :aria-label="modoRango ? 'Fecha final' : 'Fecha'"
              >
            </div>

            <!-- Grupo de botones con diseño unificado -->
            <div class="flex gap-1">
              <!-- Botón filtrar -->
              <button
                class="px-3 py-2 rounded-lg text-sm flex items-center bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
                @click="aplicarFiltroFechas"
              >
                <i class="fas fa-filter mr-1.5" />
                <span>Buscar</span>
              </button>

              <!-- Botón HOY -->
              <button
                class="px-3 py-2 rounded-lg text-sm flex items-center bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
                title="Ver citas de hoy"
                @click="cambiarFechaHoy"
              >
                <i class="fas fa-calendar-day mr-1.5" />
                <span>Ver hoy</span>
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Personalización de filas -->
      <template #row="{ item }">
        <template v-if="isLoading">
          <!-- Skeleton loader para filas -->
          <CommonTableRowSkeleton
            v-for="i in 5"
            :key="i"
            :show-actions="isUserDoctor"
          />
        </template>
        <template v-else>
          <tr
            class="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100"
          >
            <!-- ID Atención -->
            <td class="px-4 py-3 whitespace-nowrap w-[8%]">
              <div class="flex items-center gap-2">
                <div
                  class="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600"
                >
                  <i class="fas fa-clipboard-list text-md" />
                </div>
                <div class="text-sm font-medium text-blue-700">
                  {{ item.IdAtencion || "-" }}
                </div>
              </div>
            </td>

            <!-- Fecha y Hora -->
            <td class="px-4 py-3 whitespace-nowrap w-[12%]">
              <div class="flex flex-col items-start">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatHora(item.HoraInicio) }} -
                  {{
                    formatHora(item.HoraFin || calcularHoraFin(item.HoraInicio))
                  }}
                </div>
                <div class="text-xs text-gray-500 flex items-center">
                  <i class="far fa-calendar-alt mr-1 text-gray-400" />
                  <span class="capitalize line-clamp-1">{{
                    formatearFechaCorto(item.FechaCita)
                  }}</span>
                </div>
              </div>
            </td>

            <!-- Nombre y Apellidos del paciente -->
            <td class="px-4 py-3 w-[18%]">
              <div class="flex items-center text-sm capitalize">
                <div class="w-full">
                  <div
                    class="font-medium text-gray-900"
                    :class="{
                      'whitespace-normal': item.ApellidosPaciente?.length > 15,
                      truncate: item.ApellidosPaciente?.length <= 15,
                    }"
                  >
                    {{ item.ApellidosPaciente }}
                  </div>
                  <div
                    class="text-gray-500"
                    :class="{
                      'whitespace-normal': item.NombresPaciente?.length > 15,
                      truncate: item.NombresPaciente?.length <= 15,
                    }"
                  >
                    {{ item.NombresPaciente }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Edad del Paciente -->
            <!-- <td class="px-4 py-3 whitespace-nowrap w-[5%]">
              <div class="text-sm lowercase text-gray-700">
                {{ item.Edad }} años
              </div>
            </td>
            -->

            <!-- DNI del Paciente -->
            <td class="px-4 py-3 whitespace-nowrap w-[10%]">
              <div class="text-sm font-semibold text-gray-700">
                {{ item.NroDocumento }}
              </div>
            </td>

            <!-- Servicio - Oculto en móviles, visible desde tabla compacta en adelante -->
            <td class="px-4 py-3 hidden sm:table-cell w-[15%]">
              <div
                class="text-sm text-gray-800 break-words capitalize"
                :class="{
                  'whitespace-normal': item.Servicio?.length > 15,
                  truncate: item.Servicio?.length <= 15,
                }"
              >
                {{ item.Servicio }}
              </div>
            </td>

            <!-- Médico - Oculto en móviles, visible en tablets y escritorio -->
            <td class="px-4 py-3 hidden md:table-cell w-[18%] capitalize">
              <div
                class="text-sm font-medium text-gray-800"
                :class="{
                  'whitespace-normal': item.NombreDoctor?.length > 15,
                  truncate: item.NombreDoctor?.length <= 15,
                }"
              >
                {{ item.NombreDoctor }}
              </div>
              <div
                class="text-xs text-gray-500"
                :class="{
                  'whitespace-normal': item.ApellidoDoctor?.length > 15,
                  truncate: item.ApellidoDoctor?.length <= 15,
                }"
              >
                {{ item.ApellidoDoctor }}
              </div>
            </td>

            <!-- Columna de Triaje -->
            <td class="py-3 whitespace-nowrap w-[10%]">
              <div class="flex items-center">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getTriajeClass(item.Triaje)"
                >
                  <i
                    class="mr-1 text-xs"
                    :class="getTriajeClass(item.Triaje, 'icono')"
                  />
                  <span>{{ item.Triaje }}</span>
                </span>
              </div>
            </td>

            <!-- Estado de la cita -->
            <td class="py-3 whitespace-nowrap w-[7%]">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="getEstadoClass(item.Estado, item.Triaje)"
              >
                <i
                  :class="getEstadoIconClass(item.Estado)"
                  class="mr-1 text-xs"
                />
                {{ item.Estado }}
              </span>
            </td>

            <!-- Acciones -->
            <td class="px-4 py-3 text-right w-[8%]">
              <div class="flex space-x-1 justify-end">
                <!-- Botón Registrar Triaje - solo si tiene permiso -->
                <button
                  v-if="canPerformTriage"
                  class="h-8 flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300"
                  :class="[
                    item.Triaje === 'Completado'
                      ? 'px-2 bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
                      : 'px-2 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100',
                  ]"
                  title="Registrar Triaje"
                  @click="$emit('triaje', item)"
                >
                  <i class="mr-1 fa-solid fa-file-medical" />
                  <span class="text-xs font-medium whitespace-nowrap">
                    Triaje
                  </span>
                </button>

                <!-- Botón Atender Cita - solo si tiene permiso -->
                <button
                  v-if="canRegisterMedicalAttention"
                  class="h-8 px-2 flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1"
                  :class="[
                    item.Triaje !== 'Pendiente'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 focus:ring-blue-300'
                      : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed',
                    item.Estado === 'Atendido'
                      ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 focus:ring-green-300' : ''
                  ]"
                  title="Atender Cita"
                  :disabled="item.Triaje === 'Pendiente'"
                  @click="$emit('atencion', item)"
                >
                  <i class="fa-solid fa-stethoscope mr-1" />
                  <span class="text-xs font-medium">Atender</span>
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
import { getCurrentDate } from "~/composables/getCurrentDate";

// Obtener la fecha actual en formato YYYY-MM-DD
function obtenerFechaActual() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Variable para controlar el estado de carga
const showExportMenu = ref(false);
const exportMenuRef = ref(null);

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
  isLoading: {
    type: Boolean,
    default: false,
  },
  fechaInicioSeleccionada: {
    type: String,
    default: getCurrentDate(),
  },
  fechaFinSeleccionada: {
    type: String,
    default: getCurrentDate(),
  },
  isUserDoctor: {
    type: Boolean,
    default: false,
  },
  canPerformTriage: {
    type: Boolean,
    default: false,
  },
  canRegisterMedicalAttention: {
    type: Boolean,
    default: false,
  },
});

// Estado para UI visualmente estable
const modoRango = ref(false);
const fechaSeleccionada = ref(
  props.fechaInicioSeleccionada || obtenerFechaActual()
);
const fechaFin = ref(props.fechaFinSeleccionada || obtenerFechaActual());

// Escuchar cambios en las props para mantener sincronizado
watch(
  () => props.fechaInicioSeleccionada,
  (newDate) => {
    if (newDate && newDate !== fechaSeleccionada.value) {
      fechaSeleccionada.value = newDate;
    }
  },
  { immediate: true }
);

watch(
  () => props.fechaFinSeleccionada,
  (newDate) => {
    if (newDate && newDate !== fechaFin.value) {
      fechaFin.value = newDate;
    }
  },
  { immediate: true }
);

// Si fechaInicio y fechaFin son diferentes, activar modo rango
watch(
  [() => props.fechaInicioSeleccionada, () => props.fechaFinSeleccionada],
  ([inicio, fin]) => {
    if (inicio && fin && inicio !== fin) {
      modoRango.value = true;
    }
  },
  { immediate: true }
);

// Asegurar que fechaFin siempre sea >= fechaSeleccionada
watch(fechaSeleccionada, (newFecha) => {
  if (newFecha > fechaFin.value) {
    fechaFin.value = newFecha;
  }
});

const emit = defineEmits([
  "view",
  "triaje",
  "atencion",
  "search",
  "sort",
  "update:currentPage",
  "update:rowsPerPage",
  "filter-date-range",
  "reload-data",
  "preload-details",
]);

// Estado local
const searchTerm = ref("");
const sortConfig = ref({
  key: "IdAtencion",
  direction: "desc",
});

// Toggle función para modo rango
function toggleModoRango() {
  if (!modoRango.value) {
    // Si activamos modo rango, la fecha seleccionada debe ser igual o anterior a la fecha fin
    if (fechaSeleccionada.value > fechaFin.value) {
      fechaSeleccionada.value = fechaFin.value;
    }
  }
}

// Aplicar filtro de fechas (ya sea un día o rango)
function aplicarFiltroFechas() {
  if (modoRango.value) {
    console.log(
      `Aplicando filtro por rango: ${fechaSeleccionada.value} a ${fechaFin.value}`
    );

    // Asegurar que fechaFin no sea anterior a fechaSeleccionada
    if (fechaFin.value < fechaSeleccionada.value) {
      fechaFin.value = fechaSeleccionada.value;
    }

    emit("filter-date-range", {
      fechaInicio: fechaSeleccionada.value,
      fechaFin: fechaFin.value,
      resetPage: true,
    });
  } else {
    // En modo día único, usar la misma fecha para inicio y fin (la fecha fin)
    console.log(`Aplicando filtro para un día: ${fechaFin.value}`);
    emit("filter-date-range", {
      fechaInicio: fechaFin.value,
      fechaFin: fechaFin.value,
      resetPage: true,
    });
  }
}

// Función para volver a la fecha actual y reiniciar paginación
function cambiarFechaHoy() {
  const fechaHoy = obtenerFechaActual();
  fechaSeleccionada.value = fechaHoy;
  fechaFin.value = fechaHoy;
  modoRango.value = false; // Desactivar modo rango al ir a HOY

  console.log("Cambiando a fecha HOY y reseteando paginación");
  emit("filter-date-range", {
    fechaInicio: fechaHoy,
    fechaFin: fechaHoy,
    resetPage: true, // Indicar que debe resetear la paginación
  });
}

async function refrescarDatos() {
  // Si estamos en modo rango, usamos ambas fechas
  if (modoRango.value) {
    emit("reload-data", {
      fechaInicio: fechaSeleccionada.value,
      fechaFin: fechaFin.value,
    });
  } else {
    // Si no, usamos la misma fecha para inicio y fin (la fecha fin)
    emit("reload-data", {
      fechaInicio: fechaFin.value,
      fechaFin: fechaFin.value,
    });
  }
}

// Definición de columnas con valores de ancho proporcionales ajustados (sin columna de edad)
const columns = [
  { key: "IdAtencion", label: "N° Cuenta", sortable: true, width: "8%" },
  { key: "FechaCita", label: "Fecha y Hora", sortable: true, width: "12%" },
  { key: "ApellidosPaciente", label: "Paciente", sortable: true, width: "18%" },
  // { key: "Edad", label: "Edad", sortable: false, width: "5%" }, // Comentado para ahorrar espacio
  { key: "NroDocumento", label: "DNI", sortable: true, width: "10%" },
  {
    key: "Servicio",
    label: "Servicio",
    responsive: true,
    sortable: true,
    width: "15%",
    hideOnMobile: true,
  },
  {
    key: "NombreDoctor",
    label: "Médico",
    responsive: true,
    sortable: true,
    width: "18%",
    hideOnTablet: true,
  },
  { key: "Triaje", label: "Triaje", sortable: true, width: "10%" },
  { key: "Estado", label: "Estado", sortable: false, width: "7%" },
  { key: "acciones", label: "", sortable: false, width: "10%" },
];

// Formatear fecha para nombre de archivo
function formatFechaForFilename() {
  // Si estamos en modo rango y las fechas son diferentes
  if (modoRango.value && fechaSeleccionada.value !== fechaFin.value) {
    return `${fechaSeleccionada.value.replace(
      /-/g,
      ""
    )}_${fechaFin.value.replace(/-/g, "")}`;
  }
  // Si es una sola fecha, usar sólo esa
  return fechaFin.value.replace(/-/g, "");
}

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
});

function handleOutsideClick(e) {
  if (exportMenuRef.value && !exportMenuRef.value.contains(e.target)) {
    showExportMenu.value = false;
  }
}

// Manejar exportación
function handleExport(data) {
  console.log("Exportando en formato:", data.format);
  // El manejo actual en el CommonTable ya lo procesa
}

// Filtrar columnas según diseño responsive
const filteredColumns = computed(() => {
  return columns;
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

// Formatear hora para mostrar en formato 12h
const formatHora = (hora) => {
  if (!hora) return "";

  try {
    // Si ya tiene formato AM/PM, devolverlo
    if (hora.includes("AM") || hora.includes("PM")) return hora;

    const [hours, minutes] = hora.split(":");
    const h = parseInt(hours);

    return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${minutes} ${
      h >= 12 ? "PM" : "AM"
    }`;
  } catch (error) {
    console.error("Error al formatear hora:", error);
    return hora;
  }
};

// Formatear fecha a formato corto (para espacio limitado)
const formatearFechaCorto = (fechaStr) => {
  if (!fechaStr) return "";

  try {
    // Determinar si estamos filtrando por un rango mayor a 30 días
    const mostrarAño =
      modoRango.value &&
      fechaSeleccionada.value &&
      fechaFin.value &&
      new Date(fechaFin.value) - new Date(fechaSeleccionada.value) >
        30 * 24 * 60 * 60 * 1000;

    // Asumiendo formato YYYY-MM-DD
    if (fechaStr.includes("-")) {
      const [year, month, day] = fechaStr.split("-");
      const fecha = new Date(year, month - 1, day);

      // Opciones de formato: incluir año si es un rango amplio
      const options = {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: 'numeric',
      };
      return fecha.toLocaleDateString("es-ES", options);
    }

    // Para formato MM/DD/YYYY
    const partes = fechaStr.split("/");
    if (partes.length === 3) {
      // Convertir a objeto Date
      const fecha = new Date(partes[2], partes[0] - 1, partes[1]);

      // Opciones de formato: incluir año si es un rango amplio
      const options = {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: mostrarAño ? "numeric" : undefined,
      };
      return fecha.toLocaleDateString("es-ES", options);
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
      if (elemento === "icono") return "fas fa-check-circle";
      return "bg-green-100 text-green-800";

    case "pendiente":
    default:
      // Para el badge
      if (elemento === "badge") return "bg-yellow-100 text-yellow-600";
      // Para los íconos
      if (elemento === "icono") return "fas fa-hourglass-half";
      return "bg-yellow-100 text-yellow-800";

    case "no aplica":
      // Para el badge
      if (elemento === "badge") return "bg-gray-100 text-gray-600";
      // Para los íconos
      if (elemento === "icono") return "fas fa-minus-circle";
      return "bg-blue-100 text-blue-800";
  }
};

// Obtener icono según estado
const getEstadoIconClass = (estado) => {
  const estadoLower = estado?.toLowerCase();

  switch (estadoLower) {
    case "separada":
      return "fas fa-calendar-check";
    case "atendido":
      return "fas fa-check-circle";
    case "pendiente":
      return "fas fa-hourglass-half";
    default:
      return "fas fa-dot-circle";
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

  return "bg-yellow-100 text-yellow-700";
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

// Configurar carga perezosa para rendimiento optimizado
const setupLazyLoading = () => {
  // Usar IntersectionObserver para detectar cuándo las filas están visibles
  if ("IntersectionObserver" in window) {
    // Crear un observador después de que el componente se monte
    setTimeout(() => {
      const tableRows = document.querySelectorAll("tr[data-id]");

      if (tableRows.length === 0) return;

      const options = {
        root: null,
        rootMargin: "200px", // Cargar un poco antes de que sean visibles
        threshold: 0.1,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const row = entry.target;
            const idAtencion = row.getAttribute("data-id");
            const idPaciente = row.getAttribute("data-patient");

            // Solo si tenemos ambos IDs
            if (idAtencion && idPaciente) {
              // Precargar detalles cuando la fila sea visible
              // pero solo si está en el estado adecuado
              const estado = row.getAttribute("data-state");
              const triaje = row.getAttribute("data-triaje");

              if (
                (estado === "Pendiente" && triaje === "Completado") ||
                triaje === "No aplica"
              ) {
                // Emitir evento de precarga sin bloquear la UI
                emit("preload-details", Number(idAtencion), Number(idPaciente));
              }
            }

            // Dejar de observar una vez procesado
            observer.unobserve(entry.target);
          }
        });
      }, options);

      // Registrar cada fila con el observador
      tableRows.forEach((row) => {
        observer.observe(row);
      });
    }, 500); // Pequeño retraso para asegurar que el DOM esté renderizado
  }
};

// Inicializar al montar el componente
onMounted(() => {
  // Configurar lazy loading
  setupLazyLoading();
});

// Limpieza al desmontar
onUnmounted(() => {
  // Cualquier limpieza necesaria
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Mejoras de estilos para enfoque */
input:focus:not(.error),
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

input:focus.error {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
}

/* Estilo para truncar textos largos */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1; /* propiedad estándar para futuro soporte */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2; /* propiedad estándar para futuro soporte */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
