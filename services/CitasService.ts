// services/CitasService.js
import { apiService } from "./ApiService";
import type { Cita, PacienteResponse, Servicio, Medico, Horario, RegistroCitaRequest, MedicoResponse, HorarioResponse } from "~/interfaces/Cita";

class CitasService {
  async getCitasSeparadas(fechaInicio: string, fechaFin?: string): Promise<Cita[]> {
    // Asegurar que fecha de inicio sea un string válido
    if (!fechaInicio || typeof fechaInicio !== 'string') {
      console.error('Error: fecha inválida', fechaInicio);
      throw new Error('La fecha debe ser un string en formato YYYY-MM-DD');
    }

    // Validar el formato de la fecha
    if (!fechaInicio.match(/^\d{4}-\d{2}-\d{2}$/)) {
      console.error('Error: formato de fecha inválido', fechaInicio);
      throw new Error('La fecha debe tener el formato YYYY-MM-DD');
    }
    
    // Construir URL base
    let url = `/api/citas/citas-separadas?fechaInicio=${encodeURIComponent(fechaInicio)}`;
    
    // Agregar fecha fin si está presente
    if (fechaFin && fechaFin.match(/^\d{4}-\d{2}-\d{2}$/)) {
      url += `&fechaFin=${encodeURIComponent(fechaFin)}`;
    }

    const { data, error } = await apiService.get<Cita[]>(url);

    if (error) {
      throw new Error(error);
    }

    return Array.isArray(data) ? data : [];
  }

  async getCitaDetallada(idCita: number, idPaciente: number): Promise<unknown> {
    const { data, error } = await apiService.get(
      `/api/citas/cita/${idCita}/${idPaciente}`
    );

    if (error) {
      throw new Error(error);
    }

    return data;
  }

  async validarPaciente(nroDocumento: string): Promise<PacienteResponse> {
    const { data, error } = await apiService.get<PacienteResponse>(
      `/api/citas/paciente?NroDocumento=${nroDocumento}`
    );

    if (error) {
      throw new Error(error);
    }

    return data || {
      success: false,
      message: "No se recibió respuesta",
      existePaciente: false,
      tieneSHC: false,
    };
  }

  async getServiciosDisponibles(fecha: string): Promise<Servicio[]> {
    const { data, error } = await apiService.get<Servicio[]>(
      `/api/citas/servicios-fecha?fecha=${fecha}`
    );

    if (error) {
      throw new Error(error);
    }

    return Array.isArray(data) ? data : [];
  }

  async getMedicosDisponibles(
    fecha: string,
    idServicio: number | string
  ): Promise<Medico[]> {
    const { data, error } = await apiService.get<MedicoResponse[]>(
      `/api/citas/medicos-select?fecha=${fecha}&idServicio=${idServicio}`
    );

    if (error) {
      throw new Error(error);
    }

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((medico) => ({
      idMedico: medico.IdMedico,
      nombre: medico.Doctor,
    }));
  }

  async getHorariosDisponibles(
    fecha: string,
    idServicio: number | string,
    idMedico: number | string
  ): Promise<Horario[]> {
    const { data, error } = await apiService.get<HorarioResponse[]>(
      `/api/citas/horarios-select?fecha=${fecha}&idServicio=${idServicio}&idMedico=${idMedico}`
    );

    if (error) {
      throw new Error(error);
    }

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((horario) => ({
      hora: horario.HoraInicioDisponible,
      horaFin: horario.HoraFinDisponible,
    }));
  }

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
