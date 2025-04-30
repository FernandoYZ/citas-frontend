// services/CitasService.ts
import { apiService } from "./ApiService";
import type { Cita,PacienteResponse, Servicio, Medico, Horario, RegistroCitaRequest } from "~/interfaces/Cita";


class CitasService {
  /**
   * Obtiene las citas separadas para una fecha específica
   */
  async getCitasSeparadas(fecha: string): Promise<Cita[]> {
    const { data, error } = await apiService.get<Cita[]>(
      `/api/citas/citas-separadas?fecha=${fecha}`
    );

    if (error) {
      throw new Error(error);
    }

    return Array.isArray(data) ? data : [];
  }

  /**
   * Valida un paciente por su número de documento
   */
  async validarPaciente(nroDocumento: string): Promise<PacienteResponse> {
    const { data, error } = await apiService.get<PacienteResponse>(
      `/api/citas/paciente?NroDocumento=${nroDocumento}`
    );

    if (error) {
      throw new Error(error);
    }

    return (
      data || {
        success: false,
        message: "No se recibió respuesta",
        existePaciente: false,
        tieneSHC: false,
      }
    );
  }

  /**
   * Obtiene los servicios disponibles para una fecha
   */
  async getServiciosDisponibles(fecha: string): Promise<Servicio[]> {
    const { data, error } = await apiService.get<Servicio[]>(
      `/api/citas/servicios-fecha?fecha=${fecha}`
    );

    if (error) {
      throw new Error(error);
    }

    return Array.isArray(data) ? data : [];
  }

  /**
   * Obtiene los médicos disponibles para un servicio y fecha
   */
  async getMedicosDisponibles(
    fecha: string,
    idServicio: number | string
  ): Promise<Medico[]> {
    const { data, error } = await apiService.get<any[]>(
      `/api/citas/medicos-select?fecha=${fecha}&idServicio=${idServicio}`
    );

    if (error) {
      throw new Error(error);
    }

    if (!Array.isArray(data)) {
      return [];
    }

    // Transformar los datos para que coincidan con el formato esperado
    return data.map((medico) => ({
      idMedico: medico.IdMedico,
      nombre: medico.Doctor,
    }));
  }

  /**
   * Obtiene los horarios disponibles para un médico, servicio y fecha
   */
  async getHorariosDisponibles(
    fecha: string,
    idServicio: number | string,
    idMedico: number | string
  ): Promise<Horario[]> {
    const { data, error } = await apiService.get<any[]>(
      `/api/citas/horarios-select?fecha=${fecha}&idServicio=${idServicio}&idMedico=${idMedico}`
    );

    if (error) {
      throw new Error(error);
    }

    if (!Array.isArray(data)) {
      return [];
    }

    // Transformar los datos para que coincidan con el formato esperado
    return data.map((horario) => ({
      hora: horario.HoraInicioDisponible,
      horaFin: horario.HoraFinDisponible,
    }));
  }

  /**
   * Registra una nueva cita
   */
  async registrarCita(dataCita: RegistroCitaRequest): Promise<Cita> {
    const { data, error } = await apiService.post<Cita>(
      "/api/citas/citas",
      dataCita
    );

    if (error) {
      throw new Error(error);
    }

    return data as Cita;
  }
}

export const citasService = new CitasService();
