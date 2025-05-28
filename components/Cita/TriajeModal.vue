<template>
  <CommonModal
    :model-value="visible"
    :title="editMode ? 'Actualizar Triaje' : 'Registro de Triaje'"
    icon="fa-clipboard-list"
    :secondary-button="'Cancelar'"
    secondary-button-icon="fa-times"
    :primary-button="editMode ? 'Actualizar Triaje' : 'Registrar Triaje'"
    primary-button-icon="fa-check"
    size="sm:max-w-4xl"
    @secondary-click="cerrarModal"
    @primary-click="guardarTriaje"
    @close="cerrarModal"
    @update:model-value="$emit('update:visible', $event)"
    @keyup.enter="guardarTriaje"
  >
    <!-- Contenido -->
    <div class="space-y-6">
      <!-- Contenedor: Datos del Paciente -->
      <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-user text-blue-600"/>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide">Paciente</p>
              <p class="text-sm font-semibold text-gray-600 capitalize">{{ cita.ApellidosPaciente }}, {{ cita.NombresPaciente }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-id-card text-blue-600"/>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide">N° Cuenta</p>
              <p class="text-sm font-semibold text-gray-600">{{ cita.IdAtencion || "No asignado" }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-stethoscope text-blue-600"/>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide">Especialidad</p>
              <p class="text-sm font-semibold text-gray-600 capitalize">{{ cita.Servicio }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario: Registro de Signos Vitales -->
      <form id="triaje-form" @submit.prevent="guardarTriaje">
        <div class="space-y-6">
          <!-- Sección: Signos Vitales -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-heartbeat text-blue-500 mr-2" />
              {{ editMode ? "Actualizar" : "Registro de" }} Signos Vitales
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Pulso -->
              <div>
                <label class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Pulso 
                  <span class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">30 - 200</span>
                </label>
                <div class="relative">
                  <input
                    v-model="formData.pulso"
                    type="text"
                    class="w-full pl-10 pr-16 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
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
                  <span
                    class="absolute top-1/2 -translate-y-1/2 text-xs text-gray-400 transition-all duration-300 right-3"
                    :class="[
                      formData.pulso && !errores.pulso ? 'right-9' : 'right-3',
                      errores.pulso ? 'text-red-500' : 'text-gray-400',
                    ]"

                  >
                    lpm
                  </span>
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
                <label class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Frec. Respiratoria
                  <span class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">6 - 60</span>
                </label>
                <div class="relative">
                  <input
                    v-model="formData.frecuenciaRespiratoria"
                    type="text"
                    class="w-full pl-10 pr-16 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
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
                  <span
                    class="absolute top-1/2 -translate-y-1/2 text-xs text-gray-400 transition-all duration-300 right-3"
                    :class="[
                      formData.frecuenciaRespiratoria && !errores.frecuenciaRespiratoria ? 'right-9' : 'right-3',
                      errores.frecuenciaRespiratoria ? 'text-red-500' : 'text-gray-400',
                    ]"

                  >
                    rpm
                  </span>
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
                <label class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Frec. Cardiaca
                  <span class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">30 - 200</span>
                </label>
                <div class="relative">
                  <input
                    v-model="formData.frecuenciaCardiaca"
                    type="text"
                    class="w-full pl-10 pr-16 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
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
                  <span
                    class="absolute top-1/2 -translate-y-1/2 text-xs text-gray-400 transition-all duration-300 right-3"
                    :class="[
                      formData.frecuenciaCardiaca && !errores.frecuenciaCardiaca ? 'right-9' : 'right-3',
                      errores.frecuenciaCardiaca ? 'text-red-500' : 'text-gray-400',
                    ]"

                  >
                    bpm
                  </span>
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
                <label class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Temperatura
                  <span class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">20 - 50</span>
                </label>
                <div class="relative">
                  <input
                    v-model="formData.temperatura"
                    type="text"
                    class="w-full pl-10 pr-16 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
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
                  <span
                    class="absolute top-1/2 -translate-y-1/2 text-xs text-gray-400 transition-all duration-300 right-3"
                    :class="[
                      formData.temperatura && !errores.temperatura ? 'right-9' : 'right-3',
                      errores.temperatura ? 'text-red-500' : 'text-gray-400',
                    ]"

                  >
                    °C
                  </span>
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
                <label class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Presión Arterial
                  <span class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">250 / 120</span>
                </label>
                <div class="flex items-center space-x-2">
                  <!-- Sistólica -->
                  <div class="relative flex-1">
                    <input
                      v-model="formData.presionSistolica"
                      type="text"
                      class="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
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
                      class="fas fa-heart-pulse absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                      :class="[
                        errores.presionSistolica
                          ? 'text-red-500'
                          : campoFocus.presionSistolica
                          ? 'text-blue-500'
                          : 'text-gray-400',
                      ]"
                    />
                  </div>

                  <!-- Separador / -->
                  <div class="text-gray-400 font-bold text-lg">/</div>

                  <!-- Diastólica -->
                  <div class="relative flex-1">
                    <input
                      v-model="formData.presionDiastolica"
                      type="text"
                      class="w-full px-3 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
                      :class="[
                        errores.presionDiastolica
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500',
                      ]"
                      @input="validarEnteroSimple('presionDiastolica', 40, 120)"
                      @focus="campoFocus.presionDiastolica = true"
                      @blur="campoFocus.presionDiastolica = false"
                    >

                    <!-- Unidad mmHg -->
                    <span
                      class="absolute top-1/2 -translate-y-1/2 text-xs transition-all duration-300"
                      :class="[
                        formData.presionSistolica &&
                        formData.presionDiastolica &&
                        !errores.presionSistolica &&
                        !errores.presionDiastolica
                          ? 'right-9 text-gray-400'
                          : errores.presionSistolica || errores.presionDiastolica
                          ? 'right-3 text-red-500'
                          : 'right-3 text-gray-400'
                      ]"
                    >
                      mmHg
                    </span>

                    <!-- Ícono de validación -->
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

                <!-- Mensajes de error -->
                <Transition name="fade">
                  <div
                    v-if="errores.presionSistolica || errores.presionDiastolica"
                    class="mt-1 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-md gap-1"
                  >
                    <i class="fas fa-exclamation-circle text-sm mr-1" />
                    <span>{{ errores.presionSistolica || errores.presionDiastolica }}</span>
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
                <label class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Saturación O2
                  <span class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">70 - 100</span>
                </label>
                <div class="relative">
                  <input
                    v-model="formData.saturacionOxigeno"
                    type="text"
                    class="w-full pl-10 pr-16 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
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
                  <span
                    class="absolute top-1/2 -translate-y-1/2 text-xs text-gray-400 transition-all duration-300 right-3"
                    :class="[
                      formData.saturacionOxigeno && !errores.saturacionOxigeno ? 'right-9' : 'right-3',
                      errores.saturacionOxigeno ? 'text-red-500' : 'text-gray-400',
                    ]"

                  >
                    %
                  </span>
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

              <!-- Hemoglobina (Campo bloqueado) -->
              <!-- <div>
                <label class="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <i class="fas fa-tint text-gray-400 mr-2"/>
                  Hemoglobina
                  <span class="ml-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">7 - 20</span>
                </label>
                <div class="relative">
                  <input
                    type="text"
                    class="w-full pl-10 pr-20 py-2.5 rounded-lg border text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                    disabled
                    readonly
                  >
                  <i class="fas fa-tint absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"/>
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300">g/dL</span>
                  <i class="fas fa-lock absolute right-8 top-1/2 -translate-y-1/2 text-gray-300"/>
                </div>
              </div> -->
            </div>
          </div>


          <!-- Sección: Medidas Antropométricas -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              Medidas Antropométricas
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <!-- Peso -->
              <div>
                <label class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Peso
                  <span class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">1 - 300</span>
                </label>
                <div class="relative">
                  <input
                    v-model="formData.peso"
                    type="text"
                    class="w-full pl-10 pr-16 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
                    :class="[
                      errores.peso
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                    ]"
                    @input="validarCampoDecimal('peso', 1, 300)"
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
                  <span
                    class="absolute top-1/2 -translate-y-1/2 text-xs text-gray-400 transition-all duration-300 right-3"
                    :class="[
                      formData.peso && !errores.peso ? 'right-9' : 'right-3',
                      errores.peso ? 'text-red-500' : 'text-gray-400',
                    ]"

                  >
                    kg
                  </span>
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
                <label class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Talla
                  <span class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">30 - 250</span>
                </label>
                <div class="relative">
                  <input
                    v-model="formData.talla"
                    type="text"
                    class="w-full pl-10 pr-16 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
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
                  <span
                    class="absolute top-1/2 -translate-y-1/2 text-xs text-gray-400 transition-all duration-300 right-3"
                    :class="[
                      formData.talla && !errores.talla ? 'right-9' : 'right-3',
                      errores.talla ? 'text-red-500' : 'text-gray-400',
                    ]"

                  >
                    cm
                  </span>
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
                <label class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  P. Abdominal
                  <span class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">30 - 200</span>
                </label>
                <div class="relative">
                  <input
                    v-model="formData.perimetroAbdominal"
                    type="text"
                    class="w-full pl-10 pr-16 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
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
                  <span
                    class="absolute top-1/2 -translate-y-1/2 text-xs text-gray-400 transition-all duration-300 right-3"
                    :class="[
                      formData.perimetroAbdominal && !errores.perimetroAbdominal ? 'right-9' : 'right-3',
                      errores.perimetroAbdominal ? 'text-red-500' : 'text-gray-400',
                    ]"

                  >
                    cm
                  </span>
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
                <label class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  P. Encefálico
                  <span class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">30 - 90</span>
                </label>
                <div class="relative">
                  <input
                    v-model="formData.perimetroEncefalico"
                    type="text"
                    class="w-full pl-10 pr-16 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:ring-2"
                    :class="[
                      errores.perimetroEncefalico
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                    ]"
                    @input="validarCampoDecimal('perimetroEncefalico', 30, 90)"
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
                  <span
                    class="absolute top-1/2 -translate-y-1/2 text-xs text-gray-400 transition-all duration-300 right-3"
                    :class="[
                      formData.perimetroEncefalico && !errores.perimetroEncefalico ? 'right-9' : 'right-3',
                      errores.perimetroEncefalico ? 'text-red-500' : 'text-gray-400',
                    ]"

                  >
                    cm
                  </span>
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
    partes[1] = partes[1].substring(0, 3);
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

/* Transiciones suaves */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 100px;
}


input:focus {
  outline: none;
}

</style>
