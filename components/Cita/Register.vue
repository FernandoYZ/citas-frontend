<template>
  <div
    class="bg-white rounded-xl shadow-md p-4 sm:p-6 transition-all duration-300 hover:shadow-lg"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <!-- Columna 1: Datos básicos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
        <!-- Buscar paciente -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Buscar paciente</label
          >
          <div class="flex gap-2">
            <div class="relative flex-grow group">
              <input
                v-model="nroDocumento"
                type="text"
                placeholder="Ingrese DNI del paciente"
                class="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm transition-all duration-200 focus:ring-2"
                :class="{
                  'border-red-500 focus:border-red-500 focus:ring-red-500':
                    errorPacienteTemporal,
                  'focus:border-blue-500 focus:ring-blue-500':
                    !errorPacienteTemporal,
                }"
                @blur="validarPaciente"
                @keyup.enter="validarPaciente"
                @focus="focusDNI"
                @input="onInputDNI"
              >
              <i
                class="fas fa-id-card absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                :class="[
                  errorPacienteTemporal
                    ? 'text-red-500'
                    : isFocusedDNI
                    ? 'text-blue-500'
                    : 'text-gray-400',
                  { 'animate-pulse': buscandoPaciente },
                ]"
              />
              <Transition name="fade">
                <div
                  v-if="
                    nroDocumentoLimpio.length > 0 &&
                    nroDocumentoLimpio.length < 8
                  "
                  class="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <i class="fas fa-info-circle text-amber-500" />
                </div>
              </Transition>
              <Transition name="fade">
                <div
                  v-if="idPaciente && !errorPacienteTemporal"
                  class="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <i class="fas fa-check-circle text-green-500" />
                </div>
              </Transition>
            </div>
            <button
              v-if="nroDocumentoLimpio.length >= 8"
              class="px-2 py-1 rounded text-xs transition-colors duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
              @click="limpiarBusqueda"
            >
              <i class="fas fa-times"/>
            </button>
          </div>
          <Transition name="fade">
            <div
              v-if="errorPacienteTemporal"
              class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
            >
              <i class="fas fa-exclamation-circle text-sm mr-1" />
              <span>{{ errorPaciente }}</span>
            </div>
          </Transition>
          <Transition name="fade">
            <div
              v-if="
                nroDocumentoLimpio.length > 0 && nroDocumentoLimpio.length < 8
              "
              class="mt-1 flex items-center text-xs text-amber-600 bg-amber-50 p-2 rounded-md gap-1"
            >
              <i class="fas fa-info-circle text-sm" />
              <span>El DNI debe tener al menos 8 dígitos</span>
            </div>
          </Transition>
        </div>

        <!-- Nombre del paciente -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Nombre completo</label
          >
          <div class="relative">
            <input
              disabled
              type="text"
              :value="nombrePaciente"
              placeholder="Nombre y Apellidos"
              class="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm"
              style="background-color: #f5f7fa; color: #495057"
            >
            <i
              class="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Transition name="fade">
              <div
                v-if="idPaciente"
                class="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <i class="fas fa-check-circle text-green-500" />
              </div>
            </Transition>
          </div>
        </div>

        <!-- Fecha -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Fecha</label
          >
          <div class="relative">
            <input
              v-model="fechaCita"
              type="date"
              class="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :min="fechaMinima"
              @change="buscarServiciosDisponibles"
              @focus="isFocusedFecha = true"
              @blur="isFocusedFecha = false"
            >
            <i
              class="fas fa-calendar-alt absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
              :class="[
                cargandoServicios
                  ? 'text-blue-500 animate-pulse'
                  : isFocusedFecha
                  ? 'text-blue-500'
                  : 'text-gray-400',
              ]"
            />
          </div>
          <Transition name="fade">
            <span
              v-if="errorFecha"
              class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
            >
              <i class="fas fa-exclamation-circle text-sm" />
              {{ errorFecha }}
            </span>
          </Transition>
        </div>

        <!-- Horario -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <span>Horario disponible</span>
            <Transition name="fade">
              <span v-if="cargandoHorarios" class="text-xs text-blue-500 ml-1">
                Cargando <i class="fa-solid fa-circle-notch animate-spin" />
              </span>
            </Transition>
          </label>
          <div class="relative">
            <select
              v-model="horarioSeleccionado"
              class="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-300 bg-white text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              :class="{
                'bg-gray-100 text-gray-500': !horariosDisponibles.length,
                'bg-gray-100 text-gray-500 cursor-not-allowed':
                  horariosDisponibles.length === 1 && horarioSeleccionado,
              }"
              :disabled="
                horariosDisponibles.length === 1 || !horariosDisponibles.length
              "
              @focus="isFocusedHorario = true"
              @blur="isFocusedHorario = false"
            >
              <option value="" disabled>
                {{
                  !horariosDisponibles.length
                    ? "No hay horarios disponibles"
                    : "Seleccione horario"
                }}
              </option>
              <option
                v-for="horario in horariosDisponibles"
                :key="horario.hora"
                :value="horario.hora"
              >
                {{ formatHora(horario.hora) }}
              </option>
            </select>
            <i
              class="fas fa-clock absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
              :class="[
                cargandoHorarios
                  ? 'text-blue-500 animate-pulse'
                  : isFocusedHorario
                  ? 'text-blue-500'
                  : 'text-gray-400',
              ]"
            />
            <i
              class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs transition-transform duration-200"
              :class="{ 'transform rotate-180': isFocusedHorario }"
            />
            <Transition name="fade">
              <div
                v-if="horariosDisponibles.length === 1 && horarioSeleccionado"
                class="absolute right-9 top-1/2 -translate-y-1/2"
              >
                <i class="fas fa-check-circle text-green-500" />
              </div>
            </Transition>
          </div>
          <Transition name="fade">
            <span
              v-if="errorHorario"
              class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
            >
              <i class="fas fa-exclamation-circle text-sm mr-1" />
              {{ errorHorario }}
            </span>
          </Transition>
        </div>
      </div>

      <!-- Columna 2: Especialidad, Médico y Botones -->
      <div class="flex flex-col">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Especialidad -->
