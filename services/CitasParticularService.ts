// services/CitasParticularService.js
import { apiService } from "./ApiService";
import type { Cita, Servicio, RegistroCitaRequest } from "~/interfaces/Cita";

class CitasParticularService {
  async getServiciosDisponibles(fecha: string): Promise<Servicio[]> {
    const { data, error } = await apiService.get<Servicio[]>(
      `/api/citas/select-especialidades?fecha=${fecha}`
    );

    if (error) {
      throw new Error(error);
    }

    return Array.isArray(data) ? data : [];
  }

  async registrarCita(dataCita: RegistroCitaRequest): Promise<Cita> {
    const { data, error } = await apiService.post<Cita>(
      "/api/citas/cita-particular",
      dataCita
    );

    if (error) {
      throw new Error(error);
    }

    return data as Cita;
  }
}

export const citasParticularService = new CitasParticularService();
