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
                {{ cita.Servicio }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario: Registro de Signos Vitales -->
      <form id="triaje-form" @submit.prevent="guardarTriaje">
        <div>
          <h3
            class="text-md font-semibold text-blue-600 mb-3 flex items-center"
          >
            <i class="fas fa-heartbeat mr-2" />{{
              editMode ? "Actualizar" : "Registro de"
            }}
            Signos Vitales
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Pulso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pulso <span class="text-xs text-gray-500">(30 - 200)</span>
              </label>
              <div class="relative group">
                <input
                  v-model="formData.pulso"
                  type="text"
                  placeholder="30 - 200"
                  class="w-full pl-9 pr-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
                  :class="[
                    errores.pulso
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                  ]"
                  @input="validarEnteroSimple('pulso', 30, 200)"
                  @focus="campoFocus.pulso = true"
                  @blur="campoFocus.pulso = false"
                >
                <i
                  class="fas fa-heartbeat absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  :class="[
                    errores.pulso
                      ? 'text-red-500'
                      : campoFocus.pulso
                      ? 'text-blue-500'
                      : 'text-gray-400',
                  ]"
                />
                <Transition name="fade">
                  <div
                    v-if="formData.pulso && !errores.pulso"
                    class="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <i class="fas fa-check-circle text-green-500" />
                  </div>
                </Transition>
              </div>
              <Transition name="fade">
                <div
                  v-if="errores.pulso"
                  class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
                >
                  <i class="fas fa-exclamation-circle text-sm mr-1" />
                  <span>{{ errores.pulso }}</span>
                </div>
              </Transition>
            </div>

            <!-- Frecuencia Respiratoria -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Frec. Respiratoria
                <span class="text-xs text-gray-500">(6 - 60)</span>
              </label>
              <div class="relative group">
                <input
                  v-model="formData.frecuenciaRespiratoria"
                  type="text"
                  placeholder="6 - 60"
                  class="w-full pl-9 pr-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
                  :class="[
                    errores.frecuenciaRespiratoria
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                  ]"
                  @input="validarEnteroSimple('frecuenciaRespiratoria', 6, 60)"
                  @focus="campoFocus.frecuenciaRespiratoria = true"
                  @blur="campoFocus.frecuenciaRespiratoria = false"
                >
                <i
                  class="fas fa-lungs absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  :class="[
                    errores.frecuenciaRespiratoria
                      ? 'text-red-500'
                      : campoFocus.frecuenciaRespiratoria
                      ? 'text-blue-500'
                      : 'text-gray-400',
                  ]"
                />
                <Transition name="fade">
                  <div
                    v-if="
                      formData.frecuenciaRespiratoria &&
                      !errores.frecuenciaRespiratoria
                    "
                    class="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <i class="fas fa-check-circle text-green-500" />
                  </div>
                </Transition>
              </div>
              <Transition name="fade">
                <div
                  v-if="errores.frecuenciaRespiratoria"
                  class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
                >
                  <i class="fas fa-exclamation-circle text-sm mr-1" />
                  <span>{{ errores.frecuenciaRespiratoria }}</span>
                </div>
              </Transition>
            </div>

            <!-- Frecuencia Cardiaca -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Frec. Cardiaca
                <span class="text-xs text-gray-500">(30 - 200)</span>
              </label>
              <div class="relative group">
                <input
                  v-model="formData.frecuenciaCardiaca"
                  type="text"
                  placeholder="30 - 200"
                  class="w-full pl-9 pr-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
                  :class="[
                    errores.frecuenciaCardiaca
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                  ]"
                  @input="validarEnteroSimple('frecuenciaCardiaca', 30, 200)"
                  @focus="campoFocus.frecuenciaCardiaca = true"
                  @blur="campoFocus.frecuenciaCardiaca = false"
                >
                <i
                  class="fas fa-heart absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  :class="[
                    errores.frecuenciaCardiaca
                      ? 'text-red-500'
                      : campoFocus.frecuenciaCardiaca
                      ? 'text-blue-500'
                      : 'text-gray-400',
                  ]"
                />
                <Transition name="fade">
                  <div
                    v-if="
                      formData.frecuenciaCardiaca && !errores.frecuenciaCardiaca
                    "
                    class="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <i class="fas fa-check-circle text-green-500" />
                  </div>
                </Transition>
              </div>
              <Transition name="fade">
                <div
                  v-if="errores.frecuenciaCardiaca"
                  class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
                >
                  <i class="fas fa-exclamation-circle text-sm mr-1" />
                  <span>{{ errores.frecuenciaCardiaca }}</span>
                </div>
              </Transition>
            </div>

            <!-- Temperatura -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Temperatura (°C)
                <span class="text-xs text-gray-500">(20 - 50)</span>
              </label>
              <div class="relative group">
                <input
                  v-model="formData.temperatura"
                  type="text"
                  placeholder="20 - 50"
                  class="w-full pl-9 pr-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
                  :class="[
                    errores.temperatura
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                  ]"
                  @input="validarCampoDecimal('temperatura', 20, 50)"
                  @focus="campoFocus.temperatura = true"
                  @blur="campoFocus.temperatura = false"
                >
                <i
                  class="fas fa-thermometer-half absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  :class="[
                    errores.temperatura
                      ? 'text-red-500'
                      : campoFocus.temperatura
                      ? 'text-blue-500'
                      : 'text-gray-400',
                  ]"
                />
                <Transition name="fade">
                  <div
                    v-if="formData.temperatura && !errores.temperatura"
                    class="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <i class="fas fa-check-circle text-green-500" />
                  </div>
                </Transition>
              </div>
              <Transition name="fade">
                <div
                  v-if="errores.temperatura"
                  class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
                >
                  <i class="fas fa-exclamation-circle text-sm mr-1" />
                  <span>{{ errores.temperatura }}</span>
                </div>
              </Transition>
            </div>

            <!-- Presión Arterial combinada -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Presión Arterial
                <span class="text-xs text-gray-500">(250 / 120)</span>
              </label>
              <div
                class="flex items-center rounded-lg border overflow-hidden transition-all duration-200"
                :class="[
                  errores.presionSistolica || errores.presionDiastolica
                    ? 'border-red-500'
                    : 'border-gray-300',
                ]"
              >
                <div class="relative flex-grow">
                  <input
                    v-model="formData.presionSistolica"
                    type="text"
                    placeholder="Sistólica"
                    class="w-full pl-9 pr-3 py-2 text-sm focus:ring-2 border-r"
                    :class="[
                      errores.presionSistolica
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500',
                    ]"
                    @input="validarEnteroSimple('presionSistolica', 70, 250)"
                    @focus="campoFocus.presionSistolica = true"
                    @blur="campoFocus.presionSistolica = false"
                  >
                  <i
                    class="fas fa-heart-broken absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    :class="[
                      errores.presionSistolica
                        ? 'text-red-500'
                        : campoFocus.presionSistolica
                        ? 'text-blue-500'
                        : 'text-gray-400',
                    ]"
                  />
                </div>
                <span
                  class="px-2 text-gray-500"
                  :class="[
                    errores.presionSistolica || errores.presionDiastolica
                      ? 'text-red-500'
                      : '',
                  ]"
                  >/</span
                >
                <div class="relative flex-grow">
                  <input
                    v-model="formData.presionDiastolica"
                    type="text"
                    placeholder="Diastólica"
                    class="w-full px-3 py-2 text-sm focus:ring-2 border-l"
                    :class="[
                      errores.presionDiastolica
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500',
                    ]"
                    @input="validarEnteroSimple('presionDiastolica', 40, 120)"
                    @focus="campoFocus.presionDiastolica = true"
                    @blur="campoFocus.presionDiastolica = false"
                  >
                  <Transition name="fade">
                    <div
                      v-if="
                        formData.presionSistolica &&
                        formData.presionDiastolica &&
                        !errores.presionSistolica &&
                        !errores.presionDiastolica
                      "
                      class="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <i class="fas fa-check-circle text-green-500" />
                    </div>
                  </Transition>
                </div>
              </div>
              <Transition name="fade">
                <div
                  v-if="errores.presionSistolica || errores.presionDiastolica"
                  class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
                >
                  <i class="fas fa-exclamation-circle text-sm mr-1" />
                  <span>{{
                    errores.presionSistolica || errores.presionDiastolica
                  }}</span>
                </div>
              </Transition>
              <Transition name="fade">
                <div
                  v-if="errores.presionArterial"
                  class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
                >
                  <i class="fas fa-exclamation-circle text-sm mr-1" />
                  <span>{{ errores.presionArterial }}</span>
                </div>
              </Transition>
            </div>

            <!-- Saturación de Oxígeno -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                % Saturación O2
                <span class="text-xs text-gray-500">(70 - 100)</span>
              </label>
              <div class="relative group">
                <input
                  v-model="formData.saturacionOxigeno"
                  type="text"
                  placeholder="70 - 100"
                  class="w-full pl-9 pr-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
                  :class="[
                    errores.saturacionOxigeno
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                  ]"
                  @input="validarEnteroSimple('saturacionOxigeno', 70, 100)"
                  @focus="campoFocus.saturacionOxigeno = true"
                  @blur="campoFocus.saturacionOxigeno = false"
                >
                <i
                  class="fas fa-wind absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  :class="[
                    errores.saturacionOxigeno
                      ? 'text-red-500'
                      : campoFocus.saturacionOxigeno
                      ? 'text-blue-500'
                      : 'text-gray-400',
                  ]"
                />
                <Transition name="fade">
                  <div
                    v-if="
                      formData.saturacionOxigeno && !errores.saturacionOxigeno
                    "
                    class="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <i class="fas fa-check-circle text-green-500" />
                  </div>
                </Transition>
              </div>
              <Transition name="fade">
                <div
                  v-if="errores.saturacionOxigeno"
                  class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
                >
                  <i class="fas fa-exclamation-circle text-sm mr-1" />
                  <span>{{ errores.saturacionOxigeno }}</span>
                </div>
              </Transition>
            </div>

            <!-- Peso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Peso (Kg) <span class="text-xs text-gray-500">(2 - 300)</span>
              </label>
              <div class="relative group">
                <input
                  v-model="formData.peso"
                  type="text"
                  placeholder="2 - 300"
                  class="w-full pl-9 pr-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
                  :class="[
                    errores.peso
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                  ]"
                  @input="validarCampoDecimal('peso', 2, 300)"
                  @focus="campoFocus.peso = true"
                  @blur="campoFocus.peso = false"
                >
                <i
                  class="fas fa-weight absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  :class="[
                    errores.peso
                      ? 'text-red-500'
                      : campoFocus.peso
                      ? 'text-blue-500'
                      : 'text-gray-400',
                  ]"
                />
                <Transition name="fade">
                  <div
                    v-if="formData.peso && !errores.peso"
                    class="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <i class="fas fa-check-circle text-green-500" />
                  </div>
                </Transition>
              </div>
              <Transition name="fade">
                <div
                  v-if="errores.peso"
                  class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
                >
                  <i class="fas fa-exclamation-circle text-sm mr-1" />
                  <span>{{ errores.peso }}</span>
                </div>
              </Transition>
            </div>

            <!-- Talla -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Talla (cm) <span class="text-xs text-gray-500">(30 - 250)</span>
              </label>
              <div class="relative group">
                <input
                  v-model="formData.talla"
                  type="text"
                  placeholder="30 - 250"
                  class="w-full pl-9 pr-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
                  :class="[
                    errores.talla
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                  ]"
                  @input="validarCampoDecimal('talla', 30, 250)"
                  @focus="campoFocus.talla = true"
                  @blur="campoFocus.talla = false"
                >
                <i
                  class="fas fa-ruler-vertical absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  :class="[
                    errores.talla
                      ? 'text-red-500'
                      : campoFocus.talla
                      ? 'text-blue-500'
                      : 'text-gray-400',
                  ]"
                />
                <Transition name="fade">
                  <div
                    v-if="formData.talla && !errores.talla"
                    class="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <i class="fas fa-check-circle text-green-500" />
                  </div>
                </Transition>
              </div>
              <Transition name="fade">
                <div
                  v-if="errores.talla"
                  class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
                >
                  <i class="fas fa-exclamation-circle text-sm mr-1" />
                  <span>{{ errores.talla }}</span>
                </div>
              </Transition>
            </div>

            <!-- Perímetro Abdominal -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Perímetro Abdominal (cm)
                <span class="text-xs text-gray-500">(30-200)</span>
              </label>
              <div class="relative group">
                <input
                  v-model="formData.perimetroAbdominal"
                  type="text"
                  placeholder="90"
                  class="w-full pl-9 pr-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
                  :class="[
                    errores.perimetroAbdominal
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                  ]"
                  @input="validarCampoDecimal('perimetroAbdominal', 30, 200)"
                  @focus="campoFocus.perimetroAbdominal = true"
                  @blur="campoFocus.perimetroAbdominal = false"
                >
                <i
                  class="fas fa-circle absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  :class="[
                    errores.perimetroAbdominal
                      ? 'text-red-500'
                      : campoFocus.perimetroAbdominal
                      ? 'text-blue-500'
                      : 'text-gray-400',
                  ]"
                />
                <Transition name="fade">
                  <div
                    v-if="
                      formData.perimetroAbdominal && !errores.perimetroAbdominal
                    "
                    class="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <i class="fas fa-check-circle text-green-500" />
                  </div>
                </Transition>
              </div>
              <Transition name="fade">
                <div
                  v-if="errores.perimetroAbdominal"
                  class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
                >
                  <i class="fas fa-exclamation-circle text-sm mr-1" />
                  <span>{{ errores.perimetroAbdominal }}</span>
                </div>
              </Transition>
            </div>

            <!-- Perímetro Encefálico -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Perímetro Encefálico (cm)
                <span class="text-xs text-gray-500">(30-80)</span>
              </label>
              <div class="relative group">
                <input
                  v-model="formData.perimetroEncefalico"
                  type="text"
                  placeholder="50"
                  class="w-full pl-9 pr-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
                  :class="[
                    errores.perimetroEncefalico
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                  ]"
                  @input="validarCampoDecimal('perimetroEncefalico', 30, 80)"
                  @focus="campoFocus.perimetroEncefalico = true"
                  @blur="campoFocus.perimetroEncefalico = false"
                >
                <i
                  class="fas fa-brain absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  :class="[
                    errores.perimetroEncefalico
                      ? 'text-red-500'
                      : campoFocus.perimetroEncefalico
                      ? 'text-blue-500'
                      : 'text-gray-400',
                  ]"
                />
                <Transition name="fade">
                  <div
                    v-if="
                      formData.perimetroEncefalico &&
                      !errores.perimetroEncefalico
                    "
                    class="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <i class="fas fa-check-circle text-green-500" />
                  </div>
                </Transition>
              </div>
              <Transition name="fade">
                <div
                  v-if="errores.perimetroEncefalico"
                  class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
                >
                  <i class="fas fa-exclamation-circle text-sm mr-1" />
                  <span>{{ errores.perimetroEncefalico }}</span>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </form>
    </div>
  </CommonModal>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
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
  perimetroEncefalico: "",
});