<div>
  <label class="block text-sm font-medium text-gray-700 mb-1">
    <span>Especialidad</span>
    <Transition name="fade">
      <span v-if="cargandoServicios" class="text-xs text-blue-500 ml-1">
        Cargando <i class="fa-solid fa-circle-notch animate-spin" />
      </span>
    </Transition>
  </label>

  <div class="relative">
    <select
      v-model="servicioSeleccionado"
      class="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-300 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none capitalize"
      :disabled="serviciosDisponibles.length === 1 || !serviciosDisponibles.length"
      :class="[
        {
          'bg-gray-100 text-gray-500': !serviciosDisponibles.length,
          'bg-gray-100 text-gray-500 cursor-not-allowed': serviciosDisponibles.length === 1,
          'bg-white text-gray-800': serviciosDisponibles.length > 1 && !servicioSeleccionado,
        }
      ]"
      style="color: #495057"
      @change="buscarMedicosDisponibles"
      @focus="isFocusedEspecialidad = true"
      @blur="isFocusedEspecialidad = false"
    >
      <option value="" disabled>
        {{
          !serviciosDisponibles.length
            ? "No hay especialidades disponibles"
            : "Seleccione especialidad"
        }}
      </option>
      <option
        v-for="servicio in serviciosDisponibles"
        :key="servicio.IdServicio"
        :value="servicio.IdServicio"
      >
        {{ servicio.Nombre }}
      </option>
    </select>

    <!-- Ícono de estetoscopio -->
    <i
      class="fas fa-stethoscope absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
      :class="[
        cargandoServicios
          ? 'text-blue-500 animate-pulse'
          : isFocusedEspecialidad
          ? 'text-blue-500'
          : 'text-gray-400'
      ]"
    />

    <!-- Flecha desplegable -->
    <i
      class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs transition-transform duration-200"
      :class="{ 'transform rotate-180': isFocusedEspecialidad }"
    />

    <!-- Ícono de check -->
    <Transition name="fade">
      <div
        v-if="servicioSeleccionado"
        class="absolute right-9 top-1/2 -translate-y-1/2"
      >
        <i class="fas fa-check-circle text-green-500" />
      </div>
    </Transition>
  </div>

  <Transition name="fade">
    <span
      v-if="errorServicio"
      class="mt-1 flex items-center text-xs text-red-600 p-2 rounded-md gap-1"
    >
      <i class="fas fa-exclamation-circle text-sm mr-1" />
      {{ errorServicio }}
    </span>
  </Transition>
