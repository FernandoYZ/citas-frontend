<!-- Pages/citas.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 py-4">
    <CitaRegister />
    <!-- Panel de búsqueda -->
    <!-- <CitaSearchForm
      v-model:filters="filters"
      @search="applyFilters"
      @clear="clearFilters"
      @new-appointment="handleNewAppointment"
      @refresh="refreshData"
    /> -->
    
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
          @click="refreshData"
        >
          Reintentar
        </button>
      </div>
      
      <!-- Lista de citas -->
      <CitaList 
        v-else
        :citas="citasFiltradas" 
        @view="viewCita"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useCitasModel } from '~/models/citaModel';
import { useToast } from '~/composables/useToast';

// Composables
const { 
  citas, 
  citasFiltradas, 
  isLoading, 
  error, 
  filters, 
  fetchCitas, 
  updateFilters, 
  cargarDatosPrueba 
} = useCitasModel();

const toast = useToast();

// Referencia para el intervalo de actualización automática
const autoRefreshInterval = ref(null);

// Cargar datos de citas
const cargarCitas = async () => {
  try {
    await fetchCitas();
    
    if (citas.value.length === 0) {
      toast.show({
        type: 'info',
        message: 'No se encontraron citas para la fecha seleccionada'
      });
    }
  } catch (err) {
    // El error ya se maneja en el modelo, pero podemos mostrar una notificación adicional
    toast.show({
      type: 'error',
      message: 'Error al cargar las citas médicas'
    });
    
    // Si hay un error al cargar desde la API, cargamos datos de prueba
    console.warn('Cargando datos de prueba debido a un error en la API');
    cargarDatosPrueba();
  }
};

// Refrescar datos manualmente
const refreshData = async () => {
  isLoading.value = true;
  
  try {
    await fetchCitas();
    toast.show({
      type: 'success',
      message: 'Datos actualizados correctamente',
      duration: 2000
    });
  } catch (error) {
    toast.show({
      type: 'error',
      message: 'Error al actualizar los datos'
    });
  } finally {
    isLoading.value = false;
  }
};

// Aplicar filtros
const applyFilters = async () => {
  isLoading.value = true;
  
  try {
    // Si cambió la fecha, necesitamos ir a la API
    if (filters.value.fecha !== props.initialFilters?.fecha) {
      await fetchCitas();
    }
    
    if (citasFiltradas.value.length === 0) {
      toast.show({
        type: 'info',
        message: 'No se encontraron citas con los filtros aplicados'
      });
    }
  } catch (error) {
    toast.show({
      type: 'error',
      message: 'Error al aplicar los filtros'
    });
  } finally {
    isLoading.value = false;
  }
};

// Limpiar filtros
const clearFilters = async () => {
  // Actualizar filtros y volver a cargar datos
  await updateFilters({
    fecha: new Date().toISOString().split('T')[0],
    estado: '',
    terminoBusqueda: ''
  });
  
  toast.show({
    type: 'success',
    message: 'Filtros restablecidos',
    duration: 2000
  });
  
  await cargarCitas();
};

// Ver detalles de una cita
const viewCita = (cita) => {
  // Aquí implementarías la lógica para ver detalles
  // Por ejemplo, abrir un modal o navegar a una página de detalles
  console.log('Ver detalles de cita:', cita);
  
  // Ejemplo: Mostrar información básica en un toast
  toast.show({
    type: 'info',
    message: `Detalles de cita para ${cita.ApellidosPaciente}, ${cita.NombresPaciente}`,
    duration: 5000
  });
};

// Manejar la creación de una nueva cita
const handleNewAppointment = () => {
  // Navegar a la página de creación de citas o abrir un modal
  console.log('Crear nueva cita');
  
  // Ejemplo: Navegar a una página de creación de citas
  // navigateTo('/citas/nueva');
  
  // O mostrar un mensaje informativo
  toast.show({
    type: 'info',
    message: 'Función de reserva de citas en desarrollo',
    duration: 3000
  });
};

// Configurar actualización automática cada 3 minutos (180000 ms)
const setupAutoRefresh = () => {
  autoRefreshInterval.value = setInterval(() => {
    console.log('Actualizando datos automáticamente...');
    refreshData();
  }, 180000);
};

// Limpiar intervalo al desmontar el componente
onUnmounted(() => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value);
  }
});

// Cargar datos al montar el componente y configurar actualización automática
onMounted(async () => {
  await cargarCitas();
  setupAutoRefresh();
});
</script>