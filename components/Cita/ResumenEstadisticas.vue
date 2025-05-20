<!-- componentes/Cita/ResumenEstadisticas.vue -->
<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <EstadisticaCard
        v-for="item in tarjetas"
        :key="item.label"
        :color="item.color"
        :icon="item.icon"
        :label="item.label"
        :value="resumen[item.key]"
        :item-key="item.key"
        :loading="silenLoading"
        :is-selected="isCardSelected(item.key)"
        @click="onCardClick(item.key)"
      />
    </div>

    <div
      v-if="error"
      class="w-full mt-2 text-center py-1 px-2 bg-red-50 rounded-md text-xs text-red-600 border border-red-100"
    >
      <span class="flex items-center justify-center">
        <i class="fas fa-exclamation-circle mr-1" />
        {{ error }}
      </span>
    </div>
    
    <!-- Mostrar filtros activos como chips -->
    <div v-if="filtrosActivos.length > 0" class="hidden flex-wrap gap-2 mt-3">
      <div class="text-xs text-gray-500 flex items-center">
        <i class="fas fa-filter mr-1"/>
        Filtros activos:
      </div>
      <div 
        v-for="filtro in filtrosActivos" 
        :key="filtro"
        class="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full flex items-center"
      >
        {{ getFiltroLabel(filtro) }}
        <button 
          title="Eliminar filtro"
          class="ml-1 text-blue-400 hover:text-blue-700"
          @click="onCardClick(filtro)"
        >
          <i class="fas fa-times-circle"/>
        </button>
      </div>
      <button 
        v-if="filtrosActivos.length > 0 && !isTotalSelected"
        class="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full flex items-center hover:bg-gray-100"
        @click="limpiarFiltros"
      >
        Limpiar filtros
        <i class="fas fa-times ml-1"/>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, shallowRef, computed } from 'vue'
import { triajeService } from '~/services/TriajeService'
import EstadisticaCard from './EstadisticaCard.vue'

const isLoading = ref(false)
const silenLoading = ref(false)
const error = ref('')
const resumen = shallowRef({
  totalCitas: 0,
  citasPendientes: 0,
  citasAtendidas: 0,
  triajesCompletados: 0,
  triajesPendientes: 0,
  triajesNoAplica: 0,
})

// Estado para seguimiento de filtros seleccionados
const filtrosActivos = ref(['totalCitas']) // Por defecto, mostrar todas las citas

const tarjetas = [
  { key: 'totalCitas', label: 'Total citas', icon: 'fa-calendar-check', color: 'blue' },
  { key: 'citasPendientes', label: 'Pendientes', icon: 'fa-hourglass-half', color: 'amber' },
  { key: 'citasAtendidas', label: 'Atendidas', icon: 'fa-check-circle', color: 'green' },
  { key: 'triajesNoAplica', label: 'No aplica triaje', icon: 'fa-ban', color: 'gray' },
  { key: 'triajesPendientes', label: 'Triajes pendientes', icon: 'fa-file-medical', color: 'orange' },
  { key: 'triajesCompletados', label: 'Triajes completados', icon: 'fa-clipboard-check', color: 'indigo' },
]

// Mapa para convertir claves a etiquetas
const filtroToLabel = {
  totalCitas: 'Total citas',
  citasPendientes: 'Pendientes',
  citasAtendidas: 'Atendidas',
  triajesNoAplica: 'No aplica triaje',
  triajesPendientes: 'Triajes pendientes',
  triajesCompletados: 'Triajes completados'
}

// Verificar si un card está seleccionado
const isCardSelected = (key) => {
  return filtrosActivos.value.includes(key)
}

// Verificar si el filtro "Total citas" está seleccionado
const isTotalSelected = computed(() => {
  return filtrosActivos.value.includes('totalCitas')
})

// Función para limpiar filtros y mostrar todo
const limpiarFiltros = () => {
  filtrosActivos.value = ['totalCitas']
  emitFiltroActualizado()
}

// Función para obtener la etiqueta de un filtro
const getFiltroLabel = (key) => {
  return filtroToLabel[key] || key
}

