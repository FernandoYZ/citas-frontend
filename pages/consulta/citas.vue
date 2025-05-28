<template>
  <div
    ref="pageContainer"
    class="min-h-screen bg-gradient-to-br from-white to-indigo-50 transition-all duration-500 opacity-0"
  >
    <!-- Header Principal con Logo -->
    <header ref="mainHeader" class="bg-primario-700 text-white py-4 opacity-0 transform translate-y-4 transition-all duration-500">
      <div class="container mx-auto max-w-7xl px-6">
        <div class="flex items-center justify-between">
          <!-- Logo y título -->
          <div class="flex items-center">
            <div class="p-2 bg-white/10 backdrop-blur-sm rounded-xl mr-4 group hover:bg-white/20 transition-all duration-300">
              <NuxtImg
                src="/logo.webp"
                alt="Logo del Hospital"
                class="h-12 w-auto transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <h1 class="text-2xl lg:text-3xl font-bold text-white">Sistema de Citas Médicas</h1>
              <p class="text-primario-100 text-sm lg:text-base">Hospital Rezola - Cañete</p>
            </div>
          </div>

          <!-- Hora actual -->
          <div class="text-right">
            <p class="text-primario-100 text-sm">Hora actual</p>
            <p class="text-white text-xl font-bold font-mono">{{ horaActual }}</p>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto max-w-7xl px-6 py-8">
      <!-- Indicador de Progreso -->
      <div ref="progressIndicator" class="mb-8 opacity-0 transform translate-y-4 transition-all duration-500">
        <div class="flex justify-center items-center space-x-8 md:space-x-16">
          <div class="flex items-center">
            <div 
            :class="[
              'relative w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-300 shadow-lg',
              idPaciente ? 'bg-green-500 shadow-green-200' : 
              (nroDocumento.length >= 8 ? 'bg-primario-600 shadow-blue-200' : 
              'bg-gray-400 shadow-gray-200')
            ]">
              <i v-if="idPaciente" class="fas fa-check text-white"/>
              <span v-else :class="[idPaciente ? 'text-white' : (nroDocumento.length >= 8 ? 'text-white' : 'text-gray-100')]">1</span>
              <div v-if="idPaciente" class="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <i class="fas fa-check text-white text-sm"/>
              </div>
            </div>
            <div class="ml-4">
              <span class="block text-lg font-semibold text-gray-900">Paciente</span>
              <span class="text-sm text-gray-500">Identificación</span>
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="h-2 w-16 md:w-24 bg-gray-200 rounded-full overflow-hidden">
              <div 
              :class="[
                'h-full bg-primario-600 rounded-full transition-all duration-500',
                (servicioSeleccionado && medicoSeleccionado) ? 'w-full' : 'w-0'
              ]"/>
            </div>
          </div>
          
          <div class="flex items-center">
            <div 
            :class="[
              'relative w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-300 shadow-lg',
              (servicioSeleccionado && medicoSeleccionado) ? 'bg-green-500 shadow-green-200' : 
              'bg-gray-400 shadow-gray-200'
            ]">
              <i v-if="servicioSeleccionado && medicoSeleccionado" class="fas fa-check text-white"/>
              <span v-else :class="[(servicioSeleccionado && medicoSeleccionado) ? 'text-white' : 'text-gray-100']">2</span>
              <div v-if="servicioSeleccionado && medicoSeleccionado" class="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <i class="fas fa-check text-white text-sm"/>
              </div>
            </div>
            <div class="ml-4">
              <span class="block text-lg font-semibold text-gray-900">Especialidad</span>
              <span class="text-sm text-gray-500">Médico y fecha</span>
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="h-2 w-16 md:w-24 bg-gray-200 rounded-full overflow-hidden">
              <div 
              :class="[
                'h-full bg-primario-600 rounded-full transition-all duration-500',
                horarioSeleccionado ? 'w-full' : 'w-0'
              ]"/>
            </div>
          </div>
          
          <div class="flex items-center">
            <div 
            :class="[
              'relative w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-300 shadow-lg',
              horarioSeleccionado ? 'bg-green-500 shadow-green-200' : 
              'bg-gray-400 shadow-gray-200'
            ]">
              <i v-if="horarioSeleccionado" class="fas fa-check text-white"/>
              <span v-else :class="[horarioSeleccionado ? 'text-white' : 'text-gray-100']">3</span>
              <div v-if="horarioSeleccionado" class="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <i class="fas fa-check text-white text-sm"/>
              </div>
            </div>
            <div class="ml-4">
              <span class="block text-lg font-semibold text-gray-900">Horario</span>
              <span class="text-sm text-gray-500">Confirmación</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido Principal - Grid con altura reducida -->
      <div ref="mainContent" class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 opacity-0 transform translate-y-4 transition-all duration-500">
        
        <!-- Paso 1: Datos del Paciente -->
        <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <!-- Header del Card -->
          <div class="bg-primario-700 px-6 py-4 text-white">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                <i class="fas fa-id-card text-white text-lg"/>
              </div>
              <div>
                <h2 class="text-xl font-bold">Datos del Paciente</h2>
                <p class="text-primario-100 text-sm">Ingrese número de documento</p>
              </div>
            </div>
          </div>

          <div class="p-5">
            <!-- Display del Documento -->
            <div class="mb-5">             
              <div 
              :class="[
                'relative border-3 rounded-2xl p-3 min-h-[50px] flex items-center justify-center transition-all duration-300',
                errorPaciente ? 'border-red-400 bg-red-50' : 
                idPaciente ? 'border-green-400 bg-green-50' : 
                nroDocumento ? 'border-primario-400 bg-primario-50' :
                'border-gray-300 bg-gray-50'
              ]">
                <div class="text-center w-full">
                  <input
                    v-model="nroDocumento"
                    type="text"
                    maxlength="12"
                    class="w-full text-center text-2xl font-bold text-gray-900 tracking-wider bg-transparent border-none focus:outline-none"
                    placeholder="Ingrese su documento"
                    @input="filtrarNumeros"
                  >
                </div>
                
                <!-- Indicador de estado -->
                <div v-if="idPaciente" class="absolute top-3 right-3">
                  <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <i class="fas fa-check text-white text-xs"/>
                  </div>
                </div>
                
                <div v-else-if="buscandoPaciente" class="absolute top-3 right-3">
                  <div class="w-6 h-6 bg-primario-500 rounded-full flex items-center justify-center shadow-lg">
                    <i class="fas fa-spinner fa-spin text-white text-xs"/>
                  </div>
                </div>
              </div>
            </div>

            <!-- Teclado Virtual -->
            <div v-if="!idPaciente" class="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div class="grid grid-cols-3 gap-3 mb-4">
                <button
                    v-for="num in [1,2,3,4,5,6,7,8,9]"
                    :key="num"
                    :disabled="nroDocumento.length >= 12"
                    :class="[
                      'h-12 bg-white border-2 border-gray-200 rounded-xl text-xl font-bold text-gray-800 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95',
                      nroDocumento.length >= 12 ? 'opacity-50 cursor-not-allowed' : 'hover:border-primario-300 hover:bg-primario-50'
                    ]"
                    @click="agregarNumero(num)"
                >
                  {{ num }}
                </button>
              </div>
              
              <div class="grid grid-cols-3 gap-3">
                <button
                  class="h-12 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200 active:scale-95 shadow-sm"
                  @click="limpiarUltimo"
                >
                  <i class="fas fa-backspace text-lg"/>
                </button>
                
                <button
                  :disabled="nroDocumento.length >= 12"
                  :class="[
                    'h-12 bg-white border-2 border-gray-200 rounded-xl text-xl font-bold text-gray-800 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95',
                    nroDocumento.length >= 12 ? 'opacity-50 cursor-not-allowed' : 'hover:border-primario-300 hover:bg-primario-50'
                  ]"
                  @click="agregarNumero(0)"
                >
                  0
                </button>
                
                <button
                  :disabled="nroDocumento.length < 8 || buscandoPaciente"
                  :class="[
                    'h-12 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md',
                    (nroDocumento.length >= 8 && !buscandoPaciente) 
                    ? 'bg-primario-700 text-white hover:bg-primario-800 border-2 border-primario-700 cursor-pointer' 
                    : 'bg-gray-200 text-gray-500 border-2 border-gray-200 cursor-not-allowed'
                  ]"
                  @click="buscarPaciente"
                >
                  <i v-if="!buscandoPaciente" class="fas fa-search mr-1"/>
                  <i v-else class="fas fa-spinner fa-spin mr-1"/>
                </button>
              </div>
            </div>

            <!-- Botón para cambiar paciente -->
            <div v-if="idPaciente" class="mb-4">
              <button
                  class="w-full px-4 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                  @click="cambiarPaciente"
              >
                <i class="fas fa-user-edit mr-2"/>
                Registrar Otro Paciente
              </button>
            </div>

            <!-- Error del paciente -->
            <transition name="fade">
              <div v-if="errorPaciente" class="mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-lg">
                <div class="flex items-center text-red-700">
                  <i class="fas fa-exclamation-triangle mr-2 text-sm"/>
                  <span class="font-medium text-sm">{{ errorPaciente }}</span>
                </div>
              </div>
            </transition>

            <!-- Información del paciente encontrado -->
            <transition name="slide-up">
              <div v-if="idPaciente" class="p-4 bg-green-50 border-2 border-green-200 rounded-2xl">
                <div class="flex items-center mb-3">
                  <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                    <i class="fas fa-user-check text-green-600 text-lg"/>
                  </div>
                  <h4 class="text-lg font-bold text-green-800">Paciente Encontrado</h4>
                </div>
                <div class="space-y-2 text-green-700 text-sm">
                  <div class="flex items-center">
                    <i class="fas fa-id-card mr-2 w-4"/>
                    <span><strong>Documento:</strong> {{ nroDocumento }}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-user mr-2 w-4"/>
                    <span><strong>Nombre:</strong> {{ nombrePaciente }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Paso 2: Fecha y Especialidad -->
        <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <!-- Header del Card -->
          <div class="bg-primario-700 px-6 py-4 text-white">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                <i class="fas fa-calendar-alt text-white text-lg"/>
              </div>
              <div>
                <h2 class="text-xl font-bold">Fecha y Especialidad</h2>
                <p class="text-purple-100 text-sm">Seleccione fecha y médico</p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <!-- Selección de fecha -->
            <div class="mb-6">
              <label class="block text-lg font-semibold text-gray-800 mb-3">
                Seleccionar Fecha
              </label>
              <div class="grid grid-cols-7 gap-2">
                <button
                  v-for="dia in diasSemana"
                  :key="dia.fecha"
                  :disabled="!dia.activo"
                  :class="[
                    'px-3 py-3 border-2 rounded-xl text-center transition-all duration-200 min-h-[70px] flex flex-col items-center justify-center shadow-sm hover:shadow-md active:scale-95',
                    fechaCita === dia.fecha && dia.activo 
                        ? 'border-primario-500 bg-primario-50 text-primario-700 shadow-lg' 
                        : dia.activo 
                            ? 'border-gray-200 bg-white hover:border-primario-300 hover:bg-primario-50'
                            : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  ]"
                  @click="seleccionarFecha(dia.fecha)"
                >
                  <span class="text-xs font-semibold mb-1">{{ dia.dia }}</span>
                  <span class="text-lg font-bold mb-1">{{ dia.numero }}</span>
                  <span v-if="dia.esHoy" class="text-[0.6rem] bg-primario-200 text-primario-600 px-1 py-0.5 rounded-md font-medium">Hoy</span>
                </button>
              </div>
            </div>

            <!-- Especialidad -->
            <div class="mb-6">
              <label class="block text-lg font-semibold text-gray-800 mb-3">
                Especialidad Médica
              </label>
              <div class="relative">
                <select
                    v-model="servicioSeleccionado"
                    :disabled="!serviciosDisponibles.length || !fechaCita"
                    class="w-full pl-12 pr-10 py-3 text-base border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:border-primario-500 focus:ring-4 focus:ring-primario-100 appearance-none transition-all duration-200 capitalize"
                    @change="buscarMedicos"
                >
                  <option value="">
                    {{ !serviciosDisponibles.length ? "No hay especialidades disponibles" : "Seleccione especialidad" }}
                  </option>
                  <option v-for="servicio in serviciosDisponibles" :key="servicio.IdServicio" :value="servicio.IdServicio">
                    {{ servicio.Nombre }}
                  </option>
                </select>
                <i class="fas fa-stethoscope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"/>
                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"/>
              </div>
            </div>

            <!-- Médico -->
            <div>
              <label class="block text-lg font-semibold text-gray-800 mb-3">
                Médico Especialista
              </label>
              <div class="relative">
                <select
                    v-model="medicoSeleccionado"
                    :disabled="!medicosDisponibles.length"
                    :class="[
                      'w-full pl-12 pr-10 py-3 text-base border-2 rounded-xl focus:outline-none appearance-none transition-all duration-200 capitalize',
                      !medicosDisponibles.length 
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60' 
                        : 'border-gray-300 bg-white focus:border-primario-500 focus:ring-4 focus:ring-primario-100'
                    ]"
                    @change="buscarHorarios"
                >
                  <option value="">
                    {{ !medicosDisponibles.length ? "No hay médicos disponibles" : "Seleccione médico" }}
                  </option>
                  <option v-for="medico in medicosDisponibles" :key="medico.idMedico" :value="medico.idMedico">
                    Dr. {{ medico.nombre }}
                  </option>
                </select>
                <i 
                :class="[
                  'fas fa-user-md absolute left-4 top-1/2 -translate-y-1/2 text-lg',
                  !medicosDisponibles.length ? 'text-gray-300' : 'text-gray-400'
                ]"/>
                <i 
                :class="[
                  'fas absolute right-4 top-1/2 -translate-y-1/2 text-sm',
                  !medicosDisponibles.length ? 'fa-lock text-gray-300' : 'fa-chevron-down text-gray-400'
                ]"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Paso 3: Horarios -->
        <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <!-- Header del Card -->
          <div class="bg-primario-700 px-6 py-4 text-white">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                <i class="fas fa-clock text-white text-lg"/>
              </div>
              <div>
                <h2 class="text-xl font-bold">Horarios</h2>
                <p class="text-white/90 text-sm uppercase">{{ fechaCita ? formatearFecha(fechaCita) : 'Seleccione una fecha' }}</p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <!-- Pestañas de turno -->
            <div class="mb-6">
              <div class="flex bg-gray-100 rounded-2xl py-1 px-2 gap-2">
                <button
                    :disabled="!horariosMañanaDisponibles"
                    :class="[
                      'flex-1 py-2 px-4 rounded-xl font-bold transition-all duration-200 text-base',
                      !horariosMañanaDisponibles 
                        ? 'text-gray-400 cursor-not-allowed opacity-50'
                        : turnoActivo === 'mañana'
                            ? 'bg-white text-primario-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                    ]"
                    @click="!horariosMañanaDisponibles ? null : (turnoActivo = 'mañana')"
                >
                  Mañana
                </button>
                <button
                    :disabled="!horariosTardeDisponibles"
                    :class="[
                      'flex-1 py-2 px-4 rounded-xl font-bold transition-all duration-200 text-base',
                      !horariosTardeDisponibles 
                        ? 'text-gray-400 cursor-not-allowed opacity-50'
                        : turnoActivo === 'tarde'
                            ? 'bg-white text-primario-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                    ]"
                    @click="!horariosTardeDisponibles ? null : (turnoActivo = 'tarde')"
                >
                  Tarde
                </button>
              </div>
            </div>

            <!-- Grid de horarios -->
            <div class="min-h-[240px]">
              <transition name="fade" mode="out-in">
                <div v-if="cargandoHorarios" class="flex items-center justify-center py-16">
                  <div class="text-center">
                    <div class="w-12 h-12 border-4 border-primario-200 border-t-primario-600 rounded-full animate-spin mx-auto mb-4"/>
                    <p class="text-lg text-gray-600 font-medium">Cargando horarios...</p>
                  </div>
                </div>
                
                <div v-else-if="!horariosDisponibles.length" class="flex items-center justify-center py-16">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <i class="fas fa-calendar-times text-3xl text-gray-300"/>
                    </div>
                    <p class="text-lg text-gray-500 font-medium">
                      {{ !medicoSeleccionado ? 'Seleccione un médico para ver horarios' : 'No hay horarios disponibles' }}
                    </p>
                  </div>
                </div>
                
                <div v-else class="grid grid-cols-2 gap-3">
                  <button
                      v-for="horario in horariosFiltrados"
                      :key="horario.hora"
                      :class="[
                        'py-3 px-3 text-base font-bold border-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-lg ',
                        horarioSeleccionado === horario.hora
                            ? 'border-primario-500 bg-primario-50 text-primario-700 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-primario-300 hover:bg-primario-50'
                      ]"
                      @click="seleccionarHorario(horario.hora)"
                  >
                    {{ formatHora(horario.hora) }}
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div ref="actionButtons" class="flex flex-col sm:flex-row gap-4 opacity-0 transform translate-y-4 transition-all duration-500">
        <button
            class="flex-1 py-4 px-6 border-2 border-gray-300 rounded-2xl text-lg font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 active:scale-95"
            @click="limpiarFormularioCompleto"
        >
          <i class="fas fa-times mr-2 text-lg"/>
          Cancelar
        </button>
        
        <button
            :disabled="!mostrarResumen || cargando"
            :class="[
              'flex-1 py-4 px-6 rounded-2xl text-lg font-bold transition-all duration-200 active:scale-95',
              (!mostrarResumen || cargando)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-3 border-gray-300'
                  : 'bg-primario-700 text-white hover:bg-primario-800 border-3 border-primario-700 shadow-lg hover:shadow-xl'
            ]"
            @click="confirmarCita"
        >
          <template v-if="!cargando">
            <i class="fas fa-check-circle mr-2 text-lg"/>
            Confirmar Cita
          </template>
          <template v-else>
            <i class="fas fa-spinner fa-spin mr-2 text-lg"/>
            Procesando Solicitud...
          </template>
        </button>
      </div>
    </div>

    <!-- Modal de Error -->
    <transition name="modal">
      <div v-if="mostrarModalError" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl p-8 max-w-md mx-auto text-center shadow-2xl border border-gray-100 transform transition-all duration-300">
          <div class="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <i class="fas fa-exclamation-triangle text-white text-3xl"/>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Error al Procesar Cita</h3>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            {{ errorModal }}
          </p>
          <div class="flex gap-4">
            <button
              class="flex-1 py-3 px-6 bg-gray-200 text-gray-800 text-lg font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200 active:scale-95"
              @click="cerrarModalError"
            >
              Cerrar
            </button>
            <button
              class="flex-1 py-3 px-6 bg-primario-700 text-white text-lg font-semibold rounded-xl hover:bg-primario-800 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
              @click="reintentar"
            >
              <i class="fas fa-redo mr-2"/>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Notificación de Éxito -->
    <transition name="slide-up">
      <div v-if="mostrarNotificacion" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl p-10 max-w-lg mx-auto text-center shadow-2xl border border-gray-100">
          <div class="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <i class="fas fa-check-circle text-white text-4xl"/>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 mb-4">¡Cita Registrada Exitosamente!</h3>
          <p class="text-xl text-gray-600 mb-8 leading-relaxed">
            Su cita médica ha sido programada correctamente.
          </p>
          <button
            class="w-full py-4 px-8 bg-green-600 text-white text-xl font-bold rounded-2xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            @click="cerrarNotificacion"
          >
            <i class="fas fa-thumbs-up mr-3"/>
            Perfecto
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useCitaParticularForm } from '~/composables/useCitaParticularForm'