</div>


          <!-- Médico -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <span>Médico</span>
              <Transition name="fade">
                <span v-if="cargandoMedicos" class="text-xs text-blue-500 ml-1">
                  Cargando <i class="fa-solid fa-circle-notch animate-spin" />
                </span>
              </Transition>
            </label>
            <div class="relative">
              <select
                v-model="medicoSeleccionado"
                class="capitalize w-full pl-9 pr-8 py-2 rounded-lg border border-gray-300 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                :class="{
                  'bg-gray-100 text-gray-500': !medicosDisponibles.length,
                  'bg-gray-100 text-gray-500 cursor-not-allowed':
                    medicosDisponibles.length === 1 && medicoSeleccionado,
                }"
                :disabled="
                  medicosDisponibles.length === 1 || !medicosDisponibles.length
                "
                style="background-color: #f5f7fa; color: #495057"
                @change="buscarHorariosDisponibles"
                @focus="isFocusedMedico = true"
                @blur="isFocusedMedico = false"
              >
                <option value="" disabled>
                  {{
                    !medicosDisponibles.length
                      ? "No hay médicos disponibles"
                      : "Seleccione médico"
                  }}
                </option>
                <option
                  v-for="medico in medicosDisponibles"
                  :key="medico.idMedico"
                  :value="medico.idMedico"
                  class="truncate line-clamp-1"
                >
                  {{ medico.nombre }}
                </option>
              </select>
              <i
                class="fas fa-user-md absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                :class="[
                  cargandoMedicos
                    ? 'text-blue-500 animate-pulse'
                    : isFocusedMedico
                    ? 'text-blue-500'
                    : 'text-gray-400',
                ]"
              />
              <i
                class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs transition-transform duration-200"
                :class="{ 'transform rotate-180': isFocusedMedico }"
              />
              <Transition name="fade">
                <div
                  v-if="medicosDisponibles.length === 1 && medicoSeleccionado"
                  class="absolute right-9 top-1/2 -translate-y-1/2"
                >
                  <i class="fas fa-check-circle text-green-500" />
                </div>
              </Transition>
            </div>
            <Transition name="fade">
              <span
                v-if="errorMedico"
                class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
              >
                <i class="fas fa-exclamation-circle text-sm mr-1" />
                {{ errorMedico }}
              </span>
            </Transition>

            <!-- Si el médico está seleccionado, mostrar nombre completo -->
            <Transition name="fade">
              <div
                v-if="medicoSeleccionado && nombreMedicoSeleccionado"
                class="mt-1 text-xs text-gray-500 pl-1"
              />
            </Transition>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end gap-2 mt-auto pt-4 sm:pt-6">
          <button
            class="px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200 border border-gray-300 text-gray-700 hover:bg-gray-100"
            @click="resetearFormularioCompleto"
          >
            <i class="fa-solid fa-times mr-1.5"/>
            Cancelar
          </button>
          <button
            :disabled="cargando || !datosValidos"
            :class="[
              'px-5 py-2 rounded-lg text-sm flex items-center transition-all duration-200',
              cargando || !datosValidos
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow',
            ]"
            @click="handleRegistrarCita"
          >
            <template v-if="!cargando">
              <i class="fa-solid fa-check mr-1.5"/>
              Confirmar cita
            </template>
            <template v-else>
              <i class="fa-solid fa-circle-notch fa-spin mr-1.5"/>
              Procesando...
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useNotification } from "~/composables/useNotification";
import { useCitaForm } from "~/composables/useCitaForm";

