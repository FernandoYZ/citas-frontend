<!-- pages/citas.vue -->
<template>
  <div class="max-w-8xl mx-auto px-4 py-4">
    <!-- Título y estadísticas -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row justify-between items-start mb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            Gestión de Citas Médicas
          </h1>
          <p class="text-gray-600 mt-1">
            Administración y seguimiento de citas Estrategia
          </p>
        </div>
      </div>

      <!-- Componente de resumen de estadísticas - Actualizando con eventos -->
      <div class="relative">
        <CitaResumenEstadisticas
          ref="resumenRef"
          @filtro-actualizado="aplicarFiltrosEstadisticas"
        />
      </div>
    </div>

    <!-- Componente de registro de citas - solo visible con permiso -->
    <CitaRegister
      v-if="canRegisterAppointments"
      @cita-creada="handleNuevaCita"
    />

    <!-- Contenido principal -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden mt-4">
      <!-- Mensaje de error -->
      <div v-if="error" class="p-8 text-center">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4"
        >
          <i class="fas fa-exclamation-triangle text-2xl" />
        </div>
        <h2 class="text-lg font-medium text-gray-900 mb-2">
          Error al cargar datos
        </h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="cargarCitas()"
        >
          Reintentar
        </button>
      </div>

      <!-- Lista de citas -->
      <div v-else>
        <transition name="fade" mode="out-in">
          <CitaList
            v-model:rows-per-page="rowsPerPage"
            v-model:current-page="currentPage"
            :fecha-inicio-seleccionada="rangoFechas.fechaInicio"
            :fecha-fin-seleccionada="rangoFechas.fechaFin"
            :citas="citasFiltradas"
            :is-loading="isLoading"
            :can-perform-triage="canPerformTriage"
            :can-register-medical-attention="canRegisterMedicalAttention"
            @view="viewCita"
            @triaje="registrarTriaje"
            @atencion="atenderCita"
            @preload-details="preloadCitaDetails"
            @reload-data="cargarCitas"
            @filter-date-range="handleDateRangeFilter"
          />
        </transition>
      </div>
    </div>

    <!-- Modales -->
    <CitaVerModal
      v-if="modales.verCita.visible"
      v-model:visible="modales.verCita.visible"
      :cita="modales.verCita.cita"
    />

    <CitaTriajeModal
      v-if="modales.triaje.visible"
      v-model:visible="modales.triaje.visible"
      :cita="modales.triaje.cita"
      @triaje-guardado="onTriajeGuardado"
    />

    <CitaAtencionModal
      v-if="modales.atencion.visible"
      v-model:visible="modales.atencion.visible"
      :cita="modales.atencion.cita"
      :detalles-cita="detallesCitaActual"
      :detalles-cargados="detallesCargados"
      @atencion-registrada="onAtencionRegistrada"
      @consulta-guardada="onAtencionRegistrada"
      @reload-citas="onReloadCitas"
      @close="cerrarModalAtencion"
    />
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  computed,
} from "vue";
import { useCitas } from "~/composables/useCitas";
import { useNotification } from "~/composables/useNotification";
import { usePermissions } from "~/composables/usePermissions";

// Referencia al componente de resumen para actualizaciones manuales
const resumenRef = ref(null);

// Usar composable de permisos
const {
  canPerformTriage,
  canRegisterAppointments,
  canRegisterMedicalAttention,
  recalcularPermisos,
} = usePermissions();

// Usar composable de citas
const {
  citas,
  isLoading,
  error,
  fetchCitas,
  refreshSilently,
  loadCitaDetails,
  startPolling,
  stopPolling,
  agregarCita,
  actualizarCita,
  getFechaActual,
  currentPollingDateRange,
} = useCitas();

// Estado para paginación
const currentPage = ref(1);
const rowsPerPage = ref(10);

// Estado para rango de fechas
const rangoFechas = reactive({
  fechaInicio: getFechaActual(),
  fechaFin: getFechaActual(),
});

// Estado para filtros de estadísticas
const filtrosEstadisticas = ref({
  mostrarTodasCitas: true,
  estados: {
    pendiente: false,
    atendido: false,
  },
  triaje: {
    pendiente: false,
    completado: false,
    noAplica: false,
  },
});