// Configuración de página
definePageMeta({
  layout: 'none',
  middleware: [],
})


// Estados locales de UI
const mostrarNotificacion = ref(false)
const mostrarModalError = ref(false)
const errorModal = ref('')
const turnoActivo = ref('mañana')
const buscandoPaciente = ref(false)
const horaActual = ref('')

// Referencias para animaciones
const pageContainer = ref(null)
const mainHeader = ref(null)
const progressIndicator = ref(null)
const mainContent = ref(null)
const actionButtons = ref(null)

// Función para actualizar la hora
const actualizarHora = () => {
  const ahora = new Date()
  let horas = ahora.getHours()
  const minutos = ahora.getMinutes().toString().padStart(2, '0')
  const periodo = horas >= 12 ? 'PM' : 'AM'
  
  if (horas > 12) {
    horas = horas - 12
  } else if (horas === 0) {
    horas = 12
  }
  
  horaActual.value = `${horas}:${minutos} ${periodo}`
}

// Usar el composable principal
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
  cargandoHorarios,

  // Mensajes de error
  errorPaciente,

  // Computed properties
  datosValidos,

  // Métodos
  obtenerDiasSemana,
  buscarPaciente: buscarPacienteOriginal,
  buscarServiciosDisponibles,
  buscarMedicosDisponibles,
  buscarHorariosDisponibles,
  registrarCitaParticular,
  limpiarFormularioCompleto: limpiarOriginal,
} = useCitaParticularForm()