// Composables
const notification = useNotification();
const errorPacienteTemporal = ref(false);
const buscandoPaciente = ref(false);

// Estados de focus para mejorar UI
const isFocusedDNI = ref(false);
const isFocusedFecha = ref(false);
const isFocusedHorario = ref(false);
const isFocusedEspecialidad = ref(false);
const isFocusedMedico = ref(false);

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
  resetearFormulario,
} = useCitaForm();

// Emits
const emit = defineEmits(["cita-creada"]);

// Computed properties
const nroDocumentoLimpio = computed(() => {
  return nroDocumento.value.replace(/\D/g, "");
});

const nombreMedicoSeleccionado = computed(() => {
  if (!medicoSeleccionado.value || !medicosDisponibles.value.length) return "";
  const medico = medicosDisponibles.value.find(
    (m) => m.idMedico === medicoSeleccionado.value
  );
  return medico ? medico.nombre : "";
});

// Métodos
const focusDNI = () => {
  isFocusedDNI.value = true;
  // No limpiar el error al enfocar, solo cuando cambie el valor
};

// Debounce para la búsqueda de pacientes
let timeoutDNI = null;
const onInputDNI = () => {
  // Limpiar datos si el DNI es menor a 8 dígitos o si cambió
  if (nroDocumentoLimpio.value.length < 8) {
    idPaciente.value = null;
    nombrePaciente.value = "";
    errorPaciente.value = "";
    errorPacienteTemporal.value = false;
  } else if (idPaciente.value) {
    // Si ya había un paciente encontrado, limpiar los datos para validar el nuevo DNI
    idPaciente.value = null;
    nombrePaciente.value = "";
  }

  // Debounce para buscar paciente automáticamente cuando se ingresan 8 dígitos
  clearTimeout(timeoutDNI);
  if (nroDocumentoLimpio.value.length >= 8) {
    timeoutDNI = setTimeout(() => {
      validarPaciente();
    }, 500);
  }
};

const validarPaciente = async () => {
  isFocusedDNI.value = false;

  // Solo buscar si es un DNI válido (8+ dígitos)
  if (nroDocumentoLimpio.value.length < 8) {
    return;
  }

  try {
    buscandoPaciente.value = true;
    await buscarPaciente();

    // Si encontró al paciente, actualizar UI
    if (idPaciente.value) {
      errorPacienteTemporal.value = false;
    } else {
      errorPacienteTemporal.value = !!errorPaciente.value;
      // Si no se encontró paciente, asegurarse de que el campo nombre esté vacío
      nombrePaciente.value = "";
    }
  } catch (error) {
    console.error(error);
    errorPacienteTemporal.value = true;
    // Limpiar nombre del paciente en caso de error
    nombrePaciente.value = "";
    idPaciente.value = null;
  } finally {
    buscandoPaciente.value = false;
  }
};

// Método para limpiar la búsqueda de paciente
const limpiarBusqueda = () => {
  nroDocumento.value = "";
  idPaciente.value = null;
  nombrePaciente.value = "";
  errorPaciente.value = "";
  errorPacienteTemporal.value = false;
};

// Formateo de fecha para el resumen
const formatFecha = (fecha) => {
  if (!fecha) return "";
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(fecha).toLocaleDateString("es-ES", options);
};