// Citas filtradas según los criterios de las estadísticas
const citasFiltradas = computed(() => {
  // Si se muestra todas las citas, retornamos el array completo
  if (filtrosEstadisticas.value.mostrarTodasCitas) {
    return citas.value;
  }

  // Aplicar filtros por estado y triaje
  return citas.value.filter((cita) => {
    // Filtro por estado
    const estadoMatch =
      (filtrosEstadisticas.value.estados.pendiente &&
        cita.Estado?.toLowerCase() === "pendiente") ||
      (filtrosEstadisticas.value.estados.atendido &&
        cita.Estado?.toLowerCase() === "atendido") ||
      // Si no hay filtros de estado, considerar como match
      (!filtrosEstadisticas.value.estados.pendiente &&
        !filtrosEstadisticas.value.estados.atendido);

    // Filtro por triaje
    const triajeMatch =
      (filtrosEstadisticas.value.triaje.pendiente &&
        cita.Triaje?.toLowerCase() === "pendiente") ||
      (filtrosEstadisticas.value.triaje.completado &&
        cita.Triaje?.toLowerCase() === "completado") ||
      (filtrosEstadisticas.value.triaje.noAplica &&
        cita.Triaje?.toLowerCase() === "no aplica") ||
      // Si no hay filtros de triaje, considerar como match
      (!filtrosEstadisticas.value.triaje.pendiente &&
        !filtrosEstadisticas.value.triaje.completado &&
        !filtrosEstadisticas.value.triaje.noAplica);

    // Mostrar si hay match tanto en estado como en triaje
    return estadoMatch && triajeMatch;
  });
});

console.log("=== DEBUG PERMISOS ===");
console.log("canRegisterAppointments:", canRegisterAppointments.value);
console.log("canPerformTriage:", canPerformTriage.value);
console.log("canRegisterMedicalAttention:", canRegisterMedicalAttention.value);

// Composable de notificaciones
const notification = useNotification();

// Estado para almacenar en caché los detalles precargados
const citasDetallesCache = ref({});
const detallesCitaActual = ref(null);
const detallesCargados = ref(false);

// Estado de modales
const modales = reactive({
  verCita: {
    visible: false,
    cita: {},
  },
  triaje: {
    visible: false,
    cita: {},
  },
  atencion: {
    visible: false,
    cita: {},
  },
});

// Función para aplicar filtros desde las estadísticas
const aplicarFiltrosEstadisticas = (filtros) => {
  console.log("Aplicando filtros:", filtros);

  // Actualizar el estado de filtros
  filtrosEstadisticas.value = filtros;

  // Resetear paginación al cambiar filtros
  currentPage.value = 1;

  // Mostrar notificación sobre el filtro aplicado
  // let mensajeFiltro = '';

  // if (filtros.mostrarTodasCitas) {
  //   mensajeFiltro = 'Mostrando todas las citas';
  // } else {
  //   const criterios = [];

  //   if (filtros.estados.pendiente) criterios.push('pendientes');
  //   if (filtros.estados.atendido) criterios.push('atendidas');

  //   if (filtros.triaje.pendiente) criterios.push('triaje pendiente');
  //   if (filtros.triaje.completado) criterios.push('triaje completado');
  //   if (filtros.triaje.noAplica) criterios.push('sin triaje');

  //   mensajeFiltro = `Mostrando citas: ${criterios.join(', ')}`;
  // }

  // notification.show({
  //   type: 'info',
  //   title: 'Filtro aplicado',
  //   message: mensajeFiltro,
  //   duration: 3000
  // });
};

// Actualizar silenciosamente las estadísticas
const actualizarEstadisticasSilenciosamente = async () => {
  if (resumenRef.value && resumenRef.value.actualizarSilenciosamente) {
    try {
      await resumenRef.value.actualizarSilenciosamente();
    } catch (error) {
      console.error("Error al actualizar estadísticas silenciosamente:", error);
    }
  }
};

