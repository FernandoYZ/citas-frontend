<!-- components/cita/List -->
<template>
  <CommonTable
    :items="sortedCitas"
    :columns="columns"
    title="Lista de Citas"
    icon="fa-calendar-check"
    :count-label="getCountLabel(sortedCitas.length)"
    :rows-per-page="rowsPerPage"
    :current-page="currentPage"
    :enable-pagination="true"
    :enable-sort="true"
    :enable-search="false"
    :sort-key="sortConfig.key"
    :sort-direction="sortConfig.direction"
    :empty-message="'No hay citas disponibles'"
    :empty-description="'No se han registrado citas el día de hoy'"
    @sort="handleSort"
    @update:current-page="page => emit('update:currentPage', page)"
    @update:rows-per-page="size => emit('update:rowsPerPage', size)"
  >
    <!-- Personalización de filas -->
    <template #row="{ item }">
      <tr class="hover:bg-gray-50 capitalize">
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
              <i class="far fa-clock"/>
            </div>
            <div class="flex flex-col items-start text-sm text-gray-900">
              <div>{{ item.HoraInicio }} - {{ item.HoraFin || calcularHoraFin(item.HoraInicio) }}</div>
              <div class="text-xs text-gray-500">{{ formatearFecha(item.FechaCita) }}</div>
            </div>
          </div>
        </td>

        <td class="px-4 py-3 whitespace-nowrap">
          <div class="text-sm font-semibold text-blue-600">
            {{ item.IdAtencion || '-' }}
          </div>
        </td>
        
        <td class="px-4 py-3">
          <div class="flex items-center">
            <div>
              <div class="text-sm font-medium text-gray-900">
                {{ item.ApellidosPaciente }}
              </div>
              <div class="text-xs text-gray-500">{{ item.NombresPaciente }}</div>
            </div>
          </div>
        </td>

        <td class="px-4 py-3 whitespace-nowrap">
          <div class="text-sm font-semibold text-gray-700">
            {{ item.NroDocumento }}
          </div>
        </td>
        
        <td class="px-4 py-3 whitespace-nowrap hidden md:table-cell">
          <div class="text-sm text-gray-800 break-words whitespace-normal">{{ item.Servicio }}</div>
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
              <i class="mr-1" :class="getTriajeClass(item.Triaje, 'icono')" />{{ item.Triaje }}
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
        
        <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
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
              :class="item.Triaje === 'No aplica' ? 'border-gray-300 text-gray-400 cursor-not-allowed' : ''"
              :disabled="item.Triaje === 'No aplica'"
              @click="$emit('triaje', item)"
            >
              <i :class="item.Triaje === 'Completado' ? 'fas fa-edit' : 'fa-solid fa-file-medical'"/>
            </button>

            <!-- Botón Atender Cita -->
            <button
              class="w-8 h-8 flex items-center justify-center border rounded-md transition-colors"
              title="Atender Cita"
              :disabled="item.Triaje === 'Pendiente'"
              :class="item.Triaje !== 'Pendiente' 
                ? 'border-blue-500 text-blue-600 hover:bg-blue-50' 
                : 'border-gray-300 text-gray-400 cursor-not-allowed'"
              @click="$emit('atencion', item)"
            >
              <i class="fa-solid fa-stethoscope"/>
            </button>

          </div>
        </td>

      </tr>
    </template>
  </CommonTable>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props
