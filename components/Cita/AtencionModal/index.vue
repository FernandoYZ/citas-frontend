<template>
  <CommonModal
    v-model="localVisible"
    title="Consulta Médica"
    icon="fa-notes-medical"
    :secondary-button="'Cancelar'"
    secondary-button-icon="fa-times"
    :primary-button="'Registrar Atención'"
    primary-button-icon="fa-check"
    size="sm:max-w-5xl"
    :content-class="'p-5 space-y-6 relative'"
    :footer-class="'bg-gray-50'"
    :show-header-border="true"
    :full-width="true"
    @secondary-click="close"
    @primary-click="guardarConsulta"
    @close="close"
  >
    <!-- Datos del Paciente -->
    <PatientInfo :cita="cita" />

    <!-- Formulario de Consulta -->
    <div class="space-y-0">
      <!-- Tabs de navegación -->
      <div
        class="flex border-b-0 border-gray-200 bg-blue-50 rounded-t-lg overflow-hidden"
      >
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-btn px-4 py-2.5 text-sm"
          :class="{
            'tab-active': activeTab === index,
            'text-gray-500 hover:text-blue-600': activeTab !== index,
          }"
          @click="activeTab = index"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Contenedor para el contenido de la pestaña activa -->
      <div
        class="bg-white border border-gray-200 rounded-b-lg overflow-visible"
      >
        <!-- Tab 1: Antecedentes -->
        <AntecedentesTab 
          v-if="activeTab === 0" 
          v-model:antecedentes="antecedentes" 
          @update:antecedentes="hasUnsavedChanges = true"
        />

        <!-- Tab 2: Diagnósticos -->
        <DiagnosticosTab 
          v-if="activeTab === 1" 
          v-model:consulta="consulta"
          v-model:diagnosticos="diagnosticosCIEX"
          v-model:tratamiento="tratamiento"
          :clasificaciones-dx="clasificacionesDx"
          @update="hasUnsavedChanges = true"
        />

        <!-- Tab 3: Órdenes Médicas -->
        <OrdenesMedicasTab 
          v-if="activeTab === 2" 
          v-model:procedimientos="procedimientosRegistrados"
          v-model:observaciones="ordenesMedicas.observaciones"
          @update="hasUnsavedChanges = true"
        />
      </div>
    </div>

    <!-- Botones adicionales para el footer -->
    <template #footer>
      <button
        type="button"
        class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
        @click="close"
      >
        <i class="fas fa-times mr-1" />
        Cancelar
      </button>
      <div class="flex space-x-2">
        <button
          type="button"
          :disabled="isLoading"
          class="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center"
          @click="guardarConsulta"
        >
          <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"/>
          <i v-else class="fas fa-check mr-2"/>
          Registrar atención
        </button>
      </div>
    </template>
  </CommonModal>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { atencionesService } from "~/services/AtencionesService";
import { useNotification } from "~/composables/useNotification";
import _ from "lodash";

// Importar componentes
import PatientInfo from './PatientInfo.vue';
import AntecedentesTab from './AntecedentesTab.vue';
import DiagnosticosTab from './DiagnosticosTab.vue';
import OrdenesMedicasTab from './OrdenesMedicasTab.vue';

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

const emit = defineEmits(["update:visible", "close", "consulta-guardada", "reload-citas", "atencion-registrada"]);

// Usar el composable de notificaciones
const notification = useNotification();

// Estado local
const localVisible = ref(props.visible);
const activeTab = ref(1); // Iniciamos en la pestaña de diagnósticos (índice 1)
const tabs = ["Antecedentes", "Diagnósticos", "Órdenes Médicas"];
const isLoading = ref(false);
const hasUnsavedChanges = ref(false);
const clasificacionesDx = ref([]);

// Estado de polling
const isPolling = ref(false);
const pollingCount = ref(0);
const maxPollingAttempts = 3;

// Datos del formulario
const antecedentes = ref({
  quirurgico: "",
  patologico: "",
  obstetrico: "",
  alergico: "",
  familiar: "",
  otros: "",
});

const consulta = ref({
  motivoConsulta: "",
  examenClinico: "",
});

const diagnosticosCIEX = ref([]);
const tratamiento = ref("");