// Nuevo método para precargar detalles de citas que estarán visibles
const preloadCitaDetails = async (idAtencion, idPaciente) => {
  const cacheKey = `cita_${idAtencion}_${idPaciente}`;

  // Evitar cargar si ya está en caché o si está cargando
  if (citasDetallesCache.value[cacheKey]) {
    console.log(`[preloadCitaDetails] Ya en caché: ${cacheKey}`);
    return;
  }

  try {
    console.log(
      `[preloadCitaDetails] Cargando detalles en segundo plano: ${cacheKey}`
    );
    const detalles = await loadCitaDetails(idAtencion, idPaciente);

    // Guardar en caché
    citasDetallesCache.value[cacheKey] = {
      data: detalles,
      timestamp: Date.now(),
    };

    console.log(
      `[preloadCitaDetails] Detalles cargados y en caché: ${cacheKey}`
    );
  } catch (err) {
    console.error(
      `[preloadCitaDetails] Error al precargar detalles: ${cacheKey}`,
      err
    );
  }
};

// Cerrar modal de atención y limpiar estado
const cerrarModalAtencion = () => {
  modales.atencion.visible = false;
  modales.atencion.cita = {};
  detallesCitaActual.value = null;
  detallesCargados.value = false;
};

// IMPORTANTE: Establecer un watcher para mantener sincronizada la fecha de polling
watch(currentPollingDateRange, (newRange) => {
  if (
    newRange.fechaInicio &&
    newRange.fechaInicio !== rangoFechas.fechaInicio
  ) {
    console.log(
      "[watch] currentPollingDateRange.fechaInicio cambió a:",
      newRange.fechaInicio
    );
    rangoFechas.fechaInicio = newRange.fechaInicio;
  }
  if (newRange.fechaFin && newRange.fechaFin !== rangoFechas.fechaFin) {
    console.log(
      "[watch] currentPollingDateRange.fechaFin cambió a:",
      newRange.fechaFin
    );
    rangoFechas.fechaFin = newRange.fechaFin;
  }
});

// Manejar el cambio de rango de fechas
const handleDateRangeFilter = async ({ fechaInicio, fechaFin, resetPage }) => {
  console.log(
    "[handleDateRangeFilter] Filtro por rango de fechas:",
    fechaInicio,
    "a",
    fechaFin
  );

  if (!fechaInicio) {
    console.error(
      "[handleDateRangeFilter] Se recibió una fecha de inicio vacía"
    );
    return;
  }

  // Si se solicita resetear la paginación
  if (resetPage) {
    currentPage.value = 1;
  }

  // Actualizar el rango de fechas
  rangoFechas.fechaInicio = fechaInicio;
  rangoFechas.fechaFin = fechaFin || fechaInicio;

  // Detener polling y cargar datos con el nuevo rango
  stopPolling();

  try {
    await cargarCitas(fechaInicio, fechaFin);
  } catch (err) {
    console.error("[handleDateRangeFilter] Error:", err);
  }
};

// Cargar datos de citas con rango de fechas específico
const cargarCitas = async (fechaInicio, fechaFin) => {
  try {
    // Usar fechas proporcionadas o las del rango actual
    const fechaInicioConsulta = fechaInicio || rangoFechas.fechaInicio;
    const fechaFinConsulta = fechaFin || rangoFechas.fechaFin;

    console.log(
      "[cargarCitas] Cargando citas para rango:",
      fechaInicioConsulta,
      "a",
      fechaFinConsulta
    );

    isLoading.value = true;
    stopPolling();

    await fetchCitas(fechaInicioConsulta, fechaFinConsulta);

    // Actualizar estadísticas silenciosamente después de cargar nuevas citas
    await nextTick();
    actualizarEstadisticasSilenciosamente();

    if (citas.value.length === 0) {
      notification.show({
        type: "info",
        title: "Información",
        message: `No hay citas programadas para ${formatearFechaParaUsuario(
          fechaInicioConsulta
        )}${
          fechaInicioConsulta !== fechaFinConsulta
            ? ` a ${formatearFechaParaUsuario(fechaFinConsulta)}`
            : ""
        }`,
        duration: 4000,
      });
    }

    // Limpiar caché de detalles al cambiar de fecha
    citasDetallesCache.value = {};

    // Iniciar polling con el rango de fechas consultado
    startPolling(15000, fechaInicioConsulta, fechaFinConsulta);
  } catch (err) {
    notification.show({
      type: "error",
      title: "Error",
      message: error.value || "Error al cargar las citas médicas",
      duration: 5000,
    });
    console.error("[cargarCitas] Error al cargar las citas", err);
  } finally {
    isLoading.value = false;
  }
};

