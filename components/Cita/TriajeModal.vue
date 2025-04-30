<!-- components/cita/TriajeModal -->
<template>
  <CommonModal
    :model-value="visible"
    :title="editMode ? 'Actualizar Triaje' : 'Registro de Triaje'"
    icon="fa-clipboard-list"
    :secondary-button="'Cancelar'"
    secondary-button-icon="fa-times"
    :primary-button="editMode ? 'Actualizar Triaje' : 'Registrar Triaje'"
    primary-button-icon="fa-check"
    size="sm:max-w-3xl"
    @secondary-click="cerrarModal"
    @primary-click="guardarTriaje"
    @close="cerrarModal"
    @update:model-value="$emit('update:visible', $event)"
    @keyup.enter="guardarTriaje"
  >
    <!-- Contenido -->
    <div class="space-y-6">
      <!-- Contenedor: Datos del Paciente -->
      <div class="p-4 bg-gray-50 rounded-lg border border-gray-300">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div class="flex items-center">
            <div>
              <div class="text-xs text-gray-500">Paciente</div>
              <div class="text-sm font-medium text-gray-500 capitalize">
                {{ cita.ApellidosPaciente }}, {{ cita.NombresPaciente }}
              </div>
            </div>
          </div>

          <div class="flex items-center">
            <div>
              <div class="text-xs text-gray-500">N° Cuenta</div>
              <div class="text-sm font-medium text-gray-500">
                {{ cita.IdAtencion || "No asignado" }}
              </div>
            </div>
          </div>

          <div class="flex items-center">
            <div>
              <div class="text-xs text-gray-500">Especialidad</div>
              <div class="text-sm font-medium text-gray-500 uppercase">
                {{ cita.Especialidad }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario: Registro de Signos Vitales -->
      <form id="triaje-form" @submit.prevent="guardarTriaje">
        <div>
          <h3 class="text-md font-semibold text-blue-600 mb-3 flex items-center">
            <i class="fas fa-heartbeat mr-2"/>{{ editMode ? 'Actualizar' : 'Registro de' }} Signos Vitales
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Pulso</label
              >
              <input
                v-model="formData.pulso"
                type="number"
                placeholder="60 - 100"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Frec. Respiratoria</label
              >
              <input
                v-model="formData.frecuenciaRespiratoria"
                type="number"
                placeholder="10 - 20"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Frec. Cardiaca</label
              >
              <input
                v-model="formData.frecuenciaCardiaca"
                type="number"
                placeholder="60 - 100"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Temperatura (°C)</label
              >
              <input
                v-model="formData.temperatura"
                type="number"
                step="0.1"
                placeholder="36.5"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500"
              >
            </div>

            <!-- Presión Arterial combinada -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Presión Arterial</label
              >
              <div
                class="flex items-center rounded-lg border border-gray-300 overflow-hidden"
              >
                <input
                  v-model="formData.presionSistolica"
                  type="number"
                  placeholder="Sistólica"
                  class="w-full px-3 py-2 text-sm focus:ring-blue-500 border-r border-gray-300"
                >
                <span class="px-2 text-gray-500">/</span>
                <input
                  v-model="formData.presionDiastolica"
                  type="number"
                  placeholder="Diastólica"
                  class="w-full px-3 py-2 text-sm focus:ring-blue-500 border-l border-gray-300"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >% Saturación O2</label
              >
              <input
                v-model="formData.saturacionOxigeno"
                type="number"
                placeholder="95 - 100"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Peso (Kg)</label
              >
              <input
                v-model="formData.peso"
                type="number"
                step="0.1"
                placeholder="70.5"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Talla (cm)</label
              >
              <input
                v-model="formData.talla"
                type="number"
                placeholder="170"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Perímetro Abdominal (cm)</label
              >
              <input
                v-model="formData.perimetroAbdominal"
                type="number"
                placeholder="90"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500"
              >
            </div>
          </div>
        </div>
      </form>
    </div>
  </CommonModal>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useNotification } from "~/composables/useNotification";
import { triajeService } from "~/services/TriajeService";

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

const emit = defineEmits(["update:visible", "close", "triaje-guardado"]);

// Composables
const notification = useNotification();

// Estado local
const formData = reactive({
  pulso: "",
  frecuenciaRespiratoria: "",
  frecuenciaCardiaca: "",
  temperatura: "",
  presionSistolica: "",
  presionDiastolica: "",
  saturacionOxigeno: "",
  peso: "",
  talla: "",
  perimetroAbdominal: "",
});
const editMode = ref(false);

// Al montar el componente
onMounted(() => {
  if (props.visible && props.cita && props.cita.IdAtencion) {
    verificarTriajeExistente();
  }
});

// Método para cerrar el modal de forma segura
const cerrarModal = () => {
  resetForm();
  // Usar timeout de 0ms para asegurar que se ejecute después del ciclo de renderizado actual
  setTimeout(() => {
    emit("update:visible", false);
    emit("close");
  }, 0);
};

// Resetear formulario
const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = "";
  });
  editMode.value = false;
};