// Computed properties locales
const diasSemana = computed(() => obtenerDiasSemana())

const mostrarResumen = computed(() => {
  return datosValidos.value && !cargando.value
})

const horariosFiltrados = computed(() => {
  if (!horariosDisponibles.value.length) return []
  
  return horariosDisponibles.value.filter(horario => {
    const hora = parseInt(horario.hora.split(':')[0])
    
    if (turnoActivo.value === 'mañana') {
      return hora >= 8 && hora < 14
    } else {
      return hora >= 14 && hora < 18
    }
  })
})

// Computed para verificar disponibilidad de turnos
const horariosMañanaDisponibles = computed(() => {
  if (!horariosDisponibles.value.length) return false
  
  return horariosDisponibles.value.some(horario => {
    const hora = parseInt(horario.hora.split(':')[0])
    return hora >= 8 && hora < 14
  })
})

const horariosTardeDisponibles = computed(() => {
  if (!horariosDisponibles.value.length) return false
  
  return horariosDisponibles.value.some(horario => {
    const hora = parseInt(horario.hora.split(':')[0])
    return hora >= 14 && hora < 18
  })
})

// Watchers para lógica automática
watch(medicosDisponibles, (newMedicos) => {
  // Si solo hay un médico disponible, seleccionarlo automáticamente
  if (newMedicos.length === 1 && !medicoSeleccionado.value) {
    medicoSeleccionado.value = newMedicos[0].idMedico
    buscarHorarios()
  }
})