// Formateo de hora para mejor visualización
const formatHora = (hora) => {
  if (!hora) return "";

  // Si ya tiene formato 12h, devolverlo directamente
  if (hora.includes("AM") || hora.includes("PM")) {
    return hora;
  }

  // Convertir formato 24h a 12h
  try {
    const [hours, minutes] = hora.split(":");
    const h = parseInt(hours, 10);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:${minutes} ${period}`;
  } catch (error) {
    console.error(error);
    return hora; // Devolver original si hay error
  }
};

// Autoseleccionar la especialidad cuando solo hay una disponible
watch(
  serviciosDisponibles,
  (servicios) => {
    if (servicios.length === 1 && !servicioSeleccionado.value) {
      console.log("Autoseleccionando especialidad única:", servicios[0].Nombre);
      servicioSeleccionado.value = servicios[0].IdServicio;
      // Buscar médicos una vez seleccionada la especialidad automáticamente
      buscarMedicosDisponibles();
    }
  },
  { immediate: true }
);

// Autoseleccionar el médico cuando solo hay uno disponible
watch(
  medicosDisponibles,
  (medicos) => {
    if (medicos.length === 1 && !medicoSeleccionado.value) {
      console.log("Autoseleccionando médico único:", medicos[0].nombre);
      medicoSeleccionado.value = medicos[0].idMedico;
      // Buscar horarios una vez seleccionado el médico automáticamente
      buscarHorariosDisponibles();
    }
  },
  { immediate: true }
);

// Autoseleccionar el horario cuando solo hay uno disponible
watch(
  horariosDisponibles,
  (horarios) => {
    if (horarios.length === 1 && !horarioSeleccionado.value) {
      console.log("Autoseleccionando horario único:", horarios[0].hora);
      horarioSeleccionado.value = horarios[0].hora;
    }
  },
  { immediate: true }
);

// Observar cambios en el mensaje de error y manejarlo adecuadamente
watch(errorPaciente, (val) => {
  if (val) {
    errorPacienteTemporal.value = true;
    // Ocultar el error después de 6 segundos (reducido de 15 segundos original)
    setTimeout(() => {
      // Solo ocultar si no hay focus en el campo, para evitar conflictos
      if (!isFocusedDNI.value) {
        errorPacienteTemporal.value = false;
      }
    }, 6000);
  }
});

// Método para manejar el registro de la cita
const handleRegistrarCita = async () => {
  try {
    const resultado = await registrarCita();
    if (resultado) {
      notification.show({
        type: "success",
        title: "Cita registrada",
        message: `Cita registrada exitosamente para el ${formatFecha(
          fechaCita.value
        )} a las ${formatHora(horarioSeleccionado.value)}`,
        duration: 4000,
      });

      // Emitir evento para que el componente padre recargue los datos
      emit("cita-creada", resultado);

      // Reiniciar el formulario completo, incluyendo DNI y nombre
      resetearFormularioCompleto();
    }
  } catch (error) {
    console.error("Error al registrar cita:", error);
    notification.show({
      type: "error",
      title: "Error",
      message:
        error instanceof Error ? error.message : "Error al registrar la cita",
      duration: 5000,
    });
  }
};

// Función para resetear el formulario completo
const resetearFormularioCompleto = () => {
  // Resetear campos básicos
  resetearFormulario();

  // Limpiar también los campos de paciente
  nroDocumento.value = "";
  idPaciente.value = null;
  nombrePaciente.value = "";
  errorPaciente.value = "";
  errorPacienteTemporal.value = false;
};

// Inicialización
onMounted(() => {
  // Al montar el componente, inicializar la fecha con el día actual
  fechaCita.value = obtenerFechaActual();
  // Buscar servicios disponibles para hoy
  buscarServiciosDisponibles();
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

/* Transición para campos de error */
input:focus:not(.error),
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

input:focus.error {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
}

/* Efecto hover en el contenedor principal */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Truncado para textos largos */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Estilo para truncar textos largos */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1; /* propiedad estándar para futuro soporte */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2; /* propiedad estándar para futuro soporte */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
