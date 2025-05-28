<!-- components/Cita/AtencionModal/index.vue -->
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
    :content-class="'p-5 space-y-2 relative'"
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
    <div>
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
          v-model:cpts="cpts"
          :clasificaciones-dx="clasificacionesDx"
          :cita="cita"
          @update="hasUnsavedChanges = true"
        />

        <!-- Tab 3: Órdenes Médicas -->
        <OrdenesMedicasTab
          v-if="activeTab === 2"
          v-model:procedimientos="procedimientosRegistrados"
          v-model:recetas="recetas"
          v-model:observaciones="ordenesMedicas.observaciones"
          :diagnosticos-validos="diagnosticosValidos"
          :cita="cita"
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
          <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2" />
          <i v-else class="fas fa-check mr-2" />
          Registrar atención
        </button>
      </div>
    </template>
  </CommonModal>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { atencionesService } from "~/services/AtencionesService";
import { cptService } from "~/services/CPTService";
import { farmaciaService } from "~/services/FarmaciaService";
import { useNotification } from "~/composables/useNotification";

// Importar componentes
import PatientInfo from "./PatientInfo.vue";
import AntecedentesTab from "./AntecedentesTab.vue";
import DiagnosticosTab from "./DiagnosticosTab.vue";
import OrdenesMedicasTab from "./OrdenesMedicasTab.vue";

const cpts = ref([]);
const recetas = ref([]); // Nuevo estado para recetas

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

const emit = defineEmits([
  "update:visible",
  "close",
  "consulta-guardada",
  "reload-citas",
  "atencion-registrada",
]);

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

// Computed para diagnósticos válidos
const diagnosticosValidos = computed(() => {
  return diagnosticosCIEX.value.filter(
    (diag) => diag.idDiagnostico && diag.codigo
  );
});

// Sincronizar estado con props
watch(
  () => props.visible,
  () => activeTab.value,
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
      type: "error",
    });
  }
};

