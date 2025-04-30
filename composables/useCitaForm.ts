// composables/useCitaForm.ts
import { ref, computed } from "vue";
import { citasService } from "~/services/CitasService";
import { useNotification } from "~/composables/useNotification";

import type {
  Servicio,
  Medico,
  Horario,
  RegistroCitaRequest,
} from "~/interfaces/Cita";

export function useCitaForm() {
  const notification = useNotification();

  // Estado del formulario
  const nroDocumento = ref("");
  const idPaciente = ref<number | null>(null);
  const nombrePaciente = ref("");
  const fechaCita = ref(obtenerFechaActual());
  const horarioSeleccionado = ref("");
  const servicioSeleccionado = ref<string | number>("");
  const medicoSeleccionado = ref<string | number>("");

  // Listas de datos
  const serviciosDisponibles = ref<Servicio[]>([]);
  const medicosDisponibles = ref<Medico[]>([]);
  const horariosDisponibles = ref<Horario[]>([]);

  // Estados de carga
  const cargando = ref(false);
  const cargandoServicios = ref(false);
  const cargandoMedicos = ref(false);
  const cargandoHorarios = ref(false);

  // Mensajes de error
  const errorPaciente = ref("");
  const errorFecha = ref("");
  const errorServicio = ref("");
  const errorMedico = ref("");
  const errorHorario = ref("");

  // Computed properties
  const fechaMinima = computed(() => {
    return obtenerFechaActual();
  });

  const datosValidos = computed(() => {
    return (
      idPaciente.value &&
      fechaCita.value &&
      servicioSeleccionado.value &&
      medicoSeleccionado.value &&
      horarioSeleccionado.value
    );
  });

  // Métodos
  function obtenerFechaActual(): string {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  }

  async function buscarPaciente() {
    if (!nroDocumento.value || nroDocumento.value.length < 8) {
      errorPaciente.value = "Ingrese un número de documento válido";
      nombrePaciente.value = "";
      idPaciente.value = null;

      notification.show({
        type: "warning",
        title: "Nro. Documento inválido",
        message: errorPaciente.value,
        duration: 3000,
      });

      return;
    }

    cargando.value = true;
    errorPaciente.value = "";

    try {
      const data = await citasService.validarPaciente(nroDocumento.value);

      if (!data.existePaciente) {
        errorPaciente.value = "No se encontró paciente con este documento";
        idPaciente.value = null;
        nombrePaciente.value = "";

        notification.show({
          type: "error",
          title: "Paciente no encontrado",
          message: errorPaciente.value,
          duration: 3000,
        });

        return;
      }

      if (data.paciente) {
        idPaciente.value = data.paciente.idPaciente;
        nombrePaciente.value = `${data.paciente.apellidos} ${data.paciente.nombre}`;
      }

      if (!data.tieneSHC) {
        errorPaciente.value =
          "Paciente sin Historia Clínica, puede continuar pero debe tramitarla";
      }
    } catch (error) {
      console.error("Error:", error);

      const mensaje =
        error instanceof Error ? error.message : "Error al buscar paciente";

      errorPaciente.value = mensaje;

      notification.show({
        type: "error",
        title: "Error al buscar paciente",
        message: mensaje,
        duration: 3000,
      });
    } finally {
      cargando.value = false;
    }
  }

  async function buscarServiciosDisponibles() {
    if (!fechaCita.value) {
      errorFecha.value = "Seleccione una fecha válida";
      return;
    }

    cargandoServicios.value = true;
    errorFecha.value = "";
    servicioSeleccionado.value = "";
    medicoSeleccionado.value = "";
    horarioSeleccionado.value = "";
    serviciosDisponibles.value = [];
    medicosDisponibles.value = [];
    horariosDisponibles.value = [];

    try {
      serviciosDisponibles.value = await citasService.getServiciosDisponibles(
        fechaCita.value
      );

      if (serviciosDisponibles.value.length === 0) {
        errorFecha.value =
          "No hay especialidades disponibles para esta fecha. Por favor, seleccione otra fecha.";

        notification.show({
          type: "info",
          title: "Sin especialidades",
          message: errorFecha.value,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      errorFecha.value =
        error instanceof Error ? error.message : "Error al buscar servicios";
      notification.show({
        type: "error",
        title: "Error al cargar especialidades",
        message: errorFecha.value,
        duration: 4000,
      });
    } finally {
      cargandoServicios.value = false;
    }
  }

  async function buscarMedicosDisponibles() {
    if (!servicioSeleccionado.value) {
      errorServicio.value = "Seleccione un servicio";
      return;
    }

    cargandoMedicos.value = true;
    errorServicio.value = "";
    medicoSeleccionado.value = "";
    horarioSeleccionado.value = "";
    medicosDisponibles.value = [];
    horariosDisponibles.value = [];

    try {
      medicosDisponibles.value = await citasService.getMedicosDisponibles(
        fechaCita.value,
        servicioSeleccionado.value
      );

      if (medicosDisponibles.value.length === 0) {
        errorServicio.value =
          "No hay médicos disponibles para esta especialidad. Por favor, seleccione otra.";
      }
    } catch (error) {
      console.error("Error:", error);
      errorServicio.value =
        error instanceof Error ? error.message : "Error al buscar médicos";
    } finally {
      cargandoMedicos.value = false;
    }
  }

  async function buscarHorariosDisponibles() {
    if (!medicoSeleccionado.value) {
      errorMedico.value = "Seleccione un médico";
      return;
    }

    cargandoHorarios.value = true;
    errorMedico.value = "";
    horarioSeleccionado.value = "";
    horariosDisponibles.value = [];

    try {
      horariosDisponibles.value = await citasService.getHorariosDisponibles(
        fechaCita.value,
        servicioSeleccionado.value,
        medicoSeleccionado.value
      );

      if (horariosDisponibles.value.length === 0) {
        errorMedico.value =
          "No hay horarios disponibles para este médico. Por favor, seleccione otro médico.";
      }
    } catch (error) {
      console.error("Error:", error);
      errorMedico.value =
        error instanceof Error ? error.message : "Error al buscar horarios";
    } finally {
      cargandoHorarios.value = false;
    }
  }

  async function registrarCita() {
    // Validar todos los campos
    if (!datosValidos.value) {
      if (!idPaciente.value)
        errorPaciente.value = "Debe seleccionar un paciente";
      if (!fechaCita.value) errorFecha.value = "Debe seleccionar una fecha";
      if (!servicioSeleccionado.value)
        errorServicio.value = "Debe seleccionar un servicio";
      if (!medicoSeleccionado.value)
        errorMedico.value = "Debe seleccionar un médico";
      if (!horarioSeleccionado.value)
        errorHorario.value = "Debe seleccionar un horario";
      return null;
    }

    cargando.value = true;

    const dataCita: RegistroCitaRequest = {
      NroDocumento: nroDocumento.value,
      idServicio: servicioSeleccionado.value,
      idMedico: medicoSeleccionado.value,
      fechaIngreso: fechaCita.value,
      horaIngreso: horarioSeleccionado.value,
    };

    try {
      const resultado = await citasService.registrarCita(dataCita);
      return resultado;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      cargando.value = false;
    }
  }

  function resetearFormulario() {
    // Mantener solo el paciente actual
    fechaCita.value = obtenerFechaActual();
    servicioSeleccionado.value = "";
    medicoSeleccionado.value = "";
    horarioSeleccionado.value = "";
    serviciosDisponibles.value = [];
    medicosDisponibles.value = [];
    horariosDisponibles.value = [];
    errorFecha.value = "";
    errorServicio.value = "";
    errorMedico.value = "";
    errorHorario.value = "";

    // Buscar servicios disponibles para la fecha actual
    buscarServiciosDisponibles();
  }

  return {
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
  };
}
