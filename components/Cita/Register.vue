<template>
  <!-- Formulario de Cita -->
  <div class="bg-white rounded-xl shadow-sm p-4 sm:p-5">
    <!-- <h2 class="text-lg font-semibold mb-4">
      Cita Médica
    </h2> -->
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <!-- Columna 1: Datos básicos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
        <!-- Buscar paciente -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar paciente</label>
          <div class="flex gap-2">
            <div class="relative flex-grow">
              <input
                v-model="nroDocumento"
                type="text"
                placeholder="Ingrese DNI del paciente"
                class="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500 focus:outline-none"
                @blur="buscarPaciente"
                @keyup.enter="buscarPaciente"

              >
              <i class="fas fa-id-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            </div>
          </div>
          <span v-if="errorPaciente" class="text-xs text-red-500">{{ errorPaciente }}</span>
        </div>

        <!-- Nombre del paciente (se autocompleta al buscar desde DNI) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <input
            disabled
            type="text"
            :value="nombrePaciente"
            placeholder="Nombre y Apellidos"
            class="w-full pl-3 pr-3 py-2 rounded-lg border border-gray-300 text-sm bg-gray-100 text-gray-500"
          >
        </div>

        <!-- Fecha -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <div class="relative">
            <input
              v-model="fechaCita"
              type="date"
              class="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500 focus:outline-none"
              :min="fechaMinima"
              @change="buscarServiciosDisponibles"
            >
            <i 
              class="fas fa-calendar-alt absolute left-3 top-1/2 -translate-y-1/2"
              :class="cargandoServicios ? 'text-blue-500 animate-pulse' : 'text-gray-400'"
            />
          </div>
          <span v-if="errorFecha" class="text-xs text-red-500">{{ errorFecha }}</span>
        </div>
   
        <!-- Horario -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <span>Horario disponible</span>
            <span v-if="cargandoHorarios" class="text-xs text-blue-500 ml-1">Cargando... <i class="fa-solid fa-hourglass-half"/> </span>
          </label>
          <div class="relative">
            <select
              v-model="horarioSeleccionado"
              class="w-full pl-8 pr-8 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              :class="{
                'bg-gray-100 text-gray-500': !horariosDisponibles.length,
                'bg-gray-100 text-gray-500 cursor-not-allowed': horariosDisponibles.length === 1 && horarioSeleccionado
              }"
              :disabled="horariosDisponibles.length === 1 || !horariosDisponibles.length"
            >
              <option value="" disabled>{{ !horariosDisponibles.length ? 'No hay horarios disponibles' : 'Seleccione horario' }}</option>
              <option v-for="horario in horariosDisponibles" :key="horario.hora" :value="horario.hora">
                {{ horario.hora }}
              </option>
            </select>
            <i 
              class="fas fa-clock absolute left-3 top-1/2 -translate-y-1/2 text-xs"
              :class="cargandoHorarios ? 'text-blue-500 animate-pulse' : 'text-gray-400'"
            />
            <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"/>
            <div v-if="horariosDisponibles.length === 1 && horarioSeleccionado" class="absolute right-9 top-1/2 -translate-y-1/2">
              <i class="fas fa-check text-blue-500 text-xs"/>
            </div>
          </div>
          <span v-if="errorHorario" class="text-xs text-red-500">{{ errorHorario }}</span>
        </div>
      </div>
      
      <!-- Columna 2: Especialidad, Médico y Botones -->
      <div class="flex flex-col">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Especialidad -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <span>Especialidad</span>
              <span v-if="cargandoServicios" class="text-xs text-blue-500 ml-1">Cargando... <i class="fa-solid fa-hourglass-half"/></span>
            </label>
            <div class="relative">
              <select
                v-model="servicioSeleccionado"
                class="w-full pl-8 pr-8 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none capitalize"
                :class="{
                  'bg-gray-100 text-gray-500': !serviciosDisponibles.length,
                  'bg-gray-100 text-gray-500 cursor-not-allowed': serviciosDisponibles.length === 1
                }"
                :disabled="serviciosDisponibles.length === 1 || !serviciosDisponibles.length"
                @change="buscarMedicosDisponibles"
              >
                <option value="" disabled>{{ !serviciosDisponibles.length ? 'No hay especialidades disponibles' : 'Seleccione especialidad' }}</option>
                <option v-for="servicio in serviciosDisponibles" :key="servicio.IdServicio" :value="servicio.IdServicio">
                  {{ servicio.Nombre }}
                </option>
              </select>
              <i 
                class="fas fa-stethoscope absolute left-3 top-1/2 -translate-y-1/2 text-xs"
                :class="cargandoServicios ? 'text-blue-500 animate-pulse' : 'text-gray-400'"
              />
              <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"/>
              <div v-if="serviciosDisponibles.length === 1 && servicioSeleccionado" class="absolute right-9 top-1/2 -translate-y-1/2">
                <i class="fas fa-check text-blue-500 text-xs"/>
              </div>
            </div>
            <span v-if="errorServicio" class="text-xs text-red-500">{{ errorServicio }}</span>
          </div>
        
          <!-- Médico -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <span>Médico</span>
              <span v-if="cargandoMedicos" class="text-xs text-blue-500 ml-1">Cargando... <i class="fa-solid fa-hourglass-half"/></span>
            </label>
            <div class="relative">
              <select
                v-model="medicoSeleccionado"
                class="capitalize w-full pl-8 pr-8 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                :class="{
                  'bg-gray-100 text-gray-500': !medicosDisponibles.length,
                  'bg-gray-100 text-gray-500 cursor-not-allowed': medicosDisponibles.length === 1 && medicoSeleccionado
                }"
                :disabled="medicosDisponibles.length === 1 || !medicosDisponibles.length"
                @change="buscarHorariosDisponibles"
              >
                <option value="" disabled>{{ !medicosDisponibles.length ? 'No hay médicos disponibles' : 'Seleccione médico' }}</option>
                <option v-for="medico in medicosDisponibles" :key="medico.idMedico" :value="medico.idMedico">
                  {{ medico.nombre }}
                </option>
              </select>
              <i 
                class="fas fa-user-md absolute left-3 top-1/2 -translate-y-1/2 text-xs"
                :class="cargandoMedicos ? 'text-blue-500 animate-pulse' : 'text-gray-400'"
              />
              <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"/>
              <div v-if="medicosDisponibles.length === 1 && medicoSeleccionado" class="absolute right-9 top-1/2 -translate-y-1/2">
                <i class="fas fa-check text-blue-500 text-xs"/>
              </div>
            </div>
            <span v-if="errorMedico" class="text-xs text-red-500">{{ errorMedico }}</span>
          </div>
        </div>

        <!-- Botones de acción - Alineados a la derecha y pegados al borde -->
        <div class="flex justify-end gap-2 mt-auto pt-4 sm:pt-6">
          <button 
            :disabled="cargando || !datosValidos"
            :class="[
              'px-5 py-2 rounded-lg text-sm flex items-center',
              cargando || !datosValidos 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            ]"
            @click="handleRegistrarCita" 
          >
            <i v-if="!cargando" class="fa-solid fa-check mr-1.5"/>
            <i v-else class="fa-solid fa-spinner fa-spin mr-1.5"/>
            {{ cargando ? 'Procesando...' : 'Confirmar cita' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useNotification } from '~/composables/useNotification';
import { useCitaForm } from '~/composables/useCitaForm';

// Composables
const notification = useNotification();
const {
  // Estado del formulario
  nroDocumento,
  idPaciente,
  nombrePaciente,
  fechaCita,
  horarioSeleccionado,
  servicioSeleccionado,
  medicoSeleccionado,
  
  // Listas de datos
  serviciosDisponibles,
  medicosDisponibles,
  horariosDisponibles,
  
  // Estados de carga
  cargando,
  cargandoServicios,
  cargandoMedicos,
  cargandoHorarios,
  
  // Mensajes de error
  errorPaciente,
  errorFecha,
  errorServicio,
  errorMedico,
  errorHorario,
  
  // Computed properties
  fechaMinima,
  datosValidos,
  
  // Métodos
  obtenerFechaActual,
  buscarPaciente,
  buscarServiciosDisponibles,
  buscarMedicosDisponibles,
  buscarHorariosDisponibles,
  registrarCita,
  resetearFormulario
} = useCitaForm();

// Emits
const emit = defineEmits(['cita-creada']);

// Autoseleccionar la especialidad cuando solo hay una disponible
watch(serviciosDisponibles, (servicios) => {
  if (servicios.length === 1 && !servicioSeleccionado.value) {
    console.log('Autoseleccionando especialidad única:', servicios[0].Nombre);
    servicioSeleccionado.value = servicios[0].IdServicio;
    // Buscar médicos una vez seleccionada la especialidad automáticamente
    buscarMedicosDisponibles();
  }
}, { immediate: true });

// Autoseleccionar el médico cuando solo hay uno disponible
watch(medicosDisponibles, (medicos) => {
  if (medicos.length === 1 && !medicoSeleccionado.value) {
    console.log('Autoseleccionando médico único:', medicos[0].nombre);
    medicoSeleccionado.value = medicos[0].idMedico;
    // Buscar horarios una vez seleccionado el médico automáticamente
    buscarHorariosDisponibles();
  }
}, { immediate: true });

// Autoseleccionar el horario cuando solo hay uno disponible
watch(horariosDisponibles, (horarios) => {
  if (horarios.length === 1 && !horarioSeleccionado.value) {
    console.log('Autoseleccionando horario único:', horarios[0].hora);
    horarioSeleccionado.value = horarios[0].hora;
  }
}, { immediate: true });

watch(nroDocumento, (nuevo) => {
  const soloNumeros = nuevo.replace(/\D/g, '').slice(0, 12);
  nroDocumento.value = soloNumeros;

  /*
  // limpiar si el campo si el número es menor de 8 (funciona)
  if (soloNumeros.length < 8) {
    idPaciente.value = null;
    nombrePaciente.value = '';
    errorPaciente.value = '';
  }
  */
});


// Método para manejar el registro de la cita
const handleRegistrarCita = async () => {
  try {
    const resultado = await registrarCita();
    if (resultado) {
      notification.show({
        type: 'success',
        title: 'Cita registrada',
        message: `Cita registrada exitosamente para el ${fechaCita.value} a las ${horarioSeleccionado.value}`,
        duration: 4000
      });
      
      // Emitir evento para que el componente padre recargue los datos
      emit('cita-creada', resultado);

      // Reiniciar el formulario completo, incluyendo DNI y nombre
      resetearFormularioCompleto();
    }
  } catch (error) {
    console.error('Error al registrar cita:', error);
    notification.show({
      type: 'error',
      title: 'Error',
      message: error instanceof Error ? error.message : 'Error al registrar la cita',
      duration: 5000
    });
  }
};

// Función para resetear el formulario completo
const resetearFormularioCompleto = () => {
  // Resetear campos básicos
  resetearFormulario();
  
  // Limpiar también los campos de paciente
  nroDocumento.value = '';
  idPaciente.value = null;
  nombrePaciente.value = '';
  errorPaciente.value = '';
};

// Inicialización
onMounted(() => {
  // Al montar el componente, inicializar la fecha con el día actual
  fechaCita.value = obtenerFechaActual();
  // Buscar servicios disponibles para hoy
  buscarServiciosDisponibles();
});
</script>