// Cargar datos de la consulta si existe
const cargarDatosConsulta = async () => {
  if (!props.cita.IdAtencion) return;

  isLoading.value = true;
  try {
    // Cargar CPTs existentes
    const cptsExistentes = await cptService.obtenerCPTsPorAtencion(
      props.cita.IdAtencion
    );
    if (cptsExistentes && cptsExistentes.length > 0) {
      cpts.value = cptsExistentes.map((cpt) => ({
        idProducto: cpt.IdProducto,
        codigo: cpt.Codigo,
        nombre: cpt.Nombre,
        searchTerm: `${cpt.Codigo} - ${cpt.Nombre}`,
        cantidad: cpt.Cantidad || 1,
        precio: cpt.Precio || 0,
        total: cpt.Total || 0,
        idDiagnostico: cpt.idDiagnostico,
        idOrden: cpt.idOrden,
        PDR: cpt.PDR || "D",
        labConfHIS: cpt.labConfHIS || "",
        labConfHIS2: cpt.labConfHIS2 || "",
        labConfHIS3: cpt.labConfHIS3 || "",
      }));
    }

    // Cargar recetas existentes
    const recetasExistentes = await farmaciaService.obtenerRecetasPorAtencion(
      props.cita.IdAtencion
    );
    if (recetasExistentes && recetasExistentes.length > 0) {
      recetas.value = recetasExistentes.map((receta) => ({
        idProducto: receta.IdProducto,
        codigo: receta.Codigo,
        nombre: receta.Nombre,
        searchTerm: `${receta.Codigo} - ${receta.Nombre}`,
        cantidadPedida: receta.CantidadPedida || 1,
        precio: receta.Precio || 0,
        total: receta.Total || 0,
        saldoEnRegistro: receta.SaldoEnRegistroReceta || 0,
        idDiagnostico: receta.iddiagnostico,
        idReceta: receta.idReceta,
        idDosisRecetadas: receta.idDosisRecetada || 1,
        idViaAdministracion: receta.IdViaAdministracion || null, // Permitir NULL
        observaciones: receta.observaciones || "",
      }));
    }

    // Obtener datos de la consulta y diagnósticos
    const datosConsulta = await atencionesService.getDatosConsulta(
      props.cita.IdAtencion
    );

    if (datosConsulta.success) {
      // Cargar datos de la consulta
      if (datosConsulta.consulta) {
        const data = datosConsulta.consulta;

        // Actualizar datos de la consulta
        consulta.value = {
          motivoConsulta: data.CitaMotivo || "",
          examenClinico: data.CitaExamenClinico || "",
        };

        tratamiento.value = data.CitaTratamiento || "";
      }

      // Cargar antecedentes
      antecedentes.value = {
        quirurgico: "",
        patologico: "",
        obstetrico: "",
        alergico: "",
        familiar: "",
        otros: "",
      };

      if (datosConsulta.consulta && datosConsulta.consulta.CitaAntecedente) {
        antecedentes.value.otros = datosConsulta.consulta.CitaAntecedente;
      }

      if (datosConsulta.antecedentes) {
        const antecedentesPaciente = datosConsulta.antecedentes;
        antecedentes.value.quirurgico = antecedentesPaciente.antecedQuirurgico || "";
        antecedentes.value.patologico = antecedentesPaciente.antecedPatologico || "";
        antecedentes.value.obstetrico = antecedentesPaciente.antecedObstetrico || "";
        antecedentes.value.alergico = antecedentesPaciente.antecedAlergico || "";
        antecedentes.value.familiar = antecedentesPaciente.antecedFamiliar || "";
        
        if (!antecedentes.value.otros && antecedentesPaciente.antecedentes) {
          antecedentes.value.otros = antecedentesPaciente.antecedentes;
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
        // Si no hay diagnósticos, crear uno vacío
        diagnosticosCIEX.value = [
          {
            codigo: "",
            descripcion: "",
            tipo:
              clasificacionesDx.value.length > 0
                ? clasificacionesDx.value[0].IdSubclasificacionDx
                : 102,
            labConfHIS: null,
            labConfHIS2: null,
            labConfHIS3: null,
          },
        ];
      }
    }
  } catch (error) {
    console.error("Error al cargar datos de la consulta:", error);
    notification.show({
      title: "Error",
      message: "Error al cargar datos de la consulta",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

// Cerrar modal
const close = () => {
  localVisible.value = false;
  emit("close");
};

// Iniciar el polling
const startPolling = () => {
  isPolling.value = true;
  pollingCount.value = 0;
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
    emit("reload-citas");
    console.log(
      `Polling completado (${pollingCount.value}/${maxPollingAttempts})`
    );

    if (pollingCount.value < maxPollingAttempts) {
      setTimeout(() => pollData(), 3000);
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
  return procedimientosRegistrados.value.map((proc) => ({
    id: proc.id,
    tipoOrden: mapearCategoriaATipoOrden(proc.categoria),
    codigo: proc.codigo,
    descripcion: proc.procedimiento,
    cantidad: proc.cantidad,
    disponible: proc.hay ? 1 : 0,
    observaciones: proc.observaciones || "",
  }));
};

// Invertir mapeo categoría a tipoOrden
const mapearCategoriaATipoOrden = (categoria) => {
  const mapeo = {
    rayosX: 1,
    patologia: 2,
    ecografiaObs: 3,
    anatomia: 4,
    ecografiaGen: 5,
    bancoSangre: 6,
    tomografia: 7,
    farmacia: 8,
    otros: 9,
  };
  return mapeo[categoria] || 9;
};

// Función para guardar la consulta
const guardarConsulta = async () => {
  try {
    isLoading.value = true;

    console.log("=== INICIO guardarConsulta ===");
    console.log("📝 Props completos de la cita:", JSON.stringify(props.cita, null, 2));
    console.log("📝 Estado actual de recetas:", JSON.stringify(recetas.value, null, 2));

    // Verificar que tenemos idAtencion
    if (!props.cita || !props.cita.IdAtencion) {
      console.error("❌ Error: props.cita.IdAtencion no está disponible");
      console.error("  - props.cita:", props.cita);
      
      notification.show({
        title: "Error",
        message: "No se encontró el ID de atención",
        type: "error",
      });
      return;
    }

    console.log("✅ IdAtencion encontrado:", props.cita.IdAtencion, typeof props.cita.IdAtencion);

    // Obtener IdPaciente
    const idPaciente = props.cita.IdPaciente;

    if (!idPaciente) {
      console.error("❌ Error: IdPaciente no está disponible en props.cita");
      console.error("  - props.cita:", props.cita);
      
      notification.show({
        title: "Error",
        message: "No se encontró el ID del paciente",
        type: "error",
      });
      return;
    }

    console.log("✅ IdPaciente encontrado:", idPaciente, typeof idPaciente);

    // Validaciones básicas
    if (!consulta.value.motivoConsulta) {
      notification.show({
        title: "Advertencia",
        message: "Debe ingresar el motivo de consulta",
        type: "warning",
      });
      activeTab.value = 1;
      return;
    }

    if (!consulta.value.examenClinico) {
      notification.show({
        title: "Advertencia",
        message: "Debe ingresar el examen clínico consulta",
        type: "warning",
      });
      activeTab.value = 1;
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
        type: "warning",
      });
      activeTab.value = 1;
      return;
    }

    // Datos para enviar al backend
    const datosAtencion = {
      idAtencion: parseInt(props.cita.IdAtencion),
      idPaciente: parseInt(idPaciente),
      idUsuario: 3752,

      // Valores por defecto según el controlador
      idDestinoAtencion: 10,
      idCondicionMaterna: 3,
      idTipoCondicionALEstab: 3,

      // Fecha y hora actuales en formato requerido
      fechaEgreso: new Date().toISOString().split("T")[0],
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
          IdSubclasificacionDx: diag.tipo || 102,
          IdClasificacionDx: 1,
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
    const resultado = await atencionesService.registrarAtencionCE(
      datosAtencion
    );

    console.log("Respuesta del servidor:", resultado);

    if (resultado.success) {
      // Si hay CPTs para registrar (nuevos o modificados)
      const cptsNuevos = cpts.value.filter((cpt) => !cpt.idOrden);
      const cptsExistentes = cpts.value.filter((cpt) => !!cpt.idOrden);

      // Registrar solo los CPTs nuevos
      if (cptsNuevos.length > 0) {
        const cptsValidos = cptsNuevos.filter(
          (cpt) => cpt.idProducto && cpt.idDiagnostico
        );

        if (cptsValidos.length > 0) {
          try {
            const cptsParaEnviar = cptsValidos.map((cpt) => ({
              idProducto: cpt.idProducto,
              cantidad: cpt.cantidad || 1,
              idDiagnostico: cpt.idDiagnostico,
              PDR: cpt.PDR || "D",
              labConfHIS: cpt.labConfHIS || "",
              labConfHIS2: cpt.labConfHIS2 || "",
              labConfHIS3: cpt.labConfHIS3 || "",
            }));

            console.log("Enviando CPTs nuevos:", cptsParaEnviar);

            await cptService.registrarCPTsPostAtencion(
              props.cita.IdAtencion,
              props.cita.IdCuentaAtencion,
              cptsParaEnviar
            );

            notification.show({
              title: "Procedimientos registrados",
              message: `Se registraron ${cptsValidos.length} nuevos procedimientos correctamente`,
              type: "success",
            });
          } catch (error) {
            console.error("Error al registrar CPTs nuevos:", error);
            notification.show({
              title: "Advertencia",
              message:
                "La atención se guardó pero hubo un error al registrar los nuevos procedimientos",
              type: "warning",
            });
          }
        }
      }

      // Actualizar los CPTs existentes
      if (cptsExistentes.length > 0) {
        const cptsValidos = cptsExistentes.filter(
          (cpt) => cpt.idProducto && cpt.idDiagnostico && cpt.idOrden
        );

        if (cptsValidos.length > 0) {
          try {
            const cptsParaEnviar = cptsValidos.map((cpt) => ({
              idProducto: cpt.idProducto,
              idOrden: cpt.idOrden,
              cantidad: cpt.cantidad || 1,
              idDiagnostico: cpt.idDiagnostico,
              PDR: cpt.PDR || "D",
              labConfHIS: cpt.labConfHIS || "",
              labConfHIS2: cpt.labConfHIS2 || "",
              labConfHIS3: cpt.labConfHIS3 || "",
            }));

            console.log(
              "Enviando CPTs existentes para actualizar:",
              cptsParaEnviar
            );

            await cptService.actualizarCPTsPostAtencion(
              props.cita.IdAtencion,
              props.cita.IdCuentaAtencion,
              cptsParaEnviar
            );

            notification.show({
              title: "Procedimientos actualizados",
              message: `Se actualizaron ${cptsValidos.length} procedimientos correctamente`,
              type: "success",
            });
          } catch (error) {
            console.error("Error al actualizar CPTs:", error);
            notification.show({
              title: "Advertencia",
              message:
                "La atención se guardó pero hubo un error al actualizar los procedimientos existentes",
              type: "warning",
            });
          }
        }
      }

      // Si hay recetas para registrar (nuevas o modificadas)
      const recetasNuevas = recetas.value.filter((receta) => !receta.idReceta);
      const recetasExistentes = recetas.value.filter((receta) => !!receta.idReceta);

      console.log("=== PROCESANDO RECETAS ===");
      console.log("📊 Total recetas:", recetas.value.length);
      console.log("📊 Recetas nuevas:", recetasNuevas.length);
      console.log("📊 Recetas existentes:", recetasExistentes.length);
      console.log("📝 Datos de la cita:");
      console.log("  - IdAtencion:", props.cita.IdAtencion, typeof props.cita.IdAtencion);
      console.log("  - IdCuentaAtencion:", props.cita.IdCuentaAtencion, typeof props.cita.IdCuentaAtencion);

      // Registrar solo las recetas nuevas
      if (recetasNuevas.length > 0) {
        const recetasValidas = recetasNuevas.filter(
          (receta) => receta.idProducto && receta.idDiagnostico
        );

        console.log("🔍 Recetas nuevas válidas:", recetasValidas.length);
        console.log("📝 Recetas válidas detalle:", recetasValidas);

        if (recetasValidas.length > 0) {
          try {
            const recetasParaEnviar = recetasValidas.map((receta) => ({
              idProducto: receta.idProducto,
              cantidadPedida: receta.cantidadPedida || 1,
              idDiagnostico: receta.idDiagnostico,
              idDosisRecetadas: receta.idDosisRecetadas || 1,
              idViaAdministracion: receta.idViaAdministracion || null, // Permitir NULL
              observaciones: receta.observaciones || "",
            }));

            console.log("📦 Recetas procesadas para enviar:", recetasParaEnviar);
            console.log("🚀 Llamando a farmaciaService.registrarRecetasPostAtencion con:");
            console.log("  - idAtencion:", props.cita.IdAtencion);
            console.log("  - idCuentaAtencion:", props.cita.IdCuentaAtencion);
            console.log("  - recetas:", recetasParaEnviar);

            await farmaciaService.registrarRecetasPostAtencion(
              props.cita.IdAtencion,
              props.cita.IdCuentaAtencion,
              recetasParaEnviar
            );

            console.log("✅ Recetas registradas exitosamente");

            notification.show({
              title: "Recetas registradas",
              message: `Se registraron ${recetasValidas.length} nuevos medicamentos correctamente`,
              type: "success",
            });
          } catch (error) {
            console.error("❌ Error al registrar recetas nuevas:", error);
            notification.show({
              title: "Advertencia",
              message:
                "La atención se guardó pero hubo un error al registrar las nuevas recetas",
              type: "warning",
            });
          }
        }
      }

      // Actualizar las recetas existentes
      if (recetasExistentes.length > 0) {
        // Agrupar por idReceta para actualizar por lotes
        const recetasPorId = recetasExistentes.reduce((acc, receta) => {
          if (!acc[receta.idReceta]) {
            acc[receta.idReceta] = [];
          }
          acc[receta.idReceta].push(receta);
          return acc;
        }, {});

        for (const [idReceta, recetasDelGrupo] of Object.entries(recetasPorId)) {
          const recetasValidas = recetasDelGrupo.filter(
            (receta) => receta.idProducto && receta.idDiagnostico
          );

          if (recetasValidas.length > 0) {
            try {
              const recetasParaEnviar = recetasValidas.map((receta) => ({
                idProducto: receta.idProducto,
                cantidadPedida: receta.cantidadPedida || 1,
                idDiagnostico: receta.idDiagnostico,
                idDosisRecetadas: receta.idDosisRecetadas || 1,
                idViaAdministracion: receta.idViaAdministracion || null, // Permitir NULL
                observaciones: receta.observaciones || "",
              }));

              console.log(
                `Enviando recetas existentes para actualizar (idReceta: ${idReceta}):`,
                recetasParaEnviar
              );

              await farmaciaService.actualizarRecetasPostAtencion(
                props.cita.IdAtencion,
                parseInt(idReceta),
                recetasParaEnviar
              );
            } catch (error) {
              console.error(`Error al actualizar recetas (idReceta: ${idReceta}):`, error);
              notification.show({
                title: "Advertencia",
                message: `Error al actualizar algunas recetas existentes`,
                type: "warning",
              });
            }
          }
        }

        notification.show({
          title: "Recetas actualizadas",
          message: `Se actualizaron las recetas correctamente`,
          type: "success",
        });
      }

      // Mostrar mensaje de éxito
      notification.show({
        title: "Atención completada",
        message:
          resultado.message || "Atención médica registrada correctamente",
        type: "success",
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

      // Cerrar modal
      setTimeout(() => {
        localVisible.value = false;
        emit("close");
      }, 100);
    } else {
      notification.show({
        title: "Error",
        message: resultado.message || "Error al registrar la atención",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Error al guardar consulta:", error);
    notification.show({
      title: "Error",
      message:
        "Error al guardar la atención: " +
        (error.message || "Error desconocido"),
      type: "error",
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