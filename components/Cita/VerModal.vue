<!-- components/cita/VerModal.vue -->
<template>
  <CommonModal
    v-model="localVisible"
    title="Ver Cita Médica"
    icon="fa-calendar-check"
    :secondary-button="'Cerrar'"
    secondary-button-icon="fa-times"
    @secondary-click="close"
    @close="close"
  >
    <!-- Contenido -->
    <div class="space-y-6 text-sm text-gray-700">
      <!-- Paciente -->
      <div class="grid grid-cols-2 gap-6">
        <div>
          <p class="text-gray-500 text-xs uppercase mb-1">Paciente</p>
          <p class="font-semibold text-gray-800 flex items-center capitalize">
            <i class="fas fa-user text-blue-500 mr-2"/>
            {{ cita.ApellidosPaciente }}, {{ cita.NombresPaciente }}
          </p>
        </div>
        <div>
          <p class="text-gray-500 text-xs uppercase mb-1">DNI</p>
          <p class="font-medium">{{ cita.NroDocumento }}</p>
        </div>
      </div>

      <!-- Condición & Pago -->
      <div class="grid grid-cols-2 gap-6">
        <div>
          <p class="text-gray-500 text-xs uppercase mb-1">
            Condición de ingreso
          </p>
          <p class="font-medium">
            {{ cita.CondicionIngreso || "Ambulatorio" }}
          </p>
        </div>
        <div>
          <p class="text-gray-500 text-xs uppercase mb-1">Forma de pago</p>
          <p class="font-medium">
            {{ cita.FuenteFinanciamiento || "Estrategia" }}
          </p>
        </div>
      </div>

      <!-- Atención -->
      <div class="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <p class="text-xs uppercase text-gray-500 font-medium mb-3">
          Atención médica
        </p>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <p>
            <i class="fas fa-calendar-alt text-blue-500 mr-1"/>
            <span class="font-semibold">Fecha: </span> {{ cita.FechaCita }}
          </p>
          <p>
            <i class="fas fa-clock text-blue-500 mr-1"/>
            <span class="font-semibold">Hora: </span> {{ cita.HoraInicio }} -
            {{ cita.HoraFin || calcularHoraFin(cita.HoraInicio) }}
          </p>
          <p class="capitalize">
            <span class="font-semibold">Especialidad: </span>
            {{ cita.Especialidad }}
          </p>
          <p class="capitalize">
            <span class="font-semibold">Servicio: </span> {{ cita.Servicio }}
          </p>
          <p class="capitalize">
            <span class="font-semibold">Médico: </span>
            {{ formatearNombreMedico(cita) }}
          </p>
          <p>
            <span class="font-semibold">Tipo de cita: </span>
            {{ cita.TipoCita || "Cita regular" }}
          </p>
          <p class="capitalize">
            <span class="font-semibold">Estado: </span>
            <span :class="getEstadoClase(cita.Estado)">{{ cita.Estado }}</span>
          </p>
          <p>
            <span class="font-semibold">Solicitada: </span>
            {{ cita.FechaSolicitud || "-" }}
          </p>
          <p v-if="cita.IdAtencion">
            <span class="font-semibold">N° Cuenta: </span> {{ cita.IdAtencion }}
          </p>
        </div>
      </div>
    </div>
  </CommonModal>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  cita: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:visible", "close"]);

// Estado local
const localVisible = ref(props.visible);

// Sincronizar estado con props
watch(
  () => props.visible,
  (newValue) => {
    localVisible.value = newValue;
  }
);

// Emitir cambios en visibilidad
watch(localVisible, (newValue) => {
  emit("update:visible", newValue);
});

// Cerrar modal
const close = () => {
  localVisible.value = false;
  emit("close");
};

// Calcular hora de fin si no está disponible
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

// Formatear nombre del médico
const formatearNombreMedico = (cita) => {
  if (cita.NombreDoctor && cita.ApellidoDoctor) {
    return `Dr. ${cita.NombreDoctor} ${cita.ApellidoDoctor}`;
  } else if (cita.NombreDoctor) {
    return `Dr. ${cita.NombreDoctor}`;
  } else {
    return "No asignado";
  }
};

// Obtener clase de estilo según estado
const getEstadoClase = (estado) => {
  switch (estado?.toLowerCase()) {
    case "separada":
      return "font-semibold text-blue-600";
    case "atendido":
      return "font-semibold text-green-600";
    case "ausente":
      return "font-semibold text-red-600";
    default:
      return "font-semibold text-gray-600";
  }
};
</script>