watch([horariosMañanaDisponibles, horariosTardeDisponibles], ([mañana, tarde]) => {
  // Si no hay horarios en el turno actual, cambiar automáticamente
  if (turnoActivo.value === 'mañana' && !mañana && tarde) {
    turnoActivo.value = 'tarde'
  } else if (turnoActivo.value === 'tarde' && !tarde && mañana) {
    turnoActivo.value = 'mañana'
  }
})

// Animaciones
const animateElements = async () => {
  // Fade in main container
  if (pageContainer.value) {
    pageContainer.value.classList.add('opacity-100')
  }
  
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Animate header
  if (mainHeader.value) {
    mainHeader.value.classList.add('opacity-100')
    mainHeader.value.classList.remove('opacity-0', 'translate-y-4')
  }
  
  await new Promise(resolve => setTimeout(resolve, 150))
  
  // Animate progress indicator
  if (progressIndicator.value) {
    progressIndicator.value.classList.add('opacity-100')
    progressIndicator.value.classList.remove('opacity-0', 'translate-y-4')
  }
  
  await new Promise(resolve => setTimeout(resolve, 150))
  
  // Animate main content
  if (mainContent.value) {
    mainContent.value.classList.add('opacity-100')
    mainContent.value.classList.remove('opacity-0', 'translate-y-4')
  }
  
  await new Promise(resolve => setTimeout(resolve, 150))
  
  // Animate action buttons
  if (actionButtons.value) {
    actionButtons.value.classList.add('opacity-100')
    actionButtons.value.classList.remove('opacity-0', 'translate-y-4')
  }
}

