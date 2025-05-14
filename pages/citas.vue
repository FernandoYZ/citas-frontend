<!-- pages/citas.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 py-4">
    <!-- Título de la página -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestión de Citas Médicas</h1>
      <p class="text-gray-600 mt-1">Administración y seguimiento de citas Estrategia</p>
    </div>
  
    <!-- Componente de registro de citas - solo visible para médicos -->
    <CitaRegister v-if="isUserDoctor" @cita-creada="handleNuevaCita" />
    
    <!-- Contenido principal -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden mt-4">
      <!-- Mensaje de error - mantener esto fuera del CitaList -->
      <div v-if="error" class="p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
          <i class="fas fa-exclamation-triangle text-2xl"/>
        </div>
        <h2 class="text-lg font-medium text-gray-900 mb-2">Error al cargar datos</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="cargarCitas()"
        >
          Reintentar
        </button>
      </div>
      
      <!-- Siempre mostrar CitaList, pasando el estado isLoading -->
      <div v-else>
        <transition name="fade" mode="out-in">
          <CitaList 
            v-model:rows-per-page="rowsPerPage"
            v-model:current-page="currentPage"
            :selected-date="fechaSeleccionada" 
            :citas="citas" 
            :is-loading="isLoading"
            @view="viewCita"
            @triaje="registrarTriaje"
            @atencion="atenderCita"
            @reload-data="cargarCitas"
            @filter-date="handleDateFilter"
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
      @atencion-registrada="onAtencionRegistrada"
    />
  </div>
</template>


<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useCitas } from '~/composables/useCitas';
import { useNotification } from '~/composables/useNotification';
import { useAuth } from '~/composables/useAuth';

// Usar composable de citas
const { 
  citas, 
  isLoading, 
  error, 
  fetchCitas, 
  refreshSilently,
  startPolling,
  stopPolling,
  agregarCita,
  actualizarCita,
  getFechaActual
} = useCitas();

// Estado para paginación
const currentPage = ref(1);
const rowsPerPage = ref(10);

const fechaSeleccionada = ref(getFechaActual());

// Usar el composable de autenticación
const { authModel } = useAuth();

// Computed property para verificar si el usuario es médico
const isUserDoctor = computed(() => authModel.user.isMedico);

// Composable de notificaciones
const notification = useNotification();

// Estado de modales
const modales = reactive({
  verCita: {
    visible: false,
    cita: {}
  },
  triaje: {
    visible: false,
    cita: {}
  },
  atencion: {
    visible: false,
    cita: {}
  }
});

const handleDateFilter = async (fecha) => {
  console.log("handleDateFilter llamado con fecha:", fecha, "fecha actual:", fechaSeleccionada.value);
  
  // Si es la misma fecha, no hacer nada
  if (fecha === fechaSeleccionada.value) {
    console.log("Misma fecha, ignorando");
    return;
  }
  
  // Actualizar la fecha seleccionada
  console.log("Actualizando fechaSeleccionada en el padre a:", fecha);
  fechaSeleccionada.value = fecha;
  
  // notification.show({
  //   type: 'info',
  //   title: 'Cambiando fecha',
  //   message: `Cargando citas para ${formatearFechaParaUsuario(fecha)}`,
  //   duration: 2000
  // });
  
  // Detener cualquier polling existente antes de cambiar de fecha
  stopPolling();
  await cargarCitas(fecha);
};

// Cargar datos de citas con fecha específica
const cargarCitas = async (fecha) => {
  try {
    const fechaConsulta = fecha || getFechaActual();
    isLoading.value = true;
    
    // Detener cualquier polling existente antes de iniciar uno nuevo
    stopPolling();
    
    await fetchCitas(fechaConsulta);
    
    if (citas.value.length === 0) {
      notification.show({
        type: 'info',
        title: 'Información',
        message: `No hay citas programadas para ${formatearFechaParaUsuario(fechaConsulta)}`,
        duration: 4000
      });
    }

    // Iniciar polling con un intervalo adecuado (15 segundos)
    // Solo iniciar UNA instancia de polling
    startPolling(15000, fechaConsulta);
  } catch (err) {
    notification.show({
      type: 'error',
      title: 'Error',
      message: error.value || 'Error al cargar las citas médicas',
      duration: 5000
    });
    console.error("Error al cargar las citas", err);
  } finally {
    isLoading.value = false;
  }
};

// Función auxiliar para formatear fecha para mostrar al usuario
const formatearFechaParaUsuario = (fechaStr) => {
  if (!fechaStr) return 'hoy';
  
  try {
    // Para formato YYYY-MM-DD
    if (fechaStr.includes('-')) {
      const [year, month, day] = fechaStr.split('-');
      
      // Verificar si es la fecha actual
      const hoy = getFechaActual();
      if (fechaStr === hoy) return 'hoy';
      
      return `${day}/${month}/${year}`;
    }
    
    return fechaStr;
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return fechaStr;
  }
};

// Manejar nueva cita creada desde el componente de registro
const handleNuevaCita = (nuevaCita) => {
  agregarCita(nuevaCita);
    
  // Realizar una actualización inmediata para obtener los datos completos
  refreshSilently(getFechaActual());
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

// Atender cita
const atenderCita = (cita) => {
  modales.atencion.cita = cita;
  modales.atencion.visible = true;
};

// Función para manejar el triaje guardado o actualizado
const onTriajeGuardado = (datosTriaje) => {
  console.log('Triaje guardado:', datosTriaje);
  
  // Primero cerramos el modal
  modales.triaje.visible = false;
  
  // Timeout para permitir que el DOM se actualice
  setTimeout(() => {
    // Marcar la cita como completada
    const citaActualizada = {
      ...modales.triaje.cita,
      Triaje: 'Completado'
    };
    
    // Actualizar la cita en el estado local
    actualizarCita(citaActualizada);
    
    // Limpiar la referencia de la cita seleccionada
    modales.triaje.cita = {};
    
    // Polling inmediato para actualizar los datos desde el servidor
    refreshSilently(getFechaActual()).then(() => {
      console.log('Datos de citas actualizados desde el servidor después de guardar triaje');
      
      // Forzar una actualización de la UI si es necesario
      if (typeof window !== 'undefined') {
        document.body.click();
      }
    }).catch(err => {
      console.error('Error al actualizar datos después de guardar triaje:', err);
    });
  }, 100);
};

// Cuando se registra la atención
const onAtencionRegistrada = (citaAtendida) => {
  console.log('Atención registrada:', citaAtendida);
  
  // Actualizar la cita local con el nuevo estado
  actualizarCita(citaAtendida);
  
  // Actualizar silenciosamente desde el servidor
  refreshSilently(getFechaActual());
};

// Cargar datos al montar el componente y configurar polling
onMounted(async () => {
  await cargarCitas();
});

// Detener polling cuando se desmonta el componente para evitar memory leaks
onUnmounted(() => {
  stopPolling();
});
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