// Estado para órdenes médicas
const ordenesMedicas = ref({
  procedimientos: "",
  examenes: "",
  observaciones: "",
});

// Procedimientos registrados
const procedimientosRegistrados = ref([]);

// Sincronizar estado con props
watch(
  () => props.visible,
  (newValue) => {
    localVisible.value = newValue;
    if (newValue) {
      // Siempre comenzar en la pestaña de diagnósticos (índice 1)
      activeTab.value = 1;
      // Cargar datos
      cargarClasificacionesDx();
      cargarDatosConsulta();
      // Resetear estado
      hasUnsavedChanges.value = false;
    }
  }
);

// Emitir cambios en visibilidad
watch(localVisible, (newValue) => {
  emit("update:visible", newValue);
});

// Cargar clasificaciones de diagnósticos
const cargarClasificacionesDx = async () => {
  try {
    const data = await atencionesService.getClasificacionesDx();
    clasificacionesDx.value = data;
  } catch (error) {
    console.error("Error al cargar clasificaciones de diagnósticos:", error);
    notification.show({
      title: "Error",
      message: "Error al cargar clasificaciones de diagnósticos",
      type: "error"
    });
  }
};

// Cargar datos de la consulta si existe
const cargarDatosConsulta = async () => {
  if (!props.cita.IdAtencion) return;

  isLoading.value = true;
  try {
    // Cargar antecedentes del paciente
    if (props.cita) {
      antecedentes.value = {
        quirurgico: props.cita.antecedQuirurgico || "",
        patologico: props.cita.antecedPatologico || "",
        obstetrico: props.cita.antecedObstetrico || "",
        alergico: props.cita.antecedAlergico || "",
        familiar: props.cita.antecedFamiliar || "",
        otros: props.cita.antecedentes || "",
      };
    }

    // Cargar datos de la consulta y diagnósticos
    const datosConsulta = await atencionesService.getDatosConsulta(
      props.cita.IdAtencion
    );

    if (datosConsulta.success && datosConsulta.consulta) {
      const data = datosConsulta.consulta;

      // Actualizar datos de la consulta
      consulta.value = {
        motivoConsulta: data.CitaMotivo || "",
        examenClinico: data.CitaExamenClinico || "",
      };

      tratamiento.value = data.CitaTratamiento || "";

      if (data.CitaAntecedente) {
        antecedentes.value.otros = data.CitaAntecedente;
      }
    }

    // Cargar diagnósticos
    if (datosConsulta.diagnosticos && datosConsulta.diagnosticos.length > 0) {
      diagnosticosCIEX.value = datosConsulta.diagnosticos.map((diag) => ({
        id: diag.IdAtencionDiagnostico,
        idDiagnostico: diag.IdDiagnostico,
        codigo: diag.Codigo || "",
        descripcion: diag.Descripcion || "",
        tipo: diag.IdSubclasificacionDx,
        labConfHIS: diag.labConfHIS || null,
        labConfHIS2: diag.labConfHIS2 || null,
        labConfHIS3: diag.labConfHIS3 || null,
      }));
    } else {
      // Si no hay diagnósticos, crear uno vacío (esta lógica ahora está en DiagnosticosTab)
      diagnosticosCIEX.value = [{
        codigo: "",
        descripcion: "",
        tipo: clasificacionesDx.value.length > 0 ? clasificacionesDx.value[0].IdSubclasificacionDx : 102,
        labConfHIS: null,
        labConfHIS2: null,
        labConfHIS3: null,
      }];
    }

    // Cargar órdenes médicas (si existen)
    if (datosConsulta.ordenesMedicas && datosConsulta.ordenesMedicas.length > 0) {
      procedimientosRegistrados.value = datosConsulta.ordenesMedicas.map(orden => ({
        id: orden.IdOrdenMedica,
        categoria: mapearCategoriaOrden(orden.TipoOrden),
        procedimiento: orden.Descripcion,
        codigo: orden.Codigo,
        cantidad: orden.Cantidad || 1,
        hay: orden.Disponible === 1,
        observaciones: orden.Observaciones || ''
      }));
    }

    ordenesMedicas.value.observaciones = datosConsulta.observacionesGenerales || '';

  } catch (error) {
    console.error("Error al cargar datos de la consulta:", error);
    notification.show({
      title: "Error",
      message: "Error al cargar datos de la consulta",
      type: "error"
    });
  } finally {
    isLoading.value = false;
  }
};