// Métodos del teclado virtual
const agregarNumero = (num) => {
  if (nroDocumento.value.length < 12) {
    nroDocumento.value += num.toString()
  }
}

const limpiarUltimo = () => {
  if (nroDocumento.value.length > 0) {
    nroDocumento.value = nroDocumento.value.slice(0, -1)
    
    if (nroDocumento.value.length < 8) {
      idPaciente.value = null
      nombrePaciente.value = ""
      errorPaciente.value = ""
    }
  }
}

const limpiarTodo = () => {
  nroDocumento.value = ""
  idPaciente.value = null
  nombrePaciente.value = ""
  errorPaciente.value = ""
}

const cambiarPaciente = () => {
  limpiarTodo()
}

// Método de búsqueda mejorado
const buscarPaciente = async () => {
  if (nroDocumento.value.length < 8) {
    errorPaciente.value = "Ingrese al menos 8 dígitos"
    return
  }

  buscandoPaciente.value = true
  
  try {
    await buscarPacienteOriginal()
  } finally {
    buscandoPaciente.value = false
  }
}

// Métodos de selección
const seleccionarFecha = (fecha) => {
  fechaCita.value = fecha
  servicioSeleccionado.value = ""
  medicoSeleccionado.value = ""
  horarioSeleccionado.value = ""
  
  buscarServiciosDisponibles()
}

