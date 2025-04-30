<template>
  <div class="max-w-7xl mx-auto px-4 py-4">
    <!-- Componente de registro de citas -->
    <CitaRegister @cita-creada="handleNuevaCita" />
    
    <!-- Contenido principal -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden mt-4">
      <!-- Indicador de carga -->
      <div v-if="isLoading" class="flex justify-center items-center p-8">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"/>
          <p class="text-gray-600">Cargando citas...</p>
        </div>
      </div>
      
      <!-- Mensaje de error -->
      <div v-else-if="error" class="p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
          <i class="fas fa-exclamation-triangle text-2xl"/>
        </div>
        <h2 class="text-lg font-medium text-gray-900 mb-2">Error al cargar datos</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="cargarCitas"
        >
          Reintentar
        </button>
      </div>
      
      <!-- Lista de citas -->
      <CitaList 
        v-else
        v-model:rows-per-page="rowsPerPage"
        v-model:current-page="currentPage"
        :citas="citas" 
        @view="viewCita"
        @triaje="registrarTriaje"
        @atencion="atenderCita"
      />
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
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useCitas } from '~/composables/useCitas';
import { useNotification } from '~/composables/useNotification';

// Estado para paginación
const currentPage = ref(1);
const rowsPerPage = ref(10);

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

// Cargar datos de citas
const cargarCitas = async () => {
  try {
    const fecha = getFechaActual();
    await fetchCitas(fecha);
    
    if (citas.value.length === 0) {
      notification.show({
        type: 'info',
        title: 'Información',
        message: 'No hay citas programadas para hoy',
        duration: 4000
      });
    }

    // Iniciar polling automático después de la carga inicial
    startPolling(15000, fecha); // Actualizar cada 15 segundos
  } catch (err) {
    notification.show({
      type: 'error',
      title: 'Error',
      message: error.value || 'Error al cargar las citas médicas',
      duration: 5000
    });
    console.error("Error al cargar las citas", err);
  }
};

// Manejar nueva cita creada desde el componente de registro
const handleNuevaCita = (nuevaCita) => {
  agregarCita(nuevaCita);
    
  // Realizar una actualización inmediata para obtener los datos completos
  refreshSilently(getFechaActual());
  /*
  notification.show({
    type: 'success',
    title: 'Cita registrada',
    message: 'La cita ha sido registrada exitosamente',
    duration: 3000
  });
  */
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

/**
 * Función mejorada para manejar el triaje guardado o actualizado
 * Implementa un enfoque de polling para garantizar la actualización de la UI
 */
 const onTriajeGuardado = (datosTriaje) => {
  console.log('Triaje guardado:', datosTriaje);
  
  // Primero cerramos el modal (es crucial que esto ocurra antes de cualquier otra actualización)
  modales.triaje.visible = false;
  
  // Usar un timeout para permitir que el DOM se actualice
  setTimeout(() => {
    // Marcamos la cita como completada con un valor string explícito
    const citaActualizada = {
      ...modales.triaje.cita,
      Triaje: 'Completado'
    };
    
    // Actualizar la cita en el estado local
    actualizarCita(citaActualizada);
    
    // Limpiar la referencia de la cita seleccionada
    modales.triaje.cita = {};
    
    // Implementar un polling inmediato para actualizar los datos desde el servidor
    refreshSilently(getFechaActual()).then(() => {
      console.log('Datos de citas actualizados desde el servidor después de guardar triaje');
      
      /*
      // Mensaje de éxito después de la actualización
      notification.show({
        type: 'success',
        title: 'Triaje completado',
        message: 'El triaje ha sido registrado correctamente y la lista ha sido actualizada',
        duration: 3000
      });
      */
      
      // Forzar una actualización de la UI si es necesario
      if (typeof window !== 'undefined') {
        // Pequeño hack para forzar la actualización de la UI
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