// Mapea el tipo de orden a la categoría
const mapearCategoriaOrden = (tipoOrden) => {
  const mapeo = {
    1: 'rayosX',
    2: 'patologia',
    3: 'ecografiaObs',
    4: 'anatomia',
    5: 'ecografiaGen',
    6: 'bancoSangre',
    7: 'tomografia',
    8: 'farmacia',
    9: 'otros'
  };
  return mapeo[tipoOrden] || 'otros';
};

// Invertir mapeo categoría a tipoOrden
const mapearCategoriaATipoOrden = (categoria) => {
  const mapeo = {
    'rayosX': 1,
    'patologia': 2,
    'ecografiaObs': 3,
    'anatomia': 4,
    'ecografiaGen': 5,
    'bancoSangre': 6,
    'tomografia': 7,
    'farmacia': 8,
    'otros': 9
  };
  return mapeo[categoria] || 9;
};

// Cerrar modal
const close = () => {
  if (hasUnsavedChanges.value) {
    if (confirm("Tiene cambios sin guardar. ¿Desea salir sin guardarlos?")) {
      localVisible.value = false;
      emit("close");
    }
  } else {
    localVisible.value = false;
    emit("close");
  }
};

// Iniciar el polling
const startPolling = () => {
  isPolling.value = true;
  pollingCount.value = 0;
  
  // Ejecutar la primera recarga inmediatamente
  pollData();
};

// Función para realizar el polling de datos
const pollData = async () => {
  if (!isPolling.value || pollingCount.value >= maxPollingAttempts) {
    isPolling.value = false;
    return;
  }
  
  pollingCount.value++;
  
  try {
    // Emitir evento para que el componente padre recargue los datos
    emit("reload-citas");
    
    console.log(`Polling completado (${pollingCount.value}/${maxPollingAttempts})`);
    
    // Continuar el polling después de un retraso
    if (pollingCount.value < maxPollingAttempts) {
      setTimeout(() => pollData(), 3000); // Recargar cada 3 segundos
    } else {
      isPolling.value = false;
    }
  } catch (error) {
    console.error("Error durante el polling:", error);
    isPolling.value = false;
  }
};

// Preparar datos de órdenes médicas para envío
const prepararDatosOrdenesMedicas = () => {
  return procedimientosRegistrados.value.map(proc => ({
    id: proc.id, // Si existe
    tipoOrden: mapearCategoriaATipoOrden(proc.categoria),
    codigo: proc.codigo,
    descripcion: proc.procedimiento,
    cantidad: proc.cantidad,
    disponible: proc.hay ? 1 : 0,
    observaciones: proc.observaciones || ''
  }));
};

