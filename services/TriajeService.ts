// services/TriajeService.ts
import { apiService } from "./ApiService";

interface TriajeData {
  idAtencion: number;
  paciente?: string;
  edad?: string;
  presionSistolica: string;
  presionDiastolica: string;
  talla?: string;
  temperatura: string;
  peso?: string;
  pulso?: string;
  frecuenciaRespiratoria?: string;
  frecuenciaCardiaca?: string;
  saturacionOxigeno?: string;
  perimetroAbdominal?: string;
  editMode?: boolean;
}

class TriajeService {
  /**
   * Verifica si existe un triaje para una atención y obtiene sus datos
   */
  async verificarTriaje(idAtencion: number): Promise<{ tieneTriaje: boolean; data: any }> {
    const { data, error } = await apiService.get<{ success: boolean; tieneTriaje: boolean; data: any }>(
      `/api/citas/verificar-triaje/${idAtencion}`
    );

    if (error) {
      throw new Error(error);
    }

    if (!data || !data.success) {
      throw new Error("No se pudo verificar el estado del triaje");
    }

    return {
      tieneTriaje: data.tieneTriaje,
      data: data.data
    };
  }

  /**
   * Registra o actualiza un triaje
   */
  async registrarTriaje(triajeData: TriajeData): Promise<{ success: boolean; message: string }> {
    const { data, error } = await apiService.post<{ success: boolean; message: string }>(
      "/api/citas/triaje",
      triajeData
    );

    if (error) {
      throw new Error(error);
    }

    if (!data || !data.success) {
      throw new Error(data?.message || "Error al registrar el triaje");
    }

    return data;
  }
}

export const triajeService = new TriajeService();