const buscarMedicos = () => {
  medicoSeleccionado.value = ""
  horarioSeleccionado.value = ""
  buscarMedicosDisponibles()
}

const buscarHorarios = () => {
  horarioSeleccionado.value = ""
  buscarHorariosDisponibles()
}

const seleccionarHorario = (hora) => {
  horarioSeleccionado.value = hora
}

// Métodos de formato
const formatearFecha = (fecha) => {
  if (!fecha) return ""
  
  const date = new Date(fecha + 'T00:00:00')
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatHora = (hora) => {
  if (!hora) return ""

  if (hora.includes("AM") || hora.includes("PM")) {
    return hora
  }

  try {
    const [hours, minutes] = hora.split(":")
    const h = parseInt(hours, 10)
    const period = h >= 12 ? "PM" : "AM"
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
    return `${hour12}:${minutes} ${period}`
  } catch (error) {
    console.error(error)
    return hora
  }
}

// Métodos de acción
const confirmarCita = async () => {
  try {
    const resultado = await registrarCitaParticular()
    if (resultado) {
      mostrarNotificacion.value = true
      
      // Auto-limpiar después de mostrar la notificación
      setTimeout(() => {
        if (mostrarNotificacion.value) {
          cerrarNotificacion()
        }
      }, 10000)
    }
  } catch (error) {
    console.error("Error al registrar cita:", error)
    
    errorModal.value = error instanceof Error ? error.message : "Ocurrió un error inesperado al procesar su cita. Por favor, verifique los datos e intente nuevamente."
    mostrarModalError.value = true
  }
}

const limpiarFormularioCompleto = () => {
  limpiarOriginal()
  turnoActivo.value = 'mañana'
}

const cerrarNotificacion = () => {
  mostrarNotificacion.value = false
  limpiarFormularioCompleto()
}

const cerrarModalError = () => {
  mostrarModalError.value = false
  errorModal.value = ''
}

const reintentar = () => {
  cerrarModalError()
  // Reintentar la confirmación de cita
  setTimeout(() => {
    confirmarCita()
  }, 500)
}

// Inicialización
onMounted(async () => {
  await nextTick()
  
  // Inicializar hora y actualizar cada minuto
  actualizarHora()
  setInterval(actualizarHora, 60000)
  
  animateElements()
  buscarServiciosDisponibles()
})
</script>

<!-- <style scoped>
/* Animaciones mejoradas */
.fade-enter-active, .fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Animación del spinner personalizada */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Efectos de backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .fade-enter-active,
  .fade-leave-active,
  .slide-up-enter-active,
  .slide-up-leave-active,
  .modal-enter-active,
  .modal-leave-active {
    transition: none;
  }
  
  .animate-spin {
    animation: none;
  }
}

/* Responsive mejorado */
@media (max-width: 1024px) {
  .grid-cols-7 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .grid-cols-7 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Mejoras para focus y accesibilidad */
button:focus-visible,
select:focus-visible {
  outline: 3px solid #3B82F6;
  outline-offset: 2px;
}

/* Scroll suave */
html {
  scroll-behavior: smooth;
}
</style> -->