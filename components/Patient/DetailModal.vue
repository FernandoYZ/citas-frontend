<!-- components/patient/DetailModal.vue -->
<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="localVisible"
        class="fixed inset-0 bg-black/20 bg-opacity-75 flex items-center justify-center z-50"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden transform transition-all flex flex-col"
        >
          <!-- Modal Header -->
          <div class="bg-blue-50 px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">
                Detalle del Paciente
              </h3>
              <button
                class="text-gray-400 hover:text-gray-500"
                @click="closeModal"
              >
                <i class="fas fa-times" />
              </button>
            </div>
          </div>

          <!-- Modal Body with overflow -->
          <div class="px-6 py-4 overflow-y-auto flex-grow">
            <div v-if="patient">
              <!-- Patient Basic Info -->
              <div class="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 mb-6">
                <div class="flex-shrink-0">
                  <div class="bg-blue-100 h-24 w-24 rounded-full flex items-center justify-center text-blue-600">
                    <i class="fas fa-user-circle text-4xl"/>
                  </div>
                </div>
                <div class="flex-grow">
                  <h2 class="text-xl font-bold text-gray-800">
                    {{ patient.apellidos }}, {{ patient.nombres }}
                  </h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <div class="flex items-center text-gray-600">
                      <i class="fas fa-id-card w-5 mr-2"/>
                      <span>DNI: {{ patient.dni }}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                      <i class="fas fa-file-medical w-5 mr-2"/>
                      <span>Historia: {{ patient.historia }}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                      <i class="fas fa-birthday-cake w-5 mr-2"/>
                      <span>{{ patient.edad }} años ({{ patient.fechaNacimiento }})</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                      <i class="fas fa-hospital w-5 mr-2"/>
                      <span>{{ patient.especialidad }}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                      <i class="fas fa-calendar-check w-5 mr-2"/>
                      <span>Ingreso: {{ patient.fechaIngreso }}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                      <i class="fas fa-stethoscope w-5 mr-2"/>
                      <span>Última: {{ patient.fechaUltimaAtencion }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Medical History Summary -->
              <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 class="text-md font-semibold text-gray-800 mb-2 flex items-center">
                  <i class="fas fa-clipboard-list mr-2"/>
                  Resumen de historia clínica
                </h3>
                <div class="space-y-2">
                  <!-- Podríamos mostrar un resumen aquí o datos más recientes -->
                  <p class="text-sm text-gray-600">
                    {{ patient.ultimaAtencion || "Sin atenciones registradas" }}
                  </p>
                  <button 
                    class="text-blue-600 text-sm hover:text-blue-800 flex items-center"
                    @click="$emit('view-history', patient)"
                  >
                    <i class="fas fa-history mr-1"/>
                    Ver historial completo
                  </button>
                </div>
              </div>

              <!-- Clinical Data -->
              <div class="space-y-4">
                <h3 class="text-md font-semibold text-gray-800 flex items-center">
                  <i class="fas fa-heartbeat mr-2"/>
                  Datos clínicos
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Podríamos listar cosas como alergias, medicación, etc. -->
                  <div class="border rounded-lg p-3">
                    <h4 class="text-sm font-medium text-gray-700 mb-1">Alergias</h4>
                    <p class="text-sm text-gray-600">
                      {{ patient.alergias || "No registradas" }}
                    </p>
                  </div>
                  
                  <div class="border rounded-lg p-3">
                    <h4 class="text-sm font-medium text-gray-700 mb-1">Diagnósticos</h4>
                    <p class="text-sm text-gray-600">
                      {{ patient.diagnosticos || "No registrados" }}
                    </p>
                  </div>
                  
                  <div class="border rounded-lg p-3">
                    <h4 class="text-sm font-medium text-gray-700 mb-1">Medicamentos</h4>
                    <p class="text-sm text-gray-600">
                      {{ patient.medicamentos || "No registrados" }}
                    </p>
                  </div>
                  
                  <div class="border rounded-lg p-3">
                    <h4 class="text-sm font-medium text-gray-700 mb-1">Antecedentes</h4>
                    <p class="text-sm text-gray-600">
                      {{ patient.antecedentes || "No registrados" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex justify-center items-center h-40">
              <p class="text-gray-500">No se encontró información del paciente</p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-6 py-3 flex items-center justify-end gap-2 border-t border-gray-200">
            <CommonButton
              variant="tertiary"
              label="Cerrar"
              @click="closeModal"
            />
            <CommonButton
              variant="primary"
              icon-left="fa-edit"
              label="Editar paciente"
              @click="$emit('action', { type: 'edit', patient })"
            />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { watch, ref } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  patient: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:visible", "view-history", "action"]);

// Estado local para controlar la visibilidad
const localVisible = ref(props.visible);

// Sincronizar estado con props
watch(
  () => props.visible,
  (newVal) => {
    localVisible.value = newVal;
  }
);

// Cerrar el modal
const closeModal = () => {
  localVisible.value = false;
  emit("update:visible", false);
};
</script>