let intervaloActualizacion = null
let timerTimeout = null

const cargarResumen = async () => {
  try {
    isLoading.value = true
    error.value = ''
    resumen.value = await triajeService.obtenerResumenTriaje()
  } catch (err) {
    console.error('Error al cargar resumen:', err)
    error.value = err instanceof Error ? err.message : 'Error al cargar estadísticas'
  } finally {
    isLoading.value = false
  }
}

const actualizarSilenciosamente = async () => {
  if (silenLoading.value) return
  silenLoading.value = true
  try {
    resumen.value = await triajeService.obtenerResumenTriaje()
    error.value = ''
  } catch (err) {
    console.warn('Error silencioso:', err)
  } finally {
    silenLoading.value = false
  }
}

const iniciarActualizacionesPeriodicas = () => {
  detenerActualizacionesPeriodicas()
  intervaloActualizacion = setInterval(() => {
    if (!document.hidden) actualizarSilenciosamente()
  }, 15000)
}

const detenerActualizacionesPeriodicas = () => {
  if (intervaloActualizacion) {
    clearInterval(intervaloActualizacion)
    intervaloActualizacion = null
  }
}

const manejarVisibilidad = () => {
  if (!document.hidden) {
    if (timerTimeout) clearTimeout(timerTimeout)
    timerTimeout = setTimeout(() => actualizarSilenciosamente(), 300)
  }
}

const recargarDatos = (silencioso = false) =>
  silencioso ? actualizarSilenciosamente() : cargarResumen()

// Manejo de clics en cards
const onCardClick = (key) => {
  console.log('Card clicked:', key)
  
  // Si se hace clic en 'totalCitas', se deseleccionan todos los demás
  if (key === 'totalCitas') {
    filtrosActivos.value = ['totalCitas']
  } 
  // Si se hace clic en otro filtro y 'totalCitas' está activo, se deselecciona 'totalCitas'
  else if (filtrosActivos.value.includes('totalCitas')) {
    filtrosActivos.value = [key]
  }
  // Si el filtro ya está activo, se deselecciona
  else if (filtrosActivos.value.includes(key)) {
    // Si este es el último filtro activo, volvemos a 'totalCitas'
    if (filtrosActivos.value.length === 1) {
      filtrosActivos.value = ['totalCitas']
    } else {
      filtrosActivos.value = filtrosActivos.value.filter(item => item !== key)
    }
  }
  // Si el filtro no está activo, se agrega
  else {
    filtrosActivos.value.push(key)
  }
  
  // Emitir el evento con los filtros actualizados
  emitFiltroActualizado()
}

// Definir emits
const emit = defineEmits(['filtro-actualizado'])

// Función para emitir el evento de filtro actualizado
const emitFiltroActualizado = () => {
  // Crear un objeto que represente el estado de los filtros
  const filtros = {
    mostrarTodasCitas: filtrosActivos.value.includes('totalCitas'),
    estados: {
      pendiente: filtrosActivos.value.includes('citasPendientes'),
      atendido: filtrosActivos.value.includes('citasAtendidas')
    },
    triaje: {
      pendiente: filtrosActivos.value.includes('triajesPendientes'),
      completado: filtrosActivos.value.includes('triajesCompletados'),
      noAplica: filtrosActivos.value.includes('triajesNoAplica')
    }
  }
  
  console.log('Emitiendo filtros actualizados:', filtros)
  emit('filtro-actualizado', filtros)
}

onMounted(() => {
  cargarResumen()
  iniciarActualizacionesPeriodicas()
  document.addEventListener('visibilitychange', manejarVisibilidad)
  
  // Emitir filtro inicial (mostrar todas las citas)
  emitFiltroActualizado()
})

onUnmounted(() => {
  detenerActualizacionesPeriodicas()
  if (timerTimeout) clearTimeout(timerTimeout)
  document.removeEventListener('visibilitychange', manejarVisibilidad)
})

defineExpose({ cargarResumen, actualizarSilenciosamente, recargarDatos })
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

</style>