// Función auxiliar para formatear fecha para mostrar al usuario
const formatearFechaParaUsuario = (fechaStr) => {
  if (!fechaStr) return "hoy";

  try {
    // Para formato YYYY-MM-DD
    if (fechaStr.includes("-")) {
      const [year, month, day] = fechaStr.split("-");

      // Verificar si es la fecha actual
      const hoy = getFechaActual();
      if (fechaStr === hoy) return "hoy";

      return `${day}/${month}/${year}`;
    }

    return fechaStr;
  } catch (error) {
    console.error(
      "[formatearFechaParaUsuario] Error al formatear fecha:",
      error
    );
    return fechaStr;
  }
};

// Manejar nueva cita creada desde el componente de registro
const handleNuevaCita = (nuevaCita) => {
  // Solo si la fecha seleccionada es la actual, agregamos la cita al array
  if (
    rangoFechas.fechaInicio === getFechaActual() &&
    rangoFechas.fechaFin === getFechaActual()
  ) {
    agregarCita(nuevaCita);
  }

  // Actualizar silenciosamente con el rango de fechas actual
  refreshSilently(rangoFechas.fechaInicio, rangoFechas.fechaFin);

  // Actualizar estadísticas silenciosamente
  nextTick(() => {
    actualizarEstadisticasSilenciosamente();
  });
};

// Ver detalles de una cita
const viewCita = (cita) => {
  modales.verCita.cita = cita;
  modales.verCita.visible = true;
};

// Registrar triaje
const registrarTriaje = (cita) => {
  modales.triaje.cita = cita;
  modales.triaje.visible = true;
};

// Atender cita - Ahora con carga de detalles bajo demanda
const atenderCita = async (cita) => {
  // Preparar el modal
  modales.atencion.cita = cita;
  detallesCargados.value = false;
  detallesCitaActual.value = null;

  // Mostrar el modal inmediatamente
  modales.atencion.visible = true;

  // Intentar obtener datos de caché primero
  const cacheKey = `cita_${cita.IdAtencion}_${cita.IdPaciente}`;
  const cachedData = citasDetallesCache.value[cacheKey];

  if (cachedData && cachedData.data) {
    console.log(`[atenderCita] Usando datos en caché para: ${cacheKey}`);
    detallesCitaActual.value = cachedData.data;
    detallesCargados.value = true;
    return;
  }

  // Si no hay datos en caché, cargarlos
  try {
    console.log(`[atenderCita] Cargando detalles para: ${cacheKey}`);
    const detalles = await loadCitaDetails(cita.IdAtencion, cita.IdPaciente);

    // Guardar en caché y establecer en estado
    citasDetallesCache.value[cacheKey] = {
      data: detalles,
      timestamp: Date.now(),
    };

    detallesCitaActual.value = detalles;
    detallesCargados.value = true;
  } catch (err) {
    console.error(`[atenderCita] Error al cargar detalles: ${cacheKey}`, err);
    notification.show({
      type: "warning",
      title: "Advertencia",
      message:
        "No se pudieron cargar todos los datos de la cita. Algunos campos pueden estar incompletos.",
      duration: 4000,
    });
  }
};

// Cuando el componente AtencionModal pide recargar datos
const onReloadCitas = () => {
  console.log("[onReloadCitas] Recargar citas solicitado desde AtencionModal");
  refreshSilently(rangoFechas.fechaInicio, rangoFechas.fechaFin);

  // También actualizar las estadísticas silenciosamente
  nextTick(() => {
    actualizarEstadisticasSilenciosamente();
  });
};

// Función para manejar el triaje guardado o actualizado
const onTriajeGuardado = (datosTriaje) => {
  console.log("[onTriajeGuardado] Triaje guardado:", datosTriaje);

  // Primero cerramos el modal
  modales.triaje.visible = false;

  // Timeout para permitir que el DOM se actualice
  setTimeout(() => {
    // Marcar la cita como completada
    const citaActualizada = {
      ...modales.triaje.cita,
      Triaje: "Completado",
    };

    // Actualizar la cita en el estado local
    actualizarCita(citaActualizada);

    // Limpiar la referencia de la cita seleccionada
    modales.triaje.cita = {};

    // Actualizar sin mostrar loading
    refreshSilently(rangoFechas.fechaInicio, rangoFechas.fechaFin)
      .then(() => {
        console.log(
          "[onTriajeGuardado] Datos de citas actualizados desde el servidor"
        );
      })
      .catch((err) => {
        console.error("[onTriajeGuardado] Error al actualizar datos:", err);
      });

    // Actualizar estadísticas silenciosamente
    actualizarEstadisticasSilenciosamente();
  }, 100);
};