const props = defineProps({
  citas: {
    type: Array,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1
  },
  rowsPerPage: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits(["view", "triaje", "atencion", "search", "sort", "update:currentPage", "update:rowsPerPage"]);

// Estado local
const searchTerm = ref('');
const sortConfig = ref({
  key: 'IdAtencion',
  direction: 'desc'
});

// Definición de columnas
const columns = [
  { key: "FechaCita", label: "Fecha y Hora", sortable: true },
  { key: "IdAtencion", label: "N° Cuenta", sortable: true },
  { key: "ApellidosPaciente", label: "Paciente", sortable: true },
  { key: "NroDocumento", label: "DNI", sortable: true },
  { key: "Servicio", label: "Servicio", responsive: true, sortable: true },
  { key: "NombreDoctor", label: "Médico", responsive: true, sortable: true },
  { key: "Triaje", label: "Triaje", sortable: true }, // columna para triaje
  { key: "Estado", label: "Estado", sortable: false },
  { key: "acciones", label: "", sortable: false },
];

// Calcular hora de fin basado en hora de inicio (si no está disponible)
const calcularHoraFin = (horaInicio) => {
  if (!horaInicio) return '';
  
  try {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    let nuevasHoras = horas;
    let nuevosMinutos = minutos + 30; // Duración estándar de 30 minutos
    
    if (nuevosMinutos >= 60) {
      nuevosMinutos -= 60;
      nuevasHoras += 1;
    }
    
    if (nuevasHoras >= 24) {
      nuevasHoras -= 24;
    }
    
    return `${nuevasHoras.toString().padStart(2, '0')}:${nuevosMinutos.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error al calcular hora de fin:', error);
    return '';
  }
};

// Formatear fecha a formato local de Perú
const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '';
  
  try {
    // Asumiendo formato YYYY-MM-DD
    if (fechaStr.includes('-')) {
      const [year, month, day] = fechaStr.split('-');
      return `${day}/${month}/${year}`;
    }
    
    // Para formato MM/DD/YYYY
    const partes = fechaStr.split('/');
    if (partes.length === 3) {
      // Convertir a formato DD/MM/YYYY (Perú)
      return `${partes[1]}/${partes[0]}/${partes[2]}`;
    }
    
    // Si ya está en otro formato, devolver como está
    return fechaStr;
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return fechaStr;
  }
};

// Citas ordenadas y filtradas
const sortedCitas = computed(() => {
  let result = [...props.citas];
  
  // Aplicar búsqueda si hay término
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter(cita => {
      return Object.values(cita).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(term)
      );
    });
  }
  
  // Aplicar ordenamiento
  if (sortConfig.value.key) {
    result.sort((a, b) => {
      let valueA = a[sortConfig.value.key];
      let valueB = b[sortConfig.value.key];
      
      // Manejar valores nulos o undefined
      if (valueA === null || valueA === undefined) valueA = '';
      if (valueB === null || valueB === undefined) valueB = '';
      
      // Convertir a números para fechas en formato DD/MM/YYYY
      if (sortConfig.value.key === 'FechaCita') {
        // Convertir fechas a objetos Date para comparación correcta
        try {
          if (typeof valueA === 'string' && typeof valueB === 'string') {
            if (valueA.includes('-') && valueB.includes('-')) {
              // Formato YYYY-MM-DD
              const dateA = new Date(valueA);
              const dateB = new Date(valueB);
              valueA = dateA.getTime();
              valueB = dateB.getTime();
            } else {
              // Formato MM/DD/YYYY
              const partsA = valueA.split('/');
              const partsB = valueB.split('/');
              const dateA = new Date(partsA[2], partsA[0] - 1, partsA[1]);
              const dateB = new Date(partsB[2], partsB[0] - 1, partsB[1]);
              valueA = dateA.getTime();
              valueB = dateB.getTime();
            }
          }
        } catch (error) {
          console.error('Error al comparar fechas:', error);
          // Continuar con comparación de strings si hay error
        }
      }
      
      // Comparar según tipo de datos
      let comparison = 0;
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      } else {
        comparison = String(valueA).localeCompare(String(valueB));
      }
      
      // Aplicar dirección de ordenamiento
      return sortConfig.value.direction === 'asc' ? comparison : -comparison;
    });
  }
  
  return result;
});

/**
 * Función para determinar la clase CSS según el estado del triaje
 */
 const getTriajeClass = (triaje, elemento = 'badge') => {
  // Asegurar que triaje sea un string antes de llamar a toLowerCase
  const triajeStr = typeof triaje === 'string' ? triaje.toLowerCase() : String(triaje).toLowerCase();
  
  switch (triajeStr) {
    case 'completado':
      // Para el badge
      if (elemento === 'badge') return 'bg-green-100 text-green-700';
      // Para los íconos
      if (elemento === 'icono') return 'fa-solid fa-circle-check'
      return 'bg-green-100 text-green-800';
      
    case 'pendiente':
    default:
      // Para el badge
      if (elemento === 'badge') return 'bg-yellow-100 text-yellow-600';
      // Para los íconos
      if (elemento === 'icono') return 'fa-solid fa-hourglass-half'
      return 'bg-yellow-100 text-yellow-800';

    case 'no aplica':
      // Para el badge
      if (elemento === 'badge') return 'bg-gray-100 text-gray-600';
      // Para los íconos
      if (elemento === 'icono') return 'fa-solid fa-circle-minus  '
      return 'bg-blue-100 text-blue-800';
  }
};

/**
 * Función para determinar la clase CSS según el estado de la cita
 * Ahora también considera el estado del triaje
 */
const getEstadoClass = (estado, triaje) => {
  const estadoLower = estado?.toLowerCase();
  const triajeLower = triaje?.toLowerCase();
  
  if (estadoLower === 'separada') {
    // Si tiene triaje completado, está listo para atención (azul)
    if (triajeLower === 'completado') {
      return 'bg-blue-100 text-blue-700';
    } 
    else if (triajeLower === 'no aplica') {
      return 'bg-blue-100 text-blue-700';
    }
    // Si el triaje está pendiente, mostrar en amarillo (warning)
    else {
      return 'bg-yellow-100 text-yellow-600';
    }
  }

  if (estadoLower === 'atendido') {
    // Si el triaje está completado, mostrar en verde (success)
    if (triajeLower === 'completado') {
      return 'bg-green-100 text-green-700';
    } 
    // Si el triaje está pendiente, mostrar en amarillo (warning)
    else if (triajeLower === 'pendiente') {
      return 'bg-yellow-100 text-yellow-600';
    }
    // Si el triaje está completado, mostrar en verde (success)
    if (triajeLower === 'no aplica') {
      return 'bg-green-100 text-green-700';
    } 
  }
  
  // Otros estados
  return 'bg-red-100 text-red-700';
};

/**
 * Obtener texto para el contador de resultados
 */
const getCountLabel = (count) => {
  return count === 1 ? 'cita' : 'citas';
};

/**
 * Manejar cambio de ordenamiento
 */
const handleSort = (sort) => {
  sortConfig.value = sort;
  emit('sort', sort);
};
</script>