// Función para guardar la consulta
const guardarConsulta = async () => {
  try {
    isLoading.value = true;
    
    console.log("Datos de la cita:", props.cita);

    // Verificar que tenemos idAtencion
    if (!props.cita || !props.cita.IdAtencion) {
      notification.show({
        title: "Error",
        message: "No se encontró el ID de atención",
        type: "error"
      });
      console.error("Error: props.cita.IdAtencion no está disponible", props.cita);
      return;
    }

    // Obtener IdPaciente 
    const idPaciente = props.cita.IdPaciente;
    
    if (!idPaciente) {
      notification.show({
        title: "Error",
        message: "No se encontró el ID del paciente",
        type: "error"
      });
      console.error("Error: IdPaciente no está disponible en props.cita", props.cita);
      return;
    }

    // Validaciones básicas
    if (!consulta.value.motivoConsulta) {
      notification.show({
        title: "Advertencia",
        message: "Debe ingresar el motivo de consulta",
        type: "warning"
      });
      activeTab.value = 1; // Mantener en pestaña de diagnósticos
      return;
    }

    // Validar diagnósticos
    const diagnosticosValidos = diagnosticosCIEX.value.filter(
      (diag) => diag.idDiagnostico && diag.codigo
    );
    
    if (diagnosticosValidos.length === 0) {
      notification.show({
        title: "Advertencia",
        message: "Debe ingresar al menos un diagnóstico válido",
        type: "warning"
      });
      activeTab.value = 1;
      return;
    }

    // Datos para enviar al backend
    const datosAtencion = {
      idAtencion: parseInt(props.cita.IdAtencion),
      idPaciente: parseInt(idPaciente),
      idUsuario: 3752, // Obtener del contexto de autenticación si está disponible
      
      // Valores por defecto según el controlador
      idDestinoAtencion: 10,
      idCondicionMaterna: 3,
      idTipoCondicionALEstab: 3,
      
      // Fecha y hora actuales en formato requerido
      fechaEgreso: new Date().toISOString().split('T')[0],
      horaEgreso: new Date().toTimeString().substring(0, 5),
      
      // Datos para la consulta médica
      motivoConsulta: consulta.value.motivoConsulta,
      examenClinico: consulta.value.examenClinico,
      tratamiento: tratamiento.value,
      observaciones: ordenesMedicas.value.observaciones,

      // Antecedentes
      antecedentes: antecedentes.value.otros,
      antecedQuirurgico: antecedentes.value.quirurgico,
      antecedPatologico: antecedentes.value.patologico,
      antecedObstetrico: antecedentes.value.obstetrico,
      antecedAlergico: antecedentes.value.alergico,
      antecedFamiliar: antecedentes.value.familiar,

      // Diagnósticos
      diagnosticos: diagnosticosCIEX.value
        .filter((diag) => diag.idDiagnostico && diag.codigo)
        .map((diag) => ({
          IdDiagnostico: diag.idDiagnostico,
          IdAtencionDiagnostico: diag.id || undefined,
          IdSubclasificacionDx: diag.tipo || 102, // 102 = Definitivo por defecto
          IdClasificacionDx: 1, // Valor fijo según el ejemplo
          labConfHIS: diag.labConfHIS || null,
          labConfHIS2: diag.labConfHIS2 || null,
          labConfHIS3: diag.labConfHIS3 || null,
        })),
        
      // Órdenes médicas
      ordenesMedicas: prepararDatosOrdenesMedicas(),
    };

    // Log para depuración
    console.log("Enviando datos al servidor:", datosAtencion);

    // Llamar al endpoint atencion-ce
    const resultado = await atencionesService.registrarAtencionCE(datosAtencion);
    
    console.log("Respuesta del servidor:", resultado);

    if (resultado.success) {
      // Mostrar mensaje de éxito
      notification.show({
        title: "Atención completada",
        message: resultado.message || "Atención médica registrada correctamente",
        type: "success"
      });

      // Crear un objeto con los datos actualizados de la cita
      const citaActualizada = {
        ...props.cita,
        Estado: "Atendido",
        FechaAtencion: new Date().toISOString(),
      };

      // Emitir eventos
      emit("consulta-guardada", citaActualizada);
      emit("atencion-registrada", citaActualizada);

      // Resetear estado
      hasUnsavedChanges.value = false;

      // Iniciar polling para recarga silenciosa
      startPolling();

      // Cerrar modal - importante hacerlo fuera del ciclo actual para evitar problemas
      setTimeout(() => {
        localVisible.value = false;
        emit("close");
      }, 100);
    } else {
      notification.show({
        title: "Error",
        message: resultado.message || "Error al registrar la atención",
        type: "error"
      });
    }
  } catch (error) {
    console.error("Error al guardar consulta:", error);
    notification.show({
      title: "Error",
      message: "Error al guardar la atención: " + (error.message || "Error desconocido"),
      type: "error"
    });
  } finally {
    isLoading.value = false;
  }
};

// Al montar el componente
onMounted(() => {
  // Iniciar en la pestaña de diagnósticos
  activeTab.value = 1;

  // Cargar datos si el modal está visible
  if (props.visible) {
    cargarClasificacionesDx();
    cargarDatosConsulta();
  }
});
</script>

<style scoped>
/* Estilos para el componente de pestañas */
.tab-active {
  color: #2563eb;
  border-bottom: 2px solid #2563eb;
  font-weight: 500;
}

/* Asegurar que el modal tenga un ancho fijo */
:deep(.sm\:max-w-5xl) {
  width: 100%;
  max-width: 64rem !important; /* 1024px */
}
</style>