// Estado para control de errores
const errores = reactive({
  pulso: "",
  frecuenciaRespiratoria: "",
  frecuenciaCardiaca: "",
  temperatura: "",
  presionSistolica: "",
  presionDiastolica: "",
  presionArterial: "",
  saturacionOxigeno: "",
  peso: "",
  talla: "",
  perimetroAbdominal: "",
  perimetroEncefalico: "",
});

// Estado para controlar el focus de cada campo
const campoFocus = reactive({
  pulso: false,
  frecuenciaRespiratoria: false,
  frecuenciaCardiaca: false,
  temperatura: false,
  presionSistolica: false,
  presionDiastolica: false,
  saturacionOxigeno: false,
  peso: false,
  talla: false,
  perimetroAbdominal: false,
  perimetroEncefalico: false,
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

  // Limpiar todos los errores
  Object.keys(errores).forEach((key) => {
    errores[key] = "";
  });

  editMode.value = false;
};

// Validar campos de números enteros (sin decimales)
const validarEnteroSimple = (campo, min, max) => {
  let valor = formData[campo];

  // Si está vacío, mantenerlo vacío y limpiar error
  if (valor === "") {
    errores[campo] = "";
    return;
  }

  // Convertir a string explícitamente antes de usar replace
  valor = String(valor);
  
  // Eliminar cualquier carácter que no sea dígito
  const soloDigitos = valor.replace(/\D/g, "");

  // Limitar a 3 dígitos como máximo
  const valorLimitado = soloDigitos.substring(0, 3);

  // Actualizar el campo
  formData[campo] = valorLimitado;

  // Validar el rango
  const valorNumerico = parseInt(valorLimitado, 10);
  if (isNaN(valorNumerico)) {
    errores[campo] = `Este campo debe ser un número válido`;
  } else if (valorNumerico < min || valorNumerico > max) {
    errores[campo] = `Debe estar entre ${min} y ${max}`;
  } else {
    errores[campo] = "";
  }

  // Si es presión arterial, verificar la relación entre sistólica y diastólica
  if (campo === "presionSistolica" || campo === "presionDiastolica") {
    validarPresionArterial();
  }
};

// Validar presión arterial (relación entre sistólica y diastólica)
const validarPresionArterial = () => {
  const sistolica = parseInt(formData.presionSistolica);
  const diastolica = parseInt(formData.presionDiastolica);

  // Limpiar error de relación
  errores.presionArterial = "";

  // Solo validar si ambos campos tienen valores
  if (!isNaN(sistolica) && !isNaN(diastolica)) {
    if (sistolica <= diastolica) {
      errores.presionArterial =
        "La presión sistólica debe ser mayor que la diastólica";
    }
  } else if (
    !isNaN(sistolica) &&
    isNaN(diastolica) &&
    formData.presionDiastolica === ""
  ) {
    errores.presionDiastolica = "Debe ingresar también la presión diastólica";
  } else if (
    isNaN(sistolica) &&
    !isNaN(diastolica) &&
    formData.presionSistolica === ""
  ) {
    errores.presionSistolica = "Debe ingresar también la presión sistólica";
  }
};

// Validar campos de números decimales con límites
const validarCampoDecimal = (campo, min, max) => {
  let valor = formData[campo];

  // Si está vacío, mantenerlo vacío y limpiar error
  if (valor === "") {
    errores[campo] = "";
    return;
  }

  // Convertir a string explícitamente antes de usar replace
  valor = String(valor);

  // Si el valor contiene caracteres no válidos, los eliminamos
  if (!/^[0-9]*\.?[0-9]*$/.test(valor)) {
    // Conservar solo dígitos y el primer punto decimal
    valor = valor.replace(/[^\d.]/g, "");

    // Si hay más de un punto decimal, dejar solo el primero
    const puntos = valor.match(/\./g);
    if (puntos && puntos.length > 1) {
      const primerPunto = valor.indexOf(".");
      valor =
        valor.substring(0, primerPunto + 1) +
        valor.substring(primerPunto + 1).replace(/\./g, "");
    }
  }

  // Dividir en parte entera y decimal
  const partes = valor.split(".");

  // Limitar parte entera a 3 dígitos
  if (partes[0].length > 3) {
    partes[0] = partes[0].substring(0, 3);
  }

  // Si hay parte decimal, limitarla a 2 dígitos
  if (partes.length > 1) {
    partes[1] = partes[1].substring(0, 2);
    valor = partes.join(".");
  }

  // Actualizar el campo
  formData[campo] = valor;

  // Validar el rango
  const valorNumerico = parseFloat(valor);
  if (isNaN(valorNumerico)) {
    errores[campo] = `Este campo debe ser un número válido`;
  } else if (valorNumerico < min || valorNumerico > max) {
    errores[campo] = `Debe estar entre ${min} y ${max}`;
  } else {
    errores[campo] = "";
  }
};

// Verificar si ya existe un triaje para esta atención y cargar sus datos
const verificarTriajeExistente = async () => {
  try {
    if (!props.cita.IdAtencion) return;

    const { tieneTriaje, data } = await triajeService.verificarTriaje(
      props.cita.IdAtencion
    );

    if (tieneTriaje && data) {
      // Cambiar a modo edición y cargar datos
      editMode.value = true;

      // Cargar datos en el formulario - convertir a string explícitamente
      if (data.presionSistolica)
        formData.presionSistolica = String(data.presionSistolica);
      if (data.presionDiastolica)
        formData.presionDiastolica = String(data.presionDiastolica);
      if (data.talla) formData.talla = String(data.talla);
      if (data.temperatura) formData.temperatura = String(data.temperatura);
      if (data.peso) formData.peso = String(data.peso);
      if (data.pulso) formData.pulso = String(data.pulso);
      if (data.frecuenciaRespiratoria)
        formData.frecuenciaRespiratoria = String(data.frecuenciaRespiratoria);
      if (data.frecuenciaCardiaca)
        formData.frecuenciaCardiaca = String(data.frecuenciaCardiaca);
      if (data.saturacionOxigeno)
        formData.saturacionOxigeno = String(data.saturacionOxigeno);
      if (data.perimetroAbdominal)
        formData.perimetroAbdominal = String(data.perimetroAbdominal);
      if (data.perimetroEncefalico)
        formData.perimetroEncefalico = String(data.perimetroEncefalico);

      // Validar todos los campos cargados para mantener la consistencia de la UI
      validarCamposCargados();

    }
  } catch (error) {
    console.error("Error al verificar triaje existente:", error);
    notification.show({
      type: "error",
      title: "Error",
      message:
        error.message ||
        "Error al verificar si existe triaje para esta atención",
      duration: 5000,
    });
  }
};

// Validar todos los campos cargados en modo edición
const validarCamposCargados = () => {
  if (formData.pulso) validarEnteroSimple("pulso", 30, 200);
  if (formData.frecuenciaRespiratoria)
    validarEnteroSimple("frecuenciaRespiratoria", 6, 60);
  if (formData.frecuenciaCardiaca)
    validarEnteroSimple("frecuenciaCardiaca", 30, 200);
  if (formData.temperatura) validarCampoDecimal("temperatura", 20, 50);
  if (formData.saturacionOxigeno)
    validarEnteroSimple("saturacionOxigeno", 70, 100);
  if (formData.peso) validarCampoDecimal("peso", 2, 300);
  if (formData.talla) validarCampoDecimal("talla", 30, 250);
  if (formData.perimetroAbdominal)
    validarCampoDecimal("perimetroAbdominal", 30, 200);
  if (formData.perimetroEncefalico)
    validarCampoDecimal("perimetroEncefalico", 30, 80);

  // Validar presión arterial si ambos valores existen
  if (formData.presionSistolica && formData.presionDiastolica) {
    validarEnteroSimple("presionSistolica", 70, 250);
    validarEnteroSimple("presionDiastolica", 40, 120);
    validarPresionArterial();
  }
};

// Guardar triaje
const guardarTriaje = async () => {
  try {
    // Validar todos los campos antes de enviar
    validarCamposCargados();

    // Verificar si hay errores activos
    const hayErrores = Object.values(errores).some((error) => error !== "");
    if (hayErrores) {
      notification.show({
        type: "warning",
        title: "Validación",
        message: "Por favor corrija los errores antes de guardar",
        duration: 5000,
      });
      return;
    }

    // Validar que exista un ID de atención
    if (!props.cita || !props.cita.IdAtencion) {
      notification.show({
        type: "error",
        title: "Validación",
        message: "No se ha seleccionado una cita válida",
        duration: 5000,
      });
      return false;
    }

    // Validar que al menos un campo esté lleno
    const hayAlgunDato = Object.values(formData).some((val) => val !== "");
    if (!hayAlgunDato) {
      notification.show({
        type: "warning",
        title: "Validación",
        message: "Debe ingresar al menos un dato para registrar el triaje",
        duration: 5000,
      });
      return false;
    }

    // Preparar datos para enviar a la API
    const triajeDatos = {
      idAtencion: props.cita.IdAtencion,
      paciente: props.cita.NroDocumento || "",
      edad: props.cita.Edad || "",
      editMode: editMode.value,
    };

    // Agregar campos con valores
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        triajeDatos[key] = formData[key];
      }
    });

    // Llamar al API a través del servicio
    const resultado = await triajeService.registrarTriaje(triajeDatos);

    // Mostrar mensaje de éxito
    notification.show({
      type: "success",
      title: editMode.value ? "Triaje actualizado" : "Triaje registrado",
      message:
        resultado.message ||
        `Triaje ${editMode.value ? "actualizado" : "registrado"} correctamente`,
      duration: 5000,
    });

    // Emitir evento de guardado exitoso
    emit("triaje-guardado", {
      idAtencion: props.cita.IdAtencion,
      Triaje: "Completado", // String explícito para evitar problemas
    });

    // IMPORTANTE: Cerrar inmediatamente para evitar problemas de UI
    emit("update:visible", false);
    emit("close");
  } catch (error) {
    console.error(
      `Error al ${editMode.value ? "actualizar" : "guardar"} triaje:`,
      error
    );
    notification.show({
      type: "error",
      title: "Error",
      message:
        error.message ||
        `Error al ${editMode.value ? "actualizar" : "registrar"} el triaje`,
      duration: 5000,
    });
  }
};

// Observadores para mantener la validación en tiempo real
watch(
  () => formData.presionSistolica,
  () => {
    if (formData.presionDiastolica) {
      validarPresionArterial();
    }
  }
);

watch(
  () => formData.presionDiastolica,
  () => {
    if (formData.presionSistolica) {
      validarPresionArterial();
    }
  }
);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

input:focus {
  outline: none;
}

input:focus:not(.error) {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

input.error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
}
</style>