// Verificar si ya existe un triaje para esta atención y cargar sus datos
const verificarTriajeExistente = async () => {
  try {
    if (!props.cita.IdAtencion) return;
    
    const { tieneTriaje, data } = await triajeService.verificarTriaje(props.cita.IdAtencion);
    
    if (tieneTriaje && data) {
      // Cambiar a modo edición y cargar datos
      editMode.value = true;
      
      // Cargar datos en el formulario
      if (data.presionSistolica) formData.presionSistolica = data.presionSistolica;
      if (data.presionDiastolica) formData.presionDiastolica = data.presionDiastolica;
      if (data.talla) formData.talla = data.talla;
      if (data.temperatura) formData.temperatura = data.temperatura;
      if (data.peso) formData.peso = data.peso;
      if (data.pulso) formData.pulso = data.pulso;
      if (data.frecuenciaRespiratoria) formData.frecuenciaRespiratoria = data.frecuenciaRespiratoria;
      if (data.frecuenciaCardiaca) formData.frecuenciaCardiaca = data.frecuenciaCardiaca;
      if (data.saturacionOxigeno) formData.saturacionOxigeno = data.saturacionOxigeno;
      if (data.perimetroAbdominal) formData.perimetroAbdominal = data.perimetroAbdominal;
      
      notification.show({
        type: "info",
        title: "Triaje existente",
        message: "Este paciente ya tiene registro de triaje. Puede actualizar los datos.",
        duration: 5000
      });
    }
  } catch (error) {
    console.error("Error al verificar triaje existente:", error);
    notification.show({
      type: "error",
      title: "Error",
      message: error.message || "Error al verificar si existe triaje para esta atención",
      duration: 5000
    });
  }
};

// Guardar triaje
const guardarTriaje = async () => {
  try {
    // Validar datos
    if (!validarDatos()) {
      return;
    }

    // Preparar datos para enviar a la API
    const triajeDatos = {
      idAtencion: props.cita.IdAtencion,
      paciente: props.cita.NroDocumento || '',
      edad: props.cita.Edad || '',
      editMode: editMode.value
    };

    // Agregar campos con valores
    if (formData.presionSistolica) triajeDatos.presionSistolica = formData.presionSistolica;
    if (formData.presionDiastolica) triajeDatos.presionDiastolica = formData.presionDiastolica;
    if (formData.talla) triajeDatos.talla = formData.talla;
    if (formData.temperatura) triajeDatos.temperatura = formData.temperatura;
    if (formData.peso) triajeDatos.peso = formData.peso;
    if (formData.pulso) triajeDatos.pulso = formData.pulso;
    if (formData.frecuenciaRespiratoria) triajeDatos.frecuenciaRespiratoria = formData.frecuenciaRespiratoria;
    if (formData.frecuenciaCardiaca) triajeDatos.frecuenciaCardiaca = formData.frecuenciaCardiaca;
    if (formData.saturacionOxigeno) triajeDatos.saturacionOxigeno = formData.saturacionOxigeno;
    if (formData.perimetroAbdominal) triajeDatos.perimetroAbdominal = formData.perimetroAbdominal;

    // Llamar al API a través del servicio
    const resultado = await triajeService.registrarTriaje(triajeDatos);

    // Mostrar mensaje de éxito
    notification.show({
      type: "success",
      title: editMode.value ? "Triaje actualizado" : "Triaje registrado",
      message: resultado.message || `Triaje ${editMode.value ? 'actualizado' : 'registrado'} correctamente`,
      duration: 5000
    });

    // Emitir evento de guardado exitoso 
    emit("triaje-guardado", {
      idAtencion: props.cita.IdAtencion,
      Triaje: 'Completado'  // String explícito para evitar problemas
    });
    
    // IMPORTANTE: Cerrar inmediatamente para evitar problemas de UI
    emit("update:visible", false);
    emit("close");
  } catch (error) {
    console.error(`Error al ${editMode.value ? 'actualizar' : 'guardar'} triaje:`, error);
    notification.show({
      type: "error",
      title: "Error",
      message: error.message || `Error al ${editMode.value ? 'actualizar' : 'registrar'} el triaje`,
      duration: 5000
    });
  }
};

// Validar datos del formulario
const validarDatos = () => {
  // Validar que exista un ID de atención
  if (!props.cita || !props.cita.IdAtencion) {
    notification.show({
      type: "error",
      title: "Validación",
      message: "No se ha seleccionado una cita válida",
      duration: 5000
    });
    return false;
  }
  
  // Validar que al menos un campo esté lleno
  const hayAlgunDato = Object.values(formData).some(val => val !== "");
  if (!hayAlgunDato) {
    notification.show({
      type: "warning",
      title: "Validación",
      message: "Debe ingresar al menos un dato para registrar el triaje",
      duration: 5000
    });
    return false;
  }
  
  // Validar la presión arterial (si ambos valores están presentes)
  if (formData.presionSistolica && formData.presionDiastolica) {
    if (parseInt(formData.presionSistolica) <= parseInt(formData.presionDiastolica)) {
      notification.show({
        type: "warning",
        title: "Validación",
        message: "La presión sistólica debe ser mayor que la diastólica",
        duration: 5000
      });
      return false;
    }
  } else if (formData.presionSistolica && !formData.presionDiastolica) {
    notification.show({
      type: "warning",
      title: "Validación",
      message: "Si ingresa presión sistólica, también debe ingresar la diastólica",
      duration: 5000
    });
    return false;
  } else if (!formData.presionSistolica && formData.presionDiastolica) {
    notification.show({
      type: "warning",
      title: "Validación",
      message: "Si ingresa presión diastólica, también debe ingresar la sistólica",
      duration: 5000
    });
    return false;
  }
  
  return true;
};
</script>

<style>
input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}
</style>