// Cuando se registra la atención
const onAtencionRegistrada = (citaAtendida) => {
  console.log("[onAtencionRegistrada] Atención registrada:", citaAtendida);

  // Actualizar la cita local con el nuevo estado
  actualizarCita({
    ...citaAtendida,
    Estado: "Atendido",
  });

  // Cerrar el modal
  cerrarModalAtencion();

  // Limpiar la entrada de caché para esta cita
  const cacheKey = `cita_${citaAtendida.IdAtencion}_${citaAtendida.IdPaciente}`;
  if (citasDetallesCache.value[cacheKey]) {
    citasDetallesCache.value = {
      ...citasDetallesCache.value,
      [cacheKey]: undefined,
    };
  }

  // Actualizar silenciosamente
  refreshSilently(rangoFechas.fechaInicio, rangoFechas.fechaFin);

  // Actualizar estadísticas silenciosamente
  nextTick(() => {
    actualizarEstadisticasSilenciosamente();
  });
};

// Función para limpiar caché antigua
const limpiarCacheAntigua = () => {
  const ahora = Date.now();
  const tiempoMaximo = 30 * 60 * 1000; // 30 minutos en milisegundos
  
  Object.keys(citasDetallesCache.value).forEach(key => {
    const entrada = citasDetallesCache.value[key];
    if (entrada && (ahora - entrada.timestamp) > tiempoMaximo) {
      citasDetallesCache.value = {
      ...citasDetallesCache.value,
      [key]: undefined
};
      console.log(`[limpiarCacheAntigua] Eliminada entrada antigua: ${key}`);
    }
  });
};

// Referencia a los intervalos de polling para estadísticas
let pollingEstadisticasInterval = null;

// Iniciar polling de estadísticas separado
const iniciarPollingEstadisticas = () => {
  // Limpiar intervalo existente si hay
  if (pollingEstadisticasInterval) {
    clearInterval(pollingEstadisticasInterval);
  }

  // Crear nuevo intervalo - cada 15 segundos
  pollingEstadisticasInterval = setInterval(() => {
    if (!document.hidden) {
      actualizarEstadisticasSilenciosamente();
    }
  }, 15 * 1000);
};

// Detener polling de estadísticas
const detenerPollingEstadisticas = () => {
  if (pollingEstadisticasInterval) {
    clearInterval(pollingEstadisticasInterval);
    pollingEstadisticasInterval = null;
  }
};

// Cargar datos al montar el componente y configurar polling
onMounted(async () => {
  console.log("[onMounted] Verificando permisos primero");

  // Recalcular permisos explícitamente al montar el componente
  recalcularPermisos();

  // Escuchar evento global de cambio de permisos
  window.addEventListener("permissions-updated", onPermissionsUpdated);

  console.log("[onMounted] Cargando citas iniciales");
  // Inicialmente cargar solo el día actual
  const fechaHoy = getFechaActual();
  rangoFechas.fechaInicio = fechaHoy;
  rangoFechas.fechaFin = fechaHoy;

  await cargarCitas(fechaHoy, fechaHoy);

  // Iniciar polling de estadísticas
  iniciarPollingEstadisticas();

  // Configurar limpieza periódica de caché
  setInterval(limpiarCacheAntigua, 5 * 60 * 1000); // Cada 5 minutos
});

// Detener polling cuando se desmonta el componente
onUnmounted(() => {
  window.removeEventListener("permissions-updated", onPermissionsUpdated);
  console.log("[onUnmounted] Limpiando recursos");
  stopPolling();
  detenerPollingEstadisticas();
});

// Función para manejar actualización de permisos
const onPermissionsUpdated = () => {
  console.log(
    "Se detectó actualización de permisos, refrescando componente..."
  );

  // Forzar actualización de componentes que dependen de permisos
  nextTick(() => {
    // Puedes agregar lógica adicional aquí si es necesario
  });
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
